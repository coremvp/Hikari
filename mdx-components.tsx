import defaultComponents from 'fumadocs-ui/mdx';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return { ...defaultComponents, Step, Steps, ...components };
}
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}
