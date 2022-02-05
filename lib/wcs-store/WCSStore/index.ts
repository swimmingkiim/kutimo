export type WCSStoreData = {
    [key: string]: any;
}

export default class WCSStore {
    private _store: WCSStoreData;
    constructor(initialStoreData: WCSStoreData) {
        this._store = initialStoreData;
    }

    get store() {
        return Object.assign({}, this._store);
    }

    setStore(storeData: WCSStoreData) {
        this._store = {
            ...this._store,
            ...storeData,
        }
    }
}
