class Action {
    constructor(taskId, fromCol, toCol) {
        this.taskId = taskId;
        this.fromCol = fromCol;
        this.toCol = toCol;
    }

    apply() {
        document.getElementById(this.toCol).appendChild(
            document.getElementById(this.taskId)
        );
    }

    undo() {
        document.getElementById(this.fromCol).appendChild(
            document.getElementById(this.taskId)
        );
    }
}

class Node {
    constructor(action) {
        this.action = action;
        this.prev = null;
        this.next = null;
    }
}

class History {
    constructor() {
        this.head = null;
        this.current = null;
    }

    add(action) {
        const node = new Node(action);

        // clear future
        if (this.current && this.current.next) {
            this.current.next = null;
        }

        if (!this.head) {
            this.head = node;
        } else {
            node.prev = this.current;
            if (this.current) this.current.next = node;
        }

        this.current = node;
        action.apply();
        renderTimeline();
    }

    undo() {
        if (!this.current) return;
        this.current.action.undo();
        this.current = this.current.prev;
        renderTimeline();
    }

    redo() {
        if (this.current && this.current.next) {
            this.current = this.current.next;
            this.current.action.apply();
            renderTimeline();
        }
    }
}

const history = new History();

// Initial task
const task = document.createElement("div");
task.className = "task";
task.id = "task1";
task.innerText = "Task 1 (Click to Move)";
task.onclick = moveTask;
document.getElementById("todo").appendChild(task);

function moveTask() {
    const task = document.getElementById("task1");
    const parent = task.parentElement.id;

    let next;
    if (parent === "todo") next = "progress";
    else if (parent === "progress") next = "done";
    else next = "todo";

    history.add(new Action("task1", parent, next));
}

function undo() {
    history.undo();
}

function redo() {
    history.redo();
}

function renderTimeline() {
    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";

    let temp = history.head;
    while (temp) {
        const div = document.createElement("div");
        div.className = "event";
        if (temp === history.current) div.classList.add("current");

        div.innerText = `${temp.action.taskId}: ${temp.action.fromCol} → ${temp.action.toCol}`;
        timeline.appendChild(div);

        temp = temp.next;
    }
}
