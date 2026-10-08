import { it, expect, describe } from 'vitest';

import {
  BLOCKED_INPUT_ERROR,
  validatePostponementForm,
  validateMealCalendarLoginForm,
  POSTPONEMENT_NOTICE_RULE_ERROR,
} from './meal-calendar-validations';

const mealDayLookup = new Map([
  ['2026-08-04', { meals: [{ slot: 'Lunch' as const }, { slot: 'Dinner' as const }] }],
  ['2026-08-05', { meals: [{ slot: 'Dinner' as const }] }],
  ['2026-08-06', { meals: [{ slot: 'Lunch' as const }, { slot: 'Dinner' as const }] }],
  ['2026-08-07', { meals: [{ slot: 'Lunch' as const }, { slot: 'Dinner' as const }] }],
  ['2026-08-08', { meals: [{ slot: 'Lunch' as const }, { slot: 'Dinner' as const }] }],
]);

describe('validateMealCalendarLoginForm', () => {
  it('normalizes a valid email and order ID', () => {
    const result = validateMealCalendarLoginForm({
      email: ' customer@example.com ',
      orderId: ' cp123 ',
      orders: { CP123: { email: 'customer@example.com' } },
    });

    expect(result.isValid).toBe(true);
    expect(result.normalizedEmail).toBe('customer@example.com');
    expect(result.normalizedOrderId).toBe('CP123');
    expect(result.errors).toEqual({ email: '', orderId: '' });
  });

  it('preserves blocked-input errors captured while typing', () => {
    const result = validateMealCalendarLoginForm({
      email: 'customer@example.com',
      orderId: 'CP123',
      orders: { CP123: { email: 'customer@example.com' } },
      currentErrors: { email: BLOCKED_INPUT_ERROR },
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe(BLOCKED_INPUT_ERROR);
  });
});

describe('validatePostponementForm', () => {
  it('accepts a valid postponement request and trims shared fields', () => {
    const result = validatePostponementForm({
      mealDayLookup,
      form: {
        selectionMode: 'dates',
        postponements: [{ id: 'postponement-1', mealDate: '2026-08-04', session: 'Both' }],
        range: { startDate: '', endDate: '' },
        reason: '',
        contactNumber: ' 91234567 ',
        remarks: ' Please call first. ',
      },
      now: '2026-08-03T13:59:00',
    });

    expect(result.isValid).toBe(true);
    expect(result.values.contactNumber).toBe('91234567');
    expect(result.values.remarks).toBe('Please call first.');
  });

  it('returns field-level errors for duplicate dates and unavailable sessions', () => {
    const result = validatePostponementForm({
      mealDayLookup,
      form: {
        selectionMode: 'dates',
        postponements: [
          { id: 'postponement-1', mealDate: '2026-08-05', session: 'Both' },
          { id: 'postponement-2', mealDate: '2026-08-05', session: 'Dinner' },
        ],
        range: { startDate: '', endDate: '' },
        reason: '',
        contactNumber: '123',
        remarks: '',
      },
      now: '2026-08-03T13:59:00',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.dates?.[0].session).toBe('Only one meal is scheduled for this date.');
    expect(result.errors.dates?.[1].mealDate).toBe('This date has already been added.');
    expect(result.errors.contactNumber).toBe('Enter a valid contact number.');
  });

  it('accepts a valid date range request', () => {
    const result = validatePostponementForm({
      mealDayLookup,
      form: {
        selectionMode: 'range',
        postponements: [],
        range: { startDate: '2026-08-04', endDate: '2026-08-05' },
        reason: '',
        contactNumber: '91234567',
        remarks: '',
      },
      now: '2026-08-03T13:59:00',
    });

    expect(result.isValid).toBe(true);
    expect(result.values.range).toEqual({ startDate: '2026-08-04', endDate: '2026-08-05' });
  });

  it('accepts more than three individually selected postponement dates', () => {
    const result = validatePostponementForm({
      mealDayLookup,
      form: {
        selectionMode: 'dates',
        postponements: [
          { id: 'postponement-1', mealDate: '2026-08-04', session: 'Both' },
          { id: 'postponement-2', mealDate: '2026-08-05', session: 'Dinner' },
          { id: 'postponement-3', mealDate: '2026-08-06', session: 'Both' },
          { id: 'postponement-4', mealDate: '2026-08-07', session: 'Both' },
        ],
        range: { startDate: '', endDate: '' },
        reason: '',
        contactNumber: '91234567',
        remarks: '',
      },
      now: '2026-08-03T13:59:00',
    });

    expect(result.isValid).toBe(true);
  });

  it('accepts date range requests with more than three scheduled dates', () => {
    const result = validatePostponementForm({
      mealDayLookup,
      form: {
        selectionMode: 'range',
        postponements: [],
        range: { startDate: '2026-08-04', endDate: '2026-08-07' },
        reason: '',
        contactNumber: '91234567',
        remarks: '',
      },
      now: '2026-08-03T13:59:00',
    });

    expect(result.isValid).toBe(true);
  });

  it('rejects weekday postponement requests submitted after the 1 working day cutoff', () => {
    const result = validatePostponementForm({
      mealDayLookup,
      form: {
        selectionMode: 'dates',
        postponements: [{ id: 'postponement-1', mealDate: '2026-08-04', session: 'Both' }],
        range: { startDate: '', endDate: '' },
        reason: '',
        contactNumber: '91234567',
        remarks: '',
      },
      now: '2026-08-03T14:00:00',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.form).toBe(POSTPONEMENT_NOTICE_RULE_ERROR);
  });

  it('rejects weekend postponement requests submitted after the 2 working day cutoff', () => {
    const result = validatePostponementForm({
      mealDayLookup,
      form: {
        selectionMode: 'dates',
        postponements: [{ id: 'postponement-1', mealDate: '2026-08-08', session: 'Both' }],
        range: { startDate: '', endDate: '' },
        reason: '',
        contactNumber: '91234567',
        remarks: '',
      },
      now: '2026-08-06T14:00:00',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.form).toBe(POSTPONEMENT_NOTICE_RULE_ERROR);
  });

  it('uses the 2 working day cutoff for public holiday postponement requests', () => {
    const result = validatePostponementForm({
      mealDayLookup,
      form: {
        selectionMode: 'range',
        postponements: [],
        range: { startDate: '2026-08-07', endDate: '2026-08-07' },
        reason: '',
        contactNumber: '91234567',
        remarks: '',
      },
      now: '2026-08-05T14:00:00',
      publicHolidayDates: ['2026-08-07'],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.form).toBe(POSTPONEMENT_NOTICE_RULE_ERROR);
  });
});
