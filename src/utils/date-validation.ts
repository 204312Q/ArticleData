import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';

// ----------------------------------------------------------------------

const SINGAPORE_PUBLIC_HOLIDAYS: readonly string[] = [
  '2025-01-01',
  '2025-01-29',
  '2025-01-30',
  '2025-04-18',
  '2025-05-01',
  '2025-05-12',
  '2025-06-07',
  '2025-08-09',
  '2025-10-20',
  '2025-12-25',
  '2026-01-01',
  '2026-02-17',
  '2026-02-18',
  '2026-03-21',
  '2026-04-03',
  '2026-05-01',
  '2026-05-27',
  '2026-05-31',
  '2026-06-01',
  '2026-08-09',
  '2026-08-10',
  '2026-11-08',
  '2026-11-09',
  '2026-12-25',
];

type DateInput = string | Dayjs | Date | null | undefined;

type ValidationResult = {
  isValid: boolean;
  message: string;
};

// ----------------------------------------------------------------------

export function isPublicHoliday(date: DateInput) {
  if (!date) return false;

  const dateString = dayjs(date).format('YYYY-MM-DD');
  return SINGAPORE_PUBLIC_HOLIDAYS.includes(dateString);
}

type MinimumSelectableDateOptions = {
  weekdayAfterCutoffLeadDays?: number;
  // When set, bypasses the weekday/weekend/holiday/cutoff rules below and
  // always requires this many days' lead time from today.
  flatLeadDays?: number;
};

export function getMinimumSelectableDate(now = dayjs(), options?: MinimumSelectableDateOptions) {
  if (options?.flatLeadDays !== undefined) {
    return now.add(options.flatLeadDays, 'day').startOf('day');
  }

  const currentHour = now.hour();
  const dayOfWeek = now.day();
  const isTodayPublicHoliday = isPublicHoliday(now);
  const weekdayAfterCutoffLeadDays = options?.weekdayAfterCutoffLeadDays ?? 2;

  if (dayOfWeek === 0 || isTodayPublicHoliday) {
    return now.add(3, 'day').startOf('day');
  }

  if (dayOfWeek === 6) {
    return now.add(currentHour < 14 ? 2 : 3, 'day').startOf('day');
  }

  return now.add(currentHour < 14 ? 1 : weekdayAfterCutoffLeadDays, 'day').startOf('day');
}

export type BlockedDates = ReadonlySet<string>;

export function isBlockedDate(date: DateInput, blockedDates?: BlockedDates) {
  if (!date || !blockedDates) return false;

  const dateString = dayjs(date).format('YYYY-MM-DD');
  return blockedDates.has(dateString);
}

export function shouldDisableDate(
  date: Dayjs,
  options?: MinimumSelectableDateOptions,
  blockedDates?: BlockedDates
) {
  return (
    date.isBefore(getMinimumSelectableDate(undefined, options), 'day') ||
    isBlockedDate(date, blockedDates)
  );
}

export function validateSelectedDate(
  selectedDate: DateInput,
  options?: MinimumSelectableDateOptions,
  blockedDates?: BlockedDates
): ValidationResult {
  if (!selectedDate) {
    return {
      isValid: false,
      message: 'Please select a delivery date.',
    };
  }

  const date = dayjs(selectedDate);
  const minDate = getMinimumSelectableDate(undefined, options);

  if (date.isBefore(minDate, 'day')) {
    return {
      isValid: false,
      message: 'Selected date is not available for delivery.',
    };
  }

  if (isBlockedDate(date, blockedDates)) {
    return {
      isValid: false,
      message: 'Selected date is not available for delivery.',
    };
  }

  return {
    isValid: true,
    message: '',
  };
}
