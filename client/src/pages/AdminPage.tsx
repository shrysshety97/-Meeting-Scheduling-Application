import { useState, useEffect } from 'react';
import { Booking } from '../types';
import { fetchAllBookings } from '../api/apiClient';

function StatusBadge({ status }: { status: Booking['status'] }) {
  const colors = {
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    rescheduled: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchAllBookings(dateFilter || undefined)
      .then(setBookings)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [dateFilter]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin — All Bookings</h1>
          <a href="/" className="text-sm text-indigo-600 hover:text-indigo-800">← Back to Scheduler</a>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-3">
          <label htmlFor="dateFilter" className="text-sm font-medium text-gray-700">Filter by date:</label>
          <input
            id="dateFilter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
          />
          {dateFilter && (
            <button onClick={() => setDateFilter('')} className="text-xs text-gray-400 hover:text-gray-600">
              Clear
            </button>
          )}
        </div>

        {loading && <div className="text-center py-8 text-gray-400">Loading bookings...</div>}
        {error && <div className="text-center py-8 text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No bookings found</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700 text-white">
                    {['Name', 'Email', 'Date', 'Time', 'Timezone', 'Status', 'Meet Link', 'Created'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={b._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-800">{b.firstName} {b.surname}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.timeSlot}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-xs">{b.timezone}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3">
                        <a href={b.googleMeetLink} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:text-indigo-800 underline">
                          Join
                        </a>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
