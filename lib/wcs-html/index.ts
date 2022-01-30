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

const findJSExpressions = (str: string) => str.match(/\{\{\s*.*?\s*\}\}/g);

const compileJSExpressions = (expressionArray: RegExpMatchArray, state: { [name: string]: any }, props: { [name: string]: any }): { oldStr: string, newStr: string }[] => {
    return expressionArray.map((jsExpression: string) => {
        let newJSExpression = jsExpression;
        newJSExpression = newJSExpression.replace(/this\.state\.[a-zA-Z.]+/g, (char) => {
            const key = char.replace("this.state.", "");
            return typeof state[key] === "string" ? `"${state[key]}"` : state[key];
        });
        newJSExpression = newJSExpression.replace(/this\.props\.[a-zA-Z.]+/g, (char) => {
            const key = char.replace("this.props.", "");
            return typeof props[key] === "string" ? `"${props[key]}"` : props[key];
        });
        newJSExpression = newJSExpression.replace(/\{|\}/g, "");
        const jsResult = new Function(`return ${newJSExpression}`)();
        return {
            oldStr: jsExpression,
            newStr: jsResult,
        }
    });

}

const convertOldToNewExpressions = (originalStr: string, expressions: ReturnType<typeof compileJSExpressions>) => {
    let result = originalStr;
    expressions.forEach(({ oldStr, newStr }) => {
        result = result.replace(oldStr, newStr);
    })
    return result;
}

const concatHTMLStrings = (result: WCSHtmlCompileResult, state: { [name: string]: any }, props: { [name: string]: any }, strings: TemplateStringsArray, ...values: unknown[]) => {
    return strings.flatMap((str, idx) => {
        let callbackName: string = values[idx] !== undefined ? values[idx].toString() : "";
        const eventMatch = str.match(/(on:)(\w+)(?!.*\1)/g);
        if (values.length > 0 && values[idx] !== undefined && values[idx] instanceof Function) {
            callbackName = (values[idx] as Function).name;
            if (!(`${eventMatch}` in result.eventCallback)) {
                result.eventCallback[`${eventMatch}`] = {};
            }
            result.eventCallback[`${eventMatch ?? "__unknown"}`][callbackName] = values[idx] as Function;
        }
        const expressions = findJSExpressions(str);
        if (expressions === null) {
            return [str, callbackName];
        }
        const compiledExpressions = compileJSExpressions(expressions, state, props);
        const replacedString = convertOldToNewExpressions(str, compiledExpressions);
        return [replacedString, callbackName];
    }).join('').trim();
}

export const html = (strings: TemplateStringsArray, ...values: unknown[]) => (state: { [name: string]: any }, props: { [name: string]: any }) => {
    const result = initResult(strings, values);
    validateAuthor(result.authorToken);
    const _htmlString = concatHTMLStrings(result, state, props, strings, ...values);
    const _fragment = parseFragment(_htmlString);
    const template = document.createElement('template');
    template.innerHTML = serialize(_fragment);
    return {
        ...result,
        fragment: template.content,
    } as WCSHtmlCompileResult;
};
