import Store from "./Store.js";
import Cache from "./Cache.js";

const initialData = {
    count: 0
}

export const store = new Store(initialData);

export const cache = new Cache();