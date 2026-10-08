'use client';

import type { GiftSetProduct, GiftSetFoodItem } from './baby-full-month-gift-set-data';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogContent from '@mui/material/DialogContent';

import { GIFT_SET_CART_KEY } from 'src/lib/checkout/storage-keys';

import { Iconify } from 'src/components/iconify';

import { SectionHeading } from 'src/sections/home/section-heading';

import { GiftSetImportantNotesContent } from './baby-full-month-gift-set-notes';
import { buildCtbSelections, PERSONALISED_OPTION_ID } from './ctb-selection-codes';
import {
  GIFT_SET_CHECKOUT_KEY,
  type GiftSetCheckoutState,
} from './baby-full-month-gift-set-checkout-view';
// ----------------------------------------------------------------------

type GiftSetCartEntry = {
  quantity: number;
  variantId?: string;
  choices?: Record<string, string>;
  personalisedTexts?: Record<string, string>;
};

type GiftSetCart = Record<string, GiftSetCartEntry>;

type GiftSetCartLine = {
  product: GiftSetProduct;
  quantity: number;
  variantId?: string;
  variantName?: string;
  choices?: Record<string, string>;
  choiceLabels?: string[];
  selections?: Record<string, string>;
  lineTotal: number;
};

const money = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' });

// ----------------------------------------------------------------------

