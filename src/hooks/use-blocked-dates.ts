'use client';

import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------
// Fetches non-operating/blocked delivery dates from /api/blocked-dates
// (BC or CT Backend, depending on ORDER_BACKEND) for the giftbox and
// package checkout calendar pickers.

type BlockedDatesResponse = {
  success: boolean;
  dates: { date: string; description: string | null }[];
};

export function useBlockedDates(): Set<string> {
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;

    fetch('/api/blocked-dates')
      .then((response) => (response.ok ? (response.json() as Promise<BlockedDatesResponse>) : null))
      .then((data) => {
        if (!active || !data?.success) return;
        setBlockedDates(new Set(data.dates.map((d) => d.date)));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return blockedDates;
}
