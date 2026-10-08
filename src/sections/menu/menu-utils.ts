import dayjs, { type Dayjs } from 'dayjs';

// ----------------------------------------------------------------------

// The kitchen cooks one fixed 28-day rotation per calendar date, shared by every
// customer regardless of when their own plan started — so the same calendar date
// always serves the same Recovery/Nourish dish to everyone.
// Recalibrated 2026-08-06 against the actual kitchen rotation, confirmed as
// Recovery Day 3 (recoveryIndex 2) / Nourish Day 17 (nourishIndex 9) on that
// date. The previous anchor ('2025-01-01') was off by 5 days — it produced
// recoveryIndex 0 / nourishIndex 14 for the same date.
const BASE_DATE = dayjs('2025-01-06');
const RECOVERY_LENGTH = 7;
const NOURISH_LENGTH = 21;

export function getMenuIndexesForDate(selectedDate: Dayjs, nonOperatingDays: string[]) {
  let current = BASE_DATE;
  let dayCount = 0;

  while (current.isBefore(selectedDate, 'day') || current.isSame(selectedDate, 'day')) {
    if (!nonOperatingDays.includes(current.format('YYYY-MM-DD'))) {
      dayCount += 1;
    }

    current = current.add(1, 'day');
  }

  const recoveryIndex = (6 + dayCount - 1) % RECOVERY_LENGTH;
  const nourishIndex = (20 + dayCount - 1) % NOURISH_LENGTH;

  return { recoveryIndex, nourishIndex };
}