export function BabyFullMonthGiftSetView({ products }: { products: GiftSetProduct[] }) {
  const [cart, setCart] = useState<GiftSetCart>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<GiftSetProduct | null>(null);
  // Skips the very first persist so it can't overwrite the snapshot below
  // with the empty initial state before it's had a chance to load.
  const isFirstCartPersistRef = useRef(true);

  // Restores the cart when a customer goes to checkout and back — this view
  // unmounts on navigation, so plain useState alone loses `cart` on return.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(GIFT_SET_CART_KEY);
      if (raw) {
        setCart(JSON.parse(raw) as GiftSetCart);
      }
    } catch {
      // Corrupted or unavailable snapshot — just start with an empty cart.
    }
  }, []);

  useEffect(() => {
    if (isFirstCartPersistRef.current) {
      isFirstCartPersistRef.current = false;
      return;
    }
    sessionStorage.setItem(GIFT_SET_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const cartLines = useMemo<GiftSetCartLine[]>(
    () =>
      products
        .map((product) => {
          const entry = cart[product.id];
          const quantity = entry?.quantity ?? 0;
          const { variantId, choices } = entry ?? {};
          const variant = product.variants?.find((v) => v.id === variantId);
          const allChoiceDefs = [
            ...(product.choices ?? []),
            ...(variant ? [...(variant.choices ?? []), ...variant.items.flatMap((i) => i.choices ?? [])] : []),
          ];
          const choiceEntries = choices
            ? Object.entries(choices).flatMap(([choiceId, optionId]) => {
                const choice = allChoiceDefs.find((c) => c.id === choiceId);
                const option = choice?.options.find((o) => o.id === optionId);
                if (!choice || !option) return [];
                const displayValue =
                  optionId === PERSONALISED_OPTION_ID && entry?.personalisedTexts?.[choiceId]
                    ? entry.personalisedTexts[choiceId]
                    : option.label;
                return [{ choiceId, choiceLabel: choice.label, optionId, displayValue }];
              })
            : undefined;
          const choiceLabels = choiceEntries?.map(
            ({ choiceLabel, displayValue }) => `${choiceLabel}: ${displayValue}`
          );
          // Keyed by CT Backend's own option group/value codes (e.g. CARDMSG:
          // "PERSONALISED"), not our internal choice/option ids — this is what
          // actually reaches CT Backend, separate from choiceLabels above
          // (which is just for on-screen display).
          const selections = choiceEntries ? buildCtbSelections(choiceEntries) : undefined;

          return {
            product,
            quantity,
            variantId,
            variantName: variant?.name,
            choices,
            choiceLabels,
            selections,
            lineTotal: (variant?.price ?? product.price) * quantity,
          };
        })
        .filter((item) => item.quantity > 0),
    [cart, products]
  );

  const totalQuantity = cartLines.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartLines.reduce((sum, item) => sum + item.lineTotal, 0);


  const handleAddToCart = (
    productId: string,
    variantId?: string,
    choices?: Record<string, string>,
    qty?: number,
    personalisedTexts?: Record<string, string>
  ) => {
    const product = products.find((p) => p.id === productId);
    const minQty = product?.minQty ?? 1;
    setCart((currentCart) => ({
      ...currentCart,
      [productId]: { quantity: qty ?? minQty, variantId, choices, personalisedTexts },
    }));
  };

  const handleChangeQuantity = (productId: string, quantity: number) => {
    setCart((currentCart) => {
      const nextCart = { ...currentCart };

      if (quantity <= 0) {
        delete nextCart[productId];
      } else {
        nextCart[productId] = {
          quantity,
          variantId: nextCart[productId]?.variantId,
          choices: nextCart[productId]?.choices,
          personalisedTexts: nextCart[productId]?.personalisedTexts,
        };
      }

      return nextCart;
    });
  };

  return (
    <>
      <GiftSetCartIcon totalItems={totalQuantity} onClick={() => setCartOpen(true)} />
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <Stack spacing={{ xs: 7, md: 9 }}>
          <Box component="section">
            <SectionHeading
              title="Baby Full Month Gift Set"
              description="On this most joyous occasion, what better way to welcome your baby into this world and share your joy with your loved ones?"
            />

            <Box sx={{ mt: 5 }}>
              {products.length ? (
                <GiftSetProductList
                  products={products}
                  cart={cart}
                  onSelectProduct={setSelectedProduct}
                />
              ) : (
                <GiftSetEmptyContent />
              )}
            </Box>
          </Box>

          <GiftSetImportantNotesSection />
        </Stack>
      </Container>

      <GiftSetProductDetailDialog
        product={selectedProduct}
        quantity={selectedProduct ? (cart[selectedProduct.id]?.quantity ?? 0) : 0}
        minQty={selectedProduct?.minQty ?? 1}
        variantId={selectedProduct ? cart[selectedProduct.id]?.variantId : undefined}
        choices={selectedProduct ? cart[selectedProduct.id]?.choices : undefined}
        personalisedTexts={selectedProduct ? cart[selectedProduct.id]?.personalisedTexts : undefined}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(variantId, choices, qty, personalisedTexts) => {
          if (selectedProduct) handleAddToCart(selectedProduct.id, variantId, choices, qty, personalisedTexts);
        }}
      />

      <GiftSetCartDrawer
        open={cartOpen}
        totalQuantity={totalQuantity}
        subtotal={subtotal}
        cartLines={cartLines}
        onClose={() => setCartOpen(false)}
        onChangeQuantity={handleChangeQuantity}
      />
    </>
  );
}

// ----------------------------------------------------------------------

type GiftSetProductListProps = {
  cart: GiftSetCart;
  products: GiftSetProduct[];
  onSelectProduct: (product: GiftSetProduct) => void;
};

function GiftSetProductList({ products, cart, onSelectProduct }: GiftSetProductListProps) {
  return (
    <Box
      sx={{
        gap: { xs: 1.5, md: 2.5 },
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {products.map((product) => (
        <GiftSetProductItem
          key={product.id}
          product={product}
          quantity={cart[product.id]?.quantity ?? 0}
          onSelect={() => onSelectProduct(product)}
        />
      ))}
    </Box>
  );
}

function GiftSetImportantNotesSection() {
  return (
    <Card sx={{ borderRadius: 5 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Typography variant="h5" sx={{ color: 'primary.main', typography: { xs: 'h6', md: 'h5' } }}>
          Important Notes
        </Typography>

        <Box sx={{ mt: 2 }}>
          <GiftSetImportantNotesContent />
        </Box>
      </CardContent>
    </Card>
  );
}

type GiftSetProductItemProps = {
  product: GiftSetProduct;
  quantity: number;
  onSelect: () => void;
};

function GiftSetProductItem({ product, quantity, onSelect }: GiftSetProductItemProps) {
  return (
    <Card
      onClick={onSelect}
      sx={{
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <Box sx={{ position: 'relative', p: { xs: 0.75, md: 1 } }}>
        <Box
          sx={{
            width: 1,
            overflow: 'hidden',
            borderRadius: 1.5,
            aspectRatio: '1 / 1',
            position: 'relative',
            bgcolor: 'grey.100',
          }}
        >
          <Image
            fill
            alt={product.alt}
            src={product.image}
            sizes="(min-width: 1200px) 25vw, (min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
            style={{ objectFit: 'cover', objectPosition: product.imagePosition }}
          />
          {!!quantity && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 9,
                minWidth: 24,
                height: 24,
                px: 0.75,
                borderRadius: 99,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" fontWeight="bold" lineHeight={1} color="inherit">
                {quantity}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <CardContent sx={{ p: { xs: 1.5, md: 2.25 }, pt: { xs: 1, md: 1.75 } }}>
        <Stack spacing={{ xs: 1.5, md: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              overflow: 'hidden',
              fontSize: { xs: 12.5, md: 14 },
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box component="span">{money.format(product.price)}</Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

type GiftSetCartIconProps = {
  totalItems: number;
  onClick: () => void;
};

function GiftSetCartIcon({ totalItems, onClick }: GiftSetCartIconProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={(theme) => ({
        right: { xs: 16, md: 24 },
        bottom: { xs: 84, md: 96 },
        zIndex: theme.zIndex.speedDial,
        border: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        position: 'fixed',
        color: 'primary.contrastText',
        borderRadius: '999px',
        bgcolor: 'primary.main',
        padding: theme.spacing(1.5, 2.5),
        boxShadow: theme.vars.customShadows.dropdown,
        transition: theme.transitions.create(['opacity']),
        '&:hover': { opacity: 0.9 },
      })}
    >
      <Badge showZero badgeContent={totalItems} color="error" max={99}>
        <Iconify icon="solar:cart-3-bold" width={24} />
      </Badge>
    </Box>
  );
}

const GST_RATE = 9 / 100;

function CartSummaryRow({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="body2" color={color ?? 'text.secondary'}>
        {label}
      </Typography>
      <Typography variant={bold ? 'subtitle1' : 'body2'} color={color ?? 'text.primary'}>
        {value}
      </Typography>
    </Stack>
  );
}

type GiftSetCartDrawerProps = {
  open: boolean;
  totalQuantity: number;
  subtotal: number;
  cartLines: GiftSetCartLine[];
  onClose: () => void;
  onChangeQuantity: (productId: string, quantity: number) => void;
};

function GiftSetCartDrawer({
  open,
  totalQuantity,
  subtotal,
  cartLines,
  onClose,
  onChangeQuantity,
}: GiftSetCartDrawerProps) {
  // No promo code here — applying a promo requires a phone number for
  // per-customer redemption limits, and phone is only collected on the
  // checkout page. See GiftSetCheckoutView for the actual promo entry/validation.
  const total = subtotal;
  const gstAmount = total * (GST_RATE / (1 + GST_RATE));

  const router = useRouter();

  const handleProceedToOrder = () => {
    const state: GiftSetCheckoutState = {
      items: cartLines.map((line) => {
        const variant = line.variantId
          ? line.product.variants?.find((v) => v.id === line.variantId)
          : undefined;

        return {
          productId: line.product.id,
          productName: line.product.name,
          productImage: line.product.image,
          productImagePosition: line.product.imagePosition,
          variantName: line.variantName,
          choiceLabels: line.choiceLabels,
          selections: line.selections,
          quantity: line.quantity,
          unitPrice: variant ? (variant.price ?? line.product.price) : line.product.price,
          lineTotal: line.lineTotal,
          itemNo: variant?.bcNumber ?? line.product.bcNumber,
        };
      }),
      subtotal,
    };
    sessionStorage.setItem(GIFT_SET_CHECKOUT_KEY, JSON.stringify(state));
    onClose();
    router.push('/baby-full-month-gift-set/checkout');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}
    >
      <Stack sx={{ height: 1 }}>
        {/* Header */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Box>
            <Typography variant="h6">Cart</Typography>
            <Typography variant="body2" color="text.secondary">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </Typography>
          </Box>
          <IconButton aria-label="Close cart" onClick={onClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>

        {/* Line items */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2.5, py: 3 }}>
          {cartLines.length === 0 ? (
            <GiftSetEmptyContent compact />
          ) : (
            <Stack spacing={2.25}>
              {cartLines.map((item) => (
                <Box key={item.product.id}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        flexShrink: 0,
                        overflow: 'hidden',
                        borderRadius: 1.5,
                        position: 'relative',
                        bgcolor: 'grey.100',
                      }}
                    >
                      <Image
                        fill
                        alt={item.product.alt}
                        src={item.product.image}
                        sizes="72px"
                        style={{ objectFit: 'cover', objectPosition: item.product.imagePosition }}
                      />
                    </Box>

                    <Stack spacing={1} sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Box>
                        <Typography variant="subtitle2">{item.product.name}</Typography>
                        {item.variantName && (
                          <Typography variant="body2" color="primary.main">
                            {item.variantName}
                          </Typography>
                        )}
                        {item.choiceLabels?.map((label) => (
                          <Typography key={label} variant="body2" color="text.secondary">
                            {label}
                          </Typography>
                        ))}
                        <Typography variant="body2" color="text.secondary">
                          {money.format(item.product.price)} each
                        </Typography>
                      </Box>

                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <QuantityControl
                          productName={item.product.name}
                          quantity={item.quantity}
                          onDecrease={() => {
                            const min = item.product.minQty ?? 1;
                            onChangeQuantity(item.product.id, item.quantity === min ? 0 : item.quantity - 1);
                          }}
                          onIncrease={() => onChangeQuantity(item.product.id, item.quantity + 1)}
                        />
                        <Typography variant="subtitle2">{money.format(item.lineTotal)}</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Divider sx={{ mt: 2.25 }} />
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack spacing={2}>
            {/* Pricing breakdown */}
            <Stack spacing={1}>
              <CartSummaryRow label="Subtotal" value={money.format(subtotal)} />
              <CartSummaryRow label="GST (9% incl.)" value={money.format(gstAmount)} />
              <Divider />
              <CartSummaryRow label="Total" value={money.format(total)} bold />
            </Stack>

            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={cartLines.length === 0}
              onClick={handleProceedToOrder}
              startIcon={<Iconify icon="solar:cart-3-bold" />}
            >
              Proceed to Order
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
}

type QuantityControlProps = {
  quantity: number;
  productName: string;
  onDecrease: () => void;
  onIncrease: () => void;
};

function QuantityControl({ quantity, productName, onDecrease, onIncrease }: QuantityControlProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <IconButton
        size="small"
        aria-label={`Decrease ${productName} quantity`}
        onClick={onDecrease}
        sx={{ width: 36, height: 36, borderRadius: 0 }}
      >
        <Iconify icon="eva:minus-circle-fill" width={16} />
      </IconButton>

      <Typography
        variant="subtitle2"
        sx={{
          minWidth: 40,
          textAlign: 'center',
          lineHeight: '36px',
          borderLeft: '1px solid',
          borderRight: '1px solid',
          borderColor: 'divider',
          px: 1,
        }}
      >
        {quantity}
      </Typography>

      <IconButton
        size="small"
        aria-label={`Increase ${productName} quantity`}
        onClick={onIncrease}
        sx={{ width: 36, height: 36, borderRadius: 0 }}
      >
        <Iconify icon="mingcute:add-line" width={16} />
      </IconButton>
    </Stack>
  );
}

function GiftSetFoodItemRow({ item, showDivider }: { item: GiftSetFoodItem; showDivider?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      {showDivider && <Divider />}
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ cursor: item.description ? 'pointer' : 'default', px: 2, py: 1.5 }}
        onClick={() => item.description && setOpen((prev) => !prev)}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: 'text.primary',
            flexShrink: 0,
          }}
        />
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {item.name}
        </Typography>
        {item.quantity && (
          <Box
            sx={{
              px: 1.25,
              py: 0.25,
              borderRadius: 99,
              bgcolor: 'grey.100',
              flexShrink: 0,
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {item.quantity}
            </Typography>
          </Box>
        )}
        {item.description && (
          <Iconify
            icon="eva:chevron-down-fill"
            width={16}
            color="text.secondary"
            sx={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        )}
      </Stack>
      {item.description && (
        <Collapse in={open}>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 4.5, pr: 2, pb: 1.5 }}>
            {item.description}
          </Typography>
        </Collapse>
      )}
    </Box>
  );
}

function GiftSetEmptyContent({ compact = false }: { compact?: boolean }) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        py: compact ? 6 : 10,
        px: 3,
        borderRadius: 2,
        bgcolor: compact ? 'transparent' : 'background.neutral',
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.disabled',
          bgcolor: 'background.paper',
          boxShadow: compact ? 'none' : 1,
        }}
      >
        <Iconify icon="solar:cart-3-bold" width={32} />
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6">{compact ? 'Your cart is empty' : 'No gift sets'}</Typography>
        <Typography variant="body2" color="text.secondary">
          {compact
            ? 'Add a gift set to build your order.'
            : 'Gift sets are not available right now.'}
        </Typography>
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

const SECTION_LABEL_SX = {
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  fontSize: 11,
  color: 'text.secondary',
  display: 'block',
};

type GiftSetProductDetailDialogProps = {
  product: GiftSetProduct | null;
  quantity: number;
  minQty: number;
  variantId?: string;
  choices?: Record<string, string>;
  personalisedTexts?: Record<string, string>;
  onClose: () => void;
  onAddToCart: (
    variantId?: string,
    choices?: Record<string, string>,
    qty?: number,
    personalisedTexts?: Record<string, string>
  ) => void;
};

function sanitiseText(raw: string): string {
  return raw.replace(/[<>]/g, '').slice(0, 150);
}

function GiftSetProductDetailDialog({
  product,
  quantity,
  minQty,
  variantId: cartVariantId,
  choices: cartChoices,
  personalisedTexts: cartPersonalisedTexts,
  onClose,
  onAddToCart,
}: GiftSetProductDetailDialogProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(cartVariantId);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>(cartChoices ?? {});
  const [localQty, setLocalQty] = useState(Math.max(quantity || 0, minQty));
  const [personalisedTexts, setPersonalisedTexts] = useState<Record<string, string>>(cartPersonalisedTexts ?? {});
  const [personalisedErrors, setPersonalisedErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedVariantId(cartVariantId);
    setSelectedChoices(cartChoices ?? {});
    setLocalQty(Math.max(quantity || 0, minQty));
    setPersonalisedTexts(cartPersonalisedTexts ?? {});
    setPersonalisedErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const hasVariants = !!product?.variants?.length;
  const selectedVariant = product?.variants?.find((v) => v.id === selectedVariantId);

  const allVariantChoices = useMemo(() => {
    if (!selectedVariant) return [];
    const seen = new Set<string>();
    return [
      ...(selectedVariant.choices ?? []),
      ...selectedVariant.items.flatMap((i) => i.choices ?? []),
    ].filter((choice) => {
      if (seen.has(choice.id)) return false;
      seen.add(choice.id);
      return true;
    });
  }, [selectedVariant]);

  const productChoices = product?.choices ?? [];
  const allChoices = [...allVariantChoices, ...productChoices];
  const allChoicesMade = allChoices.every((choice) => !!selectedChoices[choice.id]);

  const personalisedChoiceIds = allChoices
    .filter((c) => selectedChoices[c.id] === 'personalised')
    .map((c) => c.id);
  const allPersonalisedFilled = personalisedChoiceIds.every(
    (id) => (personalisedTexts[id] ?? '').trim().length > 0
  );

  const canAddToCart = (!hasVariants || !!selectedVariantId) && allChoicesMade && allPersonalisedFilled;
  const showCustomisation = allChoices.length > 0 && (!hasVariants || !!selectedVariantId);
  const showWarning = showCustomisation && (!allChoicesMade || !allPersonalisedFilled);

  const unitPrice = selectedVariant?.price ?? product?.price ?? 0;
  const totalPrice = localQty * unitPrice;

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId);
    setSelectedChoices({});
  };

  const handleChoiceChange = (choiceId: string, optionId: string) => {
    setSelectedChoices((prev) => ({ ...prev, [choiceId]: optionId }));
  };

  const productBaseName = product
    ? product.name.includes(' (')
      ? product.name.slice(0, product.name.indexOf(' ('))
      : product.name
    : '';
  const productCategorySuffix = product
    ? product.name.includes(' (')
      ? product.name.slice(product.name.indexOf(' ('))
      : null
    : null;

  const itemsToShow = selectedVariant?.items ?? (hasVariants ? [] : product?.items ?? []);

  return (
    <Dialog
      open={!!product}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2 },
          maxHeight: { xs: 'calc(100dvh - 16px)', sm: '90dvh' },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {product && (
        <DialogContent
          sx={{
            p: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          {/* Scrollable content */}
          <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
            {/* Image with overlaid chips */}
            <Box sx={{ position: 'relative', aspectRatio: '4/3', bgcolor: 'grey.100' }}>
              <Image
                fill
                alt={product.alt}
                src={product.image}
                sizes="(min-width: 600px) 480px, 100vw"
                style={{ objectFit: 'cover', objectPosition: product.imagePosition }}
              />

              {/* Category pill — top left */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 99,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
                <Typography sx={{ ...SECTION_LABEL_SX, color: 'text.primary', display: 'inline' }}>
                  {product.category}
                </Typography>
              </Stack>

              {/* Close button — top right */}
              <IconButton
                onClick={onClose}
                aria-label="Close"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper', opacity: 0.9 },
                }}
              >
                <Iconify icon="mingcute:close-line" width={18} />
              </IconButton>
            </Box>

            {/* Content */}
            <Stack spacing={2.5} sx={{ p: 2.5, pb: 2 }}>
              {/* Name + description */}
              <Box>
                <Typography variant="h5" sx={{ lineHeight: 1.3 }}>
                  {productBaseName}
                  {productCategorySuffix && (
                    <Box component="span" sx={{ color: 'text.secondary' }}>
                      {' '}{productCategorySuffix}
                    </Box>
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {product.description}
                </Typography>
              </Box>

              {/* Choose your set */}
              {hasVariants && (
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1.5 }}
                  >
                    <Typography variant="caption" sx={SECTION_LABEL_SX}>
                      Choose your set
                    </Typography>
                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                      {money.format(unitPrice)} each
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {product.variants!.map((variant) => {
                      const active = selectedVariantId === variant.id;
                      return (
                        <Button
                          key={variant.id}
                          size="small"
                          color="primary"
                          variant={active ? 'contained' : 'outlined'}
                          onClick={() => handleVariantSelect(variant.id)}
                          sx={{ borderRadius: 99 }}
                        >
                          {variant.name}
                        </Button>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {/* What's included */}
              {(itemsToShow.length > 0 || (!hasVariants && !!product.contents?.length)) && (
                <Box>
                  <Typography variant="caption" sx={{ ...SECTION_LABEL_SX, mb: 1.5 }}>
                    What&apos;s included
                  </Typography>

                  {itemsToShow.length > 0 ? (
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      {itemsToShow.map((item, index) => (
                        <GiftSetFoodItemRow key={item.name} item={item} showDivider={index > 0} />
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      {(product.contents ?? []).map((text, index) => (
                        <Box key={text}>
                          {index > 0 && <Divider />}
                          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 2, py: 1.5 }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'text.primary', flexShrink: 0 }} />
                            <Typography variant="body2">{text}</Typography>
                          </Stack>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {/* Customisation */}
              {showCustomisation && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1.5px solid',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                    borderColor: allChoicesMade
                      ? 'primary.main'
                      : 'divider',
                  }}
                >
                  <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                      Customisation
                    </Typography>
                    {!allChoicesMade && (
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.4,
                          borderRadius: 99,
                          bgcolor: 'warning.lighter',
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          sx={{ fontSize: 11, color: 'warning.dark' }}
                        >
                          Required
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  <Stack spacing={2}>
                    {allChoices.map((choice) => (
                      <Box key={choice.id}>
                        <Typography variant="caption" sx={{ ...SECTION_LABEL_SX, mb: 1 }}>
                          {choice.label}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {choice.options.map((option) => {
                            const isSelected = selectedChoices[choice.id] === option.id;
                            return (
                              <Button
                                key={option.id}
                                size="small"
                                color="primary"
                                variant={isSelected ? 'contained' : 'outlined'}
                                onClick={() => handleChoiceChange(choice.id, option.id)}
                                sx={{ borderRadius: 99, px: 2 }}
                              >
                                {option.label}
                              </Button>
                            );
                          })}
                        </Stack>

                        {selectedChoices[choice.id] === 'personalised' && (
                          <TextField
                            fullWidth
                            size="small"
                            sx={{ mt: 1.5 }}
                            label="Your personalised message"
                            placeholder="e.g. Welcome, Baby Emma!"
                            value={personalisedTexts[choice.id] ?? ''}
                            error={!!personalisedErrors[choice.id]}
                            helperText={
                              personalisedErrors[choice.id] ||
                              `${(personalisedTexts[choice.id] ?? '').length} / 150 characters`
                            }
                            slotProps={{ htmlInput: { maxLength: 150 } }}
                            onChange={(e) => {
                              const clean = sanitiseText(e.target.value);
                              setPersonalisedTexts((prev) => ({ ...prev, [choice.id]: clean }));
                              if (personalisedErrors[choice.id]) {
                                setPersonalisedErrors((prev) => ({ ...prev, [choice.id]: '' }));
                              }
                            }}
                            onBlur={() => {
                              if (!(personalisedTexts[choice.id] ?? '').trim()) {
                                setPersonalisedErrors((prev) => ({
                                  ...prev,
                                  [choice.id]: 'Please enter your personalised message.',
                                }));
                              }
                            }}
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Sticky bottom bar */}
          <Box sx={{ flexShrink: 0, borderTop: '1px solid', borderColor: 'divider' }}>
            {/* Warning banner */}
            {showWarning && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  px: 2.5,
                  py: 1.25,
                  bgcolor: 'warning.lighter',
                  borderBottom: '1px solid',
                  borderColor: 'warning.light',
                }}
              >
                <Iconify icon="eva:info-outline" width={16} color="warning.main" sx={{ flexShrink: 0 }} />
                <Typography variant="caption" color="warning.dark">
                  Please complete all customisations above to add to cart.
                </Typography>
              </Stack>
            )}

            <Box sx={{ px: 2.5, pt: 2, pb: 2.5 }}>
              {/* Price + quantity row */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1.75 }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {money.format(totalPrice)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {money.format(unitPrice)} each · incl. GST
                  </Typography>
                </Box>

                <QuantityControl
                  productName={product.name}
                  quantity={localQty}
                  onDecrease={() => setLocalQty((q) => Math.max(minQty, q - 1))}
                  onIncrease={() => setLocalQty((q) => q + 1)}
                />
              </Stack>

              {/* Add to cart button */}
              <Button
                fullWidth
                size="large"
                variant="contained"
                disabled={!canAddToCart}
                onClick={() => {
                  onAddToCart(selectedVariantId, selectedChoices, localQty, personalisedTexts);
                  onClose();
                }}
                startIcon={<Iconify icon="solar:cart-3-bold" />}
              >
                Add to cart
              </Button>

              {/* Minimum order note */}
              {minQty > 1 && (
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1.25 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: '1.5px solid',
                      borderColor: 'text.disabled',
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Minimum order {minQty} pcs
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
}
