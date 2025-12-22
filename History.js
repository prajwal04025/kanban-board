export class Action {
    constructor(type, task, from, to, oldText = null, newText = null) {
        this.type = type;
        this.task = task;
        this.from = from;
        this.to = to;
        this.oldText = oldText;
        this.newText = newText;
    }
}

class Node {
    constructor(action) {
        this.action = action;
        this.prev = null;
        this.next = null;
    }
}

export class History {
    constructor(onChange) {
        this.head = null;
        this.current = null;
        this.onChange = onChange;
    }

    add(action) {
        const node = new Node(action);

        if (this.current && this.current.next) {
            this.current.next = null;
        }

        if (!this.head) this.head = node;
        else {
            node.prev = this.current;
            if (this.current) this.current.next = node;
        }

        this.current = node;
        this.onChange();
    }

    undo() {
        if (!this.current) return;
        this.current = this.current.prev;
        this.onChange();
    }

    redo() {
        if (this.current && this.current.next) {
            this.current = this.current.next;
            this.onChange();
        }
    }

    getTimeline() {
        const arr = [];
        let temp = this.head;
        while (temp) {
            arr.push({
                type: temp.action.type,
                active: temp === this.current
            });
            temp = temp.next;
        }
        return arr;
    }
}
