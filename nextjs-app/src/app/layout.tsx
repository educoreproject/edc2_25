import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'EDUcore Reference Library',
  description: 'AI-driven standards library for education data interoperability',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#F8F9FC] flex flex-col" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
