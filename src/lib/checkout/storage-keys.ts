// Plain string constants only — no React/MUI/component imports here. This
// module gets imported by src/sections/order-success/order-success-view.tsx
// specifically so that page doesn't pull in the entire product/giftbox
// checkout view bundles just to read a sessionStorage key name.
export const ORDER_DRAFT_STORAGE_KEY = "cp_confinement_order_draft"
export const GIFTBOX_ORDER_DRAFT_KEY = "giftboxOrderDraft"
export const GIFT_SET_CHECKOUT_KEY = "giftSetCheckout"
export const GIFT_SET_CART_KEY = "giftSetCart"
