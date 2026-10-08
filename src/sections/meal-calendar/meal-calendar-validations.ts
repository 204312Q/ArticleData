import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';

export const BLOCKED_INPUT_ERROR = 'HTML or scripting tags are not allowed.';

export const POSTPONEMENT_NOTICE_RULE_ERROR =
  'Please submit postponement requests at least 1 working day before 2pm for weekday deliveries, or 2 working days before 2pm for weekend and public holiday deliveries.';

export const MEAL_CALENDAR_FORM_LIMITS = {
  email: 120,
  orderId: 32,
  reason: 80,
  contactNumber: 32,
  remarks: 280,
} as const;

export const postponementReasonOptions = [
  'Medical appointment',
  'Hospital stay',
  'Not available at home',
  'Prefer to resume later',
  'Other',
] as const;

export type MealSlot = 'Lunch' | 'Dinner';
export type MealPhase = 'Recovery' | 'Nourish';
export type PostponementSession = MealSlot | 'Both';
export type PostponementSelectionMode = 'dates' | 'range';

export type PostponementItem = {
  id: string;
  mealDate: string;
  session: PostponementSession;
};

export type PostponementDateRange = {
  startDate: string;
  endDate: string;
};

export type PostponementFormValues = {
  selectionMode: PostponementSelectionMode;
  postponements: PostponementItem[];
  range: PostponementDateRange;
  reason: string;
  contactNumber: string;
  remarks: string;
};

export type PostponementItemErrors = Partial<Record<'mealDate' | 'session', string>>;
export type PostponementRangeErrors = Partial<Record<'startDate' | 'endDate', string>>;
export type PostponementSharedField = 'reason' | 'contactNumber' | 'remarks';

export type PostponementFormErrors = Partial<Record<PostponementSharedField, string>> & {
  dates?: PostponementItemErrors[];
  range?: PostponementRangeErrors;
  form?: string;
};

export type MealCalendarLoginErrors = Record<'email' | 'orderId', string>;

type MealCalendarLoginOrder = {
  email: string;
};

type MealDayForPostponementValidation = {
  meals: { slot: MealSlot }[];
};

type ValidateMealCalendarLoginFormOptions<TOrder extends MealCalendarLoginOrder> = {
  email: string;
  orderId: string;
  orders: Record<string, TOrder>;
  currentErrors?: Partial<MealCalendarLoginErrors>;
};

type ValidatePostponementFormOptions = {
  form: PostponementFormValues;
  mealDayLookup: ReadonlyMap<string, MealDayForPostponementValidation>;
  currentErrors?: PostponementFormErrors;
  now?: string | Date | Dayjs;
  publicHolidayDates?: readonly string[];
};

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

const isValidContactNumber = (value: string) => /^[+()\-\s\d]{8,24}$/.test(value);

export const safeText = (value: string, max = 120) => value.replace(/[<>]/g, '').slice(0, max);

export const hasBlockedInput = (value: string) => /[<>]/.test(value);

export const isBlockedInputError = (value = '') => value === BLOCKED_INPUT_ERROR;

const isScheduledMealDate = (
  mealDayLookup: ReadonlyMap<string, MealDayForPostponementValidation>,
  date: string
) => Boolean(mealDayLookup.get(date)?.meals.length);

const isPublicHoliday = (date: Dayjs, publicHolidayDates: readonly string[]) =>
  publicHolidayDates.includes(date.format('YYYY-MM-DD'));

const isWeekend = (date: Dayjs) => date.day() === 0 || date.day() === 6;

const isWorkingDay = (date: Dayjs, publicHolidayDates: readonly string[]) =>
  !isWeekend(date) && !isPublicHoliday(date, publicHolidayDates);

const subtractWorkingDays = (
  date: Dayjs,
  workingDays: number,
  publicHolidayDates: readonly string[]
) => {
  let currentDate = date.startOf('day');
  let remainingWorkingDays = workingDays;

  while (remainingWorkingDays > 0) {
    currentDate = currentDate.subtract(1, 'day');

    if (isWorkingDay(currentDate, publicHolidayDates)) {
      remainingWorkingDays -= 1;
    }
  }

  return currentDate;
};

const getEarliestPostponementDate = (postponements: PostponementItem[]) =>
  postponements.reduce((earliestDate, item) => {
    if (!item.mealDate) {
      return earliestDate;
    }

    if (!earliestDate || dayjs(item.mealDate).isBefore(dayjs(earliestDate), 'day')) {
      return item.mealDate;
    }

    return earliestDate;
  }, '');

const getPostponementRequestCutoff = (startDate: string, publicHolidayDates: readonly string[]) => {
  const postponementStartDate = dayjs(startDate);
  const requiredWorkingDays =
    isWeekend(postponementStartDate) || isPublicHoliday(postponementStartDate, publicHolidayDates)
      ? 2
      : 1;

  return subtractWorkingDays(postponementStartDate, requiredWorkingDays, publicHolidayDates).hour(
    14
  );
};

const isPostponementNoticeValid = (
  startDate: string,
  now: string | Date | Dayjs | undefined,
  publicHolidayDates: readonly string[]
) => {
  const submittedAt = now ? dayjs(now) : dayjs();
  const cutoff = getPostponementRequestCutoff(startDate, publicHolidayDates);

  return submittedAt.isBefore(cutoff);
};

