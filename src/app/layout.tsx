// Root layout passes everything through to the locale layout.
// This file exists only because Next.js requires app/layout.tsx.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
