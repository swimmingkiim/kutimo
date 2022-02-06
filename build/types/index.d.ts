import WCSBaseElement, { WCSElementState, WCSElementProps, WCSBaseElementLifecycle } from "wcs-element";
import RouterElement, { RouteDefinition, RouteMap, PageElement } from "wcs-route";
import WCSStore, { WCSStoreData } from "wcs-store";
export { WCSElementState, WCSElementProps, WCSBaseElementLifecycle };
export { RouteDefinition, RouteMap, PageElement };
export { WCSStoreData };
export declare const Store: {
    WCSStore: typeof WCSStore;
};
export declare const Router: {
    RouterElement: typeof RouterElement;
};
export default WCSBaseElement;
