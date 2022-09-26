export interface ICollection<T> {
    add(item: T): void;
    remove(): T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
    size(): number;
    clear(): void;
}

abstract class Collection<T> {
    protected items: T[] = [];

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    public size(): number {
        return this.items.length;
    }

    public clear(): void {
        this.items = [];
    }
}

export class Queue<T> extends Collection<T> implements ICollection<T> {
    constructor() {
        super();
    }

    add(item: T) {
        this.items.push(item);
    }

    remove() {
        return this.items.shift();
    }

    peek() {
        return this.items[0];
    }
}

export class Stack<T> extends Collection<T> implements ICollection<T> {
    constructor() {
        super();
    }

    add(item: T) {
        this.items.push(item);
    }

    remove() {
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }
}
