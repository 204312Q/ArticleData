'use client';

import type { Dayjs } from 'dayjs';
import type { MenuPool, MenuDaySet, MenuWeekOption } from './menu-data';

import dayjs from 'dayjs';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { paths } from 'src/routes/paths';

import { getMenuIndexesForDate } from './menu-utils';

// ----------------------------------------------------------------------

type WeekDay = {
  key: string;
  day: string;
  date: string;
  rawDate: Dayjs;
};

const RECOVERY_COLOR = '#f27b96';
const NOURISH_COLOR = '#6d7ea8';

type MenuCalendarProps = {
  weekOptions: MenuWeekOption[];
  emptyDaySet: MenuDaySet;
  nonOperatingDays: string[];
  nourishMenuPool: MenuPool;
  recoveryMenuPool: MenuPool;
};

export function MenuCalendar({
  weekOptions,
  emptyDaySet,
  nonOperatingDays,
  nourishMenuPool,
  recoveryMenuPool,
}: MenuCalendarProps) {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDayByWeek, setSelectedDayByWeek] = useState<Record<number, string>>({});
  const [menuMode, setMenuMode] = useState<'standard' | 'nourishOnly'>('standard');

  const weekStart = startDate.add((selectedWeek - 1) * 7, 'day');
  const weekDays: WeekDay[] = Array.from({ length: 7 }, (_, index) => {
    const rawDate = weekStart.add(index, 'day');

    return {
      key: rawDate.format('YYYY-MM-DD'),
      day: rawDate.format('ddd'),
      date: rawDate.format('DD/MM/YYYY'),
      rawDate,
    };
  });

  const selectedDayKey = selectedDayByWeek[selectedWeek] ?? weekDays[0]?.key;
  const selectedDay = weekDays.find((day) => day.key === selectedDayKey) ?? weekDays[0]!;
  const isNourishOnly = menuMode === 'nourishOnly';
  const isRecoveryWeek = !isNourishOnly && selectedWeek === 1;
  const activeColor = isRecoveryWeek ? RECOVERY_COLOR : NOURISH_COLOR;
  const activeSurface = alpha(activeColor, 0.1);
  const activeBorder = alpha(activeColor, 0.26);
  const activeShadow = alpha(activeColor, 0.2);

  const { recoveryIndex, nourishIndex } = getMenuIndexesForDate(
    selectedDay.rawDate,
    nonOperatingDays
  );

  const menu = isRecoveryWeek
    ? (recoveryMenuPool[recoveryIndex] ?? emptyDaySet)
    : (nourishMenuPool[nourishIndex] ?? emptyDaySet);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            p: { xs: 2.5, md: 4.5 },
            bgcolor: 'common.white',
            border: '1px solid',
            borderColor: alpha('#1f2937', 0.08),
            borderRadius: 5,
            boxShadow: '0 28px 72px rgba(15, 23, 42, 0.07)',
            textAlign: 'center',
          }}
        >
          <Box sx={{ mx: 'auto', mb: { xs: 3.5, md: 4.5 }, maxWidth: 620 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 1.5,
                py: 0.75,
                borderRadius: 999,
                bgcolor: alpha(RECOVERY_COLOR, 0.1),
                color: 'primary.main',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              4-Week Rotating Menu
            </Box>

            <Typography
              variant="h3"
              sx={{
                mt: 2,
                mb: 1.5,
                color: 'primary.main',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Find Out What Your Expected Meals Are
            </Typography>
          </Box>

          <Box
            sx={{
              mb: { xs: 3.5, md: 4 },
              p: { xs: 2, md: 2.5 },
              borderRadius: 3.5,
              border: '1px solid',
              borderColor: alpha('#1f2937', 0.08),
              background:
                'linear-gradient(135deg, rgba(255, 248, 250, 1) 0%, rgba(255, 255, 255, 1) 60%)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                color: 'text.secondary',
                fontWeight: 600,
                letterSpacing: '0.03em',
                fontSize: '0.95rem',
              }}
            >
              Select your Meal Start Date
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <DatePicker
                  label="Select a Start Date"
                  value={startDate}
                  onChange={(newValue) => {
                    if (!newValue) return;

                    setStartDate(newValue);
                    setSelectedWeek(1);
                    setSelectedDayByWeek({});
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size: 'medium',
                      sx: {
                        width: { xs: '100%', sm: 280 },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          bgcolor: 'common.white',
                        },
                      },
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1.25,
                color: 'text.secondary',
                fontWeight: 600,
                letterSpacing: '0.03em',
                fontSize: '0.95rem',
              }}
            >
              Meal Plan Type
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              {(
                [
                  { key: 'standard', label: 'Recovery + Nourish', color: RECOVERY_COLOR },
                  { key: 'nourishOnly', label: 'Nourish Only', color: NOURISH_COLOR },
                ] as const
              ).map((option) => {
                const selected = menuMode === option.key;

                return (
                  <Button
                    key={option.key}
                    variant="outlined"
                    onClick={() => setMenuMode(option.key)}
                    sx={{
                      borderWidth: 1.5,
                      borderRadius: 999,
                      px: 2.5,
                      py: 0.75,
                      borderColor: selected ? option.color : alpha(option.color, 0.24),
                      backgroundColor: selected ? option.color : alpha(option.color, 0.06),
                      color: selected ? 'common.white' : 'text.primary',
                      fontWeight: 700,
                      '&:hover': {
                        borderWidth: 1.5,
                        borderColor: option.color,
                        backgroundColor: selected ? option.color : alpha(option.color, 0.1),
                      },
                    }}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </Box>

            {isNourishOnly && (
              <Typography
                variant="caption"
                sx={{ mt: 1.25, display: 'block', color: 'text.secondary' }}
              >
                The Nourish menu runs on a 21-day cycle, so a 28-day plan will repeat from Day 1
                partway through.
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
            {weekOptions.map((week) => {
              const selected = selectedWeek === week.id;
              const weekColor = isNourishOnly ? NOURISH_COLOR : week.id === 1 ? RECOVERY_COLOR : NOURISH_COLOR;

              return (
                <Button
                  key={week.id}
                  variant="outlined"
                  onClick={() => setSelectedWeek(week.id)}
                  sx={{
                    flex: { xs: '1 0 48%', sm: '1 0 22%' },
                    display: 'flex',
                    flexDirection: 'column',
                    py: { xs: 1.5, md: 2.1 },
                    px: { xs: 1.25, md: 2 },
                    minWidth: { xs: 140, md: 110 },
                    minHeight: { xs: 62, md: 72 },
                    borderWidth: 1.5,
                    borderRadius: 3,
                    borderColor: selected ? weekColor : alpha(weekColor, 0.18),
                    backgroundColor: selected ? weekColor : alpha(weekColor, 0.06),
                    color: selected ? 'common.white' : 'text.primary',
                    boxShadow: selected ? `0 16px 34px ${alpha(weekColor, 0.2)}` : 'none',
                    '&:hover': {
                      borderWidth: 1.5,
                      borderColor: weekColor,
                      backgroundColor: selected ? weekColor : alpha(weekColor, 0.1),
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{ fontSize: { xs: '1.05rem', md: '1.1rem' }, fontWeight: 700 }}
                  >
                    Week {week.id}
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      mt: 0.25,
                      fontSize: { xs: '0.78rem', md: '0.82rem' },
                      fontWeight: 600,
                      opacity: selected ? 0.92 : 0.72,
                    }}
                  >
                    {isNourishOnly ? 'Nourish' : week.stage}
                  </Box>
                </Button>
              );
            })}
          </Box>

          <Box
            sx={{
              mb: { xs: 2.5, md: 3 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 999,
                bgcolor: activeSurface,
                color: activeColor,
                fontSize: '0.84rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {isRecoveryWeek ? 'Recovery Week' : 'Nourish Week'}
            </Box>

            <Typography color="text.secondary" sx={{ fontSize: { xs: '0.98rem', md: '1rem' } }}>
              {isRecoveryWeek
                ? 'Focused on warming, recovery-supportive meals for the first week.'
                : 'Focused on rebuilding strength and daily nourishment from week two onward.'}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              gap: { xs: 0.5, md: 1 },
              mb: { xs: 3.5, md: 4 },
            }}
          >
            {weekDays.map((item) => {
              const selected = selectedDay.key === item.key;

              return (
                <Button
                  key={item.key}
                  variant="outlined"
                  onClick={() =>
                    setSelectedDayByWeek((prev) => ({
                      ...prev,
                      [selectedWeek]: item.key,
                    }))
                  }
                  sx={{
                    minWidth: 0,
                    px: { xs: 0.25, md: 1 },
                    py: { xs: 1, md: 1.5 },
                    minHeight: { xs: 58, md: 70 },
                    borderWidth: 1.5,
                    borderRadius: 2.5,
                    borderColor: selected ? activeBorder : alpha('#1f2937', 0.08),
                    backgroundColor: selected ? activeSurface : 'common.white',
                    color: selected ? activeColor : 'text.secondary',
                    boxShadow: selected ? `0 12px 28px ${activeShadow}` : 'none',
                    '&:hover': {
                      borderWidth: 1.5,
                      borderColor: selected ? activeBorder : alpha(activeColor, 0.22),
                      backgroundColor: selected ? activeSurface : alpha(activeColor, 0.05),
                    },
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: { xs: '0.68rem', md: '0.96rem' },
                        color: selected ? activeColor : 'text.primary',
                      }}
                    >
                      {item.day}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.25,
                        fontSize: { xs: '0.6rem', md: '0.82rem' },
                        color: 'inherit',
                      }}
                    >
                      {item.date.split('/').slice(0, 2).join('/')}
                    </Typography>
                  </Box>
                </Button>
              );
            })}
          </Box>

          <Box
            sx={{
              mb: 3,
              px: { xs: 1.5, md: 2 },
              py: 1.5,
              borderRadius: 3,
              bgcolor: alpha(activeColor, 0.08),
              border: '1px solid',
              borderColor: alpha(activeColor, 0.14),
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '0.04em',
                fontSize: { xs: '0.9rem', md: '0.98rem' },
              }}
            >
              LONGAN RED DATE TEA SERVED WITH EVERY MEAL
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: -1.5, position: 'relative' }}>
            <Box
              sx={{
                px: 2,
                py: 0.75,
                borderRadius: 999,
                bgcolor: activeColor,
                color: 'common.white',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: `0 10px 24px ${activeShadow}`,
              }}
            >
              Day {menu.day}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              pt: 2.5,
            }}
          >
            {[
              { label: 'Lunch', chinese: '午餐', dishes: menu.lunchDishes },
              { label: 'Dinner', chinese: '晚餐', dishes: menu.dinnerDishes },
            ].map((meal) => (
              <Paper
                key={meal.label}
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
                  {isRecoveryWeek ? 'Recovery Menu' : 'Nourish Menu'}
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
                  {meal.label}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: activeColor }}>
                  {meal.chinese}
                </Typography>
                <Divider sx={{ my: 2.5 }} />

                <Box sx={{ textAlign: 'left' }}>
                  {meal.dishes.map((dish, index) => (
                    <Box
                      key={`${meal.label}-${dish.english}-${index}`}
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
                  ))}
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href={paths.product.root}
            sx={{ minWidth: 240 }}
          >
            Order Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
