'use client';
import { useState } from 'react';
import { request } from '@/lib/client';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export function Logout({
  variant = 'button',
}: {
  variant?: 'button' | 'menu';
}) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function signOut() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await request('/auth/logout', {});
      window.location.assign(new URL('/signin', window.location.origin).href);
    } catch {
      setError('Could not sign out. Please try again.');
      setBusy(false);
    }
  }
  if (variant === 'menu') {
    return (
      <>
        <DropdownMenuItem
          disabled={busy}
          onSelect={(event) => {
            event.preventDefault();
            void signOut();
          }}
        >
          <LogOut aria-hidden="true" />
          {busy ? 'Signing out…' : 'Sign out'}
        </DropdownMenuItem>
        {error && (
          <p role="alert" className="px-2 py-1.5 text-sm text-destructive">
            {error}
          </p>
        )}
      </>
    );
  }
  return (
    <div>
      <Button variant="outline" disabled={busy} onClick={signOut}>
        {busy ? 'Signing out…' : 'Sign out'}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
