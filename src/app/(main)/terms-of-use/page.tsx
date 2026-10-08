import { termsOfUse, LegalDocumentView } from 'src/sections/legal';

// ----------------------------------------------------------------------

export const dynamic = 'force-static';
export const metadata = { title: 'Terms of Use' };

export default function TermsOfUsePage() {
  return <LegalDocumentView doc={termsOfUse} />;
}
