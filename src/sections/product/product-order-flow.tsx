'use client';

import type { ChangeEvent } from 'react';
import type { ProductCatalog } from './product-data';

import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import StepLabel from '@mui/material/StepLabel';
import IconButton from '@mui/material/IconButton';
import Payment from '@mui/icons-material/Payment';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useBlockedDates } from 'src/hooks/use-blocked-dates';

import {
  shouldDisableDate,
  validateSelectedDate,
  getMinimumSelectableDate,
} from 'src/utils/date-validation';

import { CONFIG } from 'src/global-config';
import { ORDER_DRAFT_STORAGE_KEY } from 'src/lib/checkout/storage-keys';
import { SHIPPING_METHOD_LABEL, computePackageShippingFee } from 'src/lib/checkout/shipping-fee';
import {
  type PromoCartLine,
  fetchPromoValidation,
  computePromoDiscount,
  type AppliedPromoMeta,
} from 'src/lib/checkout/promo-validation';

import { Iconify } from 'src/components/iconify';
import { BackToTopButton } from 'src/components/animate/back-to-top-button';

import { SectionHeading } from 'src/sections/home/section-heading';

import { ProductNotes } from './product-notes';

type DeliveryData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  floor: string;
  unit: string;
  postalCode: string;
  paymentMethod: 'full' | 'partial';
  paymentType: 'credit-card' | 'paynow';
};

const money = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' });

const defaultDelivery: DeliveryData = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  floor: '',
  unit: '',
  postalCode: '',
  paymentMethod: 'full',
  paymentType: 'credit-card',
};

const getMinDateValue = () => getMinimumSelectableDate().format('YYYY-MM-DD');

const safeText = (value: string, max = 120) => value.replace(/[<>]/g, '').slice(0, max);
const safePhone = (value: string) => value.replace(/[^\d+]/g, '').slice(0, 15);
const safePostalCode = (value: string) => value.replace(/\D/g, '').slice(0, 6);
const getPaymentMethodLabel = (paymentMethod: DeliveryData['paymentMethod']) =>
  paymentMethod === 'full' ? 'Full Payment' : 'Partial Payment (Deposit)';
const getPaymentTypeLabel = (paymentType: DeliveryData['paymentType']) =>
  paymentType === 'credit-card' ? 'Online Payment' : 'PayNow';
const getOrderDraftExpiry = () => dayjs().add(ORDER_DRAFT_TTL_HOURS, 'hour').toISOString();
const createDraftId = () => {
  const randomSuffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8).toUpperCase()
      : Math.random().toString(36).slice(2, 10).toUpperCase();

  return `CONF-${dayjs().format('YYYYMMDD-HHmmss')}-${randomSuffix}`;
};
const isStoredDraftExpired = (draft: Partial<StoredOrderDraft> | null) =>
  !draft?.expiresAt || dayjs().isAfter(dayjs(draft.expiresAt));

type ProductOrderFlowProps = {
  productCatalog: ProductCatalog;
};

export type StoredOrderDraft = {
  version: 1;
  draftId: string;
  savedAt: string;
  expiresAt: string;
  summary: {
    categoryName: string;
    optionLabel: string;
    totalLabel: string;
  };
  packageSelection: {
    categoryId: string | null;
    categoryName: string;
    durationDays: number;
    itemNo: string;
    optionId: string | null;
    optionLabel: string;
    selectedDateType: 'confirmed' | 'edd';
    selectedDate: string;
    startWith: 'lunch' | 'dinner';
  };
  bundles: Array<{ id: string; itemNo: string; name: string; price: number }>;
  addOns: Array<{ id: string; itemNo: string; label: string; price: number; quantity: number }>;
  specialRequests: {
    selected: string[];
    riceOption: 'WHITE' | 'BROWN' | 'NO_PREF';
    note: string;
  };
  delivery: DeliveryData;
  payment: Pick<DeliveryData, 'paymentMethod' | 'paymentType'>;
  pricing: {
    subtotal: number;
    promoCode: string | null;
    promoDiscount: number;
    gstAmount: number;
    total: number;
    deposit: number;
    balance: number;
    // Tiered shipping fee — only set for full-payment orders (see
    // src/lib/checkout/shipping-fee.ts). Partial-payment orders don't charge
    // it yet, so these stay undefined there.
    shippingMethod?: 'FREE' | 'SMALL_ORDER' | 'STANDARD';
    shippingAmount?: number;
  };
};

type SubmitNotice = {
  severity: 'success' | 'error' | 'info';
  message: string;
};

type PaymentUiState =
  | 'idle'
  | 'preparing'
  | 'loading-sdk'
  | 'awaiting-input'
  | 'verifying'
  | 'submitting-order'
  | 'success'
  | 'error';

type PaymentSessionResponse = {
  data?: {
    captureContext?: string;
    gateway?: 'cybersource' | 'stripe';
    orderReference?: string;
    sessionId?: string;
    url?: string;
  } | null;
  message?: string;
  status?: number;
};

type PaymentVerificationResult = {
  amount: string | null;
  currency: string | null;
  message?: string | null;
  orderReference: string;
  paymentStatus: string;
  transactionId: string;
};

type PaymentConfirmResponse = {
  data?: PaymentVerificationResult | null;
  message?: string;
  status?: number;
};

type CheckoutCompletionResult = {
  customerNo: string;
  customerSource: 'created' | 'matched_email';
  notes: string[];
  orderNo: string | null;
  orderReference: string;
  orderSystemId: string | null;
  paymentStatus: string;
  resolvedItems: Array<{
    itemNo: string;
    quantity: number;
    sourceId: string;
    sourceLabel: string;
    sourceType: 'addon' | 'bundle' | 'package';
    unitPrice: number | null;
  }>;
  transactionId: string;
};

type CheckoutCompleteResponse = {
  data?: CheckoutCompletionResult | null;
  message?: string;
  status?: number;
};

type UnifiedPaymentInstance = {
  complete: (transientToken: string) => Promise<string>;
  show: (args: {
    containers: {
      paymentScreen: string;
      paymentSelection: string;
    };
  }) => Promise<string>;
};

type AcceptInstance = {
  unifiedPayments: (sidebar: boolean) => Promise<UnifiedPaymentInstance>;
};

declare global {
  interface Window {
    Accept?: (captureContext: string) => Promise<AcceptInstance>;
  }
}

const ORDER_DRAFT_TTL_HOURS = 24;
const ORDER_DRAFT_VERSION = 1;
const PAYMENT_SELECTION_CONTAINER_ID = 'cpPaymentSelectionContainer';
const PAYMENT_SCREEN_CONTAINER_ID = 'cpEmbeddedPaymentContainer';

function decodeJwtPayload<T extends Record<string, unknown>>(jwt: string): T {
  const base64Url = jwt.split('.')[1];

  if (!base64Url) {
    throw new Error('Invalid JWT payload');
  }

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  return JSON.parse(atob(padded)) as T;
}

function normalizeStoredDelivery(delivery: Partial<DeliveryData> | undefined): DeliveryData {
  return {
    fullName: safeText(delivery?.fullName ?? '', 80),
    phone: safePhone(delivery?.phone ?? ''),
    email: safeText(delivery?.email ?? '', 80),
    address: safeText(delivery?.address ?? '', 180),
    floor: safeText(delivery?.floor ?? '', 80),
    unit: safeText(delivery?.unit ?? '', 80),
    postalCode: safePostalCode(delivery?.postalCode ?? ''),
    paymentMethod: 'full',
    paymentType: 'credit-card',
  };
}

