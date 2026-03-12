import { useState } from 'react';
import { toApiDate, isPast, isWeekend, isToday } from '../utils/dateUtils';

interface CalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export default function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed

  const firstDay = new Date(viewYear, viewMonth, 1);
  // Convert Sunday=0 to Monday=0 based week
  const startDayOfWeek = (firstDay.getDay() + 6) % 7; // 0=Mon...6=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const isCurrentMonth =
    viewYear === now.getFullYear() && viewMonth === now.getMonth();

  function prevMonth() {
    if (isCurrentMonth) return; // Don't go before current month
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  // Build grid cells (null = empty padding)
  const cells: (number | null)[] = Array(startDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  function handleDayClick(day: number) {
    const date = new Date(viewYear, viewMonth, day);
    if (isPast(date) || isWeekend(date)) return;
    onSelectDate(toApiDate(date));
  }

  function getDayClasses(day: number): string {
    const date = new Date(viewYear, viewMonth, day);
    const dateStr = toApiDate(date);
    const past = isPast(date);
    const weekend = isWeekend(date);
    const disabled = past || weekend;
    const selected = selectedDate === dateStr;
    const today = isToday(date);

    let cls = 'w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all duration-150 select-none ';

    if (disabled) {
      cls += 'text-slate-400 cursor-not-allowed ';
    } else if (selected) {
      cls += 'bg-orange-500 text-white font-semibold cursor-pointer ';
    } else if (today) {
      cls += 'border-2 border-orange-400 text-white font-semibold cursor-pointer hover:bg-orange-400 ';
    } else {
      cls += 'text-white cursor-pointer hover:bg-slate-600 ';
    }

    return cls;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-slate-500 flex items-center justify-center text-white text-xl font-bold mb-3">
          V
        </div>
        <p className="text-slate-300 text-sm">Meet with Victoire Serruys</p>
        {/* Month navigation */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={prevMonth}
            disabled={isCurrentMonth}
            aria-label="Previous month"
            className={`text-slate-300 hover:text-white transition-colors p-1 ${
              isCurrentMonth ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            ‹
          </button>
          <p className="text-white font-semibold text-sm">
            {MONTHS[viewMonth]} {viewYear}
          </p>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="text-slate-300 hover:text-white transition-colors p-1"
          >
            ›
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-slate-400 text-[10px] font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center py-0.5">
            {day !== null ? (
              <button
                onClick={() => handleDayClick(day)}
                disabled={isPast(new Date(viewYear, viewMonth, day)) || isWeekend(new Date(viewYear, viewMonth, day))}
                aria-label={`${day} ${MONTHS[viewMonth]} ${viewYear}`}
                aria-disabled={isPast(new Date(viewYear, viewMonth, day)) || isWeekend(new Date(viewYear, viewMonth, day))}
                className={getDayClasses(day)}
              >
                {day}
              </button>
            ) : (
              <div className="w-8 h-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
