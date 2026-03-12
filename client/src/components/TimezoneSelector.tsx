import { useState, useEffect, useRef } from 'react';
import { TimezoneOption, TIMEZONE_LIST } from '../utils/timezoneUtils';

interface TimezoneSelectorProps {
  selected: TimezoneOption;
  onChange: (tz: TimezoneOption) => void;
}

export default function TimezoneSelector({ selected, onChange }: TimezoneSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = TIMEZONE_LIST.filter(
    (tz) =>
      tz.label.toLowerCase().includes(search.toLowerCase()) ||
      tz.cities.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected.display}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn"
          role="listbox"
          aria-label="Select timezone"
        >
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1.5">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* Timezone list */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.map((tz) => (
              <button
                key={tz.label}
                role="option"
                aria-selected={selected.label === tz.label}
                onClick={() => {
                  onChange(tz);
                  setOpen(false);
                  setSearch('');
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  selected.label === tz.label ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                }`}
              >
                {tz.display}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-3 text-sm text-gray-400 text-center">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
