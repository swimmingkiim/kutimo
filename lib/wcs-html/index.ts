import { parseFragment, serialize } from 'parse5';

export type WCSFunctionName = string;

export type WCSHtmlCompileResult = {
    authorToken: string;
    validation: boolean;
    sanitized: boolean;
    strings: TemplateStringsArray;
    values: unknown[] | null;
    fragment: DocumentFragment | null;
    dependencies: string[],
    eventCallback: {
        [eventName: string]: {
            [name: WCSFunctionName]: Function;
        }
    };
}

const AUTHOR_TOKEN = `WCS__${Math.random().toString().slice(12)}`;

const initResult = (strings: TemplateStringsArray, ...values: unknown[]): WCSHtmlCompileResult => {
    return {
        authorToken: AUTHOR_TOKEN,
        validation: false,
        sanitized: false,
        strings,
        values,
        fragment: null,
        dependencies: [],
        eventCallback: {
            "__unknown": {}
        }
    };
};

const validateAuthor = (token: string) => {
    return token == AUTHOR_TOKEN;
};

export const html = (strings: TemplateStringsArray, ...values: unknown[]) => (state: { [name: string]: any }) => {
    const result = initResult(strings, values);
    validateAuthor(result.authorToken);
    const _htmlString = strings.flatMap((str, idx) => {
        let callbackName: string = values[idx] !== undefined ? values[idx].toString() : "";
        const eventMatch = str.match(/(on:)(\w+)(?!.*\1)/g);
        if (values[idx] instanceof Function) {
            callbackName = (values[idx] as Function).name;
            if (!(`${eventMatch}` in result.eventCallback)) {
                result.eventCallback[`${eventMatch}`] = {};
            }
            result.eventCallback[`${eventMatch ?? "__unknown"}`][callbackName] = values[idx] as Function;
        }
        const variables = str.match(/\{\{\s*this\.state\.[a-zA-Z.]+\s*\}\}/g)?.map((str) => str.replace(/[\{\}\s]|this\.state\./g, "")) ?? [];
        let replacedString = str;
        replacedString = replacedString.replace(/\{\{\s*this\.state\.[a-zA-Z.]+\s*\}\}/g, (_) => {
            const key = variables[0];
            variables.unshift();
            return state[key];
        });
        return [replacedString, callbackName];
    }).join('').trim();
    const _fragment = parseFragment(_htmlString);
    const template = document.createElement('template');
    template.innerHTML = serialize(_fragment);
    return {
        ...result,
        fragment: template.content,
    } as WCSHtmlCompileResult;
};
