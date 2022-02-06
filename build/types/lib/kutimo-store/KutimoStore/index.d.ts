export declare type KutimoStoreData = {
    [key: string]: any;
};
export default class KutimoStore {
    private _store;
    constructor(initialStoreData: KutimoStoreData);
    get store(): KutimoStoreData;
    setStore(storeData: KutimoStoreData): void;
}
