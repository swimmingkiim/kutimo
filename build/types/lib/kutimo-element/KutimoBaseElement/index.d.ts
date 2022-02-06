import KutimoStore, { KutimoStoreData } from "kutimo-store";
/**
 * KutimoElementState refers to state type of KutimoBaseElement
 */
export declare type KutimoElementState = {
    [key: string]: any;
};
/**
 * KutimoElementStore refers to store type of KutimoBaseElement
 */
/**
 * KutimoElementState refers to props type of KutimoBaseElement
 */
export declare type KutimoElementProps = {
    [key: string]: any;
};
/**
 * KutimoBaseElementLifecycle refers to type of life cycle that can be used in any element that extends KutimoBaseElement.
 */
export interface KutimoBaseElementLifecycle {
    onStart?(): void;
    onBeforeRender?(): void;
    onAfterRender?(): void;
    onUpdateState?(): (prevState: KutimoElementState, currentState: KutimoElementState) => void;
}
/**
 * KutimoBaseElementCustomFields is for any element extends KutimoBaseElement to be customizable.
 */
export interface KutimoBaseElementCustomFields {
    [key: string]: any;
}
/**
 * KutimoBaseElement is core class in web-components-system(aka. kutimo).
 * Consumer can directly extend this class and use it to build their custom web component using kutimo.
 */
export default class KutimoBaseElement extends HTMLElement implements KutimoBaseElementLifecycle, KutimoBaseElementCustomFields {
    static tagName: string;
    static _storeRef: KutimoStore;
    props: KutimoElementProps;
    import: any[];
    store: KutimoStoreData & {
        setStore: Function;
    } | null;
    private readonly _tagName;
    private _state;
    private _element;
    private _eventListener;
    constructor(tagName: string);
    get state(): KutimoElementState;
    static get storeRef(): any;
    static set storeRef(store: any);
    static registerTag(classRef: any): void;
    init(initialState?: KutimoElementState): void;
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
    onUpdateState(): (prevState: KutimoElementState, currentState: KutimoElementState) => void;
}
