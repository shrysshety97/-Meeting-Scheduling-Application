import { useState, useEffect } from 'react';
import { fetchAvailableSlots } from '../api/apiClient';

export function useAvailableSlots(date: string | null) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchAvailableSlots(date)
      .then((data) => {
        if (!controller.signal.aborted) {
          setSlots(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!controller.signal.aborted) {
          setError(err.message);
          setSlots([]);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [date]);

  const retry = () => {
    if (date) {
      setLoading(true);
      setError(null);
      fetchAvailableSlots(date)
        .then(setSlots)
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }
  };

  return { slots, loading, error, retry };
}
