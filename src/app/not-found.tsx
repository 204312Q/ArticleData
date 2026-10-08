import { MainLayout } from 'src/layouts/main';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export const metadata = { title: 'Page Not Found' };

export default function Page() {
  return (
    <MainLayout>
      <NotFoundView />
    </MainLayout>
  );
}
