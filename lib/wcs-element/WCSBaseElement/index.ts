/*
4. [ ] `class` WCSBaseElement
   1. [ ] lifecycle hook `callback fun`
      1. [ ] onStart
      2. [ ] `internal` registerIfNot
      3. [ ] onBeforeInit
      4. [ ] `internal` init -> instantiate & insert to dom
      5. [ ] onAfterInit
      6. [ ] onUpdate
         * `prop` callback function
         * `prop` dependencies array
*/

import { html, WCSHtmlCompileResult } from "wcs-html";

export type WCSElementState = {
    [key: string]: any;
}

export interface HTMLTagClass extends HTMLElement {
    context: WCSBaseElement;
    render: (compiled: WCSHtmlCompileResult) => void;
};

export default abstract class WCSBaseElement {
    tagName: string;
    private _state: WCSElementState;
    _element: {
        self: WCSBaseElement | null,
        htmlTagClass: typeof HTMLElement & HTMLTagClass,
        htmlCompileResult: WCSHtmlCompileResult | null,
        strings: TemplateStringsArray | null,
        values: unknown[];
    }

    constructor(tagName: string) {
        this.tagName = tagName;
        this._element = {
            self: null,
            htmlTagClass: null,
            htmlCompileResult: null,
            strings: null,
            values: []
        };
    }

    /* get & set */
    get state() {
        return this._state;
    }

    /* basic methods */
    public init(initialState?: WCSElementState) {
        if (initialState !== null && initialState !== undefined) {
            this._state = initialState;
        } else {
            this._state = {};
        }
    }

    public html(strings: TemplateStringsArray, ...values: unknown[]) {
        this._element.strings = strings;
        this._element.values = values;
        this._render();
    }

    private _render() {
        if (this._element.strings === null) {
            throw new Error("Please run this.html inside constructor");
        }
        this._element.htmlCompileResult = html(this._element.strings, ...this._element.values)(this.state);
        if (!customElements.get(this.tagName)) {
            this._registerTag();
        }
    }
    private _registerTag() {
        const elementContext = this;
        class WCSElement extends HTMLElement implements HTMLTagClass {
            context: WCSBaseElement;
            constructor() {
                super();
                this.context = elementContext;
                this.setAttribute("class", "__wcs-element");
                Object.entries(this.context._element.htmlCompileResult.eventCallback).forEach(([eventName, handlers]) => {
                    this.addEventListener(eventName.replace("on:", ""), (evt) => {
                        const targetElement = evt.target as HTMLElement;
                        Object.entries(handlers).forEach(([handlerName, callback]) => {
                            if (targetElement.getAttribute(eventName) === handlerName) {
                                callback.call(this.context, evt);
                                this.render();
                            }
                        })
                    });
                });
                this.appendChild(this.context._element.htmlCompileResult.fragment);
            }
            render() {
                this.replaceChildren(...this.context._element.htmlCompileResult.fragment.children)
            };
        };
        customElements.define(this.tagName, WCSElement);
    }

    public setState(newState: object) {
        this._state = {
            ...this._state,
            ...newState,
        }
        console.log(this.state);
        this._render();
    }

    /* lifecycle hooks */
    public onStart() {

    }
    public onBeforeInit() {

    }
    public onAfterInit() {

    }
    public onUpdate() {

    }
}

const snakeToCamel = (str: string) => str.replace(/\-[a-z]/g, (char) => char[1].toUpperCase());
const snakeToPascal = (str: string) => str.replace(/^[a-z]/g, (char) => char.toUpperCase()).replace(/\-[a-z]/g, (char) => char[1].toUpperCase());

export type WCSGeneratedHTMLElementResult = {
    className: string;
    elementClass: CustomElementConstructor;
}
