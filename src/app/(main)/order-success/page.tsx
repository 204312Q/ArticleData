import type { Metadata } from 'next';

import { OrderSuccessView } from 'src/sections/order-success/order-success-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Order Confirmed',
};

export default function OrderSuccessPage() {
  return <OrderSuccessView />;
}
