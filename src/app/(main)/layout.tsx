import { MainLayout } from 'src/layouts/main';

// ----------------------------------------------------------------------

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
