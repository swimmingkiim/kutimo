import KutimoBaseElement, { Router, Store, RouteMap } from "kutimo";
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

const customStore = new Store.KutimoStore({ count: 0 });
KutimoBaseElement.storeRef = customStore;
KutimoBaseElement.registerTag(CustomRouterElement);

document.body.querySelector("#kutimo-root").innerHTML = "<kutimo-router></kutimo-router>";

