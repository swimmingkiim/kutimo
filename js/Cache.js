export default class Cache {
    constructor() {
        this.cache = {};
    }

    cache() {
        return this.cache;
    }

    setCache(setFunc) {
        this.cache = setFunc(this.cache);
    }
}