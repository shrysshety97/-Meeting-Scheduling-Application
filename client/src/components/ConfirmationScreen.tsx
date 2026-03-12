import { Booking } from '../types';
import CelebrationIllustration from './CelebrationIllustration';

interface ConfirmationScreenProps {
  booking: Booking;
  displayTime: string;   // user's timezone-converted time e.g. "17:00"
  timezone: string;      // e.g. "UTC +06:00 Bishkek, Dacca, Dhaka"
}

function formatConfirmDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ConfirmationScreen({ booking, displayTime, timezone }: ConfirmationScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-xs w-full text-center animate-scaleIn">
        {/* Illustration */}
        <div className="flex justify-center mb-4">
          <CelebrationIllustration />
        </div>

        {/* Text */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Booking confirmed</h2>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          You&apos;re booked with Victoire Serruys.<br />
          An invitation has been emailed to you.
        </p>

        {/* Date & Time — show user's timezone display time */}
        <div className="mt-2">
          <p className="text-base font-bold text-gray-800">{formatConfirmDate(booking.date)}</p>
          <p className="text-base font-bold text-gray-800">{displayTime}</p>
          <p className="text-xs text-gray-400 mt-1">{timezone}</p>
        </div>

        {/* Google Meet link */}
        <div className="mt-4">
          <a
            href={booking.googleMeetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 hover:text-indigo-800 break-all"
          >
            {booking.googleMeetLink}
          </a>
        </div>

        {/* Book another */}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 text-xs text-gray-400 hover:text-gray-600 underline"
        >
          Book another meeting
        </button>
      </div>
    </div>
  );
}
