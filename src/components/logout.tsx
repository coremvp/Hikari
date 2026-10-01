'use client';
import { useState } from 'react';
import { request } from '@/lib/client';
export function Logout() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <button
        className="button-secondary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await request('/auth/logout', {});
            window.location.assign(
              new URL('/signin', window.location.origin).href,
            );
          } catch {
            setError('Could not sign out. Please try again.');
            setBusy(false);
          }
        }}
      >
        {busy ? 'Signing out…' : 'Sign out'}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