export function ProductOrderFlow({ productCatalog }: ProductOrderFlowProps) {
  const router = useRouter();
  const { packageCategories, addOnGroups, specialRequestOptions, promoCodes } = productCatalog;
  const configSectionRef = useRef<HTMLDivElement | null>(null);
  const paymentContainerRef = useRef<HTMLDivElement | null>(null);
  const lastScrolledCategoryRef = useRef<string | null>(null);
  const isRestoringDraftRef = useRef(false);
  const launchedCaptureContextRef = useRef<string | null>(null);
  // isStartingCheckout (state) only flips true after the promo re-check below
  // resolves, so a second click during that await isn't caught by isPaymentBusy
  // yet. A ref closes that gap synchronously — state wouldn't, since a second
  // click landing before React re-renders would still read the stale value.
  const isSubmittingCheckoutRef = useRef(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [selectedBundleIds, setSelectedBundleIds] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string | null>>({});
  const [selectedDateType, setSelectedDateType] = useState<'confirmed' | 'edd'>('confirmed');
  const [selectedDate, setSelectedDate] = useState(getMinDateValue());
  const blockedDates = useBlockedDates();
  const [startWith, setStartWith] = useState<'lunch' | 'dinner'>('lunch');
  const [dateError, setDateError] = useState('');
  const [delivery, setDelivery] = useState<DeliveryData>(defaultDelivery);
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const [specialNote, setSpecialNote] = useState('');
  const [riceOption, setRiceOption] = useState<'WHITE' | 'BROWN' | 'NO_PREF'>('NO_PREF');
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [appliedPromoMeta, setAppliedPromoMeta] = useState<AppliedPromoMeta | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  // Tracks a code this component applied on the customer's behalf (as
  // opposed to one they typed into the promo field), so the "applied" badge
  // can say so and so a manual Remove doesn't get silently reinstated.
  const [autoAppliedPromoCode, setAutoAppliedPromoCode] = useState<string | null>(null);
  const dismissedAutoPromoRef = useRef<string | null>(null);
  const promoRevalidatedRef = useRef<string | null>(null);
  const promoLinesKeyRef = useRef<string | null>(null);
  const promoCustomerKeyRef = useRef<string | null>(null);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const [submitNotice, setSubmitNotice] = useState<SubmitNotice | null>(null);
  const [paymentUiState, setPaymentUiState] = useState<PaymentUiState>('idle');
  // Tracks the /api/payments/session request in flight, independent of the
  // dialog — Stripe redirects away immediately once it resolves, so it never
  // needs the dialog open at all; only CyberSource opens it (once its capture
  // context is ready), since it walks through several steps in-page.
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentOrderReference, setPaymentOrderReference] = useState('');
  const [paymentCaptureContext, setPaymentCaptureContext] = useState<string | null>(null);
  const [paymentGatewayMode, setPaymentGatewayMode] = useState<'cybersource' | 'stripe' | null>(null);
  const [activeDraft, setActiveDraft] = useState<StoredOrderDraft | null>(null);
  // MUI's Dialog mounts its content one render behind `open` flipping true, so
  // paymentContainerRef.current can still be null on the render where the
  // capture context first arrives. A ref's value isn't reactive, so the launch
  // effect below has no way to notice it becoming available afterward — this
  // state (set from a callback ref) makes container-readiness something the
  // effect can actually depend on and re-run for.
  const [isPaymentContainerMounted, setIsPaymentContainerMounted] = useState(false);
  const [checkoutCompletion, setCheckoutCompletion] = useState<CheckoutCompletionResult | null>(
    null
  );
  const isCompactSummaryLayout = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const isMobilePaymentDialog = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!checkoutCompletion) return;
    sessionStorage.removeItem(ORDER_DRAFT_STORAGE_KEY);
    const params = new URLSearchParams();
    if (checkoutCompletion.orderNo) params.set('orderNo', checkoutCompletion.orderNo);
    params.set('ref', checkoutCompletion.orderReference);
    params.set('draftKind', 'product');
    router.push(`/order-success?${params.toString()}`);
  }, [checkoutCompletion, router]);

  const selectedCategory = useMemo(
    () => packageCategories.find((item) => item.id === selectedCategoryId) ?? null,
    [packageCategories, selectedCategoryId]
  );
  const selectedOption = useMemo(
    () =>
      selectedCategory
        ? (selectedCategory.options.find((item) => item.id === selectedOptionId) ??
          selectedCategory.options[0])
        : null,
    [selectedCategory, selectedOptionId]
  );
  const bundles = useMemo(() => selectedOption?.bundles ?? [], [selectedOption]);
  // Trial Meal is a single-day order — the preset meal-exclusion checkboxes
  // and rice preference don't apply at that scale, so only free-text notes
  // are offered for it.
  const isTrialMeal = selectedCategory?.id === 'trial-meal';

  useEffect(() => {
    if (!selectedCategory) {
      setSelectedOptionId('');
      setSelectedBundleIds([]);
      setSelectedAddOns({});
      return;
    }

    if (isRestoringDraftRef.current) {
      isRestoringDraftRef.current = false;
      return;
    }

    setSelectedOptionId(selectedCategory.options[0]?.id ?? '');
    setSelectedBundleIds([]);
    setSelectedAddOns({});
    setPromoInput('');
    setPromoMessage(null);
    setAppliedPromoCode(null);
    setAppliedPromoMeta(null);
    setAutoAppliedPromoCode(null);
    dismissedAutoPromoRef.current = null;

    if (selectedCategory.id === 'trial-meal') {
      // Drop preset meal-exclusion picks (but keep "No Weekend Deliveries",
      // which lives in the same array and isn't one of the hidden presets).
      setSpecialRequests((prev) => prev.filter((item) => item === 'No Weekend Deliveries'));
      setRiceOption('NO_PREF');
    }
  }, [selectedCategory]);

  // A dismissed auto-apply code (see the auto-apply effect below) is scoped
  // to "this package selection" — switching duration options, not just
  // category, counts as a new selection the customer hasn't dismissed
  // anything for yet.
  useEffect(() => {
    dismissedAutoPromoRef.current = null;
  }, [selectedOptionId]);

  useEffect(() => {
    try {
      const storedDraft = sessionStorage.getItem(ORDER_DRAFT_STORAGE_KEY);

      if (!storedDraft) {
        return;
      }

      const parsedDraft = JSON.parse(storedDraft) as Partial<StoredOrderDraft>;

      if (parsedDraft.version !== ORDER_DRAFT_VERSION || isStoredDraftExpired(parsedDraft)) {
        sessionStorage.removeItem(ORDER_DRAFT_STORAGE_KEY);
        return;
      }

      const categoryId = parsedDraft.packageSelection?.categoryId ?? null;
      const restoredCategory = packageCategories.find((item) => item.id === categoryId);

      if (!restoredCategory) {
        return;
      }

      const restoredOptionId =
        restoredCategory.options.find((item) => item.id === parsedDraft.packageSelection?.optionId)
          ?.id ?? restoredCategory.options[0]?.id ?? '';

      const restoredAddOns = addOnGroups.reduce<Record<string, string | null>>((acc, group) => {
        const restoredOption = group.options.find((option) =>
          parsedDraft.addOns?.some((item) => item.id === option.id)
        );

        if (restoredOption) {
          acc[group.id] = restoredOption.id;
        }

        return acc;
      }, {});

      isRestoringDraftRef.current = true;
      setSelectedCategoryId(restoredCategory.id);
      setSelectedOptionId(restoredOptionId);
      setSelectedBundleIds((parsedDraft.bundles ?? []).map((item) => item.id));
      setSelectedAddOns(restoredAddOns);
      setSelectedDateType(parsedDraft.packageSelection?.selectedDateType === 'edd' ? 'edd' : 'confirmed');
      setSelectedDate(parsedDraft.packageSelection?.selectedDate ?? getMinDateValue());
      setStartWith(parsedDraft.packageSelection?.startWith === 'dinner' ? 'dinner' : 'lunch');
      setDelivery(normalizeStoredDelivery(parsedDraft.delivery));
      setSpecialRequests(parsedDraft.specialRequests?.selected ?? []);
      setRiceOption(parsedDraft.specialRequests?.riceOption ?? 'NO_PREF');
      setSpecialNote(safeText(parsedDraft.specialRequests?.note ?? '', 240));
      setPromoInput(parsedDraft.pricing?.promoCode ?? '');
      setAppliedPromoCode(parsedDraft.pricing?.promoCode ?? null);
      setPromoMessage(
        parsedDraft.pricing?.promoCode
          ? `Promo code ${parsedDraft.pricing.promoCode} was restored from your saved draft.`
          : null
      );
    } catch (error) {
      console.error('Unable to validate the stored order draft. Clearing local copy.', error);
      sessionStorage.removeItem(ORDER_DRAFT_STORAGE_KEY);
    }
  }, [addOnGroups, packageCategories]);

  useEffect(() => {
    setSelectedBundleIds((prev) => prev.filter((id) => bundles.some((bundle) => bundle.id === id)));
  }, [bundles]);

  useEffect(() => {
    let timer: number | undefined;

    if (!selectedCategory) {
      lastScrolledCategoryRef.current = null;
    } else if (
      selectedOption &&
      configSectionRef.current &&
      lastScrolledCategoryRef.current !== selectedCategory.id
    ) {
      timer = window.setTimeout(() => {
        lastScrolledCategoryRef.current = selectedCategory.id;
        configSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [selectedCategory, selectedOption]);

  const selectedBundleItems = bundles.filter((bundle) => selectedBundleIds.includes(bundle.id));
  const selectedAddOnItems = addOnGroups
    .map((group) => group.options.find((option) => option.id === selectedAddOns[group.id]))
    .filter((item): item is NonNullable<typeof item> => !!item);
  const selectedAddOnSummaryItems = addOnGroups.flatMap((group) => {
    const selectedAddOnOptionId = selectedAddOns[group.id];
    const selectedItem = group.options.find((option) => option.id === selectedAddOnOptionId);

    if (!selectedItem) return [];

    return [
      {
        id: selectedItem.id,
        label: group.type === 'single' ? group.name : `${group.name} (${selectedItem.label})`,
        price: selectedItem.price,
        bcNumber: selectedItem.bcNumber,
      },
    ];
  });

  const subtotal =
    (selectedOption?.price ?? 0) +
    selectedBundleItems.reduce((sum, item) => sum + item.price, 0) +
    selectedAddOnItems.reduce((sum, item) => sum + item.price, 0);

  // Cart lines sent with promo validation — mirrors the subtotal composition
  // so item-scoped promos are checked against the actual selected products.
  const promoCartLines: PromoCartLine[] = [
    ...(selectedOption
      ? [{ lineAmount: selectedOption.price, productNo: selectedOption.bcNumber ?? undefined }]
      : []),
    ...selectedBundleItems.map((item) => ({
      lineAmount: item.price,
      productNo: item.bcNumber ?? undefined,
    })),
    ...selectedAddOnItems.map((item) => ({
      lineAmount: item.price,
      productNo: item.bcNumber ?? undefined,
    })),
  ];
  const promoCartLinesKey = JSON.stringify(promoCartLines);
  // Some promo codes are limited per phone/email — editing either after a
  // successful apply must invalidate the stale result, same as changing the
  // cart does below. Without this, "Promo code applied!" keeps showing even
  // after the customer switches to a phone that's already used this
  // campaign's limit, right up until the final pre-payment check.
  const promoCustomerKey = `${delivery.email.trim().toLowerCase()}|${delivery.phone.trim()}`;

  const promoDiscount = appliedPromoCode ? computePromoDiscount(appliedPromoMeta, subtotal) : 0;
  const total = Math.max(0, subtotal - promoDiscount);
  const gstAmount = (total * 9) / 109;
  const deposit = delivery.paymentMethod === 'partial' ? 100 : 0;
  const balance = delivery.paymentMethod === 'partial' ? Math.max(0, total - 100) : 0;
  // Packages have no delivery fee at all — it's bundled into the package
  // price. The only charge is a small-order surcharge when a steep promo
  // pushes the order below a sane minimum; computePackageShippingFee()
  // returns null otherwise, meaning no fee applies.
  // Shipping is only charged for full-payment orders today — partial-payment
  // (deposit now / balance later) doesn't have an agreed point to charge it
  // yet, so it's left out of the deposit/balance split for now.
  const shippingFee = computePackageShippingFee(total);
  const isFullPayment = delivery.paymentMethod === 'full';
  const shippingAmount = isFullPayment && shippingFee ? shippingFee.amount : 0;
  const grandTotal = total + shippingAmount;
  const dateValidation = validateSelectedDate(selectedDate, undefined, blockedDates);

  const fieldErrors = {
    email: delivery.email.trim() && !/\S+@\S+\.\S+/.test(delivery.email) ? 'Invalid email' : '',
    postalCode:
      delivery.postalCode.trim() && !/^\d{6}$/.test(delivery.postalCode) ? '6 digits required' : '',
  };
  const hasRequiredDeliveryFields =
    !!delivery.fullName.trim() &&
    !!delivery.phone.trim() &&
    !!delivery.email.trim() &&
    !!delivery.address.trim() &&
    !!delivery.postalCode.trim() &&
    !!delivery.unit.trim();
  const hasDeliveryErrors = !hasRequiredDeliveryFields || Object.values(fieldErrors).some(Boolean);

  const canProceed =
    !!selectedDate &&
    dateValidation.isValid &&
    !hasDeliveryErrors &&
    !!selectedOption &&
    !!selectedCategory;
  const selectedSpecialRequestCount =
    specialRequests.length + (specialNote.trim() ? 1 : 0) + (riceOption !== 'NO_PREF' ? 1 : 0);
  const validationMessage = !selectedOption
    ? 'Please select a package.'
    : !dateValidation.isValid
      ? dateValidation.message
      : hasDeliveryErrors
        ? 'Please complete the delivery information.'
        : '';
  const isPaymentBusy =
    isStartingCheckout ||
    paymentUiState === 'preparing' ||
    paymentUiState === 'loading-sdk' ||
    paymentUiState === 'awaiting-input' ||
    paymentUiState === 'verifying' ||
    paymentUiState === 'submitting-order';
  // Once the card has been submitted for authorization, the charge may already be
  // in flight or complete — closing the dialog here would just hide that fact,
  // not stop it. Cancelling is only safe before that point.
  const isPaymentIrreversible =
    paymentUiState === 'verifying' || paymentUiState === 'submitting-order';

  const handleDeliveryChange =
    (field: keyof DeliveryData) => (event: ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;
      if (field === 'phone') value = safePhone(value);
      else if (field === 'postalCode') value = safePostalCode(value);
      else value = safeText(value, field === 'address' ? 180 : 80);
      setDelivery((prev) => ({ ...prev, [field]: value }));
    };

  const handleAddOnToggle = (groupId: string, checked: boolean) => {
    const group = addOnGroups.find((item) => item.id === groupId);

    if (!group) {
      return;
    }

    setSelectedAddOns((prev) => ({
      ...prev,
      [groupId]: checked ? (group.options[0]?.id ?? null) : null,
    }));
  };

  const handleAddOnOptionChange = (groupId: string, optionId: string) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  const isPromoEligibleForSelection = useCallback(
    (promoCode: (typeof promoCodes)[number]) => {
      if (!promoCode.conditions?.length) {
        return true;
      }

      return !!selectedOption?.id && promoCode.conditions.includes(selectedOption.id);
    },
    [selectedOption?.id]
  );

  const applyPromo = async () => {
    if (selectedBundleItems.length > 0) {
      setPromoMessage('Promo code is not applicable when a bundle is selected.');
      setAppliedPromoCode(null);
      setAppliedPromoMeta(null);
      return;
    }

    // Required up front, not just at the "Proceed to Order" gate — some promo
    // codes are tracked per phone number (one redemption per customer), and
    // that check can only run once we actually have a phone to check against.
    // Without this, a customer could leave it blank, get a promo silently
    // approved without the phone check, and only discover the problem (or
    // worse, slip past it) much later.
    if (!delivery.phone.trim()) {
      setPromoMessage(
        'Please enter your phone number in Delivery Address and Payment before applying a promo code.'
      );
      setAppliedPromoCode(null);
      setAppliedPromoMeta(null);
      return;
    }

    // Sent exactly as typed: CT Backend matches promo codes case-sensitively,
    // and some codes are mixed case (MummiesClub10). Upper-casing here made
    // those impossible to redeem.
    const code = promoInput.trim();
    if (!code) {
      return;
    }

    // Frontend-only package eligibility gate (kept for codes defined in the local catalog).
    const localRule = promoCodes.find((item) => item.code === code);
    if (localRule && !isPromoEligibleForSelection(localRule)) {
      setPromoMessage('Promo code is not valid for the selected package option.');
      setAppliedPromoCode(null);
      setAppliedPromoMeta(null);
      return;
    }

    setPromoLoading(true);
    setPromoMessage(null);

    const result = await fetchPromoValidation(
      code,
      subtotal,
      promoCartLines,
      delivery.email.trim() || undefined,
      delivery.phone.trim() || undefined
    );

    setPromoLoading(false);

    if (!result.ok) {
      setPromoMessage(result.reason);
      setAppliedPromoCode(null);
      setAppliedPromoMeta(null);
      return;
    }

    setAppliedPromoMeta(result.meta);
    setAppliedPromoCode(code);
    setAutoAppliedPromoCode(null);
    setPromoMessage(result.description ?? 'Promo code applied!');
  };

  useEffect(() => {
    if (!appliedPromoCode) {
      return;
    }

    // Promo codes are never valid alongside a bundle (see applyPromo and the
    // auto-apply effect's guard) — but that's only checked when a code is
    // first applied. Without re-checking it here too, selecting a bundle
    // AFTER a promo is already applied leaves it in place: the cart-change
    // revalidation effect just re-asks the server, which has no concept of
    // this frontend-only "no bundle" rule and re-confirms it.
    if (selectedBundleItems.length > 0) {
      setAppliedPromoCode(null);
      setAppliedPromoMeta(null);
      setAutoAppliedPromoCode(null);
      // No promoMessage here — the "Promo codes are not applicable when a
      // bundle is selected" caption is already shown below whenever a
      // bundle is selected, so setting one here just duplicates it.
      setPromoMessage(null);
      return;
    }

    const localRule = promoCodes.find((item) => item.code === appliedPromoCode);

    if (localRule && !isPromoEligibleForSelection(localRule)) {
      setAppliedPromoCode(null);
      setAppliedPromoMeta(null);
      setAutoAppliedPromoCode(null);
      setPromoMessage(
        'Promo code was removed because it is not valid for the selected package option.'
      );
      return;
    }

    if (appliedPromoMeta?.minSpend && subtotal < appliedPromoMeta.minSpend) {
      setAppliedPromoCode(null);
      setAppliedPromoMeta(null);
      setAutoAppliedPromoCode(null);
      setPromoMessage(
        `Promo code was removed because the order is below the minimum of ${money.format(appliedPromoMeta.minSpend)}.`
      );
    }
  }, [
    appliedPromoCode,
    appliedPromoMeta,
    isPromoEligibleForSelection,
    promoCodes,
    selectedBundleItems.length,
    subtotal,
  ]);

  // When the cart composition or the customer's email/phone changes while a
  // promo is applied, drop the stale meta — the revalidation effect below
  // refetches against the new cart/identity, so scope-aware discounts and
  // per-phone/email limits stay correct instead of showing a stale "applied".
  useEffect(() => {
    const linesChanged = promoLinesKeyRef.current !== promoCartLinesKey;
    const customerChanged = promoCustomerKeyRef.current !== promoCustomerKey;
    promoLinesKeyRef.current = promoCartLinesKey;
    promoCustomerKeyRef.current = promoCustomerKey;

    if (!linesChanged && !customerChanged) {
      return;
    }

    if (appliedPromoCode && appliedPromoMeta) {
      promoRevalidatedRef.current = null;
      setAppliedPromoMeta(null);
    }
  }, [promoCartLinesKey, promoCustomerKey, appliedPromoCode, appliedPromoMeta]);

  // Re-validate a promo carried in from a restored draft (code present, meta missing)
  // against Business Central so the discount and validity reflect live BC state.
  useEffect(() => {
    if (!appliedPromoCode) {
      promoRevalidatedRef.current = null;
      return undefined;
    }

    if (appliedPromoMeta || promoRevalidatedRef.current === appliedPromoCode) {
      return undefined;
    }

    promoRevalidatedRef.current = appliedPromoCode;
    let cancelled = false;

    void (async () => {
      const result = await fetchPromoValidation(
        appliedPromoCode,
        subtotal,
        promoCartLines,
        delivery.email.trim() || undefined,
        delivery.phone.trim() || undefined
      );

      if (cancelled) {
        return;
      }

      if (result.ok) {
        setAppliedPromoMeta(result.meta);
      } else {
        setAppliedPromoCode(null);
        setPromoMessage(result.reason);
      }
    })();

    return () => {
      cancelled = true;
    };
    // promoCartLines/delivery.email/delivery.phone are intentionally read at
    // fetch time only — the effect is keyed on the serialized cart
    // (promoCartLinesKey) instead of the per-render array identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedPromoCode, appliedPromoMeta, subtotal, promoCartLinesKey]);

  // Auto-apply codes flagged `autoApply` (e.g. EB5OFF) as soon as the
  // selection qualifies, instead of making the customer find and type them.
  // Gated on delivery.phone being filled in, same as the manual Apply flow
  // above — some promo codes are limited per phone number, and that check
  // can only run once we actually have a phone to check against. Without
  // this, the discount could flash "applied" before we know the phone, then
  // get silently corrected once it's entered.
  //
  // Codes marked `autoApplyImmediately` (EB5OFF) skip that gate — it has no
  // per-phone/email redemption limit, only a package + min-spend rule, so
  // there's nothing for a phone-aware check to catch. Showing it right away
  // matches the discount already advertised in the promo banner, instead of
  // only appearing once the customer reaches the delivery form.
  //
  // Skipped once a promo is already applied — whether typed in manually or
  // auto-applied earlier — and skipped for a code the customer explicitly
  // removed for this package selection (dismissedAutoPromoRef), so hitting
  // Remove sticks until they pick a different category/option.
  useEffect(() => {
    if (appliedPromoCode || promoLoading || selectedBundleItems.length > 0 || !selectedOption) {
      return undefined;
    }

    const autoPromo = promoCodes.find(
      (item) =>
        item.autoApply &&
        item.code !== dismissedAutoPromoRef.current &&
        isPromoEligibleForSelection(item)
    );

    if (!autoPromo || (!autoPromo.autoApplyImmediately && !delivery.phone.trim())) {
      return undefined;
    }

    let cancelled = false;
    setPromoLoading(true);

    void (async () => {
      const result = await fetchPromoValidation(
        autoPromo.code,
        subtotal,
        promoCartLines,
        delivery.email.trim() || undefined,
        delivery.phone.trim() || undefined
      );

      if (cancelled) {
        return;
      }

      setPromoLoading(false);

      // Silent on failure (e.g. below min spend) — there's no error to show
      // the customer since they never typed anything in.
      if (result.ok) {
        setAppliedPromoMeta(result.meta);
        setAppliedPromoCode(autoPromo.code);
        setAutoAppliedPromoCode(autoPromo.code);
      }
    })();

    return () => {
      cancelled = true;
    };
    // promoCartLines/delivery.email are intentionally read at fetch time
    // only, same as the effects above — keyed on promoCartLinesKey instead
    // of the per-render array identity. delivery.phone IS a real dependency
    // here (it gates the effect), so it's listed below.
    //
    // promoLoading is deliberately NOT listed: it's only read as a guard
    // against starting a second fetch while one is in flight. Listing it
    // would make setPromoLoading(true) above re-trigger this same effect,
    // running this instance's cleanup (cancelled = true) before its own
    // fetch resolves — so the result would always be discarded and
    // setPromoLoading(false) would never run, leaving "Applying…" stuck.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    appliedPromoCode,
    selectedBundleItems.length,
    selectedOption,
    isPromoEligibleForSelection,
    subtotal,
    promoCartLinesKey,
    delivery.phone,
  ]);

  useEffect(() => {
    if (!isCompactSummaryLayout || !selectedCategory || !selectedOption) {
      setIsMobileSummaryOpen(false);
    }
  }, [isCompactSummaryLayout, selectedCategory, selectedOption]);

  const buildStoredOrderDraft = useCallback((): StoredOrderDraft => {
    const draftId = createDraftId();

    return {
      version: ORDER_DRAFT_VERSION,
      draftId,
      savedAt: dayjs().toISOString(),
      expiresAt: getOrderDraftExpiry(),
      summary: {
        categoryName: selectedCategory?.name ?? '',
        optionLabel: selectedOption?.label ?? '',
        // The package's own price (matches the on-screen "Package" summary
        // row) — not the order grand total, which the order confirmation
        // email shows separately and would otherwise double-count against
        // every bundle/add-on line shown alongside this one.
        totalLabel: money.format(selectedOption?.price ?? 0),
      },
      packageSelection: {
        categoryId: selectedCategory?.id ?? null,
        categoryName: selectedCategory?.name ?? '',
        durationDays: selectedOption?.durationDays ?? 0,
        itemNo: selectedOption?.bcNumber ?? '',
        optionId: selectedOption?.id ?? null,
        optionLabel: selectedOption?.label ?? '',
        selectedDateType,
        selectedDate,
        startWith,
      },
      bundles: selectedBundleItems.map((item) => ({
        id: item.id,
        itemNo: item.bcNumber ?? '',
        name: item.name,
        price: item.price,
      })),
      addOns: selectedAddOnSummaryItems.map((item) => ({
        id: item.id,
        itemNo: item.bcNumber ?? '',
        label: item.label,
        price: item.price,
        quantity: addOnGroups
          .flatMap((group) => group.options)
          .find((option) => option.id === item.id)?.qty ?? 1,
      })),
      specialRequests: {
        selected: specialRequests,
        riceOption,
        note: specialNote,
      },
      delivery: { ...delivery },
      payment: {
        paymentMethod: delivery.paymentMethod,
        paymentType: delivery.paymentType,
      },
      pricing: {
        subtotal,
        promoCode: appliedPromoCode,
        promoDiscount,
        gstAmount,
        total,
        deposit,
        balance,
        shippingMethod: isFullPayment && shippingFee ? shippingFee.method : undefined,
        shippingAmount: isFullPayment && shippingFee ? shippingFee.amount : undefined,
      },
    };
  }, [
    addOnGroups,
    appliedPromoCode,
    balance,
    delivery,
    deposit,
    gstAmount,
    isFullPayment,
    promoDiscount,
    riceOption,
    selectedAddOnSummaryItems,
    selectedBundleItems,
    selectedCategory,
    selectedDate,
    selectedDateType,
    selectedOption,
    shippingFee,
    specialNote,
    specialRequests,
    startWith,
    subtotal,
    total,
  ]);
  const handleProceedToOrder = useCallback(async (): Promise<void> => {
    if (!canProceed || isPaymentBusy || isSubmittingCheckoutRef.current) {
      return;
    }
    isSubmittingCheckoutRef.current = true;

    try {
      // Final promo re-check, phone-aware. Earlier validations (Apply click,
      // cart-change revalidation) can run before delivery.phone is filled in,
      // so a campaign phone-dedup rejection would otherwise only surface after
      // payment, inside CT Backend's recordOrder — which never rejects an
      // order, it just silently drops the discount. canProceed already
      // requires delivery.phone, so phone is guaranteed present here.
      if (appliedPromoCode) {
        const recheck = await fetchPromoValidation(
          appliedPromoCode,
          subtotal,
          promoCartLines,
          delivery.email.trim() || undefined,
          delivery.phone.trim() || undefined
        );

        if (!recheck.ok) {
          setAppliedPromoCode(null);
          setAppliedPromoMeta(null);
          setPromoMessage(recheck.reason);
          setSubmitNotice({
            severity: 'error',
            message: `Your promo code is no longer valid: ${recheck.reason}. Please review your order summary and try again.`,
          });
          return;
        }
      }

      const storedOrderDraft = buildStoredOrderDraft();
      const payableAmount =
        storedOrderDraft.payment.paymentMethod === 'partial'
          ? storedOrderDraft.pricing.deposit
          : storedOrderDraft.pricing.total + (storedOrderDraft.pricing.shippingAmount ?? 0);

      sessionStorage.setItem(ORDER_DRAFT_STORAGE_KEY, JSON.stringify(storedOrderDraft));
      setActiveDraft(storedOrderDraft);
      launchedCaptureContextRef.current = null;
      setPaymentCaptureContext(null);
      setPaymentGatewayMode(null);
      setCheckoutCompletion(null);
      setPaymentError(null);
      setIsStartingCheckout(true);
      setPaymentOrderReference(storedOrderDraft.draftId);
      setSubmitNotice({
        severity: 'info',
        message: 'Your order has been drafted. Please proceed to payment.',
      });

      const response = await fetch('/api/payments/session', {
        body: JSON.stringify({
          amount: payableAmount.toFixed(2),
          currency: 'SGD',
          customer: {
            email: storedOrderDraft.delivery.email,
            phoneNumber: storedOrderDraft.delivery.phone,
          },
          draft: storedOrderDraft,
          orderReference: storedOrderDraft.draftId,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const data = (await response.json()) as PaymentSessionResponse;

      if (!response.ok || data.status !== 200 || !data.data) {
        throw new Error(data.message || 'Failed to create the payment session.');
      }

      if (data.data.gateway === 'stripe') {
        if (!data.data.url) {
          throw new Error('Failed to create the payment session.');
        }
        setPaymentOrderReference(data.data.orderReference ?? storedOrderDraft.draftId);
        setPaymentGatewayMode('stripe');
        // Full-page redirect to Stripe's hosted checkout — the draft is already
        // saved in sessionStorage above, and gets picked back up by
        // OrderSuccessView once Stripe redirects to its success_url.
        window.location.href = data.data.url;
        return;
      }

      if (!data.data.captureContext) {
        throw new Error('Failed to create the payment session.');
      }

      setPaymentOrderReference(data.data.orderReference ?? storedOrderDraft.draftId);
      setPaymentGatewayMode('cybersource');
      // CyberSource's flow stays in-page and walks through several steps, so
      // this is the one gateway that actually opens the dialog.
      setPaymentUiState('preparing');
      setIsStartingCheckout(false);
      setPaymentCaptureContext(data.data.captureContext);
    } catch (error) {
      console.error('Unable to start the payment checkout.', error);
      setIsStartingCheckout(false);
      setPaymentUiState('error');
      setPaymentError(
        error instanceof Error
          ? error.message
          : 'Unable to start the payment checkout. Please try again.'
      );
      setSubmitNotice({
        severity: 'error',
        message: 'Unable to start the payment checkout. Please review the payment configuration.',
      });
    } finally {
      isSubmittingCheckoutRef.current = false;
    }
    // promoCartLines is intentionally read at call time only (like the
    // revalidation effect above) — it's a plain array literal recreated every
    // render, so listing it here would defeat this callback's memoization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedPromoCode, buildStoredOrderDraft, canProceed, delivery, isPaymentBusy, subtotal]);

  useEffect(() => {
    if (
      paymentGatewayMode !== 'cybersource' ||
      !paymentCaptureContext ||
      !activeDraft ||
      !isPaymentContainerMounted
    ) {
      return undefined;
    }

    if (launchedCaptureContextRef.current === paymentCaptureContext) {
      return undefined;
    }
    launchedCaptureContextRef.current = paymentCaptureContext;

    let cancelled = false;

    const launchCheckout = async (): Promise<void> => {
      try {
        setPaymentUiState('loading-sdk');

        if (typeof window.Accept !== 'function') {
          const jwtPayload = decodeJwtPayload<{
            ctx?: Array<{ data?: { clientLibrary?: string; clientLibraryIntegrity?: string } }>;
          }>(paymentCaptureContext);
          const clientLibrary = jwtPayload.ctx?.[0]?.data?.clientLibrary;
          const clientLibraryIntegrity = jwtPayload.ctx?.[0]?.data?.clientLibraryIntegrity;

          if (!clientLibrary || !clientLibraryIntegrity) {
            throw new Error('Unable to load the CyberSource payment library from captureContext.');
          }

          await new Promise<void>((resolve, reject) => {
            const existingScript = document.querySelector<HTMLScriptElement>(
              'script[data-cp-cybersource-sdk="true"]'
            );

            if (existingScript) {
              existingScript.remove();
            }

            const script = document.createElement('script');
            script.async = false;
            script.crossOrigin = 'anonymous';
            script.dataset.cpCybersourceSdk = 'true';
            script.integrity = clientLibraryIntegrity;
            script.src = clientLibrary;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load the CyberSource payment SDK.'));
            document.head.appendChild(script);
          });
        }

        if (cancelled) {
          return;
        }

        if (typeof window.Accept !== 'function') {
          throw new Error('The CyberSource payment library loaded, but window.Accept is unavailable.');
        }

        const accept = await window.Accept(paymentCaptureContext);
        const unifiedPayments = await accept.unifiedPayments(false);

        if (cancelled) {
          return;
        }

        setPaymentUiState('awaiting-input');

        const transientToken = await unifiedPayments.show({
          containers: {
            paymentScreen: `#${PAYMENT_SCREEN_CONTAINER_ID}`,
            paymentSelection: `#${PAYMENT_SELECTION_CONTAINER_ID}`,
          },
        });

        if (cancelled) {
          return;
        }

        setPaymentUiState('verifying');
        const resultJwt = await unifiedPayments.complete(transientToken);

        const confirmResponse = await fetch('/api/payments/confirm', {
          body: JSON.stringify({
            orderReference: paymentOrderReference || activeDraft.draftId,
            resultJwt,
            transientToken,
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        const confirmData = (await confirmResponse.json()) as PaymentConfirmResponse;

        if (!confirmResponse.ok || confirmData.status !== 200 || !confirmData.data) {
          throw new Error(confirmData.message || 'Payment verification failed.');
        }

        if (confirmData.data.paymentStatus !== 'AUTHORIZED') {
          throw new Error(
            confirmData.message || `Payment ${confirmData.data.paymentStatus.toLowerCase()}.`
          );
        }

        if (cancelled) {
          return;
        }

        setPaymentUiState('submitting-order');

        const completeResponse = await fetch('/api/checkout/complete', {
          body: JSON.stringify({
            draft: activeDraft,
            orderReference: paymentOrderReference || activeDraft.draftId,
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        const completeData = (await completeResponse.json()) as CheckoutCompleteResponse;

        if (!completeResponse.ok || completeData.status !== 201 || !completeData.data) {
          throw new Error(
            completeData.message ||
            'Payment was authorized, but the Business Central order was not created.'
          );
        }

        if (cancelled) {
          return;
        }

        setCheckoutCompletion(completeData.data);
        setPaymentUiState('success');
        setSubmitNotice({
          severity: 'success',
          message: `Payment authorized and Business Central order ${completeData.data.orderNo ?? ''} created successfully.`,
        });
      } catch (error) {
        console.error('Payment checkout flow failed.', error);

        if (cancelled) {
          return;
        }

        setPaymentUiState('error');
        setPaymentError(
          error instanceof Error ? error.message : 'The payment checkout could not be completed.'
        );
      }
    };

    launchCheckout();

    return () => {
      cancelled = true;
    };
  }, [activeDraft, paymentCaptureContext, paymentGatewayMode, paymentOrderReference, isPaymentContainerMounted]);

  // Stripe's cancel_url still points back here (its success_url now goes
  // straight to /order-success, which does its own verification — see
  // OrderSuccessView). This just strips the query param on a cancelled return.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('stripeCancelled')) {
      router.replace('/product');
    }
  }, [router]);

  const resetPaymentDialog = () => {
    setPaymentUiState('idle');
    setIsStartingCheckout(false);
    launchedCaptureContextRef.current = null;
    setPaymentCaptureContext(null);
    setPaymentGatewayMode(null);
    setPaymentError(null);
    setCheckoutCompletion(null);
  };
  const renderOrderSummaryContent = () => (
    <Stack spacing={2.5}>
      <Box>
        <Typography
          variant="h3"
          color="primary.main"
          sx={{ mb: 1, typography: { xs: 'h4', md: 'h3' } }}
        >
          Order summary
        </Typography>
        <Typography variant="h4" sx={{ typography: { xs: 'h5', md: 'h4' } }}>
          {selectedCategory?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedOption?.label}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
          Package Selected
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {selectedCategory?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedOption?.label} - {money.format(selectedOption?.price ?? 0)}
        </Typography>
        {!!selectedBundleItems.length && (
          <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedBundleItems.map((item) => (
              <Chip
                key={item.id}
                label={`${item.name} + ${money.format(item.price)}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Order Details
        </Typography>
        <Stack spacing={1}>
          <SummaryRow
            label={selectedDateType === 'confirmed' ? 'Start Date' : 'E.D.D'}
            value={selectedDate}
          />
          <SummaryRow label="Start With" value={startWith === 'lunch' ? 'Lunch' : 'Dinner'} />
          <SummaryRow label="Includes" value="Longan Tea with Red Dates" />
        </Stack>
      </Box>

      {!!selectedAddOnSummaryItems.length && (
        <>
          <Divider />
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Add-Ons ({selectedAddOnSummaryItems.length})
            </Typography>
            <Stack spacing={1}>
              {selectedAddOnSummaryItems.map((item) => (
                <SummaryRow key={item.id} label={item.label} value={money.format(item.price)} />
              ))}
            </Stack>
          </Box>
        </>
      )}

      {selectedSpecialRequestCount > 0 && (
        <>
          <Divider />
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Special Requests
            </Typography>
            {!!specialRequests.length && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                {specialRequests.map((item) => (
                  <Chip key={item} label={item} size="small" variant="outlined" />
                ))}
              </Box>
            )}
            {riceOption !== 'NO_PREF' && (
              <Chip
                label={riceOption === 'WHITE' ? 'All White Rice' : 'All Brown Rice'}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mb: specialNote ? 1.5 : 0 }}
              />
            )}
            {!!specialNote && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                &ldquo;{specialNote}&rdquo;
              </Typography>
            )}
          </Box>
        </>
      )}

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Payment Details
        </Typography>
        <Stack spacing={1}>
          <SummaryRow
            label="Payment Method"
            value={getPaymentMethodLabel(delivery.paymentMethod)}
          />
          <SummaryRow label="Payment Type" value={getPaymentTypeLabel(delivery.paymentType)} />
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Pricing
        </Typography>
        <Stack spacing={1}>
          <SummaryRow label="Package" value={money.format(selectedOption?.price ?? 0)} />
          {selectedBundleItems.map((item) => (
            <SummaryRow key={item.id} label={item.name} value={money.format(item.price)} />
          ))}
          {selectedAddOnSummaryItems.map((item) => (
            <SummaryRow key={item.id} label={item.label} value={money.format(item.price)} />
          ))}
          <SummaryRow label="Subtotal" value={money.format(subtotal)} />
          <SummaryRow
            label="Discount"
            value={appliedPromoCode ? `- ${money.format(promoDiscount)}` : '$--'}
          />
          <SummaryRow label="GST (9% inclusive)" value={money.format(gstAmount)} />
          {isFullPayment && shippingFee && (
            <SummaryRow
              label={`Shipping (${SHIPPING_METHOD_LABEL[shippingFee.method]})`}
              value={money.format(shippingFee.amount)}
            />
          )}
        </Stack>
      </Box>

      <Box sx={{ p: 0 }}>
        {!appliedPromoCode ? (
          <Stack spacing={1.5}>
            <TextField
              size="small"
              value={promoInput}
              onChange={(event) => setPromoInput(event.target.value)}
              placeholder="DISCOUNT5"
              disabled={selectedBundleItems.length > 0}
              error={!!promoMessage && !appliedPromoCode}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="text"
                      size="small"
                      onClick={applyPromo}
                      disabled={selectedBundleItems.length > 0 || !promoInput.trim() || promoLoading}
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 1,
                      }}
                    >
                      {promoLoading ? 'Applying…' : 'Apply'}
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'common.white',
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            {selectedBundleItems.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                Promo codes are not applicable when a bundle is selected.
              </Typography>
            )}
            {!!promoMessage && !appliedPromoCode && (
              <Typography variant="caption" color="error.main">
                {promoMessage}
              </Typography>
            )}
          </Stack>
        ) : (
          <Box
            sx={{
              px: 1.75,
              py: 1.5,
              borderRadius: 2.5,
              bgcolor: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid',
              borderColor: 'rgba(34, 197, 94, 0.18)',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 0.25 }}
                >
                  {appliedPromoCode === autoAppliedPromoCode
                    ? 'Discount applied automatically!'
                    : 'Promo code applied!'}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'success.dark', fontWeight: 700 }}>
                  {appliedPromoCode}
                </Typography>
              </Box>

              <Button
                variant="text"
                color="error"
                size="small"
                sx={{ minWidth: 'auto', px: 0, color: 'text.secondary' }}
                onClick={() => {
                  if (appliedPromoCode === autoAppliedPromoCode) {
                    dismissedAutoPromoRef.current = appliedPromoCode;
                  }
                  setAppliedPromoCode(null);
                  setAppliedPromoMeta(null);
                  setAutoAppliedPromoCode(null);
                  setPromoMessage(null);
                  setPromoInput('');
                }}
              >
                Remove
              </Button>
            </Stack>
          </Box>
        )}
      </Box>

      {delivery.paymentMethod === 'partial' && (
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'rgba(242, 124, 150, 0.10)',
            border: '1px solid',
            borderColor: 'rgba(242, 124, 150, 0.35)',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1.5,
              color: 'primary.main',
              fontWeight: 700,
            }}
          >
            Payment Breakdown
          </Typography>

          <Stack spacing={1}>
            <SummaryRow label="Pay now" value={money.format(deposit)} />
            <SummaryRow label="Pay later" value={money.format(balance)} />
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            Deposit is collected first. The remaining balance is payable later.
          </Typography>
        </Box>
      )}

      <SummaryRow label="Grand Total" value={money.format(grandTotal)} emphasis />
      {!!validationMessage && <Alert severity="warning">{validationMessage}</Alert>}
      {!!submitNotice && <Alert severity={submitNotice.severity}>{submitNotice.message}</Alert>}
      <Button
        variant="contained"
        fullWidth
        sx={{ color: 'common.white' }}
        disabled={!canProceed || isPaymentBusy || paymentUiState === 'success'}
        onClick={handleProceedToOrder}
      >
        {isPaymentBusy ? 'Processing Payment...' : 'Proceed to Order'}
      </Button>
    </Stack>
  );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
          <Container
            maxWidth="lg"
            sx={{
              py: { xs: 7, md: 10 },
              pb:
                selectedCategory && selectedOption && isCompactSummaryLayout
                  ? 'calc(132px + env(safe-area-inset-bottom))'
                  : undefined,
            }}
          >
            <Stack spacing={{ xs: 7, md: 9 }}>
              <Box component="section">
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    alignItems: 'center',
                    gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
                  }}
                >
                  <Box sx={{ display: { xs: 'none', md: 'block' } }} />
                  <SectionHeading title="Choose your package" />
                  <Box sx={{ justifySelf: { xs: 'center', md: 'end' } }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      component="a"
                      href={CONFIG.weeklyMenuPdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      startIcon={<Iconify icon="solar:file-text-bold" />}
                    >
                      View Full Menu (PDF)
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 5,
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                  }}
                >
                  {packageCategories.map((category) => (
                    <Card
                      key={category.id}
                      onClick={() => setSelectedCategoryId(category.id)}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        borderRadius: 4,
                        border: category.id === selectedCategory?.id ? '2px solid' : '1px solid',
                        borderColor:
                          category.id === selectedCategory?.id ? 'primary.main' : 'divider',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          borderRadius: 3,
                          overflow: 'hidden',
                          aspectRatio: '1 / 1',
                        }}
                      >
                        <Image
                          fill
                          alt={category.name}
                          src={category.image}
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <Stack spacing={1} sx={{ p: 2.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {category.description}
                        </Typography>
                        <Typography variant="h5">{category.name}</Typography>
                        <Typography variant="body1" color="primary.main">
                          From{' '}
                          {money.format(Math.min(...category.options.map((item) => item.price)))}
                        </Typography>
                      </Stack>
                    </Card>
                  ))}
                </Box>
              </Box>

              {selectedCategory && selectedOption && (
                <Stack spacing={3}>
                  <Box
                    ref={configSectionRef}
                    sx={{
                      display: 'grid',
                      gap: 3,
                      alignItems: 'start',
                      gridTemplateColumns: {
                        xs: '1fr',
                        lg: 'minmax(0, 1.3fr) minmax(320px, 0.85fr)',
                      },
                    }}
                  >
                    <Stack spacing={3}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        alignItems={{ sm: 'center' }}
                        justifyContent="space-between"
                      >
                        <Box>
                          <Typography
                            variant="h3"
                            sx={{ color: 'primary.main', typography: { xs: 'h4', md: 'h3' } }}
                          >
                            Configure your order
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          fullWidth={false}
                          onClick={() => {
                            setSelectedCategoryId(null);
                            setSelectedOptionId('');
                            setSelectedBundleIds([]);
                            setSelectedAddOns({});
                            setSelectedDateType('confirmed');
                            setSelectedDate(getMinDateValue());
                            setDateError('');
                            setStartWith('lunch');
                            setDelivery(defaultDelivery);
                            setSpecialRequests([]);
                            setSpecialNote('');
                            setRiceOption('NO_PREF');
                            setPromoInput('');
                            setPromoMessage(null);
                            setAppliedPromoCode(null);
                            setAppliedPromoMeta(null);
                            setAutoAppliedPromoCode(null);
                            dismissedAutoPromoRef.current = null;
                          }}
                          sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                          Clear Selection
                        </Button>
                      </Stack>

                      <ConfigCard title="1. Package details">
                        <Stack spacing={3}>
                          <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'grey.100' }}>
                            <Typography variant="subtitle2" color="primary.main" gutterBottom>
                              Package Selected
                            </Typography>
                            <Typography variant="h5">{selectedCategory.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {selectedCategory.description}
                            </Typography>
                            {!!selectedCategory.note && (
                              <Typography variant="body2" sx={{ mt: 1.5, fontStyle: 'italic' }}>
                                {selectedCategory.note}
                              </Typography>
                            )}
                          </Box>

                          <Box>
                            <Typography variant="subtitle1" gutterBottom>
                              Select Days
                            </Typography>
                            <Stack spacing={1}>
                              {selectedCategory.options.map((option) => (
                                <FormControlLabel
                                  key={option.id}
                                  control={
                                    <Radio
                                      checked={option.id === selectedOption.id}
                                      onChange={() => setSelectedOptionId(option.id)}
                                    />
                                  }
                                  label={`${option.label} - ${money.format(option.price)}`}
                                />
                              ))}
                            </Stack>
                          </Box>

                          {!!bundles.length && (
                            <Box
                              sx={{
                                p: 2.5,
                                border: '0.5px solid',
                                borderColor: 'primary.main',
                                borderRadius: 3,
                                bgcolor: 'rgba(242, 124, 150, 0.06)',
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{ color: 'primary.main', fontWeight: 700 }}
                                gutterBottom
                              >
                                Bundle with:
                              </Typography>
                              <Stack spacing={1.5}>
                                {bundles.map((bundle) => (
                                  <Box key={bundle.id}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={selectedBundleIds.includes(bundle.id)}
                                          onChange={(event) =>
                                            setSelectedBundleIds((prev) =>
                                              event.target.checked
                                                ? [...prev, bundle.id]
                                                : prev.filter((id) => id !== bundle.id)
                                            )
                                          }
                                          sx={{ color: 'primary.darker' }}
                                        />
                                      }
                                      label={`${bundle.name} + ${money.format(bundle.price)}`}
                                    />

                                    {(bundle.description || bundle.notes?.length) && (
                                      <Box sx={{ pl: 5.5, pt: 0.5 }}>
                                        {bundle.description && (
                                          <Typography
                                            variant="body2"
                                            sx={{ color: 'primary.main', fontWeight: 600 }}
                                          >
                                            {bundle.description}
                                          </Typography>
                                        )}

                                        {!!bundle.notes?.length && (
                                          <Stack spacing={1} sx={{ mt: 1 }}>
                                            {bundle.notes.map((note) => (
                                              <Stack
                                                key={note}
                                                direction="row"
                                                spacing={1}
                                                alignItems="flex-start"
                                              >
                                                <Box
                                                  sx={{
                                                    width: 6,
                                                    height: 6,
                                                    mt: 0.875,
                                                    borderRadius: '50%',
                                                    bgcolor: 'text.secondary',
                                                    flexShrink: 0,
                                                  }}
                                                />
                                                <Typography
                                                  variant="body2"
                                                  color="text.primary.darker"
                                                >
                                                  {note}
                                                </Typography>
                                              </Stack>
                                            ))}
                                          </Stack>
                                        )}
                                      </Box>
                                    )}
                                  </Box>
                                ))}
                              </Stack>
                            </Box>
                          )}

                          <Divider />

                          <Box>
                            <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
                              Select Date
                            </Typography>
                            <Stack spacing={3}>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ mb: 1.5, color: 'text.secondary' }}
                                >
                                  Date type
                                </Typography>
                                <Stack spacing={1}>
                                  <FormControlLabel
                                    value="confirmed"
                                    control={
                                      <Radio
                                        checked={selectedDateType === 'confirmed'}
                                        onChange={() => setSelectedDateType('confirmed')}
                                      />
                                    }
                                    label="Confirmed Start Date"
                                  />
                                  {selectedCategory.id !== 'trial-meal' && (
                                    <FormControlLabel
                                      value="edd"
                                      control={
                                        <Radio
                                          checked={selectedDateType === 'edd'}
                                          onChange={() => setSelectedDateType('edd')}
                                        />
                                      }
                                      label="E.D.D"
                                    />
                                  )}
                                </Stack>
                              </Box>
                              <DatePicker
                                label={
                                  selectedDateType === 'confirmed'
                                    ? 'Confirmed start date'
                                    : 'E.D.D date'
                                }
                                value={selectedDate ? dayjs(selectedDate) : null}
                                minDate={getMinimumSelectableDate()}
                                format="DD/MM/YYYY"
                                shouldDisableDate={(date) => shouldDisableDate(date, undefined, blockedDates)}
                                onChange={(newValue) => {
                                  if (!newValue) {
                                    setSelectedDate('');
                                    setDateError('Please select a delivery date.');
                                    return;
                                  }

                                  const nextValue = newValue.isValid()
                                    ? newValue.format('YYYY-MM-DD')
                                    : '';
                                  setSelectedDate(nextValue);

                                  const validation = validateSelectedDate(nextValue, undefined, blockedDates);
                                  setDateError(validation.message);
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    error: !!dateError,
                                  },
                                }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ mb: 1.5, color: 'text.secondary' }}
                                >
                                  Start with
                                </Typography>
                                <Stack spacing={1}>
                                  <FormControlLabel
                                    value="lunch"
                                    control={
                                      <Radio
                                        checked={startWith === 'lunch'}
                                        onChange={() => setStartWith('lunch')}
                                      />
                                    }
                                    label="Lunch"
                                  />
                                  <FormControlLabel
                                    value="dinner"
                                    control={
                                      <Radio
                                        checked={startWith === 'dinner'}
                                        onChange={() => setStartWith('dinner')}
                                      />
                                    }
                                    label="Dinner"
                                  />
                                </Stack>
                              </Box>
                            </Stack>
                          </Box>
                        </Stack>
                      </ConfigCard>

                      {selectedCategory.id !== 'trial-meal' && (
                        <ConfigCard title="2. Add Ons">
                          <Stack spacing={2}>
                            {addOnGroups.map((group) => (
                              <Card key={group.id} sx={{ boxShadow: 'none' }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: { xs: 1, sm: 1.5 },
                                  }}
                                >
                                  <Box sx={{ pt: 1, flexShrink: 0 }}>
                                    <Checkbox
                                      checked={!!selectedAddOns[group.id]}
                                      onChange={(event) =>
                                        handleAddOnToggle(group.id, event.target.checked)
                                      }
                                      sx={{ p: 0.5 }}
                                    />
                                  </Box>

                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: { xs: 1.5, sm: 2 },
                                      minWidth: 0,
                                      flex: '1 1 auto',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        position: 'relative',
                                        width: 72,
                                        height: 72,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                      }}
                                    >
                                      <Image
                                        fill
                                        alt={group.name}
                                        src={group.image}
                                        style={{ objectFit: 'cover' }}
                                      />
                                    </Box>

                                    <Stack
                                      spacing={1}
                                      sx={{ minWidth: 0, flex: '1 1 auto', pt: 0.25 }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          gap: 1,
                                          alignItems: { xs: 'flex-start', sm: 'center' },
                                          justifyContent: 'space-between',
                                          flexDirection: { xs: 'column', sm: 'row' },
                                        }}
                                      >
                                        <Typography variant="subtitle1">{group.name}</Typography>
                                        {group.type === 'single' && (
                                          <Typography
                                            variant="body2"
                                            sx={{ color: 'primary.main', fontWeight: 600 }}
                                          >
                                            {money.format(group.options[0]?.price ?? 0)}
                                          </Typography>
                                        )}
                                      </Box>

                                      <Typography variant="body2" color="text.secondary">
                                        {group.description}
                                      </Typography>

                                      {group.type === 'single' ? (
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={
                                                selectedAddOns[group.id] === group.options[0]?.id
                                              }
                                              onChange={(event) =>
                                                handleAddOnToggle(group.id, event.target.checked)
                                              }
                                            />
                                          }
                                          label={group.options[0]?.label ?? 'Add-on'}
                                          sx={{ display: 'none' }}
                                        />
                                      ) : (
                                        !!selectedAddOns[group.id] && (
                                          <Stack spacing={1.5} sx={{ pt: 1 }}>
                                            {group.options.map((option) => (
                                              <FormControlLabel
                                                key={option.id}
                                                value={option.id}
                                                control={
                                                  <Radio
                                                    size="small"
                                                    checked={selectedAddOns[group.id] === option.id}
                                                    onChange={() =>
                                                      handleAddOnOptionChange(group.id, option.id)
                                                    }
                                                  />
                                                }
                                                label={
                                                  <Box
                                                    sx={{
                                                      display: 'flex',
                                                      alignItems: {
                                                        xs: 'flex-start',
                                                        sm: 'center',
                                                      },
                                                      flexDirection: { xs: 'column', sm: 'row' },
                                                      gap: 0.5,
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="body2"
                                                      sx={{ fontWeight: 500 }}
                                                    >
                                                      {option.label}
                                                    </Typography>
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        color: 'primary.main',
                                                        fontWeight: 600,
                                                      }}
                                                    >
                                                      {money.format(option.price)}
                                                    </Typography>
                                                  </Box>
                                                }
                                                sx={{
                                                  m: 0,
                                                  alignItems: 'flex-start',
                                                  '& .MuiFormControlLabel-label': {
                                                    pt: '2px',
                                                  },
                                                }}
                                              />
                                            ))}
                                          </Stack>
                                        )
                                      )}
                                    </Stack>
                                  </Box>
                                </Box>
                              </Card>
                            ))}
                          </Stack>
                        </ConfigCard>
                      )}

                      {!isTrialMeal && (
                        <ConfigCard
                          title={`3. Special Requests${selectedSpecialRequestCount ? ` (${selectedSpecialRequestCount})` : ''}`}
                        >
                          <Stack spacing={2}>
                            <Typography variant="subtitle2" color="primary.main">
                              Exclude the Following
                            </Typography>
                            <Box
                              sx={{
                                display: 'grid',
                                gap: 1,
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                              }}
                            >
                              {specialRequestOptions.map((option) => (
                                <FormControlLabel
                                  key={option.id}
                                  control={
                                    <Checkbox
                                      checked={specialRequests.includes(option.label)}
                                      onChange={(event) =>
                                        setSpecialRequests((prev) =>
                                          event.target.checked
                                            ? [...prev, option.label]
                                            : prev.filter((item) => item !== option.label)
                                        )
                                      }
                                    />
                                  }
                                  label={option.label}
                                />
                              ))}
                            </Box>
                            <TextField
                              select
                              label="Rice option (Excludes Fried RIce & Noodles)"
                              value={riceOption}
                              onChange={(event) =>
                                setRiceOption(event.target.value as 'WHITE' | 'BROWN' | 'NO_PREF')
                              }
                            >
                              <MenuItem value="WHITE">All White Rice</MenuItem>
                              <MenuItem value="BROWN">All Brown Rice</MenuItem>
                              <MenuItem value="NO_PREF">No Preference</MenuItem>
                            </TextField>
                            <TextField
                              label="Notes"
                              multiline
                              minRows={3}
                              placeholder="Enter any additional special requests here..."
                              value={specialNote}
                              onChange={(event) => setSpecialNote(safeText(event.target.value, 240))}
                              helperText={`${specialNote.length}/240`}
                            />
                          </Stack>
                        </ConfigCard>
                      )}

                      <ConfigCard title="4. Delivery Address and Payment">
                        <Box
                          sx={{
                            display: 'grid',
                            gap: 3,
                            gridTemplateColumns: {
                              xs: '1fr',
                              md: 'minmax(0, 1.3fr) minmax(280px, 0.9fr)',
                            },
                          }}
                        >
                          <Stack spacing={2}>
                            <Typography variant="subtitle1">Delivery Address</Typography>
                            <Box
                              sx={{
                                display: 'grid',
                                gap: 2,
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                              }}
                            >
                              <TextField
                                required
                                label="Full name"
                                value={delivery.fullName}
                                onChange={handleDeliveryChange('fullName')}
                              />
                              <TextField
                                required
                                label="Phone"
                                value={delivery.phone}
                                onChange={handleDeliveryChange('phone')}
                              />
                              <TextField
                                required
                                label="Email"
                                value={delivery.email}
                                onChange={handleDeliveryChange('email')}
                                error={!!fieldErrors.email}
                                helperText={fieldErrors.email}
                              />
                              <TextField
                                required
                                label="Postal Code"
                                value={delivery.postalCode}
                                onChange={handleDeliveryChange('postalCode')}
                                error={!!fieldErrors.postalCode}
                                helperText={fieldErrors.postalCode}
                              />
                              <TextField
                                required
                                label="Address"
                                value={delivery.address}
                                onChange={handleDeliveryChange('address')}
                                sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}
                              />
                              <TextField
                                label="Floor"
                                value={delivery.floor}
                                onChange={handleDeliveryChange('floor')}
                              />
                              <TextField
                                required
                                label="Unit"
                                value={delivery.unit}
                                onChange={handleDeliveryChange('unit')}
                              />
                            </Box>

                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={specialRequests.includes('No Weekend Deliveries')}
                                  onChange={(e) =>
                                    setSpecialRequests((prev) =>
                                      e.target.checked
                                        ? [...prev, 'No Weekend Deliveries']
                                        : prev.filter((item) => item !== 'No Weekend Deliveries')
                                    )
                                  }
                                />
                              }
                              label="No weekend deliveries"
                            />
                          </Stack>

                          <Stack spacing={2}>
                            <Typography variant="subtitle1">Payment method</Typography>
                            <PaymentOptionCard
                              title="Full"
                              selected={delivery.paymentMethod === 'full'}
                              onClick={() =>
                                setDelivery((prev) => ({ ...prev, paymentMethod: 'full' }))
                              }
                            />
                            <Divider />
                            <Typography variant="subtitle1">Payment type</Typography>
                            <PaymentOptionCard
                              title="Online Payment"
                              icon={<Payment sx={{ fontSize: 24 }} />}
                              selected={delivery.paymentType === 'credit-card'}
                              onClick={() =>
                                setDelivery((prev) => ({
                                  ...prev,
                                  paymentType: 'credit-card',
                                }))
                              }
                            />
                          </Stack>
                        </Box>
                      </ConfigCard>

                    </Stack>

                    <Card
                      sx={{
                        display: { xs: 'none', lg: 'block' },
                        position: { lg: 'sticky' },
                        top: { lg: 120 },
                        borderRadius: 5,
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                        {renderOrderSummaryContent()}
                      </CardContent>
                    </Card>
                  </Box>

                  <ProductNotes
                    selectedCategory={selectedCategory}
                    selectedBundles={selectedBundleItems}
                  />
                </Stack>
              )}
            </Stack>
          </Container>
        </Box>
      </LocalizationProvider>

      {selectedCategory && selectedOption && isCompactSummaryLayout && (
        <>
          <Box
            sx={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: (theme) => theme.zIndex.appBar,
              px: 2,
              pt: 1.5,
              pb: 'calc(16px + env(safe-area-inset-bottom))',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 24%, rgba(255,255,255,1) 100%)',
            }}
          >
            <Card sx={{ borderRadius: 4, boxShadow: 10 }}>
              <Stack spacing={1.5} sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Order summary
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {money.format(total)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {selectedCategory.name} · {selectedOption.label}
                    </Typography>
                  </Box>

                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setIsMobileSummaryOpen(true)}
                    sx={{ flexShrink: 0 }}
                  >
                    View details
                  </Button>
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ color: 'common.white' }}
                  disabled={!canProceed || isPaymentBusy || paymentUiState === 'success'}
                  onClick={handleProceedToOrder}
                >
                  {isPaymentBusy ? 'Processing Payment...' : 'Proceed to Order'}
                </Button>
              </Stack>
            </Card>
          </Box>

          <Drawer
            anchor="bottom"
            open={isMobileSummaryOpen}
            onClose={() => setIsMobileSummaryOpen(false)}
            PaperProps={{
              sx: {
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: '88vh',
              },
            }}
          >
            <Box
              sx={{
                px: 2,
                pt: 1.5,
                pb: 'calc(24px + env(safe-area-inset-bottom))',
                overflowY: 'auto',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 5,
                  borderRadius: 999,
                  bgcolor: 'grey.300',
                  mx: 'auto',
                  mb: 2,
                }}
              />
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <CardContent sx={{ p: 2.5 }}>{renderOrderSummaryContent()}</CardContent>
              </Card>
            </Box>
          </Drawer>
        </>
      )}

      <Dialog
        open={paymentUiState !== 'idle'}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobilePaymentDialog}
        disableEscapeKeyDown={isPaymentIrreversible}
        onClose={() => {
          if (isPaymentIrreversible) return;
          resetPaymentDialog();
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor:
                paymentUiState === 'error'
                  ? 'error.lighter'
                  : paymentUiState === 'success'
                    ? 'success.lighter'
                    : 'primary.lighter',
              color:
                paymentUiState === 'error'
                  ? 'error.main'
                  : paymentUiState === 'success'
                    ? 'success.main'
                    : 'primary.main',
            }}
          >
            {paymentUiState === 'success' ? (
              <CheckCircleRounded fontSize="small" />
            ) : paymentUiState === 'error' ? (
              <ErrorOutlineRounded fontSize="small" />
            ) : (
              <Payment fontSize="small" />
            )}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              {paymentUiState === 'success'
                ? 'Payment Successful'
                : paymentUiState === 'error'
                  ? 'Payment Issue'
                  : 'Secure Payment Checkout'}
            </Typography>
            {!!paymentOrderReference && paymentUiState === 'error' && (
              <Typography variant="caption" color="text.secondary">
                Order reference: {paymentOrderReference}
              </Typography>
            )}
          </Box>
          {!isPaymentIrreversible && (
            <IconButton
              aria-label="Cancel checkout"
              onClick={resetPaymentDialog}
              size="small"
              sx={{ ml: 'auto', alignSelf: 'flex-start' }}
            >
              <CloseRounded fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>

        {/* Only CyberSource's flow actually walks through these steps in this
            dialog — Stripe redirects away and back, so showing this stepper
            for it would claim steps happened here that the customer never
            saw in this dialog. */}
        {paymentGatewayMode === 'cybersource' && paymentUiState !== 'idle' && paymentUiState !== 'error' && (
          <Stepper
            activeStep={
              paymentUiState === 'success'
                ? 2
                : paymentUiState === 'verifying' || paymentUiState === 'submitting-order'
                  ? 1
                  : 0
            }
            alternativeLabel
            sx={{ px: 3, pb: 0 }}
          >
            <Step>
              <StepLabel>Payment Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Confirming Payment</StepLabel>
            </Step>
            <Step>
              <StepLabel>Order Confirmed</StepLabel>
            </Step>
          </Stepper>
        )}

        <DialogContent
          sx={{
            pt:
              paymentGatewayMode === 'cybersource' && paymentUiState !== 'idle' && paymentUiState !== 'error'
                ? 2
                : undefined,
          }}
        >
          <Stack spacing={2}>
            {(paymentUiState === 'preparing' ||
              paymentUiState === 'loading-sdk' ||
              paymentUiState === 'verifying' ||
              paymentUiState === 'submitting-order') && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    {paymentUiState === 'preparing' && 'Preparing your secure payment session...'}
                    {paymentUiState === 'loading-sdk' && 'Loading secure checkout...'}
                    {paymentUiState === 'verifying' && 'Confirming your payment...'}
                    {paymentUiState === 'submitting-order' && 'Finalizing your order...'}
                  </Typography>
                </Stack>
              )}

            {!!paymentError && (
              <Alert severity="error" variant="outlined">
                {paymentError}
              </Alert>
            )}

            {paymentUiState === 'success' && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  {checkoutCompletion?.orderNo
                    ? `Order ${checkoutCompletion.orderNo} confirmed. Redirecting you now...`
                    : 'Payment confirmed. Redirecting you now...'}
                </Typography>
              </Stack>
            )}

            <Box
              ref={(node: HTMLDivElement | null) => {
                paymentContainerRef.current = node;
                setIsPaymentContainerMounted(!!node);
              }}
            >
              <div id={PAYMENT_SELECTION_CONTAINER_ID} style={{ overflow: 'hidden' }} />
              <div
                id={PAYMENT_SCREEN_CONTAINER_ID}
                style={{
                  minHeight:
                    paymentUiState === 'loading-sdk' || paymentUiState === 'awaiting-input' ? '420px' : 0,
                  overflow: 'hidden',
                  transition: 'min-height 0.2s ease',
                }}
              />
            </Box>

            {paymentUiState === 'error' && (
              <Button variant="contained" fullWidth onClick={resetPaymentDialog}>
                Try Again
              </Button>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      <BackToTopButton color="primary" />
    </>
  );
}

function ConfigCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card sx={{ borderTop: '5px solid', borderColor: 'primary.main', borderRadius: '4px 4px 0 0' }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ mt: 2 }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

function PaymentOptionCard({
  title,
  description,
  icon,
  selected,
  disabled = false,
  onClick,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        px: 2,
        py: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'rgba(242, 124, 150, 0.06)' : 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: selected ? 'primary.main' : 'grey.400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          {selected && (
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
          )}
        </Box>
        {icon && (
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: selected ? 'rgba(242, 124, 150, 0.12)' : 'grey.100',
              color: selected ? 'primary.main' : 'text.secondary',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          sx={{
            minHeight: icon ? 42 : 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: icon && !description ? 'center' : 'flex-start',
          }}
        >
          <Typography variant="subtitle2">{title}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function SummaryRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 0.25, sm: 2 },
      }}
    >
      <Typography
        variant={emphasis ? 'subtitle1' : 'body2'}
        color={emphasis ? 'text.primary' : 'text.secondary'}
      >
        {label}
      </Typography>
      <Typography
        variant={emphasis ? 'subtitle1' : 'body2'}
        sx={{ fontWeight: emphasis ? 700 : 600, textAlign: { xs: 'left', sm: 'right' } }}
      >
        {value}
      </Typography>
    </Box>
  );
}
