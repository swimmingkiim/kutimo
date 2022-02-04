import WCSBaseElement from "wcs-element";
import RouterPageElement from "./router-page";

/**
 * PageElement refers to any wcs element that extends WCSBaseElement
 * If you want to use, make it sure you use "Partial<PageElement>"
 * in order to avoid conflict
 */
export class PageElement extends WCSBaseElement {
}


/**
 * RouteDefinition refers to router node that matching each path
 * If you want sub router node which extends this node's path,
 * you can specify children with keys being extra path of current node's path
 */
export interface RouteDefinition {
  pageElement: Partial<PageElement>;
  children?: {
    [path: string]: RouteDefinition
  };
}


/**
 * RouteMap refers to a blueprint of your routing system.
 * You can provide this type of object to your custom RouterElement as a param of super call at constructor which extends RouterElement.
 */
export type RouteMap = {
  root: RouteDefinition,
}


/**
 * ROUTER_PREFIX refers to base path of all of your route node.
 * Empty string refers to "/", since any ROUTE_PREFIX comes first to "/"(basic root path)
 */
const ROUTE_PREFIX = "";

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
const getFlatRouteMap = (parentPath: string, route: RouteDefinition, flattenMap: { [path: string]: Partial<PageElement> }) => {
  if (route.children) {
    Object.keys(route.children).forEach((subRoutePath) => {
      flattenMap[`${ parentPath }${ subRoutePath }`] = route.children[subRoutePath].pageElement;
      if (route.children[subRoutePath].children) {
        getFlatRouteMap(`${ parentPath }${ subRoutePath }`, route.children[subRoutePath], flattenMap);
      }
    });
  }
  return flattenMap;
};

/**
 * getDependencies returns unique WCS element classes array which appeared on your RouteMap.
 * This is used for import in RouterElement.
 * @param route {RouteDefinition}
 * @param list {Set<Partial<PageElement>>}
 * @return {Set<Partial<PageElement>>}
 */
const getDependencies = (route: RouteDefinition, list: Set<Partial<PageElement>>) => {
  if (!list.has(route.pageElement)) {
    list.add(route.pageElement);
  }
  if (route.children) {
    Object.values(route.children).forEach((subRoute) => getDependencies(subRoute, list));
  }
  return Array.from(list);
};

/**
 * RouterElement is WCS Element for single page routing.
 * You can extend this element to define your route element.
 * !!! Don't directly use this element, please extends this element to create your router element.
 * !!! Don't forget to call WCSBaseElement.registerTag(YourCustomRouterElement) before use <wcs-router></wcs-router>.
 */
export default class RouterElement extends WCSBaseElement {
  static tagName = "wcs-router";
  routeList: ReturnType<typeof getFlatRouteMap>;
  routeMap: RouteMap;

  /**
   * @param routeMap {RouteMap}
   */
  constructor(routeMap: RouteMap) {
    super(RouterElement.tagName);
    this.routeMap = routeMap;
    this.routeList = getFlatRouteMap("", this.routeMap.root, {"/": this.routeMap.root.pageElement});
    this.import = [RouterPageElement, ...getDependencies(this.routeMap.root, new Set())];
    this.init({
      location: this.location,
      currentPageElementName: this.routeList[this.location.pathname]?.tagName ?? this.routeMap.root.pageElement.tagName,
    });
  }

  renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
    render`
      <wcs-router-page
        path="${ this.state.location.pathname ? this.state.location.pathname : window.location.pathname }"
        element-name="${ this.state.currentPageElementName }"></wcs-router-page>`;
  }

  onStart(): void {
    // block default behavior of browser's go back action and use internal logic
    window.addEventListener("popstate", (evt) => {
      evt.preventDefault();
      RouterElement.goBack();
    });
    // custom event handler for navigate method
    window.addEventListener("historypush", (evt: CustomEvent) => {
      window.history.pushState(null, "home", evt.detail);
      this.setState({
        location: {
          ...this.state.location,
          pathname: evt.detail
        },
        currentPageElementName: this.routeList[this.location.pathname]?.tagName ?? this.routeMap.root.pageElement.tagName,
      });
    });
    // custom event handler for goBack method
    window.addEventListener("historyback", (evt: CustomEvent) => {
      console.log(this.location);
      this.setState({
        location: {
          ...this.state.location,
          pathname: this.location,
        },
        currentPageElementName: this.routeList[this.location.pathname]?.tagName ?? this.routeMap.root.pageElement.tagName,
      });
    });
    // custom event handler for refresh method
    window.addEventListener("historyrefresh", (evt: CustomEvent) => {
      window.history.replaceState(null, "", window.location.href);
      this.setState({
        location: {
          ...this.state.location,
          pathname: this.location,
        },
        currentPageElementName: this.routeList[this.location.pathname]?.tagName ?? this.routeMap.root.pageElement.tagName,
      });
    });
  }

  /**
   * @return current location state object according to window.location
   */
  get location() {
    return {
      pathname: window.location.pathname,
      query: new URLSearchParams(window.location.search),
    };
  }

  /**
   * navigate method is for internal route navigation when you use RouterElement.
   * You only can use this when you implemented your own RouterElement,
   * because handler registration for custom event used in this method are implemented on RouterElement.onStart
   * @param url url to navigate
   */
  static navigate(url: string) {
    const locationChangeEvent = new CustomEvent("historypush", {detail: `${ ROUTE_PREFIX }${ url }`});
    window.dispatchEvent(locationChangeEvent);
  }

  /**
   * goBack method is for internal route navigation when you use RouterElement.
   * You only can use this when you implemented your own RouterElement,
   * because handler registration for custom event used in this method are implemented on RouterElement.onStart
   */
  static goBack() {
    const locationChangeEvent = new CustomEvent("historyback");
    window.dispatchEvent(locationChangeEvent);
  }

  /**
   * refresh method is for internal route navigation when you use RouterElement.
   * You only can use this when you implemented your own RouterElement,
   * because handler registration for custom event used in this method are implemented on RouterElement.onStart
   */
  static refresh() {
    const locationChangeEvent = new CustomEvent("historyrefresh");
    window.dispatchEvent(locationChangeEvent);
  }
}

