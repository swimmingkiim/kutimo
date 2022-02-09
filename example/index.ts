import KutimoBaseElement, { Router, Store, RouteMap } from "kutimo";
import AppElement from "./src/app";
import "./index.css";
import SubPageElement from "./src/sub-page";

const routeMap: RouteMap = {
    root: {
        pageElement: AppElement,
        children: {
            "/:id": {
                pageElement: SubPageElement,
            },
            "/sub": {
                pageElement: SubPageElement
            }
        }
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

