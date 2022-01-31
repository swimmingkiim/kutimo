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

export type WCSElementProps = {
    [key: string]: any;
}

//export interface HTMLTagClass extends HTMLElement {
//    context: WCSBaseElement;
//    render: () => void;
//};

export interface WCSBaseElementLifecycle {
    onStart?(): void;
    onBeforeRender?(): void;
    onAfterRender?(): void;
    onUpdate?(): void;
}

export default class WCSBaseElement extends HTMLElement implements WCSBaseElementLifecycle {
    static tagName: string;
    private _tagName: string;
    props: WCSElementProps;
    import: any[];
    private _state: WCSElementState;
    private _eventListener: {
        [eventName: string]: (...args: any[]) => void;
    }
    _element: {
        self: WCSBaseElement | null,
        htmlCompileResult: WCSHtmlCompileResult | null,
        strings: TemplateStringsArray | null,
        values: unknown[];
    }

    constructor(tagName: string) {
        super();
        this._tagName = tagName;
        this.props = {};
        this.import = [];
        this._element = {
            self: null,
            htmlCompileResult: null,
            strings: null,
            values: []
        };
        this._eventListener = {};
    }

    /* get & set */
    get state() {
        return this._state;
    }

    /* basic methods */
    public init(initialState?: WCSElementState) {
        if (this.import.length > 0) {
            this.import.forEach((SubElement) => {
                WCSBaseElement.registerTag(SubElement)
            });
        }
        if (initialState !== null && initialState !== undefined) {
            this._state = initialState;
        } else {
            this._state = {};
        }
        this.setAttribute("class", "__wcs-element");
    }

    private _eventCallBack(eventName: string, handlers: { [name: string]: Function }) {
        return (evt: Event) => {
            const targetElement = evt.target as HTMLElement;
            Object.entries(handlers).forEach(([handlerName, callback]) => {
                if (targetElement.getAttribute(eventName) === handlerName) {
                    callback.call(this, evt);
                }
            })
        }
    }

    private _removeEventListener(eventName: string) {
        if (this._eventListener.hasOwnProperty(eventName)) {
            this.removeEventListener(eventName.replace("on:", ""), this._eventListener[eventName]);
            delete this._eventListener[eventName];
        }
    }

    private _setEventListener(targetEventNames?: string[]) {
        Object.entries(this._element.htmlCompileResult.eventCallback).forEach(([eventName, handlers]) => {
            if (targetEventNames !== null && targetEventNames !== undefined) {
                if (!targetEventNames.includes(eventName)) {
                    return;
                }
                this._eventListener[eventName] = this._eventCallBack(eventName, handlers);
                this.addEventListener(eventName.replace("on:", ""), this._eventListener[eventName]);
            } else {
                this._eventListener[eventName] = this._eventCallBack(eventName, handlers);
                this.addEventListener(eventName.replace("on:", ""), this._eventListener[eventName]);
            }
        });
    }

    private _changedEventNames(prevCompiledResult: WCSHtmlCompileResult) {
        if (prevCompiledResult === null || Object.keys(prevCompiledResult.eventCallback).length === 0) {
            return Object.keys(this._element.htmlCompileResult.eventCallback).filter((eventName: string) => eventName !== "__unknown");
        }
        return Object.entries(this._element.htmlCompileResult.eventCallback).map(([eventName, handlers]) => {
            if (isObjectSame(prevCompiledResult.eventCallback[eventName], handlers)) {
                return eventName;
            }
            return null;
        }).filter((eventName) => eventName !== null && eventName !== "__unknown");
    }

    private _updateEventListener(prevCompiledResult: WCSHtmlCompileResult) {
        const updateList = this._changedEventNames(prevCompiledResult);
        if (updateList.length === 0) {
            return;
        }
        updateList.forEach((eventName: string) => this._removeEventListener(eventName));
        this._setEventListener(updateList);
    }

    public html(strings: TemplateStringsArray, ...values: unknown[]) {
        this._element.strings = strings;
        this._element.values = values;
    }

    private _compileHTML() {
        const prevCompiledResult = this._element.htmlCompileResult;
        this._element.htmlCompileResult = html(this._element.strings, ...this._element.values)(this.state, this.props);
        this._updateEventListener(prevCompiledResult);
    }

    private _render() {
        if (!customElements.get(this._tagName)) {
            throw new Error("Please call registerTag before you use the element");
        }
        if (this._element.strings === null) {
            throw new Error("Please run this.html inside constructor");
        }
        this._registerProps();
        this.onBeforeRender();
        this._compileHTML();
        this.replaceChildren(...this._element.htmlCompileResult.fragment.children)
        this.onAfterRender();
    }
    private _registerProps() {
        Object.keys(this.props).forEach((propName: string) => {
            const attr = this.getAttribute(camelToSnack(propName));
            if (attr) {
                this.props[propName] = attr;
            }
        });
    }

    public static registerTag(classRef: any) {
        if (!customElements.get(classRef.tagName)) {
            customElements.define(classRef.tagName, classRef);
        }
    }

    public setState(newState: object) {
        this._state = {
            ...this._state,
            ...newState,
        }
        this._render();
    }

    public startRender() {
        this.onStart();
        this._render();
    }

    /* lifecycle hooks */
    onStart(): void {

    }
    onBeforeRender(): void {

    }
    onAfterRender(): void {

    }
    onUpdate(): void {

    }
}

const snakeToCamel = (str: string) => str.replace(/\-[a-z]/g, (char) => char[1].toUpperCase());
const snakeToPascal = (str: string) => str.replace(/^[a-z]/g, (char) => char.toUpperCase()).replace(/\-[a-z]/g, (char) => char[1].toUpperCase());

const camelToSnack = (str: string) => str.replace(/\[a-z][A-Z]/g, (char) => `-${char[1].toLowerCase()}`).replace(/[A-Z]/g, (char) => char.toLowerCase());
const isObjectSame = (obj1: { [key: string | number]: any }, obj2: { [key: string | number]: any }) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export type WCSGeneratedHTMLElementResult = {
    className: string;
    elementClass: CustomElementConstructor;
}
