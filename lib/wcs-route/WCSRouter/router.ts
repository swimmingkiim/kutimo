import WCSBaseElement from "wcs-element";
import RouterPageElement from "./router-page";

export class PageElement extends WCSBaseElement {
}

export interface RouteDefinition {
  pageElement: Partial<PageElement>;
  children?: {
    [path: string]: RouteDefinition
  };
}

export type RouteMap = {
  root: RouteDefinition,
}

const ROUTE_PREFIX = "";

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

const getDependencies = (route: RouteDefinition, list: Set<Partial<PageElement>>) => {
  if (!list.has(route.pageElement)) {
    list.add(route.pageElement);
  }
  if (route.children) {
    Object.values(route.children).forEach((subRoute) => getDependencies(subRoute, list));
  }
  return Array.from(list);
};

export default class RouterElement extends WCSBaseElement {
  static tagName = "wcs-router";
  routeList: ReturnType<typeof getFlatRouteMap>;
  routeMap: RouteMap;

  constructor(routeMap: RouteMap) {
    super(RouterElement.tagName);
    this.routeMap = routeMap;
    this.routeList = getFlatRouteMap("", this.routeMap.root, {"/": this.routeMap.root.pageElement});
    this.import = [RouterPageElement, ...getDependencies(this.routeMap.root, new Set())];
    this.init({
      location: this.location,
      currentPageElementName: this.routeList[this.location.pathname]?.tagName ?? this.routeMap.root.pageElement.tagName,
    });
    this.html`
      <wcs-router-page
        path="{{ this.state.location.pathname ? this.state.location.pathname : window.location.pathname }}"
        element-name="{{this.state.currentPageElementName}}"></wcs-router-page>`;
    this.startRender();
  }

  onStart(): void {
    window.addEventListener("popstate", (evt) => {
      evt.preventDefault();
      RouterElement.goBack();
    });
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

  get location() {
    return {
      pathname: window.location.pathname,
      query: new URLSearchParams(window.location.search),
    };
  }

  static navigate(url: string) {
    const locationChangeEvent = new CustomEvent("historypush", {detail: `${ ROUTE_PREFIX }${ url }`});
    window.dispatchEvent(locationChangeEvent);
  }

  static goBack() {
    const locationChangeEvent = new CustomEvent("historyback");
    window.dispatchEvent(locationChangeEvent);
  }

  static refresh() {
    const locationChangeEvent = new CustomEvent("historyrefresh");
    window.dispatchEvent(locationChangeEvent);
  }
}

