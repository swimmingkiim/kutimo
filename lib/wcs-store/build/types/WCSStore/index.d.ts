export declare type WCSStoreData = {
    [key: string]: any;
};
export default class WCSStore {
    private _store;
    constructor(initialStoreData: WCSStoreData);
    get store(): WCSStoreData;
    setStore(storeData: WCSStoreData): void;
}
