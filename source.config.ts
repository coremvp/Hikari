import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';

export const docs = defineDocs({ dir: 'src/content/docs' });
export const blog = defineDocs({
  dir: 'src/content/blogs',
  docs: {
    schema: frontmatterSchema.extend({
      title: z.string().min(1),
      description: z.string().min(1),
      date: z.coerce.date().transform((date) => date.toISOString()),
      author: z.string().min(1),
      index: z.boolean(),
    }),
  },
});
export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
