export interface Booking {
  _id: string;
  firstName: string;
  surname: string;
  email: string;
  date: string;
  timeSlot: string;
  timezone: string;
  googleMeetLink: string;
  status: 'confirmed' | 'cancelled' | 'rescheduled';
  confirmationToken: string;
  createdAt: string;
}

export interface BookingFormData {
  firstName: string;
  surname: string;
  email: string;
}

export interface TimezoneOption {
  label: string;
  offset: number; // offset in minutes from UTC
  cities: string;
  display: string; // e.g. "UTC +05:30 New Delhi, Mumbai, Calcutta"
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
