import rateLimit from 'express-rate-limit';
import { Router, Request, Response } from 'express';
import Booking from '../models/Booking';
import { getAvailableSlots, availabilityConfig } from '../config/availability';
import { sendConfirmationEmail } from '../services/emailService';

const router = Router();

const createBookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many booking attempts. Please try again later.' },
});

router.get('/config', (_req: Request, res: Response) => {
  res.json({ success: true, data: availabilityConfig });
});

router.get('/health', (_req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mongoose = require('mongoose');
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({ status: 'ok', mongodb: states[mongoose.connection.readyState] || 'unknown', timestamp: new Date().toISOString() });
});

router.get('/availability/:date', async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const allSlots = getAvailableSlots(date);
    const booked = await Booking.find({ date, status: 'confirmed' }).select('timeSlot');
    const bookedSlots = new Set(booked.map((b) => b.timeSlot));
    const available = allSlots.filter((s) => !bookedSlots.has(s));
    res.json({ success: true, data: available });
  } catch { res.status(500).json({ success: false, error: 'Failed to fetch availability' }); }
});

router.get('/bookings', async (req: Request, res: Response) => {
  try {
    const filter: Record<string, string> = {};
    if (req.query.date) filter.date = req.query.date as string;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch { res.status(500).json({ success: false, error: 'Failed to fetch bookings' }); }
});

router.post('/bookings', createBookingLimiter, async (req: Request, res: Response) => {
  try {
    const { firstName, surname, email, date, timeSlot, timezone } = req.body as Record<string, string>;
    const errors: string[] = [];
    if (!firstName?.trim()) errors.push('First name is required');
    if (!surname?.trim()) errors.push('Surname is required');
    if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required');
    if (!date) errors.push('Date is required');
    if (!timeSlot) errors.push('Time slot is required');
    if (!timezone) errors.push('Timezone is required');
    if (errors.length > 0) return res.status(400).json({ success: false, error: errors.join(', ') });

    const existing = await Booking.findOne({ date, timeSlot, status: 'confirmed' });
    if (existing) return res.status(409).json({ success: false, error: 'This time slot is already booked. Please select another time.' });

    const booking = new Booking({ firstName: firstName.trim(), surname: surname.trim(), email: email.trim().toLowerCase(), date, timeSlot, timezone });
    await booking.save();
    sendConfirmationEmail(booking).catch((err: Error) => console.error('Email send failed:', err.message));
    return res.status(201).json({ success: true, data: booking });
  } catch { return res.status(500).json({ success: false, error: 'Failed to create booking' }); }
});

router.get('/bookings/:id', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    return res.json({ success: true, data: booking });
  } catch { return res.status(500).json({ success: false, error: 'Failed to fetch booking' }); }
});

// GET /api/bookings/:id/cancel — called from email link, redirects to frontend
router.get('/bookings/:id/cancel', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (!booking) return res.redirect(`${frontendUrl}/cancelled?error=notfound`);
    if (booking.confirmationToken !== req.query.token) return res.redirect(`${frontendUrl}/cancelled?error=invalid`);
    booking.status = 'cancelled';
    await booking.save();
    return res.redirect(`${frontendUrl}/cancelled?name=${encodeURIComponent(booking.firstName)}`);
  } catch { return res.status(500).json({ success: false, error: 'Failed to cancel booking' }); }
});

// GET /api/bookings/:id/reschedule — called from email link, marks old booking rescheduled, redirects
router.get('/bookings/:id/reschedule', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (!booking) return res.redirect(`${frontendUrl}/?error=notfound`);
    if (booking.confirmationToken !== req.query.token) return res.redirect(`${frontendUrl}/?error=invalid`);
    booking.status = 'rescheduled';
    await booking.save();
    return res.redirect(
      `${frontendUrl}/reschedule?bookingId=${booking._id}&email=${encodeURIComponent(booking.email)}&firstName=${encodeURIComponent(booking.firstName)}&surname=${encodeURIComponent(booking.surname)}&token=${booking.confirmationToken}`
    );
  } catch { return res.status(500).json({ success: false, error: 'Failed to initiate reschedule' }); }
});

export default router;
