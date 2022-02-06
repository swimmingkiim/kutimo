import WCSBaseElement, { Router, Store, RouteMap } from "web-components-system";
import AppElement from "./src/app";
import "./index.css";

const routeMap: RouteMap = {
    root: {
        pageElement: AppElement,
    }
};

class CustomRouterElement extends Router.RouterElement {
    constructor() {
        super(routeMap);
    }
}

const customStore = new Store.WCSStore({ count: 0 });
WCSBaseElement.storeRef = customStore;
WCSBaseElement.registerTag(CustomRouterElement);

document.body.querySelector("#wcs-root").innerHTML = "<wcs-router></wcs-router>";

