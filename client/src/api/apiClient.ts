import { ApiResponse, Booking, BookingFormData } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchAvailableSlots(date: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/availability/${date}`);
  const json: ApiResponse<string[]> = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch slots');
  return json.data || [];
}

export async function createBooking(
  data: BookingFormData & { date: string; timeSlot: string; timezone: string }
): Promise<Booking> {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json: ApiResponse<Booking> = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to create booking');
  return json.data!;
}

export async function fetchAllBookings(date?: string): Promise<Booking[]> {
  const url = date ? `${BASE_URL}/bookings?date=${date}` : `${BASE_URL}/bookings`;
  const res = await fetch(url);
  const json: ApiResponse<Booking[]> = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch bookings');
  return json.data || [];
}
