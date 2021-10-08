import { compare } from "./_util.js";

export default class Store {
    constructor(initialData) {
        this._data = initialData ? Object.assign({}, initialData) : {};
        this.prevData = Object.assign({}, this._data);
        this.subscribes = new Map();
    }

    get data() {
        return this._data;
    }

    set data(newData) {
        const isSame = compare(this._data, newData);
        if (!isSame) {
            this.updatePrevData();
            this.updateData(newData);
            this.runSubscribes();
        }
    }

    updatePrevData() {
        this.prevData = Object.assign({}, this._data);
    }

    updateData(data) {
        this._data = data;
    }

    addSubscribe(func) {
        const id = this.subscribes.size;
        this.subscribes.set(id, func);
        func(this);
        return id;
    }

    removeSubscribe(id) {
        const subscribe = this.subscribes.get(id);
        if (subscribe) {
            this.subscribes.delete(id);
            return 0;
        }
        return 1;
    }

    runSubscribes() {
        this.subscribes.forEach((val, key, _) => {
            val(this);
        });
    }
}