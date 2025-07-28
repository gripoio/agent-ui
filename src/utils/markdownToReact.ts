import {
  Element,
  ElementContent,
  Nodes,
  Parents,
  Root,
} from 'hast';
import { Root as MdastRoot } from 'mdast';
import { ComponentProps, ElementType, ReactElement } from 'react';
import { Options as RemarkRehypeOptions } from 'remark-rehype';
import { PluggableList, Processor, unified } from 'unified';
import { VFile } from 'vfile';

function unreachable(message: string): never {
  throw new Error(message);
}
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { urlAttributes } from 'html-url-attributes';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { createElement, useEffect, useState } from 'react';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { visit } from 'unist-util-visit';

// Types
export type AllowElement = (
  element: Readonly<Element>,
  index: number,
  parent: Readonly<Parents> | undefined
) => boolean | null | undefined;

export type ExtraProps = {
  node?: Element;
};

export type Components = {
  [Key in Extract<ElementType, string>]?: ElementType<ComponentProps<Key> & ExtraProps>;
};

export type Deprecation = {
  from: string;
  id: string;
  to?: keyof Options;
};

export type UrlTransform = (
  url: string,
  key: string,
  node: Readonly<Element>
) => string | null | undefined;

export type Options = {
  allowElement?: AllowElement | null;
  allowedElements?: ReadonlyArray<string> | null;
  children?: string | null;
  className?: string | null;
  components?: Components | null;
  disallowedElements?: ReadonlyArray<string> | null;
  rehypePlugins?: PluggableList | null;
  remarkPlugins?: PluggableList | null;
  remarkRehypeOptions?: Readonly<RemarkRehypeOptions> | null;
  skipHtml?: boolean | null;
  unwrapDisallowed?: boolean | null;
  urlTransform?: UrlTransform | null;
};

const changelog =
  'https://github.com/remarkjs/react-markdown/blob/main/changelog.md';

const emptyPlugins: PluggableList = [];
const emptyRemarkRehypeOptions: Readonly<RemarkRehypeOptions> = {
  allowDangerousHtml: true,
};
const safeProtocol = /^(https?|ircs?|mailto|xmpp)$/i;

const deprecations: ReadonlyArray<Readonly<Deprecation>> = [
  { from: 'astPlugins', id: 'remove-buggy-html-in-markdown-parser' },
  { from: 'allowDangerousHtml', id: 'remove-buggy-html-in-markdown-parser' },
  {
    from: 'allowNode',
    id: 'replace-allownode-allowedtypes-and-disallowedtypes',
    to: 'allowElement',
  },
  {
    from: 'allowedTypes',
    id: 'replace-allownode-allowedtypes-and-disallowedtypes',
    to: 'allowedElements',
  },
  {
    from: 'disallowedTypes',
    id: 'replace-allownode-allowedtypes-and-disallowedtypes',
    to: 'disallowedElements',
  },
  { from: 'escapeHtml', id: 'remove-buggy-html-in-markdown-parser' },
  { from: 'includeElementIndex', id: '#remove-includeelementindex' },
  {
    from: 'includeNodeIndex',
    id: 'change-includenodeindex-to-includeelementindex',
  },
  { from: 'linkTarget', id: 'remove-linktarget' },
  { from: 'plugins', id: 'change-plugins-to-remarkplugins', to: 'remarkPlugins' },
  { from: 'rawSourcePos', id: '#remove-rawsourcepos' },
  { from: 'renderers', id: 'change-renderers-to-components', to: 'components' },
  { from: 'source', id: 'change-source-to-children', to: 'children' },
  { from: 'sourcePos', id: '#remove-sourcepos' },
  { from: 'transformImageUri', id: '#add-urltransform', to: 'urlTransform' },
  { from: 'transformLinkUri', id: '#add-urltransform', to: 'urlTransform' },
];

export function Markdown(options: Readonly<Options>): ReactElement {
  const processor = createProcessor(options);
  const file = createFile(options);
  return post(processor.runSync(processor.parse(file), file), options);
}

export async function MarkdownAsync(options: Readonly<Options>): Promise<ReactElement> {
  const processor = createProcessor(options);
  const file = createFile(options);
  const tree = await processor.run(processor.parse(file), file);
  return post(tree, options);
}

