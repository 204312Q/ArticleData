import { buildChecklistPdf } from 'src/sections/confinement-checklist/checklist-pdf';
import { CHECKLIST_ITEM_COUNT } from 'src/sections/confinement-checklist/checklist-data';

// ----------------------------------------------------------------------

export const runtime = 'nodejs';

function pdfResponse(pdf: Uint8Array) {
  return new Response(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="confinement-checklist.pdf"',
      'Cache-Control': 'private, no-store',
    },
  });
}

// Blank checklist (plain link / no JavaScript).
export async function GET() {
  return pdfResponse(await buildChecklistPdf());
}

// Checklist with the visitor's ticks. Only the tick states are accepted; no
// text input is read, stored or logged.
export async function POST(request: Request) {
  let body: { done?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid request', { status: 400 });
  }

  const ticks = Array.isArray(body.done) ? body.done : [];
  const done = Array.from({ length: CHECKLIST_ITEM_COUNT }, (_, i) => ticks[i] === true);

  return pdfResponse(await buildChecklistPdf({ done }));
}
