import { expect } from '@playwright/test';
const origin = 'http://127.0.0.1:55424';
export async function localEmailLink(email: string) {
  let link: string | undefined;
  await expect
    .poll(
      async () => {
        const response = await fetch(origin + '/api/v1/messages');
        const data = (await response.json()) as {
          messages: { ID: string; To: { Address: string }[] }[];
        };
        for (const message of data.messages || []) {
          if (!message.To.some((to) => to.Address === email)) continue;
          const full = (await (
            await fetch(origin + '/api/v1/message/' + message.ID)
          ).json()) as { HTML: string };
          const match = full.HTML.match(/href="([^"]+)"/g)?.find((value) =>
            value.includes('type=recovery'),
          );
          if (match) {
            link = match.slice(6, -1).replaceAll('&amp;', '&');
            return true;
          }
        }
        return false;
      },
      { timeout: 20000 },
    )
    .toBe(true);
  if (!link) throw new Error('Local recovery email did not arrive.');
  return link;
}
