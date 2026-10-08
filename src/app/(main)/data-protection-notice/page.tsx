import { LegalDocumentView, dataProtectionNotice } from 'src/sections/legal';

// ----------------------------------------------------------------------

export const dynamic = 'force-static';
export const metadata = { title: 'Data Protection Notice' };

export default function DataProtectionNoticePage() {
  return <LegalDocumentView doc={dataProtectionNotice} />;
}
