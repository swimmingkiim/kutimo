import KutimoBaseElement, {
    KutimoElementState,
    KutimoElementProps,
    KutimoBaseElementLifecycle
} from "kutimo-element";
import RouterElement, { RouteDefinition, RouteMap, PageElement } from "kutimo-route";
import KutimoStore, { KutimoStoreData } from "kutimo-store";

export { KutimoElementState, KutimoElementProps, KutimoBaseElementLifecycle };
export { RouteDefinition, RouteMap, PageElement };
export { KutimoStoreData };

export const Store = {
    KutimoStore,
}

export const Router = {
    RouterElement
};
export default KutimoBaseElement;
