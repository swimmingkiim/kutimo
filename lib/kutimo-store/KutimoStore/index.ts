export type KutimoStoreData = {
    [key: string]: any;
}

export default class KutimoStore {
    private _store: KutimoStoreData;
    constructor(initialStoreData: KutimoStoreData) {
        this._store = initialStoreData;
    }

    get store() {
        return Object.assign({}, this._store);
    }

    setStore(storeData: KutimoStoreData) {
        this._store = {
            ...this._store,
            ...storeData,
        }
    }
}
