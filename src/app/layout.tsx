import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'Hikari by CoreMVP', template: '%s | Hikari' },
  description: "CoreMVP's open-source Next.js application foundation.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
