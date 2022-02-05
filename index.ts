import WCSBaseElement, {
    WCSElementState,
    WCSElementProps,
    WCSBaseElementLifecycle
} from "wcs-element";
import RouterElement, { RouteDefinition, RouteMap, PageElement } from "wcs-route";
import WCSStore, { WCSStoreData } from "wcs-store";

export { WCSElementState, WCSElementProps, WCSBaseElementLifecycle };
export { RouteDefinition, RouteMap, PageElement };
export { WCSStoreData };

export const Store = {
    WCSStore,
}

export const Router = {
    RouterElement
};
export default WCSBaseElement;
