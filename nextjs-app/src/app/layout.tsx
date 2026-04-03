import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
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
      <body className="h-full flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <TopBar />
          <main className="flex-1 bg-[#F8F9FC]">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
