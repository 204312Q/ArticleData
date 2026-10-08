import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { isPayLabEnabled } from 'src/lib/paylab/enabled';

import { PayLabView } from './paylab-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Payment Lab — internal',
  robots: { index: false, follow: false },
};

// Evaluate the gate per request rather than baking it into a prerendered page,
// so toggling ENABLE_PAY_LAB takes effect without a rebuild.
export const dynamic = 'force-dynamic';

export default function PayLabPage() {
  // Gate 1. Gates 2 and 3 (Entra ID session, allow-list) run in middleware
  // before this ever executes. Without ENABLE_PAY_LAB the route does not exist,
  // which is what makes an accidental merge to main harmless.
  if (!isPayLabEnabled()) {
    notFound();
  }

  return <PayLabView />;
}
