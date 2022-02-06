import KutimoBaseElement, { KutimoElementState, KutimoElementProps, KutimoBaseElementLifecycle } from "kutimo-element";
import RouterElement, { RouteDefinition, RouteMap, PageElement } from "kutimo-route";
import KutimoStore, { KutimoStoreData } from "kutimo-store";
export { KutimoElementState, KutimoElementProps, KutimoBaseElementLifecycle };
export { RouteDefinition, RouteMap, PageElement };
export { KutimoStoreData };
export declare const Store: {
    KutimoStore: typeof KutimoStore;
};
export declare const Router: {
    RouterElement: typeof RouterElement;
};
export default KutimoBaseElement;
