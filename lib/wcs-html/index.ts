import {parseFragment, serialize} from 'parse5';

export type WcsHtmlCompileResult = {
  authorToken: string;
  validation: boolean;
  sanitized: boolean;
  strings: TemplateStringsArray;
  values: unknown[] | null;
  fragment: DocumentFragment | null;
  dependencies: unknown[] | null;
}

const AUTHOR_TOKEN = `WCS__${Math.random().toString().slice(12)}`;

const initResult = (strings: TemplateStringsArray, ...values: unknown[]): WcsHtmlCompileResult => {
  return {
    authorToken: AUTHOR_TOKEN,
    validation: false,
    sanitized: false,
    strings,
    values,
    fragment: null,
    dependencies: null
  };
};

const validateAuthor = (token: string) => {
  return token == AUTHOR_TOKEN;
};

export const html = (strings: TemplateStringsArray, ...values: unknown[]) => {
  const result = initResult(strings, values);
  validateAuthor(result.authorToken);
  const _htmlString = strings.flatMap((str, idx) => [str, values[idx] ?? '']).join('').trim();
  const _fragment = parseFragment(_htmlString);
  const template = document.createElement('template');
  template.innerHTML = serialize(_fragment);
  return {
    ...result,
    fragment: template.content,
  } as WcsHtmlCompileResult;
};
