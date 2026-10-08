import type { CSSObject } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

export const MealCalendarRoot = styled('div')(({ theme }) => {
  const cssVars: CSSObject = {
    '--fc-small-font-size': '0.813rem',
    '--fc-border-color': theme.vars.palette.TableCell.border,
    '--fc-page-bg-color': theme.vars.palette.background.default,
    '--fc-neutral-text-color': theme.vars.palette.text.secondary,
    '--fc-neutral-bg-color': theme.vars.palette.background.neutral,
    '--fc-more-link-bg-color': 'var(--fc-neutral-bg-color)',
    '--fc-more-link-text-color': 'var(--fc-neutral-text-color)',
    '--fc-today-bg-color': 'transparent',
    '--fc-highlight-color': varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
    '--fc-non-business-color': varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
    '--custom-day-number-active-size': '26px',
    '--custom-day-other-color': theme.vars.palette.action.disabled,
    '--custom-day-business-color': theme.vars.palette.text.secondary,
    '--custom-today-color': theme.vars.palette.primary.contrastText,
    '--custom-today-bg': theme.vars.palette.primary.main,
  };

  const containerStyles: CSSObject = {
    '& .fc-license-message': { display: 'none' },
    '& .fc-media-screen': {
      flex: '1 1 auto',
      minHeight: 0,
    },
    '& .fc-scrollgrid': {
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
  };

  const headerStyles: CSSObject = {
    '& .fc-col-header-cell': {
      borderRightColor: 'transparent',
      '& .fc-col-header-cell-cushion': {
        ...theme.typography.subtitle2,
        paddingTop: 12,
        paddingBottom: 12,
      },
    },
  };

  const dayStyles: CSSObject = {
    '& .fc-daygrid-day-number': {
      ...theme.typography.body2,
      lineHeight: 'var(--custom-day-number-active-size)',
      padding: '4px 8px',
    },
    '& .fc-day-today .fc-daygrid-day-number': {
      display: 'inline-flex',
      justifyContent: 'center',
      color: 'var(--custom-today-color)',
      fontWeight: theme.typography.fontWeightSemiBold,
      width: '34px',
      '&::before': {
        zIndex: -1,
        content: '""',
        borderRadius: '50%',
        position: 'absolute',
        backgroundColor: 'var(--custom-today-bg)',
        width: 'var(--custom-day-number-active-size)',
        height: 'var(--custom-day-number-active-size)',
      },
    },
    '& .fc-day-sat, & .fc-day-sun': {
      '&.fc-col-header-cell, & .fc-daygrid-day-top': {
        color: 'var(--custom-day-business-color)',
      },
    },
    '& .fc-day-other .fc-daygrid-day-top': {
      opacity: 1,
      color: 'var(--custom-day-other-color)',
    },
  };

  const eventStyles: CSSObject = {
    '& .fc-event': {
      borderWidth: 0,
      borderRadius: 999,
      boxShadow: 'none',
      cursor: 'pointer',
      overflow: 'hidden',
      '& .fc-event-main': {
        padding: '3px 8px',
        borderRadius: 'inherit',
      },
      '& .fc-event-title': {
        ...theme.typography.caption,
        fontWeight: 700,
        textOverflow: 'ellipsis',
      },
      '& .fc-event-time': {
        display: 'none',
      },
    },
    '& .fc-daygrid-event': {
      marginTop: 0,
      marginBottom: 4,
    },
    '& .fc-daygrid-event.fc-event-end, & .fc-daygrid-event.fc-event-start': {
      marginLeft: 4,
      marginRight: 4,
    },
    '& .fc-list-event': {
      ...theme.typography.body2,
      cursor: 'pointer',
    },
    '& .fc-list-event-dot': {
      borderColor: 'currentColor',
    },
    '& .fc-list-event-time': {
      display: 'none',
    },
    '& .fc-list-empty': {
      ...theme.typography.h6,
      backgroundColor: 'transparent',
      color: theme.vars.palette.text.disabled,
    },
  };

  const moreLinkStyles: CSSObject = {
    '& .fc-daygrid-more-link': {
      ...theme.typography.caption,
      padding: theme.spacing(0, 1),
      color: theme.vars.palette.text.secondary,
      fontWeight: theme.typography.fontWeightMedium,
      transition: theme.transitions.create(['color']),
      '&:hover': {
        textDecoration: 'underline',
        backgroundColor: 'transparent',
        color: theme.vars.palette.text.primary,
      },
    },
    '& .fc-popover': {
      borderWidth: 0,
      boxShadow: theme.vars.customShadows.dropdown,
      borderRadius: Number(theme.shape.borderRadius) * 1.5,
    },
    '& .fc-popover-header': {
      ...theme.typography.subtitle2,
      padding: theme.spacing(1),
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit',
    },
    '& .fc-more-popover .fc-popover-body': {
      padding: theme.spacing(0.5),
    },
  };

  return {
    ...cssVars,
    ...containerStyles,
    ...headerStyles,
    ...dayStyles,
    ...eventStyles,
    ...moreLinkStyles,
  };
});
