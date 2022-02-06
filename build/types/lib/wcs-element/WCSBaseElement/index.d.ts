import WCSStore, { WCSStoreData } from "wcs-store";
/**
 * WCSElementState refers to state type of WCSBaseElement
 */
export declare type WCSElementState = {
    [key: string]: any;
};
/**
 * WCSElementStore refers to store type of WCSBaseElement
 */
/**
 * WCSElementState refers to props type of WCSBaseElement
 */
export declare type WCSElementProps = {
    [key: string]: any;
};
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
    store: WCSStoreData & {
        setStore: Function;
    } | null;
    private readonly _tagName;
    private _state;
    private _element;
    private _eventListener;
    constructor(tagName: string);
    get state(): WCSElementState;
    static get storeRef(): any;
    static set storeRef(store: any);
    static registerTag(classRef: any): void;
    init(initialState?: WCSElementState): void;
    private _eventCallBack;
    private _setEventListener;
    private _removeEventListener;
    private _changedEventNames;
    private _updateEventListener;
    private _render;
    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void;
    private _html;
    private _compileHTML;
    private _registerProps;
    reRender(): void;
    startRender(): void;
    setState(newState: object): void;
    private _setStore;
    onStart(): void;
    onBeforeRender(): void;
    onAfterRender(): void;
    onUpdateState(): (prevState: WCSElementState, currentState: WCSElementState) => void;
}
