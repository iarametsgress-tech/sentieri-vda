import PageTransition from '@/components/PageTransition';

export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
