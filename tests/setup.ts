import { mock } from 'bun:test';
// Bun tests execute server modules outside the Next.js renderer.
mock.module('server-only', () => ({}));
