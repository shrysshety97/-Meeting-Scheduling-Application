import { useState } from 'react';
import { BookingFormData } from '../types';
import { formatDateForDisplay } from '../utils/dateUtils';
import { createBooking } from '../api/apiClient';
import { TimezoneOption } from '../utils/timezoneUtils';
import { Booking } from '../types';

interface BookingFormProps {
  prefillFirstName?: string;
  prefillSurname?: string;
  prefillEmail?: string;
  selectedDate: string;
  selectedSlot: string;
  displayTime: string;
  timezone: TimezoneOption;
  onBack: () => void;
  onConfirm: (booking: Booking) => void;
}

interface FormErrors {
  firstName?: string;
  surname?: string;
  email?: string;
  general?: string;
}

export default function BookingForm({
  selectedDate,
  selectedSlot,
  displayTime,
  timezone,
  prefillFirstName = '',
  prefillSurname = '',
  prefillEmail = '',
  onBack,
  onConfirm,
}: BookingFormProps) {
  const [form, setForm] = useState<BookingFormData>({ firstName: prefillFirstName, surname: prefillSurname, email: prefillEmail });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  function validate(data: BookingFormData): FormErrors {
    const errs: FormErrors = {};
    if (!data.firstName.trim()) errs.firstName = 'First name is required';
    if (!data.surname.trim()) errs.surname = 'Surname is required';
    if (!data.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      errs.email = 'Please enter a valid email address';
    }
    return errs;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) {
      setErrors(validate(updated));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validate(form));
  }

  async function handleSubmit() {
    // Mark all as touched
    setTouched({ firstName: true, surname: true, email: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const booking = await createBooking({
        ...form,
        date: selectedDate,
        timeSlot: selectedSlot,
        timezone: `${timezone.label} ${timezone.cities}`,
      });
      onConfirm(booking);
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fadeIn">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Your information</h2>

      {/* Selected time summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-800 font-medium">
          {formatDateForDisplay(selectedDate)} {displayTime}{' '}
          <button
            onClick={onBack}
            className="text-indigo-600 text-sm font-normal hover:text-indigo-800 ml-1"
          >
            Edit
          </button>
        </p>
        <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>Google Meet</span>
        </div>
      </div>

      {/* General error */}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {errors.general}
        </div>
      )}

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
            First name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={50}
            className={`w-full border rounded-md px-3 py-2 text-sm outline-none transition-colors ${
              errors.firstName && touched.firstName
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-300 focus:border-indigo-500'
            }`}
            placeholder="First name"
          />
          {errors.firstName && touched.firstName && (
            <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label htmlFor="surname" className="block text-xs font-medium text-gray-700 mb-1">
            Surname <span className="text-red-500">*</span>
          </label>
          <input
            id="surname"
            name="surname"
            type="text"
            value={form.surname}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={50}
            className={`w-full border rounded-md px-3 py-2 text-sm outline-none transition-colors ${
              errors.surname && touched.surname
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-300 focus:border-indigo-500'
            }`}
            placeholder="Surname"
          />
          {errors.surname && touched.surname && (
            <p className="text-xs text-red-500 mt-1">{errors.surname}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
          Your email address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={100}
          className={`w-full border rounded-md px-3 py-2 text-sm outline-none transition-colors ${
            errors.email && touched.email
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-300 focus:border-indigo-500'
          }`}
          placeholder="you@example.com"
        />
        {errors.email && touched.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ‹ Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-800 text-white rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {loading ? 'Confirming...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}
