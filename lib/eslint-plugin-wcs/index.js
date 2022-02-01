"use strict";

module.exports = {
  "rules": {
    "wcs-html-template-literal": {
      meta: {
        type: "layout",
        docs: {
          description: "wcs html format",
          recommended: true,
        },
        schema: [],
        fixable: "whitespace",
      },
      create: function (context) {
        function addOneSpaceToStart(fixer, ele, isStart) {
          return fixer.replaceText(ele, `${isStart ? "`" : ""}${ele.value.raw.replaceAll(/{{/g, "{{ ")}${ele.tail ? "`" : ""}`);
        }

        function addOneSpaceToEnd(fixer, ele, isStart) {
          return fixer.replaceText(ele, `${isStart ? "`" : ""}${ele.value.raw.replaceAll(/}}/g, " }}")}${ele.tail ? "`" : ""}`);
        }

        function setOnlyOneSpaceToStart(fixer, ele, isStart) {
          return fixer.replaceText(ele, `${isStart ? "`" : ""}${ele.value.raw.replaceAll(/{{[\s]{2,}/g, "{{ ")}${ele.tail ? "`" : ""}`);
        }

        function setOnlyOneSpaceToEnd(fixer, ele, isStart) {
          return fixer.replaceText(ele, `${isStart ? "`" : ""}${ele.value.raw.replaceAll(/[\s]{2,}}}/g, " }}")}${ele.tail ? "`" : ""}`);
        }

        function check(node) {
          const templateElements = node.quasi.quasis;
          for (let i = 0; i < templateElements.length; i++) {
            const str = templateElements[i].value.raw;
            const isStart = i === 0;
            if (str.match(/{{[^\s^\n]/g) !== null) {
              context.report({
                node,
                message: "need one space after start of interpolation",
                fix: fixer => addOneSpaceToStart(fixer, templateElements[i], isStart)
              });
            }
            if (str.match(/[^\s^\n]}}/g) !== null) {
              context.report({
                node,
                message: "need one space before end of interpolation",
                fix: fixer => addOneSpaceToEnd(fixer, templateElements[i], isStart)
              });
            }
            if (str.match(/{{[\s|\n]{2,}/g) !== null) {
              context.report({
                node,
                message: "need only one space after start of interpolation",
                fix: fixer => setOnlyOneSpaceToStart(fixer, templateElements[i], isStart)
              });
            }
            if (str.match(/[\s|\n]{2,}}}/g) !== null) {
              context.report({
                node,
                message: "need one space before end of interpolation",
                fix: fixer => setOnlyOneSpaceToEnd(fixer, templateElements[i], isStart)
              });
            }
          }
        }

        return {
          TaggedTemplateExpression: check,
        };
      }
    }
  }
};

