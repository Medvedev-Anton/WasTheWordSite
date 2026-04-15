export class MainCollection {
    constructor(items = []) {
        this.items = items;
    }

    add(item) {
        this.items.push(item);
        return this;
    }

    remove(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
        this.items.splice(index, 1);
        }
        return this;
    }

    [Symbol.iterator]() {
        return this.items[Symbol.iterator]();
    }
    
    get length() {
        return this.items.length;
    }
}