import { chmod, mkdir } from 'node:fs/promises';
const names = [
  'APP_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'DATABASE_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_ID',
  'STRIPE_PRO_PRICE_ID',
  'STRIPE_BUSINESS_PRICE_ID',
];
const args = process.argv.slice(2);
function run(command: string[]) {
  const child = Bun.spawn(command, {
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });
  return child.exited;
}
if (args.join(' ') === 'env list') {
  for (const name of names)
    console.log(name + ': ' + (process.env[name] ? 'set' : 'missing'));
} else if (args.join(' ') === 'env sync') {
  const child = Bun.spawn(
    ['bunx', '--no-install', 'supabase', 'status', '--output', 'json'],
    { stdout: 'pipe', stderr: 'pipe' },
  );
  const timeout = setTimeout(() => child.kill(), 30000);
  const [raw, , code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  clearTimeout(timeout);
  if (code !== 0)
    throw new Error(
      'Local Supabase is unavailable. Run bunx supabase start first.',
    );
  const status = JSON.parse(raw) as Record<string, string>;
  const derived = {
    APP_URL: 'http://localhost:3000',
    NEXT_PUBLIC_SUPABASE_URL: status.API_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      status.PUBLISHABLE_KEY || status.ANON_KEY,
    DATABASE_URL: status.DB_URL,
  };
  if (Object.values(derived).some((value) => !value))
    throw new Error('Supabase status is missing required environment fields.');
  for (const value of [derived.NEXT_PUBLIC_SUPABASE_URL, derived.DATABASE_URL])
    if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(value).hostname))
      throw new Error('env sync supports local Supabase only.');
  const file = Bun.file('.env.local');
  let text = (await file.exists())
    ? await file.text()
    : await Bun.file('.env.example').text();
  for (const [name, value] of Object.entries(derived)) {
    if (name === 'APP_URL' && /^APP_URL=.+$/m.test(text)) continue;
    const line = name + '=' + value;
    const pattern = new RegExp('^' + name + '=.*$', 'm');
    text = pattern.test(text)
      ? text.replace(pattern, () => line)
      : text + '\n' + line + '\n';
  }
  await Bun.write('.env.local', text);
  await chmod('.env.local', 0o600);
  console.log(
    'Updated local application environment. Existing Stripe settings were preserved.',
  );
} else if (
  args[0] === 'e2e' &&
  args.length === 2 &&
  ['auth', 'billing:subscription'].includes(args[1])
) {
  await mkdir('tmp/e2e', { recursive: true });
  process.exitCode = await run([
    'bunx',
    '--no-install',
    'playwright',
    'test',
    args[1] === 'auth' ? 'auth.spec.ts' : 'subscription.spec.ts',
  ]);
} else if (
  args.slice(0, 3).join(' ') === 'prod e2e smoke' &&
  args.length === 4
) {
  const url = new URL(args[3]);
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  )
    throw new Error('Provide the HTTPS application origin.');
  const home = await fetch(url, {
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  });
  if (!home.ok || !(await home.text()).includes('Hikari'))
    throw new Error('Application page failed.');
  const health = await fetch(new URL('/api/health', url), {
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  });
  const data = (await health.json()) as { status?: string };
  if (!health.ok || data.status !== 'ok')
    throw new Error('Application health failed.');
  const account = await fetch(new URL('/api/account', url), {
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  });
  if (account.status !== 401)
    throw new Error('Anonymous account boundary failed.');
  console.log(
    'Hosted liveness and anonymous account rejection passed. Auth and billing provider journeys were not run.',
  );
} else {
  console.log(
    'Hikari commands:\n  ./coremvp env sync\n  ./coremvp env list\n  ./coremvp e2e auth\n  ./coremvp e2e billing:subscription\n  ./coremvp prod e2e smoke <url>',
  );
  if (args.length) process.exitCode = 1;
}