export function validateMealCalendarLoginForm<TOrder extends MealCalendarLoginOrder>({
  email,
  orderId,
  orders,
  currentErrors,
}: ValidateMealCalendarLoginFormOptions<TOrder>) {
  const normalizedEmail = email.trim();
  const normalizedOrderId = orderId.trim().toUpperCase();
  const matchingOrder = orders[normalizedOrderId];
  const errors: MealCalendarLoginErrors = {
    email: isBlockedInputError(currentErrors?.email) ? BLOCKED_INPUT_ERROR : '',
    orderId: isBlockedInputError(currentErrors?.orderId) ? BLOCKED_INPUT_ERROR : '',
  };

  if (hasBlockedInput(normalizedEmail)) {
    errors.email = BLOCKED_INPUT_ERROR;
  } else if (!errors.email && !normalizedEmail) {
    errors.email = 'Enter your email address.';
  } else if (!errors.email && !isValidEmail(normalizedEmail)) {
    errors.email = 'Enter a valid email address.';
  }

  if (hasBlockedInput(normalizedOrderId)) {
    errors.orderId = BLOCKED_INPUT_ERROR;
  } else if (!errors.orderId && !normalizedOrderId) {
    errors.orderId = 'Enter your order ID.';
  } else if (!errors.orderId && !matchingOrder) {
    errors.orderId = 'Order ID not found.';
  } else if (
    !errors.orderId &&
    matchingOrder.email.toLowerCase() !== normalizedEmail.toLowerCase()
  ) {
    errors.orderId = 'Email and order ID do not match.';
  }

  return {
    errors,
    matchingOrder,
    normalizedEmail,
    normalizedOrderId,
    isValid: !errors.email && !errors.orderId && Boolean(matchingOrder),
  };
}

export function validatePostponementForm({
  form,
  mealDayLookup,
  currentErrors,
  now,
  publicHolidayDates = [],
}: ValidatePostponementFormOptions) {
  const errors: PostponementFormErrors = {};
  const dateErrors: PostponementItemErrors[] = form.postponements.map(() => ({}));
  const normalizedPostponements = form.postponements.map((item) => ({
    ...item,
    mealDate: item.mealDate.trim(),
  }));
  const normalizedRange = {
    startDate: form.range.startDate.trim(),
    endDate: form.range.endDate.trim(),
  };
  const normalizedValues: PostponementFormValues = {
    ...form,
    postponements: normalizedPostponements,
    range: normalizedRange,
    reason: form.reason.trim(),
    contactNumber: form.contactNumber.trim(),
    remarks: form.remarks.trim(),
  };
  const selectedDates = new Set<string>();
  let postponementStartDate = '';
  let canValidateNotice = false;

  if (normalizedValues.selectionMode === 'range') {
    const rangeErrors: PostponementRangeErrors = {};
    const { startDate, endDate } = normalizedRange;

    if (!startDate) {
      rangeErrors.startDate = 'Select the first meal date to postpone.';
    } else if (!isScheduledMealDate(mealDayLookup, startDate)) {
      rangeErrors.startDate = 'Select a scheduled meal date.';
    }

    if (!endDate) {
      rangeErrors.endDate = 'Select the last meal date to postpone.';
    } else if (!isScheduledMealDate(mealDayLookup, endDate)) {
      rangeErrors.endDate = 'Select a scheduled meal date.';
    } else if (startDate && dayjs(endDate).isBefore(dayjs(startDate), 'day')) {
      rangeErrors.endDate = 'End date must be on or after the start date.';
    }

    if (Object.values(rangeErrors).some(Boolean)) {
      errors.range = rangeErrors;
    } else {
      postponementStartDate = startDate;
      canValidateNotice = true;
    }
  } else {
    normalizedPostponements.forEach((item, index) => {
      const sessionOptions = mealDayLookup.get(item.mealDate)?.meals.map((meal) => meal.slot) ?? [];

      if (!item.mealDate) {
        dateErrors[index].mealDate = 'Select the meal date to postpone.';
      } else if (!sessionOptions.length) {
        dateErrors[index].mealDate = 'Select a scheduled meal date.';
      } else if (selectedDates.has(item.mealDate)) {
        dateErrors[index].mealDate = 'This date has already been added.';
      } else {
        selectedDates.add(item.mealDate);
      }

      if (!item.session) {
        dateErrors[index].session = 'Select the meal session.';
      } else if (item.session === 'Both' && sessionOptions.length < 2) {
        dateErrors[index].session = 'Only one meal is scheduled for this date.';
      } else if (item.session !== 'Both' && !sessionOptions.includes(item.session)) {
        dateErrors[index].session = 'Select a meal session available for this date.';
      }
    });

    if (!normalizedPostponements.length) {
      errors.form = 'Select at least one postponement date.';
    }

    if (dateErrors.some((error) => Object.values(error).some(Boolean))) {
      errors.dates = dateErrors;
    } else if (normalizedPostponements.length) {
      postponementStartDate = getEarliestPostponementDate(normalizedPostponements);
      canValidateNotice = true;
    }
  }

  if (
    canValidateNotice &&
    postponementStartDate &&
    !isPostponementNoticeValid(postponementStartDate, now, publicHolidayDates)
  ) {
    errors.form = POSTPONEMENT_NOTICE_RULE_ERROR;
  }

  if (isBlockedInputError(currentErrors?.contactNumber) || hasBlockedInput(form.contactNumber)) {
    errors.contactNumber = BLOCKED_INPUT_ERROR;
  } else if (!normalizedValues.contactNumber) {
    errors.contactNumber = 'Enter a contact number.';
  } else if (!isValidContactNumber(normalizedValues.contactNumber)) {
    errors.contactNumber = 'Enter a valid contact number.';
  }

  if (isBlockedInputError(currentErrors?.reason) || hasBlockedInput(form.reason)) {
    errors.reason = BLOCKED_INPUT_ERROR;
  }

  if (isBlockedInputError(currentErrors?.remarks) || hasBlockedInput(form.remarks)) {
    errors.remarks = BLOCKED_INPUT_ERROR;
  }

  return {
    errors,
    values: normalizedValues,
    isValid: Object.keys(errors).length === 0,
  };
}
