import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  firstName: string;
  surname: string;
  email: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  timezone: string;
  googleMeetLink: string;
  status: 'confirmed' | 'cancelled' | 'rescheduled';
  confirmationToken: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    surname: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    timezone: { type: String, required: true },
    googleMeetLink: { type: String, default: '' },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'rescheduled'],
      default: 'confirmed',
    },
    confirmationToken: { type: String, default: '' },
  },
  { timestamps: true }
);

// Indexes for performance
BookingSchema.index({ date: 1 });
BookingSchema.index({ date: 1, timeSlot: 1 });

// Pre-save: generate Google Meet link and token
BookingSchema.pre('save', function (next) {
  if (!this.googleMeetLink) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const rand = (n: number) =>
      Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    this.googleMeetLink = `https://meet.google.com/${rand(3)}-${rand(4)}-${rand(3)}`;
  }
  if (!this.confirmationToken) {
    this.confirmationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
  next();
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
