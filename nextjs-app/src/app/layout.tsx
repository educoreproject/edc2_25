import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-white flex flex-col font-[family-name:var(--font-inter)]">
        <SiteHeader />
        <main className="flex-1 bg-slate-50/50">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
