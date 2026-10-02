'use client';
import { RootProvider } from 'fumadocs-ui/provider/next';

export function DocsProvider({ children }: { children: React.ReactNode }) {
  return <RootProvider theme={{ enabled: false }}>{children}</RootProvider>;
}
