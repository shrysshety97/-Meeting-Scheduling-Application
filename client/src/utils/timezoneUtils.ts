export interface TimezoneOption {
  label: string;
  offset: number;
  cities: string;
  display: string;
}

export const TIMEZONE_LIST: TimezoneOption[] = [
  { label: 'UTC +05:00', offset: 300, cities: 'Almaty, Aqtau, Aqtobe', display: 'UTC +05:00 Almaty, Aqtau, Aqto...' },
  { label: 'UTC +05:30', offset: 330, cities: 'New Delhi, Mumbai, Calcutta', display: 'UTC +05:30 New Delhi, Mumbai, Calcutta' },
  { label: 'UTC +05:45', offset: 345, cities: 'Kathmandu, Katmandu', display: 'UTC +05:45 Kathmandu, Katma...' },
  { label: 'UTC +06:00', offset: 360, cities: 'Bishkek, Dacca, Dhaka', display: 'UTC +06:00 Bishkek, Dacca, Dh...' },
  { label: 'UTC +06:30', offset: 390, cities: 'Rangoon, Yangon', display: 'UTC +06:30 Rangoon, Yangon' },
  { label: 'UTC +07:00', offset: 420, cities: 'Jakarta, Indochina Time', display: 'UTC +07:00 Indochina Time' },
];

export const DEFAULT_TIMEZONE = TIMEZONE_LIST[1]; // UTC +05:30

// Slots are stored as IST (UTC+5:30 = offset 330)
const BASE_OFFSET = 330;

export function convertTimeToTimezone(timeSlot: string, toOffset: number): string {
  const [h, m] = timeSlot.split(':').map(Number);
  const totalMinutes = h * 60 + m;
  const diffMinutes = toOffset - BASE_OFFSET;
  let converted = totalMinutes + diffMinutes;
  // Handle overflow
  converted = ((converted % 1440) + 1440) % 1440;
  const newH = Math.floor(converted / 60);
  const newM = converted % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export function convertSlotsToTimezone(slots: string[], toOffset: number): string[] {
  return slots.map((s) => convertTimeToTimezone(s, toOffset));
}
