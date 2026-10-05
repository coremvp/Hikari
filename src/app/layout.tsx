import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';
const geist = Geist({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: { default: 'Hikari by CoreMVP', template: '%s | Hikari' },
  description: "CoreMVP's open-source Next.js application foundation.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
