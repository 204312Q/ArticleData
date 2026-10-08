'use client';

import type FullCalendar from '@fullcalendar/react';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { EventInput, DatesSetArg, EventClickArg } from '@fullcalendar/core';
import type {
  MealSlot,
  MealPhase,
  PostponementItem,
  PostponementSession,
  PostponementFormValues,
  PostponementFormErrors,
  PostponementSharedField,
  PostponementSelectionMode,
} from 'src/sections/meal-calendar/meal-calendar-validations';

import dayjs from 'dayjs';
import Calendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import { alpha, useTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { Iconify } from 'src/components/iconify';

import { getMenuIndexesForDate } from 'src/sections/menu/menu-utils';
import { MealCalendarRoot } from 'src/sections/meal-calendar/meal-calendar-styles';
import {
  nourishMenuPool,
  nonOperatingDays,
  recoveryMenuPool,
  EMPTY_MENU_DAY_SET,
} from 'src/sections/menu/menu-data';
import {
  safeText,
  hasBlockedInput,
  BLOCKED_INPUT_ERROR,
  validatePostponementForm,
  MEAL_CALENDAR_FORM_LIMITS,
  postponementReasonOptions,
  validateMealCalendarLoginForm,
} from 'src/sections/meal-calendar/meal-calendar-validations';

const addOnColor = {
  pigTrotter: '#f4a261',
  birdNest: '#ffce49',
  papayaFishSoup: 'success.main',
} as const;

const addOnLabel = {
  pigTrotter: "Pig's Trotter",
  birdNest: "Bird's Nest",
  papayaFishSoup: 'Papaya Fish Soup',
} as const;

const POSTPONED_COLOR = 'secondary.darker';
const UNAVAILABLE_COLOR = '#FF6767';
const DISPLAY_DATE_FORMAT = 'DD MMM YYYY';

const legendItems = [
  { label: 'Recovery', color: '#f27b96' },
  { label: 'Nourish', color: '#6d7ea8' },
  { label: addOnLabel.pigTrotter, color: addOnColor.pigTrotter },
  { label: addOnLabel.birdNest, color: addOnColor.birdNest },
  { label: addOnLabel.papayaFishSoup, color: addOnColor.papayaFishSoup },
  { label: 'Postponed', color: POSTPONED_COLOR },
  { label: 'Unavailable', color: UNAVAILABLE_COLOR },
];

const calendarViewOptions = [
  { value: 'dayGridMonth', label: 'Calendar', icon: 'mingcute:calendar-month-line' },
  { value: 'listWeek', label: 'Agenda', icon: 'custom:calendar-agenda-outline' },
] as const;

const singaporePublicHolidayDates = [
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
] as const;

const publicHolidayDates = [...new Set([...nonOperatingDays, ...singaporePublicHolidayDates])];

type MealCalendarSortableEvent = {
  extendedProps?: {
    sort?: number;
  };
};

const getMealCalendarEventSort = (event: unknown) => {
  if (!event || typeof event !== 'object' || !('extendedProps' in event)) {
    return 0;
  }

  const sort = (event as MealCalendarSortableEvent).extendedProps?.sort;

  return typeof sort === 'number' ? sort : 0;
};

const orderMealCalendarEvents = (firstEvent: unknown, secondEvent: unknown) =>
  getMealCalendarEventSort(firstEvent) - getMealCalendarEventSort(secondEvent);

type MealAddOn = keyof typeof addOnColor;
type MealCalendarViewMode = 'dayGridMonth' | 'listWeek';
type MealCalendarEventKind = 'meal' | 'postponed' | 'addOn';
type MealCalendarNavigationAction = 'today' | 'prev' | 'next';

type DayMeal = {
  slot: MealSlot;
  phase: MealPhase;
};

type CalendarCell = {
  date: string;
  day: number;
  meals: DayMeal[];
  addOns?: MealAddOn[];
  isPostponed?: boolean;
};

type MockOrder = {
  orderId: string;
  email: string;
  packageName: string;
  durationDays: number;
  recoveryDays: number;
  startDate: string;
  startType: MealSlot;
  startPhase: MealPhase;
  postponementDates?: string[];
  postponementRanges?: { startDate: string; endDate: string }[];
  addOnAssignments?: { date: string; addOn: MealAddOn }[];
  specialRequests?: string[];
  specialRequestNote?: string;
};

const tomorrowMealStartDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

// Temporary in-memory order records for the demo lookup.
// Replace this with API/customer order data when the backend is connected.
const mockOrders: Record<string, MockOrder> = {
  CP123: {
    orderId: 'CP123',
    email: 'customer@example.com',
    packageName: '28 days dual meal',
    durationDays: 28,
    recoveryDays: 7,
    startDate: '2025-07-01',
    startType: 'Lunch',
    startPhase: 'Recovery',
  },
  CP515: {
    orderId: 'CP515',
    email: 'customer@example.com',
    packageName: '28 days dual meal',
    durationDays: 28,
    recoveryDays: 7,
    startDate: tomorrowMealStartDate,
    startType: 'Lunch',
    startPhase: 'Recovery',
  },
  CP127: {
    orderId: 'CP127',
    email: 'customer@example.com',
    packageName: '28 days dual meal',
    durationDays: 28,
    recoveryDays: 7,
    startDate: '2026-07-27',
    startType: 'Dinner',
    startPhase: 'Recovery',
    postponementRanges: [{ startDate: '2026-08-05', endDate: '2026-08-07' }],
    addOnAssignments: [
      { date: '2026-08-04', addOn: 'pigTrotter' },
      { date: '2026-08-18', addOn: 'pigTrotter' },
    ],
  },
  CP888: {
    orderId: 'CP888',
    email: 'customer@example.com',
    packageName: '28 days dual meal',
    durationDays: 28,
    recoveryDays: 7,
    startDate: '2026-08-03',
    startType: 'Lunch',
    startPhase: 'Recovery',
    postponementRanges: [{ startDate: '2026-08-12', endDate: '2026-08-13' }],
    addOnAssignments: [
      { date: '2026-08-07', addOn: 'papayaFishSoup' },
      { date: '2026-08-18', addOn: 'birdNest' },
      { date: '2026-08-24', addOn: 'pigTrotter' },
    ],
    specialRequests: [
      'No Pork Innards',
      'No Salmon',
      'Less Sugar in Red Dates Tea',
      'No Weekend Deliveries',
      'No Alchohol'
    ],
    specialRequestNote: 'Customer prefers less ginger and no wine in dinner dishes.',
  },
  CP214: {
    orderId: 'CP214',
    email: 'customer@example.com',
    packageName: '14 days dual meal',
    durationDays: 14,
    recoveryDays: 0,
    startDate: '2026-10-05',
    startType: 'Lunch',
    startPhase: 'Nourish',
  },
  CP314: {
    orderId: 'CP314',
    email: 'single.customer@example.com',
    packageName: '14 days single meal',
    durationDays: 14,
    recoveryDays: 7,
    startDate: '2026-08-03',
    startType: 'Dinner',
    startPhase: 'Recovery',
  },
};

const slotPhaseColor = {
  Recovery: '#f27b96',
  Nourish: '#6d7ea8',
} as const;

const NOURISH_MENU_COLOR = '#7482AD';

const mealSlotSort: Record<MealSlot, number> = {
  Lunch: 1,
  Dinner: 2,
};

const mealSlotDisplay: Record<
  MealSlot,
  { chinese: string; dishesKey: 'lunchDishes' | 'dinnerDishes' }
> = {
  Lunch: { chinese: '\u5348\u9910', dishesKey: 'lunchDishes' },
  Dinner: { chinese: '\u665a\u9910', dishesKey: 'dinnerDishes' },
};

const isSingleMealPackage = (packageName: string) => packageName.toLowerCase().includes('single');

const getMealSlotsForDay = (
  isSingleMeal: boolean,
  startType: MealSlot,
  dayIndex: number,
  durationDays: number
): MealSlot[] => {
  if (isSingleMeal) {
    return [startType];
  }

  if (startType === 'Dinner') {
    if (dayIndex === 0) {
      return ['Dinner'];
    }

    if (dayIndex === durationDays - 1) {
      return ['Lunch'];
    }
  }

  return ['Lunch', 'Dinner'];
};

const getMealPhaseForDay = (
  startPhase: MealPhase,
  recoveryDays: number,
  dayIndex: number
): MealPhase => {
  // Some orders choose Nourish for the whole package. In that case, ignore
  // recoveryDays and keep every scheduled meal in the Nourish phase.
  if (startPhase === 'Nourish') {
    return 'Nourish';
  }

  return dayIndex < recoveryDays ? 'Recovery' : 'Nourish';
};

const expandPostponementDates = (order: MockOrder) => {
  const postponementDateSet = new Set(order.postponementDates ?? []);

  order.postponementRanges?.forEach(({ startDate, endDate }) => {
    let currentDate = dayjs(startDate);
    const finalDate = dayjs(endDate);

    while (currentDate.isBefore(finalDate, 'day') || currentDate.isSame(finalDate, 'day')) {
      postponementDateSet.add(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'day');
    }
  });

  return [...postponementDateSet].sort();
};

// Builds the customer's meal schedule from the order rules.
// Dual packages have Lunch and Dinner each day; single packages use only the
// startType slot, so a single Dinner package receives Dinner only.
// If a dual package starts with Dinner, day 1 has Dinner only and the final day
// ends with Lunch so the schedule still fits within the package duration.
// The first recoveryDays are marked Recovery only when the order starts in the Recovery phase;
// orders that start in Nourish stay Nourish for the whole duration.
// Postponed dates are skipped, marked on the calendar, and the schedule continues
// after them until the full package duration is fulfilled.
// Add-on assignments are attached to their calendar dates and rendered as dots.
const generateMealSchedule = (order: MockOrder): CalendarCell[] => {
  const {
    packageName,
    durationDays,
    recoveryDays,
    startDate,
    startType,
    startPhase,
    addOnAssignments = [],
  } = order;
  const start = dayjs(startDate);
  const isSingleMeal = isSingleMealPackage(packageName);
  const postponementDates = expandPostponementDates(order);
  const postponedDateSet = new Set(postponementDates);
  const daysByDate: Record<string, CalendarCell> = {};
  let serviceDayIndex = 0;
  let calendarDayOffset = 0;

  // Generate meals by calendar day so Recovery always ends on the 7th day's last meal,
  // even when a dual package starts with Dinner.
  while (serviceDayIndex < durationDays) {
    const currentDate = start.add(calendarDayOffset, 'day');
    const date = currentDate.format('YYYY-MM-DD');

    if (postponedDateSet.has(date)) {
      daysByDate[date] = {
        date,
        day: currentDate.date(),
        meals: [],
        isPostponed: true,
      };
      calendarDayOffset += 1;
      continue;
    }

    const slots = getMealSlotsForDay(isSingleMeal, startType, serviceDayIndex, durationDays);
    const phase = getMealPhaseForDay(startPhase, recoveryDays, serviceDayIndex);

    daysByDate[date] = {
      date,
      day: currentDate.date(),
      meals: slots.map((slot) => ({ slot, phase })),
      addOns: [],
    };

    serviceDayIndex += 1;
    calendarDayOffset += 1;
  }

  postponementDates.forEach((date) => {
    if (daysByDate[date]) {
      return;
    }

    const postponedDate = dayjs(date);

    daysByDate[date] = {
      date,
      day: postponedDate.date(),
      meals: [],
      isPostponed: true,
    };
  });

  addOnAssignments.forEach(({ date, addOn }) => {
    const addOnDate = dayjs(date);

    if (!daysByDate[date]) {
      daysByDate[date] = {
        date,
        day: addOnDate.date(),
        meals: [],
      };
    }

    daysByDate[date].addOns = [...(daysByDate[date].addOns ?? []), addOn];
  });

  const days: CalendarCell[] = Object.keys(daysByDate)
    .sort()
    .map((date) => daysByDate[date]);

  return days;
};

const getMenuForMeal = (date: string, meal: DayMeal) => {
  const { recoveryIndex, nourishIndex } = getMenuIndexesForDate(dayjs(date), nonOperatingDays);

  return meal.phase === 'Recovery'
    ? (recoveryMenuPool[recoveryIndex] ?? EMPTY_MENU_DAY_SET)
    : (nourishMenuPool[nourishIndex] ?? EMPTY_MENU_DAY_SET);
};

const createPostponementItem = (
  mealDate = '',
  session: PostponementSession = 'Both'
): PostponementItem => ({
  id:
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `postponement-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  mealDate,
  session,
});

const createInitialPostponementForm = (): PostponementFormValues => ({
  selectionMode: 'dates',
  postponements: [createPostponementItem()],
  range: { startDate: '', endDate: '' },
  reason: '',
  contactNumber: '',
  remarks: '',
});

// ----------------------------------------------------------------------

export function MealCalendarView() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const calendarRef = useRef<FullCalendar>(null);
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticatedOrderId, setAuthenticatedOrderId] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', orderId: '' });
  const [mealDialogDay, setMealDialogDay] = useState<CalendarCell | null>(null);
  const [postponementDialogOpen, setPostponementDialogOpen] = useState(false);
  const [postponementSubmitted, setPostponementSubmitted] = useState(false);
  const [postponementForm, setPostponementForm] = useState<PostponementFormValues>(
    createInitialPostponementForm
  );
  const [postponementErrors, setPostponementErrors] = useState<PostponementFormErrors>({});
  const [showMobileOrderDetails, setShowMobileOrderDetails] = useState(false);
  const [calendarTitle, setCalendarTitle] = useState('');
  const [calendarView, setCalendarView] = useState<MealCalendarViewMode>(
    mdUp ? 'dayGridMonth' : 'listWeek'
  );
  const mealMenuColor: Record<MealPhase, string> = {
    Recovery: theme.palette.primary.main,
    Nourish: NOURISH_MENU_COLOR,
  };

  const trimmedEmail = email.trim();
  const normalizedOrderId = orderId.trim().toUpperCase();
  const selectedMockOrder = mockOrders[authenticatedOrderId] ?? mockOrders.CP123;

  // Whenever the selected order changes, jump the calendar back to that order's start month.
  useEffect(() => {
    calendarRef.current?.getApi().gotoDate(selectedMockOrder.startDate);
    setShowMobileOrderDetails(false);
  }, [selectedMockOrder.startDate]);

  useEffect(() => {
    setPostponementDialogOpen(false);
    setPostponementSubmitted(false);
    setPostponementErrors({});
    setPostponementForm(createInitialPostponementForm());
  }, [selectedMockOrder.orderId]);

  useEffect(() => {
    const nextView: MealCalendarViewMode = mdUp ? 'dayGridMonth' : 'listWeek';
    const calendarApi = calendarRef.current?.getApi();

    setCalendarView((currentView) => {
      if (currentView === nextView) {
        return currentView;
      }

      calendarApi?.changeView(nextView);
      return nextView;
    });
  }, [mdUp]);

  const mealDays = generateMealSchedule(selectedMockOrder);
  const scheduledMealDays = mealDays.filter((day) => day.meals.length > 0);
  const finalMealDay = scheduledMealDays[scheduledMealDays.length - 1];
  const postponementDates = expandPostponementDates(selectedMockOrder);
  const specialRequests = selectedMockOrder.specialRequests ?? [];
  const specialRequestNote = selectedMockOrder.specialRequestNote?.trim();
  const hasSpecialRequests = specialRequests.length > 0 || Boolean(specialRequestNote);
  const specialRequestCount = specialRequests.length + (specialRequestNote ? 1 : 0);
  const mealDayLookup = useMemo(() => new Map(mealDays.map((day) => [day.date, day])), [mealDays]);
  const rangeScheduledDateCount = useMemo(() => {
    const { startDate, endDate } = postponementForm.range;

    if (!startDate || !endDate || dayjs(endDate).isBefore(dayjs(startDate), 'day')) {
      return 0;
    }

    return scheduledMealDays.filter(
      (day) =>
        !dayjs(day.date).isBefore(dayjs(startDate), 'day') &&
        !dayjs(day.date).isAfter(dayjs(endDate), 'day')
    ).length;
  }, [postponementForm.range, scheduledMealDays]);
  const resolvedAddOnColor: Record<MealAddOn, string> = useMemo(
    () => ({
      pigTrotter: addOnColor.pigTrotter,
      birdNest: addOnColor.birdNest,
      papayaFishSoup: theme.palette.success.main,
    }),
    [theme.palette.success.main]
  );
  const calendarEvents: EventInput[] = useMemo(
    () =>
      mealDays.flatMap((day) => {
        const events: EventInput[] = [];

        if (day.isPostponed) {
          events.push({
            id: `${day.date}-postponed`,
            title: 'Postponed',
            start: day.date,
            allDay: true,
            color: theme.palette.secondary.dark,
            textColor: theme.palette.common.white,
            extendedProps: {
              date: day.date,
              kind: 'postponed' satisfies MealCalendarEventKind,
            },
          });
        }

        day.meals.forEach((meal, index) => {
          events.push({
            id: `${day.date}-${meal.slot}`,
            title: meal.slot,
            start: day.date,
            allDay: true,
            color: slotPhaseColor[meal.phase],
            textColor: theme.palette.common.white,
            extendedProps: {
              date: day.date,
              kind: 'meal' satisfies MealCalendarEventKind,
              sort: mealSlotSort[meal.slot],
            },
          });
        });

        day.addOns?.forEach((addOn, index) => {
          events.push({
            id: `${day.date}-${addOn}`,
            title: addOnLabel[addOn],
            start: day.date,
            allDay: true,
            color: resolvedAddOnColor[addOn],
            textColor: theme.palette.common.white,
            extendedProps: {
              date: day.date,
              kind: 'addOn' satisfies MealCalendarEventKind,
              sort: 3 + index,
            },
          });
        });

        return events;
      }),
    [mealDays, resolvedAddOnColor, theme.palette.common.white, theme.palette.secondary.dark]
  );

  const orderSummary = {
    orderId: selectedMockOrder.orderId,
    email: selectedMockOrder.email,
    packageName: selectedMockOrder.packageName,
    duration: `${selectedMockOrder.durationDays} days`,
    startDate: dayjs(selectedMockOrder.startDate).format(DISPLAY_DATE_FORMAT),
    startType: selectedMockOrder.startType,
    startPhase: selectedMockOrder.startPhase,
    postponements: postponementDates.length
      ? postponementDates.map((date) => dayjs(date).format(DISPLAY_DATE_FORMAT)).join(', ')
      : 'None',
    finalMealDate: finalMealDay ? dayjs(finalMealDay.date).format(DISPLAY_DATE_FORMAT) : '-',
  };
  const orderSummaryItems = [
    { label: 'Order ID', value: orderSummary.orderId },
    { label: 'Email', value: orderSummary.email },
    { label: 'Package', value: orderSummary.packageName },
    { label: 'Duration', value: orderSummary.duration },
    { label: 'Start date', value: orderSummary.startDate },
    { label: 'Final meal date', value: orderSummary.finalMealDate },
    { label: 'Start meal', value: orderSummary.startType },
    { label: 'Start phase', value: orderSummary.startPhase },
    { label: 'Postponements', value: orderSummary.postponements },
  ];

  const mealDialogItems =
    mealDialogDay?.meals.map((meal) => {
      const menu = getMenuForMeal(mealDialogDay.date, meal);
      const { dishesKey, chinese } = mealSlotDisplay[meal.slot];

      return {
        ...meal,
        chinese,
        day: menu.day,
        dishes: menu[dishesKey],
      };
    }) ?? [];

  const handleLogin = () => {
    const validation = validateMealCalendarLoginForm({
      email,
      orderId,
      orders: mockOrders,
      currentErrors: fieldErrors,
    });

    setFieldErrors(validation.errors);

    if (!validation.isValid) return;

    setEmail(validation.normalizedEmail);
    setOrderId(validation.normalizedOrderId);
    setAuthenticatedOrderId(validation.normalizedOrderId);
    setAuthenticated(true);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    const blocked = hasBlockedInput(nextValue);

    setEmail(safeText(nextValue, MEAL_CALENDAR_FORM_LIMITS.email));
    setFieldErrors({ email: blocked ? BLOCKED_INPUT_ERROR : '', orderId: '' });
  };

  const handleOrderIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    const blocked = hasBlockedInput(nextValue);

    setOrderId(safeText(nextValue, MEAL_CALENDAR_FORM_LIMITS.orderId));
    setFieldErrors((current) => ({
      ...current,
      orderId: blocked ? BLOCKED_INPUT_ERROR : '',
    }));
  };

  const openMealDialogForDate = useCallback(
    (date: string) => {
      const day = mealDayLookup.get(date);

      if (day?.meals.length) {
        setMealDialogDay(day);
      }
    },
    [mealDayLookup]
  );

  const handleCalendarDateClick = useCallback(
    (arg: DateClickArg) => {
      openMealDialogForDate(arg.dateStr);
    },
    [openMealDialogForDate]
  );

  const handleCalendarEventClick = useCallback(
    (arg: EventClickArg) => {
      const eventDate = arg.event.extendedProps.date as string | undefined;

      if (eventDate) {
        openMealDialogForDate(eventDate);
      }
    },
    [openMealDialogForDate]
  );

  const handleCalendarDatesSet = useCallback((arg: DatesSetArg) => {
    setCalendarTitle(arg.view.title);
    setCalendarView(arg.view.type as MealCalendarViewMode);
  }, []);

  const handleCalendarNavigation = (action: MealCalendarNavigationAction) => {
    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi) return;

    if (action === 'today') {
      calendarApi.today();
      return;
    }

    if (action === 'prev') {
      calendarApi.prev();
      return;
    }

    calendarApi.next();
  };

  const handleCalendarViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextView: MealCalendarViewMode | null
  ) => {
    if (!nextView) return;

    calendarRef.current?.getApi().changeView(nextView);
    setCalendarView(nextView);
  };

  const handleCloseMealDialog = () => {
    setMealDialogDay(null);
  };

  const getDefaultPostponementSession = useCallback(
    (date: string): PostponementSession => {
      const selectedDay = mealDayLookup.get(date);

      if (selectedDay?.meals.length === 1) {
        return selectedDay.meals[0].slot;
      }

      return 'Both';
    },
    [mealDayLookup]
  );

  const getPostponementSessionOptions = useCallback(
    (date: string) => mealDayLookup.get(date)?.meals.map((meal) => meal.slot) ?? [],
    [mealDayLookup]
  );

  const getFirstAvailablePostponementDate = useCallback(
    (selectedDates: string[]) =>
      scheduledMealDays.find((day) => !selectedDates.includes(day.date))?.date ?? '',
    [scheduledMealDays]
  );

  const isPostponementDateUsed = (date: string, activeIndex: number) =>
    postponementForm.postponements.some(
      (item, itemIndex) => itemIndex !== activeIndex && item.mealDate === date
    );

  const handleOpenPostponementDialog = () => {
    const nextMealDate = scheduledMealDays[0]?.date ?? '';

    setPostponementForm({
      ...createInitialPostponementForm(),
      postponements: [
        createPostponementItem(nextMealDate, getDefaultPostponementSession(nextMealDate)),
      ],
      range: { startDate: nextMealDate, endDate: nextMealDate },
    });
    setPostponementErrors({});
    setPostponementSubmitted(false);
    setPostponementDialogOpen(true);
  };

  const handleClosePostponementDialog = () => {
    setPostponementDialogOpen(false);
  };

  const handleAddPostponementDate = () => {
    setPostponementForm((current) => {
      if (current.postponements.length >= scheduledMealDays.length) {
        return current;
      }

      const selectedDates = current.postponements.map((item) => item.mealDate).filter(Boolean);
      const nextMealDate = getFirstAvailablePostponementDate(selectedDates);

      if (!nextMealDate) {
        return current;
      }

      return {
        ...current,
        postponements: [
          ...current.postponements,
          createPostponementItem(nextMealDate, getDefaultPostponementSession(nextMealDate)),
        ],
      };
    });
    setPostponementSubmitted(false);
    setPostponementErrors((current) => ({ ...current, form: '' }));
  };

  const handleRemovePostponementDate = (index: number) => {
    setPostponementForm((current) => {
      if (current.postponements.length === 1) {
        return current;
      }

      return {
        ...current,
        postponements: current.postponements.filter((_, itemIndex) => itemIndex !== index),
      };
    });
    setPostponementSubmitted(false);
    setPostponementErrors((current) => ({
      ...current,
      form: '',
      dates: current.dates?.filter((_, errorIndex) => errorIndex !== index),
    }));
  };

  const handlePostponementMealDateChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const mealDate = event.target.value;

      setPostponementForm((current) => ({
        ...current,
        postponements: current.postponements.map((item, itemIndex) =>
          itemIndex === index
            ? { ...item, mealDate, session: getDefaultPostponementSession(mealDate) }
            : item
        ),
      }));
      setPostponementSubmitted(false);
      setPostponementErrors((current) => ({
        ...current,
        form: '',
        dates: current.dates?.map((error, errorIndex) =>
          errorIndex === index ? { ...error, mealDate: '', session: '' } : error
        ),
      }));
    };

  const handlePostponementSessionChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setPostponementForm((current) => ({
        ...current,
        postponements: current.postponements.map((item, itemIndex) =>
          itemIndex === index
            ? { ...item, session: event.target.value as PostponementSession }
            : item
        ),
      }));
      setPostponementSubmitted(false);
      setPostponementErrors((current) => ({
        ...current,
        dates: current.dates?.map((error, errorIndex) =>
          errorIndex === index ? { ...error, session: '' } : error
        ),
      }));
    };

  const handlePostponementModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextMode: PostponementSelectionMode | null
  ) => {
    if (!nextMode) return;

    setPostponementForm((current) => {
      const firstMealDate =
        current.postponements.find((item) => item.mealDate)?.mealDate ??
        scheduledMealDays[0]?.date ??
        '';

      return {
        ...current,
        selectionMode: nextMode,
        postponements: current.postponements.length
          ? current.postponements
          : [createPostponementItem(firstMealDate, getDefaultPostponementSession(firstMealDate))],
        range: {
          startDate: current.range.startDate || firstMealDate,
          endDate: current.range.endDate || firstMealDate,
        },
      };
    });
    setPostponementSubmitted(false);
    setPostponementErrors((current) => ({
      ...current,
      form: '',
      dates: undefined,
      range: undefined,
    }));
  };

  const handlePostponementRangeChange =
    (field: keyof PostponementFormValues['range']) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextDate = event.target.value;

        setPostponementForm((current) => {
          const nextRange = { ...current.range, [field]: nextDate };

          if (
            field === 'startDate' &&
            nextRange.endDate &&
            dayjs(nextRange.endDate).isBefore(dayjs(nextDate), 'day')
          ) {
            nextRange.endDate = nextDate;
          }

          return {
            ...current,
            range: nextRange,
          };
        });
        setPostponementSubmitted(false);
        setPostponementErrors((current) => ({
          ...current,
          form: '',
          range: { ...current.range, [field]: '' },
        }));
      };

  const handlePostponementTextChange =
    (field: PostponementSharedField, max = 120) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;
        const blocked = hasBlockedInput(nextValue);

        setPostponementForm((current) => ({
          ...current,
          [field]: safeText(nextValue, max),
        }));
        setPostponementSubmitted(false);
        setPostponementErrors((current) => ({
          ...current,
          [field]: blocked ? BLOCKED_INPUT_ERROR : '',
        }));
      };

  const handleSubmitPostponement = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validatePostponementForm({
      form: postponementForm,
      mealDayLookup,
      currentErrors: postponementErrors,
      publicHolidayDates,
    });

    setPostponementErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    setPostponementForm(validation.values);
    setPostponementSubmitted(true);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 6, md: 10 },
        minHeight: authenticated ? 'calc(100vh - 88px)' : 'auto',
        position: 'relative',
        isolation: 'isolate',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '100vw',
          zIndex: -1,
          transform: 'translateX(-50%)',
          background:
            'linear-gradient(180deg, rgba(249, 201, 211, 0.52) 0%, rgba(255, 255, 255, 0.96) 16%, rgba(255, 255, 255, 1) 36%)',
        },
      }}
    >
      <Box
        sx={{
          mx: 'auto',
          maxWidth: 640,
          textAlign: 'center',
          mb: { xs: authenticated ? 4 : 3, md: authenticated ? 6 : 4 },
        }}
      >
        <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 800 }}>
          View My Meal Calendar
        </Typography>
        <Typography
          sx={{
            mt: 1.25,
            color: 'text.secondary',
            fontSize: { xs: '0.98rem', md: '1.05rem' },
            lineHeight: 1.6,
          }}
        >
          {authenticated
            ? 'Review your order details, meal schedule, and postponement options.'
            : 'Enter your order email and order ID to view your confinement meal schedule.'}
        </Typography>
      </Box>

      {!authenticated ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              maxWidth: 520,
              width: '100%',
              p: { xs: 3, md: 4.25 },
              borderRadius: { xs: 4, md: 4.5 },
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.16),
              boxShadow: `0 24px 64px ${alpha(theme.palette.primary.main, 0.12)}`,
              bgcolor: 'rgba(255,255,255,0.96)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: '50%',
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify width={24} icon="mingcute:calendar-month-line" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Enter your order details
                </Typography>
              </Box>
            </Box>

            <Stack spacing={2.5}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                autoComplete="email"
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'common.white',
                    borderRadius: 1.5,
                  },
                }}
              />
              <TextField
                label="Order ID"
                value={orderId}
                onChange={handleOrderIdChange}
                error={!!fieldErrors.orderId}
                helperText={fieldErrors.orderId}
                autoComplete="off"
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'common.white',
                    borderRadius: 1.5,
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                disabled={!trimmedEmail || !normalizedOrderId}
                onClick={handleLogin}
                sx={{
                  mt: 1,
                  minHeight: 52,
                  borderRadius: 1.5,
                  bgcolor: '#f27b96',
                  boxShadow: `0 14px 30px ${alpha(theme.palette.primary.main, 0.22)}`,
                  '&:hover': { bgcolor: '#d86887' },
                  '&.Mui-disabled': {
                    boxShadow: 'none',
                  },
                }}
              >
                View Now
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.75,
                  color: 'text.secondary',
                }}
              >
                <Iconify width={16} icon="solar:inbox-bold" />
                <Typography variant="caption">
                  Your order ID is in your confirmation email.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: { xs: 3, md: 4 }, gridTemplateColumns: '1fr' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.75, md: 4 },
              borderRadius: { xs: 4.5, md: 4 },
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.12),
              boxShadow: `0 24px 56px ${alpha(theme.palette.primary.main, 0.08)}`,
              bgcolor: 'rgba(255,255,255,0.98)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.25,
                mb: { xs: 2.25, md: 3 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  fontSize: { xs: '1.28rem', md: undefined },
                  fontWeight: 800,
                }}
              >
                Order summary
              </Typography>

              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.4,
                  py: 0.75,
                  borderRadius: 999,
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                <Iconify width={16} icon="solar:bill-list-bold" />
                Order {orderSummary.orderId}
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {orderSummary.orderId}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.45,
                      color: 'text.primary',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      lineHeight: 1.25,
                    }}
                  >
                    {orderSummary.packageName}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 1.75,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 1.25,
                }}
              >
                {[
                  { label: 'Start Date', value: orderSummary.startDate },
                  { label: 'End Date', value: orderSummary.finalMealDate },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      minHeight: 82,
                      p: 1.25,
                      borderRadius: 2.5,
                      bgcolor: 'rgba(31, 41, 55, 0.02)',
                      border: '1px solid rgba(31, 41, 55, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.86rem' }}>
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.65,
                        color: 'text.primary',
                        fontSize: '0.96rem',
                        fontWeight: 600,
                        lineHeight: 1.35,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.85 }}>
                {[
                  postponementDates.length
                    ? `${postponementDates.length} postponements`
                    : 'No postponements',
                  specialRequestCount
                    ? `${specialRequestCount} special request${specialRequestCount > 1 ? 's' : ''}`
                    : 'No special requests',
                ].map((label) => (
                  <Box
                    key={label}
                    sx={{
                      px: 1.2,
                      py: 0.8,
                      borderRadius: 999,
                      bgcolor: 'rgba(31, 41, 55, 0.04)',
                      color: 'text.secondary',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      lineHeight: 1,
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>

              <Button
                size="small"
                onClick={() => setShowMobileOrderDetails((current) => !current)}
                sx={{
                  mt: 2,
                  px: 0,
                  minWidth: 0,
                  color: 'primary.main',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                }}
              >
                {showMobileOrderDetails ? 'Hide details' : 'View details'}
              </Button>
            </Box>

            <Box
              sx={{
                display: { xs: showMobileOrderDetails ? 'grid' : 'none', md: 'grid' },
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                columnGap: 4,
                rowGap: 2.5,
                mt: { xs: 2, md: 0 },
              }}
            >
              {orderSummaryItems.map((item) => (
                <Box key={item.label} sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{ color: 'text.secondary', fontSize: '0.85rem', lineHeight: 1.35 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.45,
                      color: 'text.primary',
                      fontWeight: 800,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: { xs: showMobileOrderDetails ? 'block' : 'none', md: 'block' } }}>
              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 700 }}
                >
                  Special requests
                </Typography>

                {hasSpecialRequests ? (
                  <Stack spacing={1.5}>
                    {!!specialRequests.length && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {specialRequests.map((request) => (
                          <Box
                            key={request}
                            sx={{
                              px: 1.5,
                              py: 0.75,
                              borderRadius: 999,
                              border: '1px solid',
                              borderColor: alpha(theme.palette.secondary.dark, 0.2),
                              bgcolor: alpha(theme.palette.secondary.dark, 0.08),
                              color: 'secondary.dark',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              lineHeight: 1.2,
                            }}
                          >
                            {request}
                          </Box>
                        ))}
                      </Box>
                    )}

                    {specialRequestNote && (
                      <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>
                        {specialRequestNote}
                      </Typography>
                    )}
                  </Stack>
                ) : (
                  <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>None</Typography>
                )}
              </Box>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.12),
              boxShadow: `0 24px 56px ${alpha(theme.palette.primary.main, 0.08)}`,
              bgcolor: 'rgba(255,255,255,0.98)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
                p: { xs: 2, md: 2.5 },
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                bgcolor: alpha(theme.palette.primary.main, 0.06),
              }}
            >
              <Box sx={{ minWidth: 0, textAlign: { xs: 'center', sm: 'left' } }}>
                <Box
                  sx={{
                    mx: { xs: 'auto', sm: 0 },
                    mb: 0.75,
                    width: 'fit-content',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.65,
                    px: 1.2,
                    py: 0.55,
                    borderRadius: 999,
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  <Iconify width={15} icon="solar:bill-list-bold" />
                  Order {orderSummary.orderId}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {calendarTitle || dayjs(selectedMockOrder.startDate).format('MMMM YYYY')}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={calendarView}
                  onChange={handleCalendarViewChange}
                  aria-label="calendar view"
                  sx={{
                    display: 'inline-flex',
                    flexShrink: 0,
                    bgcolor: 'common.white',
                    border: '1px solid rgba(31, 41, 55, 0.08)',
                    borderRadius: 2,
                    '& .MuiToggleButton-root': {
                      gap: { xs: 0.65, sm: 0 },
                      px: { xs: 1.15, sm: 1 },
                      borderColor: 'transparent',
                      '&.Mui-selected': {
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      },
                    },
                  }}
                >
                  {calendarViewOptions.map((option) => (
                    <Tooltip key={option.value} title={option.label}>
                      <ToggleButton value={option.value} aria-label={`${option.label} view`}>
                        <Iconify icon={option.icon} />
                        <Box
                          component="span"
                          sx={{
                            display: { xs: 'inline', sm: 'none' },
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          {option.label}
                        </Box>
                      </ToggleButton>
                    </Tooltip>
                  ))}
                </ToggleButtonGroup>

                <IconButton
                  size="small"
                  onClick={() => handleCalendarNavigation('prev')}
                  sx={{
                    bgcolor: 'common.white',
                    border: '1px solid rgba(31, 41, 55, 0.1)',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleCalendarNavigation('next')}
                  sx={{
                    bgcolor: 'common.white',
                    border: '1px solid rgba(31, 41, 55, 0.1)',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleCalendarNavigation('today')}
                  sx={{ bgcolor: 'common.white' }}
                >
                  Today
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mb: 3,
                justifyContent: 'center',
              }}
            >
              {legendItems.map((legend) => (
                <Box
                  key={legend.label}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.25,
                    py: 0.65,
                    borderRadius: 999,
                    bgcolor: 'rgba(31, 41, 55, 0.03)',
                    border: '1px solid rgba(31, 41, 55, 0.06)',
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: legend.color,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', fontWeight: 700, whiteSpace: 'nowrap' }}
                  >
                    {legend.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <MealCalendarRoot>
              <Calendar
                weekends
                firstDay={1}
                dayMaxEvents={3}
                eventMaxStack={3}
                rerenderDelay={10}
                headerToolbar={false}
                eventDisplay="block"
                eventOrder={orderMealCalendarEvents}
                eventOrderStrict
                fixedWeekCount={false}
                height="auto"
                ref={calendarRef}
                initialDate={selectedMockOrder.startDate}
                initialView={calendarView}
                events={calendarEvents}
                datesSet={handleCalendarDatesSet}
                dateClick={handleCalendarDateClick}
                eventClick={handleCalendarEventClick}
                plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
              />
            </MealCalendarRoot>

            <Box
              sx={{
                mt: 3,
                p: { xs: 2, md: 2.5 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.18),
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>
                  Need to postpone a meal delivery?
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.35, color: 'text.secondary' }}>
                  Submit a request and our team will confirm the updated schedule.
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleOpenPostponementDialog}
                disabled={!scheduledMealDays.length}
                sx={{
                  flexShrink: 0,
                  bgcolor: '#f27b96',
                  '&:hover': { bgcolor: '#d86887' },
                }}
              >
                Request postponement
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      <Dialog
        open={Boolean(mealDialogDay)}
        onClose={handleCloseMealDialog}
        aria-labelledby="meal-dialog-title"
        aria-describedby="meal-dialog-description"
        maxWidth="md"
        fullWidth
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow: '0 24px 64px rgba(15, 23, 42, 0.22)',
            },
          },
        }}
      >
        <DialogTitle
          id="meal-dialog-title"
          sx={{
            px: { xs: 2.5, md: 3 },
            pt: { xs: 3, md: 4 },
            pb: 1,
            color: 'text.primary',
            fontWeight: 800,
          }}
        >
          Your Meal
        </DialogTitle>

        <DialogContent id="meal-dialog-description" sx={{ px: { xs: 2.5, md: 3 }, pb: 2 }}>
          <Box
            sx={{
              pt: 1,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: mealDialogItems.length > 1 ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)',
              },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {mealDialogItems.map((meal) => {
              const activeColor = mealMenuColor[meal.phase];
              const activeSurface = alpha(activeColor, 0.1);

              return (
                <Paper
                  key={meal.slot}
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    textAlign: 'center',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: alpha('#1f2937', 0.08),
                    backgroundColor: 'common.white',
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.05)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 5,
                      bgcolor: activeColor,
                    }}
                  />

                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 1.25,
                      py: 0.6,
                      borderRadius: 999,
                      bgcolor: activeSurface,
                      color: activeColor,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {meal.phase} Menu &middot; Day {meal.day}
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      mt: 1.75,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: 'text.primary',
                    }}
                  >
                    {meal.slot}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: activeColor }}>
                    {meal.chinese}
                  </Typography>

                  <Divider sx={{ my: 2.5 }} />

                  <Box sx={{ textAlign: 'left' }}>
                    {meal.dishes.length > 0 ? (
                      meal.dishes.map((dish, index) => (
                        <Box
                          key={`${meal.slot}-${dish.english}-${index}`}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.25,
                            py: 1.25,
                            borderTop: index === 0 ? 'none' : `1px solid ${alpha('#1f2937', 0.06)}`,
                          }}
                        >
                          <Box
                            sx={{
                              mt: 0.3,
                              width: 24,
                              height: 24,
                              flexShrink: 0,
                              borderRadius: '50%',
                              bgcolor: activeSurface,
                              color: activeColor,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {index + 1}
                          </Box>

                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                lineHeight: 1.45,
                                fontSize: { xs: '1rem', md: '1.04rem' },
                              }}
                            >
                              {dish.english}
                            </Typography>
                            <Typography
                              sx={{
                                mt: 0.35,
                                color: 'text.secondary',
                                lineHeight: 1.45,
                                fontSize: { xs: '0.98rem', md: '1rem' },
                              }}
                            >
                              {dish.chinese}
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>
                        Menu unavailable.
                      </Typography>
                    )}
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2.5, md: 3 }, pb: { xs: 2.5, md: 3 } }}>
          <Button onClick={handleCloseMealDialog} sx={{ color: 'text.primary', fontWeight: 700 }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={postponementDialogOpen}
        onClose={handleClosePostponementDialog}
        aria-labelledby="postponement-dialog-title"
        maxWidth="sm"
        fullWidth
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow: '0 24px 64px rgba(15, 23, 42, 0.22)',
            },
          },
        }}
      >
        <DialogTitle
          id="postponement-dialog-title"
          sx={{
            px: { xs: 2.5, md: 3 },
            pt: { xs: 3, md: 4 },
            pb: 1,
            color: 'text.primary',
            fontWeight: 800,
          }}
        >
          Request meal postponement
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmitPostponement}>
          <DialogContent sx={{ px: { xs: 2.5, md: 3 }, pb: 2 }}>
            <Stack spacing={2.25}>
              <Alert severity={postponementSubmitted ? 'success' : 'info'}>
                {postponementSubmitted
                  ? 'Your postponement request has been captured for review.'
                  : 'Please submit at least 1 working day before 2pm for weekdays, 2 working days before 2pm for Weekends and public holidays.'}
              </Alert>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(31, 41, 55, 0.03)',
                  border: '1px solid rgba(31, 41, 55, 0.08)',
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                    Order ID
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>{selectedMockOrder.orderId}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                    Email
                  </Typography>
                  <Typography sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
                    {selectedMockOrder.email}
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={1.5}>
                <Box>
                  <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>
                    Dates to postpone
                  </Typography>

                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={postponementForm.selectionMode}
                    onChange={handlePostponementModeChange}
                    sx={{
                      mt: 1,
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                      gap: 1,
                      '& .MuiToggleButtonGroup-grouped': {
                        m: 0,
                        border: '1px solid rgba(31, 41, 55, 0.12)',
                        borderRadius: '8px',
                        justifyContent: 'center',
                      },
                    }}
                  >
                    <ToggleButton value="dates" sx={{ gap: 0.75 }}>
                      <Iconify icon="mingcute:calendar-day-line" />
                      Multiple dates
                    </ToggleButton>
                    <ToggleButton value="range" sx={{ gap: 0.75 }}>
                      <Iconify icon="mingcute:calendar-week-line" />
                      Date range
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {!!postponementErrors.form && (
                  <Alert severity="error">{postponementErrors.form}</Alert>
                )}

                {postponementForm.selectionMode === 'dates' ? (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Select scheduled meal dates to postpone.
                      </Typography>

                      <Button
                        type="button"
                        variant="outlined"
                        size="small"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        disabled={postponementForm.postponements.length >= scheduledMealDays.length}
                        onClick={handleAddPostponementDate}
                        sx={{ flexShrink: 0 }}
                      >
                        Add another date
                      </Button>
                    </Box>

                    {postponementForm.postponements.map((item, index) => {
                      const itemErrors = postponementErrors.dates?.[index] ?? {};
                      const sessionOptions = getPostponementSessionOptions(item.mealDate);
                      const hasDualSessions = sessionOptions.length > 1;

                      return (
                        <Box
                          key={`${item.id}-${index}`}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr',
                              sm: 'minmax(0, 1.15fr) minmax(0, 0.85fr) auto',
                            },
                            gap: 1.25,
                            alignItems: 'flex-start',
                          }}
                        >
                          <TextField
                            select
                            required
                            label={`Meal date ${index + 1}`}
                            value={item.mealDate}
                            onChange={handlePostponementMealDateChange(index)}
                            error={!!itemErrors.mealDate}
                            helperText={
                              itemErrors.mealDate || 'Only scheduled meal dates are shown.'
                            }
                            fullWidth
                          >
                            {scheduledMealDays.map((day) => (
                              <MenuItem
                                key={day.date}
                                value={day.date}
                                disabled={isPostponementDateUsed(day.date, index)}
                              >
                                {dayjs(day.date).format(DISPLAY_DATE_FORMAT)}
                              </MenuItem>
                            ))}
                          </TextField>

                          <TextField
                            select
                            required
                            label="Meal session"
                            value={item.session}
                            onChange={handlePostponementSessionChange(index)}
                            error={!!itemErrors.session}
                            helperText={itemErrors.session}
                            fullWidth
                          >
                            {hasDualSessions && <MenuItem value="Both">Lunch and dinner</MenuItem>}
                            {sessionOptions.map((slot) => (
                              <MenuItem key={slot} value={slot}>
                                {slot}
                              </MenuItem>
                            ))}
                          </TextField>

                          <Tooltip
                            title={
                              postponementForm.postponements.length === 1
                                ? 'At least one date is required'
                                : 'Remove date'
                            }
                          >
                            <span>
                              <IconButton
                                aria-label={`Remove postponement date ${index + 1}`}
                                disabled={postponementForm.postponements.length === 1}
                                onClick={() => handleRemovePostponementDate(index)}
                                sx={{
                                  mt: { xs: 0, sm: 0.75 },
                                  border: '1px solid rgba(31, 41, 55, 0.12)',
                                }}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      );
                    })}
                  </>
                ) : (
                  <Stack spacing={1.25}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Select the first and last scheduled meal dates to postpone.
                    </Typography>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                        gap: 1.25,
                      }}
                    >
                      <TextField
                        select
                        required
                        label="Start date"
                        value={postponementForm.range.startDate}
                        onChange={handlePostponementRangeChange('startDate')}
                        error={!!postponementErrors.range?.startDate}
                        helperText={
                          postponementErrors.range?.startDate ||
                          'First scheduled date in the range.'
                        }
                        fullWidth
                      >
                        {scheduledMealDays.map((day) => (
                          <MenuItem key={day.date} value={day.date}>
                            {dayjs(day.date).format(DISPLAY_DATE_FORMAT)}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        select
                        required
                        label="End date"
                        value={postponementForm.range.endDate}
                        onChange={handlePostponementRangeChange('endDate')}
                        error={!!postponementErrors.range?.endDate}
                        helperText={
                          postponementErrors.range?.endDate || 'Last scheduled date in the range.'
                        }
                        fullWidth
                      >
                        {scheduledMealDays.map((day) => (
                          <MenuItem
                            key={day.date}
                            value={day.date}
                            disabled={
                              !!postponementForm.range.startDate &&
                              dayjs(day.date).isBefore(
                                dayjs(postponementForm.range.startDate),
                                'day'
                              )
                            }
                          >
                            {dayjs(day.date).format(DISPLAY_DATE_FORMAT)}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    {!!rangeScheduledDateCount && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {rangeScheduledDateCount} scheduled{' '}
                        {rangeScheduledDateCount === 1 ? 'date' : 'dates'} selected.
                      </Typography>
                    )}
                  </Stack>
                )}
              </Stack>

              <TextField
                select
                label="Reason (optional)"
                value={postponementForm.reason}
                onChange={handlePostponementTextChange('reason', MEAL_CALENDAR_FORM_LIMITS.reason)}
                error={!!postponementErrors.reason}
                helperText={postponementErrors.reason}
                fullWidth
              >
                <MenuItem value="">No reason selected</MenuItem>
                {postponementReasonOptions.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                label="Contact number"
                value={postponementForm.contactNumber}
                onChange={handlePostponementTextChange(
                  'contactNumber',
                  MEAL_CALENDAR_FORM_LIMITS.contactNumber
                )}
                error={!!postponementErrors.contactNumber}
                helperText={
                  postponementErrors.contactNumber || 'for our team to reach you if needed'
                }
                autoComplete="tel"
                fullWidth
              />

              <TextField
                label="Remarks (optional)"
                value={postponementForm.remarks}
                onChange={handlePostponementTextChange(
                  'remarks',
                  MEAL_CALENDAR_FORM_LIMITS.remarks
                )}
                error={!!postponementErrors.remarks}
                helperText={postponementErrors.remarks}
                multiline
                minRows={3}
                fullWidth
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: { xs: 2.5, md: 3 }, pb: { xs: 2.5, md: 3 } }}>
            <Button
              type="button"
              onClick={handleClosePostponementDialog}
              sx={{ color: 'text.primary', fontWeight: 700 }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#f27b96' }}>
              Submit request
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}
