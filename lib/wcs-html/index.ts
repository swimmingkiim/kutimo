import {parseFragment, serialize} from "parse5";

export type WCSFunctionName = string;

/**
 * WCSHTMLCompileResult refers to type of final result of html function in this file.
 * fragment is the for DOM, and others are extra information for in case consumer might need.
 * Currently, fragment, strings, values, eventCallback are being used in WCSBaseElement(wcs-element).
 */
export type WCSHTMLCompileResult = {
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

/**
 * Stamp string that result is compiled from wcs-html.
 */
const AUTHOR_TOKEN = `WCS__${ Math.random().toString().slice(12) }`;

/**
 * initResult returns initialized, not compiled yet WCSHTMLCompileResult object with default values set.
 * @param strings {TemplateStringsArray}
 * @param values {unknown[]}
 * @return {WCSHTMLCompileResult}
 */
const initResult = (strings: TemplateStringsArray, ...values: unknown[]): WCSHTMLCompileResult => {
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

/**
 * validateAuthor checks whether the WCSHTMLCompiledResult is made for wcs-html.
 * For now, not used much.
 * But this could be used to further features, such as prevent force injection of WCSHTMLCompiledResult.
 * @param token
 */
const validateAuthor = (token: string) => {
  return token == AUTHOR_TOKEN;
};


/**
 * concatHTMLStrings returns joined string with provide strings and values.
 * And save functions provide as attribute prefixed with "on:" as eventCallback in WCSHTMLCompileResult.
 * @param result {WCSHTMLCompileResult}
 * @param strings {TemplateStringsArray}
 * @param values {unknown[]}
 * @return {string}
 */
const concatHTMLStrings = (result: WCSHTMLCompileResult, strings: TemplateStringsArray, ...values: unknown[]) => {
  return strings.flatMap((str, idx) => {
    let callbackName: string = values[idx] !== undefined ? values[idx].toString() : "";
    const eventMatch = str.match(/(on:)(\w+)(?!.*\1)/g);
    if (values.length > 0 && values[idx] !== undefined && values[idx] instanceof Function) {
      callbackName = (values[idx] as Function).name;
      if (!(`${ eventMatch }` in result.eventCallback)) {
        result.eventCallback[`${ eventMatch }`] = {};
      }
      result.eventCallback[`${ eventMatch ?? "__unknown" }`][callbackName] = values[idx] as Function;
    }
    return [str, callbackName];
  }).join("").trim();
};

/**
 * html is main function of wcs-html.
 * It takes template literal as parameter and returns WCSHTMLCompileResult.
 * @param strings {TemplateStringsArray}
 * @param values {unknown[]}
 * @return {WCSHTMLCompileResult}
 */
export const html = (strings: TemplateStringsArray, ...values: unknown[]): WCSHTMLCompileResult => {
  const result = initResult(strings, values);
  validateAuthor(result.authorToken);
  const _htmlString = concatHTMLStrings(result, strings, ...values);
  const _fragment = parseFragment(_htmlString);
  const template = document.createElement("template");
  template.innerHTML = serialize(_fragment);
  return {
    ...result,
    fragment: template.content,
  } as WCSHTMLCompileResult;
};

/**
 * not using any more, since ${} can handle all variables from html template literals.
 * Previously, in html template literal, used interpolation to handle state and props related fields.
 * Just keeping it here for a reference in case I need to use these again.

 const findJSExpressions = (str: string) => str.match(/\{\{\s*.*?\s*\}\}/g);

 const compileJSExpressions = (expressionArray: RegExpMatchArray, state: { [name: string]: any }, props: { [name: string]: any }): { oldStr: string, newStr: string }[] => {
  return expressionArray.map((jsExpression: string) => {
    let newJSExpression = jsExpression;
    newJSExpression = newJSExpression.replace(/this\.state\.[a-zA-Z.]+/g, (char) => {
      const key = char.replace("this.state.", "");
      return typeof state[key] === "string" ? `${state[key]}` : state[key];
    });
    newJSExpression = newJSExpression.replace(/this\.props\.[a-zA-Z.]+/g, (char) => {
      const key = char.replace("this.props.", "");
      return typeof props[key] === "string" ? `${props[key]}` : props[key];
    });
    newJSExpression = newJSExpression.replace(/\{|\}/g, "");
    let jsResult = newJSExpression;
    try {
      jsResult = new Function(`return (${newJSExpression.trim()})`)();
    } catch (e) {
      console.log("just string not js")
    }
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

 --> implementation
 const expressions = findJSExpressions(htmlstring);
 if (expressions === null) {
  return replacedWithValues;
 }
 const compiledExpressions = compileJSExpressions(expressions, state, props);
 const replacedWithStateAndProps = convertOldToNewExpressions(replacedWithValues, compiledExpressions);
 return replacedWithStateAndProps;
 */
