let taskCounter = 0;

/* ================= ACTION ================= */
class Action {
    constructor(type, taskNode, from, to, oldText = null, newText = null) {
        this.type = type;
        this.taskNode = taskNode; // 🔥 always store node
        this.from = from;
        this.to = to;
        this.oldText = oldText;
        this.newText = newText;
    }

    apply() {
        switch (this.type) {
            case "CREATE":
                document.getElementById(this.to).appendChild(this.taskNode);
                break;

            case "MOVE":
                document.getElementById(this.to).appendChild(this.taskNode);
                break;

            case "EDIT":
                this.taskNode.querySelector("span").innerText = this.newText;
                break;

            case "DELETE":
                this.taskNode.remove();
                break;
        }
    }

    undo() {
        switch (this.type) {
            case "CREATE":
                this.taskNode.remove();
                break;

            case "MOVE":
                document.getElementById(this.from).appendChild(this.taskNode);
                break;

            case "EDIT":
                this.taskNode.querySelector("span").innerText = this.oldText;
                break;

            case "DELETE":
                document.getElementById(this.from).appendChild(this.taskNode);
                break;
        }
    }
}

/* ================= DLL NODE ================= */
class Node {
    constructor(action) {
        this.action = action;
        this.prev = null;
        this.next = null;
    }
}

/* ================= HISTORY (DLL) ================= */
class History {
    constructor() {
        this.head = null;
        this.current = null;
    }

    add(action) {
        const node = new Node(action);

        // clear future
        if (this.current && this.current.next) {
            let temp = this.current.next;
            while (temp) {
                let nxt = temp.next;
                temp.prev = temp.next = null;
                temp = nxt;
            }
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
        if (!this.current) {
            // redo from beginning
            if (this.head) {
                this.current = this.head;
                this.current.action.apply();
            }
        } else if (this.current.next) {
            this.current = this.current.next;
            this.current.action.apply();
        }
        renderTimeline();
    }
}

const history = new History();

/* ================= UI ================= */

function createTask() {
    const input = document.getElementById("taskInput");
    if (!input.value.trim()) return;

    const task = document.createElement("div");
    task.className = "task";
    task.id = "task" + (++taskCounter);

    const span = document.createElement("span");
    span.innerText = input.value;

    const moveBtn = document.createElement("button");
    moveBtn.innerText = "Move";
    moveBtn.onclick = () => moveTask(task);

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.onclick = () => editTask(task);

    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.onclick = () => deleteTask(task);

    task.append(span, moveBtn, editBtn, delBtn);

    history.add(new Action("CREATE", task, null, "todo"));
    input.value = "";
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString(); // date + time (local)
}



function moveTask(task) {
    const from = task.parentElement.id;
    const to =
        from === "todo" ? "progress" :
        from === "progress" ? "done" : "todo";

    history.add(new Action("MOVE", task, from, to));
}

function editTask(task) {
    const span = task.querySelector("span");
    const newText = prompt("Edit task", span.innerText);
    if (newText === null) return;

    history.add(new Action(
        "EDIT",
        task,
        null,
        null,
        span.innerText,
        newText
    ));
}

function deleteTask(task) {
    const from = task.parentElement.id;
    history.add(new Action("DELETE", task, from, null));
}

function undo() { history.undo(); }
function redo() { history.redo(); }

/* ================= TIMELINE ================= */
function renderTimeline() {
    const t = document.getElementById("timeline");
    t.innerHTML = "";

    let temp = history.head;
    while (temp) {
        const div = document.createElement("div");
        div.className = "event";
        if (temp === history.current) div.classList.add("current");
        div.innerText = temp.action.type;
        t.appendChild(div);
        temp = temp.next;
    }
}
