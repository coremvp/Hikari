export function filterIndexableBlogPages<
  T extends { data: { index?: boolean } },
>(pages: T[]): T[] {
  return pages.filter((page) => page.data.index === true);
}
