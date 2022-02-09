import KutimoBaseElement from "kutimo-element";
/**
 * PageElement refers to any kutimo element that extends KutimoBaseElement
 * If you want to use, make it sure you use "Partial<PageElement>"
 * in order to avoid conflict
 */
export declare class PageElement extends KutimoBaseElement {
}
/**
 * RouteDefinition refers to router node that matching each path
 * If you want sub router node which extends this node's path,
 * you can specify children with keys being extra path of current node's path
 */
export interface RouteDefinition {
    pageElement: Partial<PageElement>;
    children?: {
        [path: string]: RouteDefinition;
    };
}
/**
 * RouteMap refers to a blueprint of your routing system.
 * You can provide this type of object to your custom RouterElement as a param of super call at constructor which extends RouterElement.
 */
export declare type RouteMap = {
    root: RouteDefinition;
};
/**
 * getFlatRouteMap returns 1 depth object.
 * key is full path of route node, and value is PageElement to render with that path.
 * When you provide your RouteMap object to your RouterElement, RouterElement generate this flat version of your RouteMap.
 * This is used for quicker search for route navigation.
 * @param parentPath {string}
 * @param route {RouteDefinition}
 * @param flattenMap {{[path: string]: Partial<PageElement>}}
 * @return {{[path: string]: Partial<PageElement>}}
 */
declare const getFlatRouteMap: (parentPath: string, route: RouteDefinition, flattenMap: {
    [path: string]: Partial<PageElement>;
}) => {
    [path: string]: Partial<PageElement>;
};
/**
 * RouterElement is Kutimo Element for single page routing.
 * You can extend this element to define your route element.
 * !!! Don't directly use this element, please extends this element to create your router element.
 * !!! Don't forget to call KutimoBaseElement.registerTag(YourCustomRouterElement) before use <kutimo-router></kutimo-router>.
 */
export default class RouterElement extends KutimoBaseElement {
    static tagName: string;
    routeList: ReturnType<typeof getFlatRouteMap>;
    routeMap: RouteMap;
    /**
     * @param routeMap {RouteMap}
     */
    constructor(routeMap: RouteMap);
    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void;
    onStart(): void;
    /**
     * @return current location state object according to window.location
     */
    get location(): {
        pathname: string;
        query: URLSearchParams;
    };
    /**
     * navigate method is for internal route navigation when you use RouterElement.
     * You only can use this when you implemented your own RouterElement,
     * because handler registration for custom event used in this method are implemented on RouterElement.onStart
     * @param url url to navigate
     */
    static navigate(url: string): void;
    /**
     * goBack method is for internal route navigation when you use RouterElement.
     * You only can use this when you implemented your own RouterElement,
     * because handler registration for custom event used in this method are implemented on RouterElement.onStart
     */
    static goBack(): void;
    /**
     * refresh method is for internal route navigation when you use RouterElement.
     * You only can use this when you implemented your own RouterElement,
     * because handler registration for custom event used in this method are implemented on RouterElement.onStart
     */
    static refresh(): void;
    private _findMatchingRoute;
    private _getCurrentElement;
}
export {};
