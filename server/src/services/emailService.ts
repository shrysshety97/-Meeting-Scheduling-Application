import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { IBooking } from '../models/Booking';

function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function buildEmailHtml(booking: IBooking, rescheduleUrl: string, cancelUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
  <tr><td align="center">
    <table width="540" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);max-width:100%;">

      <!-- Header -->
      <tr><td style="padding:24px 28px;border-bottom:1px solid #e5e7eb;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:8px;vertical-align:middle;">
                    <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="20,4 36,13 20,22 4,13" fill="#6366f1"/>
                      <polygon points="4,13 20,22 20,36 4,25" fill="#312e81"/>
                      <polygon points="36,13 20,22 20,36 36,25" fill="#4338ca"/>
                    </svg>
                  </td>
                  <td style="font-size:20px;font-weight:800;color:#1e1b4b;vertical-align:middle;letter-spacing:-0.5px;">climatiq</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:28px;">
        <h2 style="margin:0 0 6px;font-size:18px;color:#111827;text-align:center;">Meeting confirmed with Victoire Serruys</h2>
        <p style="margin:0 0 24px;font-size:13px;color:#6b7280;text-align:center;">
          Hi ${booking.firstName}, your meeting has been booked successfully.
        </p>

        <!-- Avatar -->
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:56px;height:56px;background:#e0e7ff;border-radius:50%;display:inline-block;line-height:56px;font-size:22px;font-weight:700;color:#4338ca;">V</div>
        </div>

        <!-- Details table -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
          <tr>
            <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;background:#fafafa;">
              <div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Attendee</div>
              <div style="color:#111827;font-size:14px;font-weight:500;">${booking.firstName} ${booking.surname}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;background:#fff;">
              <div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Email</div>
              <div style="color:#4338ca;font-size:14px;">${booking.email}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;background:#fafafa;">
              <div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Date &amp; Time</div>
              <div style="color:#111827;font-size:14px;font-weight:600;">${formatDateLong(booking.date)} at ${booking.timeSlot}</div>
              <div style="color:#9ca3af;font-size:12px;margin-top:2px;">${booking.timezone}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;background:#fff;">
              <div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Meeting Link</div>
              <a href="${booking.googleMeetLink}" style="color:#4338ca;font-size:14px;word-break:break-all;">${booking.googleMeetLink}</a>
            </td>
          </tr>
        </table>

        <!-- Action buttons -->
        <p style="color:#6b7280;font-size:13px;text-align:center;margin:0 0 14px;">
          Need to make changes? Use the buttons below:
        </p>
        <div style="text-align:center;">
          <a href="${rescheduleUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:11px 26px;border-radius:7px;text-decoration:none;font-size:13px;font-weight:700;margin-right:10px;">
            📅 Reschedule
          </a>
          <a href="${cancelUrl}" style="display:inline-block;background:#ef4444;color:#fff;padding:11px 26px;border-radius:7px;text-decoration:none;font-size:13px;font-weight:700;">
            ✕ Cancel Meeting
          </a>
        </div>

        <!-- Footer note -->
        <p style="color:#d1d5db;font-size:11px;text-align:center;margin:28px 0 0;">
          This email was sent by Climatiq Meeting Scheduler. Please do not reply to this email.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ── RESEND (primary — real emails) ──────────────────────────────────────────
async function sendWithResend(booking: IBooking, rescheduleUrl: string, cancelUrl: string): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = buildEmailHtml(booking, rescheduleUrl, cancelUrl);

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Climatiq Meetings <onboarding@resend.dev>',
    to: [booking.email],
    subject: `✅ Meeting confirmed: ${formatDateLong(booking.date)} at ${booking.timeSlot}`,
    html,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  console.log(`📧 Email sent via Resend! ID: ${data?.id}`);
}

// ── ETHEREAL (fallback — no API key needed) ─────────────────────────────────
async function sendWithEthereal(booking: IBooking, rescheduleUrl: string, cancelUrl: string): Promise<void> {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', port: 587, secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });

  const html = buildEmailHtml(booking, rescheduleUrl, cancelUrl);
  const info = await transporter.sendMail({
    from: `"Climatiq Meetings" <noreply@climatiq.io>`,
    to: booking.email,
    subject: `✅ Meeting confirmed: ${formatDateLong(booking.date)} at ${booking.timeSlot}`,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log(`📧 Ethereal preview URL: ${previewUrl}`);
  console.log(`   (No RESEND_API_KEY set — using test mode)`);
}

// ── Main export ──────────────────────────────────────────────────────────────
export async function sendConfirmationEmail(booking: IBooking): Promise<void> {
  const backendUrl  = process.env.BACKEND_URL  || 'http://localhost:5000';
  const token       = booking.confirmationToken;
  const id          = String(booking._id);

  const rescheduleUrl = `${backendUrl}/api/bookings/${id}/reschedule?token=${token}`;
  const cancelUrl     = `${backendUrl}/api/bookings/${id}/cancel?token=${token}`;

  if (process.env.RESEND_API_KEY) {
    await sendWithResend(booking, rescheduleUrl, cancelUrl);
  } else {
    await sendWithEthereal(booking, rescheduleUrl, cancelUrl);
  }
}
