export declare type WCSFunctionName = string;
/**
 * WCSHTMLCompileResult refers to type of final result of html function in this file.
 * fragment is the for DOM, and others are extra information for in case consumer might need.
 * Currently, fragment, strings, values, eventCallback are being used in WCSBaseElement(wcs-element).
 */
export declare type WCSHTMLCompileResult = {
    authorToken: string;
    validation: boolean;
    sanitized: boolean;
    strings: TemplateStringsArray;
    values: unknown[] | null;
    fragment: DocumentFragment | null;
    dependencies: string[];
    eventCallback: {
        [eventName: string]: {
            [name: WCSFunctionName]: Function;
        };
    };
};
/**
 * html is main function of wcs-html.
 * It takes template literal as parameter and returns WCSHTMLCompileResult.
 * @param strings {TemplateStringsArray}
 * @param values {unknown[]}
 * @return {WCSHTMLCompileResult}
 */
export declare const html: (strings: TemplateStringsArray, ...values: unknown[]) => WCSHTMLCompileResult;
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
