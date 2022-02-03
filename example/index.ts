import WCSBaseElement, {Router, RouteMap} from "web-components-system";
import AppElement from "./src/app";
import SubElement from "./src/sub-element";

const routeMap: RouteMap = {
    root: {
        pageElement: AppElement,
        children: {
            "/sub": {
                pageElement: SubElement,
            }
        }
    }
};

class CustomRouterElement extends Router.RouterElement {
    constructor() {
        super(routeMap);
    }

}

WCSBaseElement.registerTag(CustomRouterElement);

document.body.querySelector("#wcs-root").innerHTML = "<wcs-router></wcs-router>";