export function MarkdownHooks(options: Readonly<Options>): ReactElement {
  const processor = createProcessor(options);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [tree, setTree] = useState<Root | undefined>(undefined);

  useEffect(() => {
    const file = createFile(options);
    processor.run(processor.parse(file), file, (error, tree) => {
      setError(error);
      setTree(tree);
    });
  }, [
    options.children,
    options.rehypePlugins,
    options.remarkPlugins,
    options.remarkRehypeOptions,
  ]);

  if (error) throw error;
  return tree ? post(tree, options) : createElement(Fragment);
}

function createProcessor(
  options: Readonly<Options>
): Processor<MdastRoot, MdastRoot, Root, undefined, undefined> {
  const rehypePlugins = options.rehypePlugins || emptyPlugins;
  const remarkPlugins = options.remarkPlugins || emptyPlugins;
  const remarkRehypeOptions = options.remarkRehypeOptions
    ? { ...options.remarkRehypeOptions, ...emptyRemarkRehypeOptions }
    : emptyRemarkRehypeOptions;

  return unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, remarkRehypeOptions)
    .use(rehypePlugins);
}

function createFile(options: Readonly<Options>): VFile {
  const children = options.children || '';
  const file = new VFile();

  if (typeof children === 'string') {
    file.value = children;
  } else {
    unreachable(
      'Unexpected value `' +
        children +
        '` for `children` prop, expected `string`'
    );
  }

  return file;
}

function post(tree: Nodes, options: Readonly<Options>): ReactElement {
  const {
    allowedElements,
    allowElement,
    components,
    disallowedElements,
    skipHtml,
    unwrapDisallowed,
    urlTransform = defaultUrlTransform,
  } = options;

  for (const deprecation of deprecations) {
    if (Object.hasOwn(options, deprecation.from)) {
      unreachable(
        `Unexpected \`${deprecation.from}\` prop, ` +
          (deprecation.to
            ? `use \`${deprecation.to}\` instead`
            : 'remove it') +
          ` (see <${changelog}#${deprecation.id}> for more info)`
      );
    }
  }

  if (allowedElements && disallowedElements) {
    unreachable(
      'Unexpected combined `allowedElements` and `disallowedElements`, expected one or the other'
    );
  }

 if (options.className) {
  const elementChildren = tree.type === 'root' 
    ? tree.children.filter((child): child is ElementContent => 
        child.type !== 'doctype' // Filter out doctype and other root-only nodes
      )
    : [tree as ElementContent]; // Cast tree itself to ElementContent

  tree = {
    type: 'element',
    tagName: 'div',
    properties: { className: options.className },
    children: elementChildren,
  };
}

  visit(tree, transform);

  return toJsxRuntime(tree, {
    Fragment,
    components: components as any,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true,
  });

  function transform(node: any, index: number | undefined, parent: any) {
    if (node.type === 'raw' && parent && typeof index === 'number') {
      if (skipHtml) {
        parent.children.splice(index, 1);
      } else {
        parent.children[index] = { type: 'text', value: node.value };
      }
      return index;
    }

    if (node.type === 'element') {
      for (const key in urlAttributes) {
        if (
          Object.hasOwn(urlAttributes, key) &&
          Object.hasOwn(node.properties, key)
        ) {
          const value = node.properties[key];
          const test = urlAttributes[key];
          if (test === null || test.includes(node.tagName)) {
            node.properties[key] = urlTransform
              ? urlTransform(String(value || ''), key, node)
              : String(value || '');
          }
        }
      }

      let remove = allowedElements
        ? !allowedElements.includes(node.tagName)
        : disallowedElements
          ? disallowedElements.includes(node.tagName)
          : false;

      if (!remove && allowElement && typeof index === 'number') {
        remove = !allowElement(node, index, parent);
      }

      if (remove && parent && typeof index === 'number') {
        if (unwrapDisallowed && node.children) {
          parent.children.splice(index, 1, ...node.children);
        } else {
          parent.children.splice(index, 1);
        }
        return index;
      }
    }
  }
}

export function defaultUrlTransform(value: string): string {
  const colon = value.indexOf(':');
  const questionMark = value.indexOf('?');
  const numberSign = value.indexOf('#');
  const slash = value.indexOf('/');

  if (
    colon === -1 ||
    (slash !== -1 && colon > slash) ||
    (questionMark !== -1 && colon > questionMark) ||
    (numberSign !== -1 && colon > numberSign) ||
    safeProtocol.test(value.slice(0, colon))
  ) {
    return value;
  }

  return '';
}
