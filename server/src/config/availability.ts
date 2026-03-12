// Availability configuration
const START_HOUR = parseInt(process.env.AVAILABILITY_START || '16', 10);
const START_MIN = parseInt(process.env.AVAILABILITY_START_MIN || '30', 10);
const END_HOUR = parseInt(process.env.AVAILABILITY_END || '18', 10);
const END_MIN = parseInt(process.env.AVAILABILITY_END_MIN || '0', 10);
const SLOT_DURATION = parseInt(process.env.SLOT_DURATION_MINUTES || '15', 10);

export function isWeekend(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6;
}

export function isPastDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + 'T00:00:00');
  return date < today;
}

export function getAvailableSlots(dateStr: string): string[] {
  if (isWeekend(dateStr) || isPastDate(dateStr)) return [];

  const slots: string[] = [];
  let hour = START_HOUR;
  let min = START_MIN;

  while (hour < END_HOUR || (hour === END_HOUR && min < END_MIN)) {
    const hh = String(hour).padStart(2, '0');
    const mm = String(min).padStart(2, '0');
    slots.push(`${hh}:${mm}`);
    min += SLOT_DURATION;
    if (min >= 60) {
      hour += Math.floor(min / 60);
      min = min % 60;
    }
  }

  return slots;
}

export const availabilityConfig = {
  startHour: START_HOUR,
  startMin: START_MIN,
  endHour: END_HOUR,
  endMin: END_MIN,
  slotDuration: SLOT_DURATION,
  hostName: 'Victoire Serruys',
};
