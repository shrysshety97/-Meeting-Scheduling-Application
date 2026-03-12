import { useRef, useEffect } from 'react';
import { TimezoneOption } from '../utils/timezoneUtils';
import { convertSlotsToTimezone } from '../utils/timezoneUtils';
import { formatDateMedium } from '../utils/dateUtils';
import TimezoneSelector from './TimezoneSelector';

interface TimeSlotPanelProps {
  selectedDate: string | null;
  slots: string[];
  loading: boolean;
  error: string | null;
  selectedSlot: string | null;
  timezone: TimezoneOption;
  onTimezoneChange: (tz: TimezoneOption) => void;
  onSelectSlot: (slot: string, displayTime: string) => void;
  onRetry: () => void;
}

function SkeletonSlot() {
  return <div className="h-10 bg-gray-100 rounded-lg animate-pulse" aria-hidden="true" />;
}

export default function TimeSlotPanel({
  selectedDate, slots, loading, error, selectedSlot,
  timezone, onTimezoneChange, onSelectSlot, onRetry,
}: TimeSlotPanelProps) {
  const displaySlots = convertSlotsToTimezone(slots, timezone.offset);
  const firstSlotRef = useRef<HTMLButtonElement>(null);

  // When slots finish loading, announce to screen readers
  useEffect(() => {
    if (!loading && slots.length > 0 && firstSlotRef.current) {
      // Don't auto-focus — just make available
    }
  }, [loading, slots.length]);

  return (
    <div className="flex flex-col h-full">
      {/* Meeting location */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Meeting location</p>
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Google Meet</span>
        </div>
      </div>

      {/* Meeting duration */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Meeting duration</p>
        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
          30 mins
        </span>
      </div>

      {/* What time works best */}
      <div className="flex-1 flex flex-col min-h-0">
        <p className="text-sm font-semibold text-gray-800 mb-0.5">What time works best?</p>
        <p className="text-xs text-gray-500 mb-2">
          {selectedDate ? `Showing times for ${formatDateMedium(selectedDate)}` : 'Select a date to see available times'}
        </p>

        {selectedDate && (
          <div className="mb-3">
            <TimezoneSelector selected={timezone} onChange={onTimezoneChange} />
          </div>
        )}

        {/* aria-live region announces slot list changes to screen readers */}
        <div
          className="flex-1 overflow-y-auto slot-scroll space-y-2 max-h-56 pr-1"
          aria-live="polite"
          aria-atomic="false"
          role="region"
          aria-label="Available time slots"
        >
          {!selectedDate && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400" role="status">
              <svg className="w-8 h-8 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Select a date to see available times</p>
            </div>
          )}

          {selectedDate && loading && (
            <div role="status" aria-label="Loading available time slots">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonSlot key={i} />)}
              <span className="sr-only">Loading available times...</span>
            </div>
          )}

          {selectedDate && error && (
            <div className="text-center py-4" role="alert">
              <p className="text-sm text-red-500 mb-2">Unable to load available times. Please try again.</p>
              <button onClick={onRetry} className="text-xs text-indigo-600 hover:text-indigo-800 underline">
                Try again
              </button>
            </div>
          )}

          {selectedDate && !loading && !error && displaySlots.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-gray-400" role="status">
              <svg className="w-6 h-6 mb-1 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-center">No available times for this date.<br />Please select another date.</p>
            </div>
          )}

          {!loading && !error && displaySlots.map((displayTime, i) => {
            const originalSlot = slots[i];
            const isSelected = selectedSlot === originalSlot;
            return (
              <button
                key={originalSlot}
                ref={i === 0 ? firstSlotRef : undefined}
                onClick={() => onSelectSlot(originalSlot, displayTime)}
                className={`w-full py-2.5 text-sm font-medium border rounded-lg transition-all duration-150 ${
                  isSelected
                    ? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400 hover:text-indigo-700'
                }`}
                aria-pressed={isSelected}
                aria-label={`Select ${displayTime}`}
              >
                {displayTime}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
