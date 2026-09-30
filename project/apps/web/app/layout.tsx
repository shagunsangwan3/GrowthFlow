import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GrowthFlow — The Future of AI-Powered Growth',
  description:
    'GrowthFlow is an AI-powered Growth Operating Platform that helps businesses plan, launch, optimize, automate, and scale digital marketing campaigns.',
  applicationName: 'GrowthFlow',
  authors: [{ name: 'GrowthFlow' }],
  keywords: [
    'AI marketing',
    'Google Ads',
    'growth platform',
    'marketing automation',
    'ROAS',
  ],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0a0e1a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
