import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import Logo from '../components/Logo';
import Calendar from '../components/Calendar';
import TimeSlotPanel from '../components/TimeSlotPanel';
import BookingForm from '../components/BookingForm';
import FloatingChatButton from '../components/FloatingChatButton';
import { DEFAULT_TIMEZONE, TimezoneOption } from '../utils/timezoneUtils';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { Booking } from '../types';
import ConfirmationScreen from '../components/ConfirmationScreen';

type Step = 'calendar' | 'form' | 'confirmation';

export default function ReschedulePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const prefillEmail = params.get('email') || '';
  const prefillFirst = params.get('firstName') || '';
  const prefillSurname = params.get('surname') || '';

  const [step, setStep] = useState<Step>('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [displayTime, setDisplayTime] = useState('');
  const [timezone, setTimezone] = useState<TimezoneOption>(DEFAULT_TIMEZONE);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const { slots, loading, error, retry } = useAvailableSlots(selectedDate);

  function handleSelectSlot(slot: string, display: string) {
    setSelectedSlot(slot);
    setDisplayTime(display);
    setStep('form');
  }

  function handleConfirm(booking: Booking) {
    setConfirmedBooking(booking);
    setStep('confirmation');
  }

  if (step === 'confirmation' && confirmedBooking) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-8 px-4">
        <div className="w-full max-w-2xl">
          <StepIndicator currentStep="confirmation" />
          <Logo />
          <ConfirmationScreen booking={confirmedBooking} displayTime={displayTime} timezone={`${timezone.label} ${timezone.cities}`} />
        </div>
        <FloatingChatButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-8 px-4 pb-16">
      <div className="w-full max-w-2xl">
        {/* Banner */}
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl px-4 py-3 mb-4 text-center">
          You are rescheduling your meeting. Please select a new date and time.
        </div>

        <StepIndicator currentStep={step === 'form' ? 'form' : 'calendar'} />
        <Logo />

        {step === 'form' && selectedDate && selectedSlot ? (
          <div className="bg-white rounded-2xl shadow-md p-8 animate-fadeIn">
            <BookingForm
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              displayTime={displayTime}
              timezone={timezone}
              prefillFirstName={prefillFirst}
              prefillSurname={prefillSurname}
              prefillEmail={prefillEmail}
              onBack={() => setStep('calendar')}
              onConfirm={handleConfirm}
            />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row rounded-2xl shadow-md overflow-hidden">
            <div className="bg-slate-700 p-6 md:w-[45%] flex-shrink-0">
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={(date) => { setSelectedDate(date); setSelectedSlot(null); }}
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

        <button onClick={() => navigate('/')} className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline block text-center">
          Cancel rescheduling — go back home
        </button>
      </div>
      <FloatingChatButton />
    </div>
  );
}
