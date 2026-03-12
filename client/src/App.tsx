import { useState, useRef, useEffect } from 'react';
import { Booking } from './types';
import { DEFAULT_TIMEZONE, TimezoneOption } from './utils/timezoneUtils';
import { useAvailableSlots } from './hooks/useAvailableSlots';
import StepIndicator from './components/StepIndicator';
import Logo from './components/Logo';
import Calendar from './components/Calendar';
import TimeSlotPanel from './components/TimeSlotPanel';
import BookingForm from './components/BookingForm';
import ConfirmationScreen from './components/ConfirmationScreen';
import FloatingChatButton from './components/FloatingChatButton';

type Step = 'calendar' | 'form' | 'confirmation';

export default function App() {
  const [step, setStep] = useState<Step>('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [displayTime, setDisplayTime] = useState<string>('');
  const [timezone, setTimezone] = useState<TimezoneOption>(DEFAULT_TIMEZONE);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const { slots, loading, error, retry } = useAvailableSlots(selectedDate);

  // Focus management: move focus to top of new step for screen readers
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [step]);

  function handleSelectSlot(slot: string, display: string) {
    setSelectedSlot(slot);
    setDisplayTime(display);
    setStep('form');
  }

  function handleConfirm(booking: Booking) {
    setConfirmedBooking(booking);
    setStep('confirmation');
  }

  function handleBack() {
    setStep('calendar');
    setSelectedSlot(null);
    setDisplayTime('');
  }

  if (step === 'confirmation' && confirmedBooking) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-8 px-4">
        {/* Skip to main content link for keyboard users */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-4 py-2 rounded text-indigo-700 text-sm font-medium z-50">
          Skip to main content
        </a>
        <div
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="w-full max-w-2xl outline-none"
          aria-label="Booking confirmation"
        >
          <StepIndicator currentStep="confirmation" />
          <Logo />
          <ConfirmationScreen
            booking={confirmedBooking}
            displayTime={displayTime}
            timezone={`${timezone.label} ${timezone.cities}`}
          />
        </div>
        <FloatingChatButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-8 px-4 pb-16">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-4 py-2 rounded text-indigo-700 text-sm font-medium z-50">
        Skip to main content
      </a>
      <div
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="w-full max-w-2xl outline-none"
        aria-label={step === 'form' ? 'Your information form' : 'Select meeting time'}
      >
        <StepIndicator currentStep={step === 'form' ? 'form' : 'calendar'} />
        <Logo />

        {step === 'form' && selectedDate && selectedSlot ? (
          <div className="bg-white rounded-2xl shadow-md p-8 animate-fadeIn">
            <BookingForm
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              displayTime={displayTime}
              timezone={timezone}
              onBack={handleBack}
              onConfirm={handleConfirm}
            />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row rounded-2xl shadow-md overflow-hidden">
            <div className="bg-slate-700 p-6 md:w-[45%] flex-shrink-0">
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
              />
            </div>
            <div className="bg-white p-6 flex-1 flex flex-col">
              <TimeSlotPanel
                selectedDate={selectedDate}
                slots={slots}
                loading={loading}
                error={error}
                selectedSlot={selectedSlot}
                timezone={timezone}
                onTimezoneChange={setTimezone}
                onSelectSlot={handleSelectSlot}
                onRetry={retry}
              />
            </div>
          </div>
        )}
      </div>
      <FloatingChatButton />
    </div>
  );
}
