import { z } from 'zod';
export async function request(path: string, body?: unknown): Promise<unknown> {
  const response = await fetch('/api' + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });
  const data: unknown = await response.json();
  if (!response.ok) {
    const parsed = z.object({ error: z.string() }).safeParse(data);
    throw new Error(
      parsed.success
        ? parsed.data.error
        : 'Please check your details and try again.',
    );
  }
  return data;
}
