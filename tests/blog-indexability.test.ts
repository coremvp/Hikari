import { expect, test } from 'bun:test';
import { filterIndexableBlogPages } from '@/lib/blog-indexability';

test('Blog discovery includes only explicitly published articles', () => {
  const published = { data: { index: true } };
  expect(
    filterIndexableBlogPages([
      published,
      { data: { index: false } },
      { data: {} },
    ]),
  ).toEqual([published]);
});
