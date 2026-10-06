import { handle } from 'hono/vercel';
import { api } from '@/api/app';
export const runtime = 'nodejs';
export const maxDuration = 60;
export const GET = handle(api);
export const POST = handle(api);
