import { html, WCSHTMLCompileResult } from "wcs-html";
import WCSStore, { WCSStoreData } from "wcs-store";

/**
 * WCSElementState refers to state type of WCSBaseElement
 */
export type WCSElementState = {
    [key: string]: any;
}

/**
 * WCSElementStore refers to store type of WCSBaseElement
 */

/**
 * WCSElementState refers to props type of WCSBaseElement
 */
export type WCSElementProps = {
    [key: string]: any;
}

/**
 * WCSBaseElementLifecycle refers to type of life cycle that can be used in any element that extends WCSBaseElement.
 */
export interface WCSBaseElementLifecycle {
    onStart?(): void;

    onBeforeRender?(): void;

    onAfterRender?(): void;

    onUpdateState?(): (prevState: WCSElementState, currentState: WCSElementState) => void;
}

/**
 * WCSBaseElementCustomFields is for any element extends WCSBaseElement to be customizable.
 */
export interface WCSBaseElementCustomFields {
    [key: string]: any;
}

/**
 * WCSBaseElement is core class in web-components-system(aka. wcs).
 * Consumer can directly extend this class and use it to build their custom web component using wcs.
 */
export default class WCSBaseElement extends HTMLElement implements WCSBaseElementLifecycle, WCSBaseElementCustomFields {
    static tagName: string;
    static _storeRef: WCSStore;
    props: WCSElementProps;
    import: any[];
    store: WCSStoreData & { setStore: Function } | null;
    private readonly _tagName: string;
    private _state: WCSElementState;
    private _element: {
        htmlCompileResult: WCSHTMLCompileResult | null,
        strings: TemplateStringsArray | null,
        values: unknown[];
    };
    private _eventListener: {
        [eventName: string]: (...args: any[]) => void;
    };
    constructor(tagName: string) {
        super();
        this.props = {};
        this.import = [];
        this.store = WCSBaseElement._storeRef ? { data: WCSBaseElement._storeRef.store, setStore: this._setStore.bind(this) } : null;
        this._tagName = tagName;
        this._element = {
            htmlCompileResult: null,
            strings: null,
            values: []
        };
        this._eventListener = {};
    }

    /* ========================================================================= */

    /* get & set */

    get state() {
        return this._state;
    }

    /* ========================================================================= */

    /* Initialize */

    static get storeRef() {
        return Object.assign({}, WCSBaseElement._storeRef);
    }

    static set storeRef(store: any) {
        WCSBaseElement._storeRef = store;
    }

    public static registerTag(classRef: any) {
        if (!customElements.get(classRef.tagName)) {
            customElements.define(classRef.tagName, classRef);
        }
    }

    public init(initialState?: WCSElementState) {
        if (this.import.length > 0) {
            this.import.forEach((SubElement) => {
                WCSBaseElement.registerTag(SubElement);
            });
        }
        if (initialState !== null && initialState !== undefined) {
            this._state = initialState;
        } else {
            this._state = {};
        }
        this.setAttribute("class", "__wcs-element");
        this.startRender();
    }

    /* ========================================================================= */

    /* Event handling related */

    private _eventCallBack(eventName: string, handlers: { [name: string]: Function }): (...args: any[]) => void {
        return (evt: Event) => {
            const targetElement = evt.target as HTMLElement;
            Object.entries(handlers).forEach(([handlerName, callback]) => {
                if (targetElement.getAttribute(eventName) === handlerName) {
                    callback.call(this, evt);
                }
            });
        };
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

    private _removeEventListener(eventName: string) {
        if (this._eventListener.hasOwnProperty(eventName)) {
            this.removeEventListener(eventName.replace("on:", ""), this._eventListener[eventName]);
            delete this._eventListener[eventName];
        }
    }

    private _changedEventNames(prevCompiledResult: WCSHTMLCompileResult) {
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

    private _updateEventListener(prevCompiledResult: WCSHTMLCompileResult) {
        const updateList = this._changedEventNames(prevCompiledResult);
        if (updateList.length === 0) {
            return;
        }
        updateList.forEach((eventName: string) => this._removeEventListener(eventName));
        this._setEventListener(updateList);
    }

    /* ========================================================================= */

    /* Rendering HTML related */

    private _render() {
        if (!customElements.get(this._tagName)) {
            throw new Error("Please call registerTag before you use the element");
        }
        this._registerProps();
        this.onBeforeRender();
        this._compileHTML();
        this.replaceChildren(...this._element.htmlCompileResult.fragment.children);
        this.onAfterRender();
    }

    public renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void) {
    }

    private _html(strings: TemplateStringsArray, ...values: unknown[]) {
        this._element.strings = strings;
        this._element.values = values;
    }

    private _compileHTML() {
        const prevCompiledResult = this._element.htmlCompileResult;
        this.renderHTML.call(this, this._html.bind(this));
        this._element.htmlCompileResult = html(this._element.strings, ...this._element.values);
        this._updateEventListener(prevCompiledResult);
    }

    private _registerProps() {
        Object.keys(this.props).forEach((propName: string) => {
            const attr = this.getAttribute(camelToSnack(propName));
            if (attr) {
                this.props[propName] = attr;
            }
        });
    }

    public reRender() {
        this._render();
    }

    public startRender() {
        this.onStart();
        this._render();
    }

    /* ========================================================================= */

    /* State related */

    public setState(newState: object) {
        const oldState = { ...this._state };
        this._state = {
            ...this._state,
            ...newState,
        };
        this._render();
        this.onUpdateState()(oldState, this.state);
    }

    /* ========================================================================= */

    /* State related */

    private _setStore(newStoreData: WCSStoreData) {
        WCSBaseElement._storeRef.setStore(newStoreData);
        this.store.data = WCSBaseElement._storeRef.store;
        const { values: prevValues } = this._element;
        this.renderHTML.call(this, this._html.bind(this));
        if (prevValues.length !== this._element.values.length) {
            this._render();
        } else if (prevValues.some((val, idx) => val !== this._element.values[idx])) {
            this._render();
        }
    }


    /* ========================================================================= */

    /* Lifecycle hooks */

    onStart(): void {

    }

    onBeforeRender(): void {

    }

    onAfterRender(): void {

    }

    onUpdateState(): (prevState: WCSElementState, currentState: WCSElementState) => void {
        return () => null;
    }
}

/* ========================================================================= */
/* Utils */

const snakeToCamel = (str: string) => str.replace(/\-[a-z]/g, (char) => char[1].toUpperCase());
const snakeToPascal = (str: string) => str.replace(/^[a-z]/g, (char) => char.toUpperCase()).replace(/\-[a-z]/g, (char) => char[1].toUpperCase());
const camelToSnack = (str: string) => str.replace(/\[a-z][A-Z]/g, (char) => `-${char[1].toLowerCase()}`).replace(/[A-Z]/g, (char) => char.toLowerCase());
const isObjectSame = (obj1: { [key: string | number]: any }, obj2: { [key: string | number]: any }) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};
