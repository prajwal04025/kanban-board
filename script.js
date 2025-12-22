let taskCounter = 0;

/* ---------- ACTION CLASS ---------- */
class Action {
    constructor(type, taskId, from, to, oldText = null, newText = null) {
        this.type = type;
        this.taskId = taskId;
        this.from = from;
        this.to = to;
        this.oldText = oldText;
        this.newText = newText;
    }

    apply() {
        const task = document.getElementById(this.taskId);

        switch (this.type) {
            case "CREATE":
                document.getElementById(this.to).appendChild(task);
                break;

            case "MOVE":
                document.getElementById(this.to).appendChild(task);
                break;

            case "EDIT":
                task.querySelector("span").innerText = this.newText;
                break;

            case "DELETE":
                task.remove();
                break;
        }
    }

    undo() {
        const task = document.getElementById(this.taskId);

        switch (this.type) {
            case "CREATE":
                task.remove();
                break;

            case "MOVE":
                document.getElementById(this.from).appendChild(task);
                break;

            case "EDIT":
                task.querySelector("span").innerText = this.oldText;
                break;

            case "DELETE":
                document.getElementById(this.from).appendChild(task);
                break;
        }
    }
}

/* ---------- DLL NODE ---------- */
class Node {
    constructor(action) {
        this.action = action;
        this.prev = null;
        this.next = null;
    }
}

/* ---------- HISTORY (DLL) ---------- */
class History {
    constructor() {
        this.head = null;
        this.current = null;
    }

    add(action) {
        const node = new Node(action);

        // Clear future history
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
        if (this.current && this.current.next) {
            this.current = this.current.next;
            this.current.action.apply();
            renderTimeline();
        }
    }
}

const history = new History();

/* ---------- UI FUNCTIONS ---------- */

function createTask() {
    const input = document.getElementById("taskInput");
    if (!input.value.trim()) return;

    const id = "task" + (++taskCounter);
    const task = document.createElement("div");
    task.id = id;
    task.className = "task";

    const text = document.createElement("span");
    text.innerText = input.value;

    const moveBtn = document.createElement("button");
    moveBtn.innerText = "Move";
    moveBtn.onclick = () => moveTask(id);

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.onclick = () => editTask(id);

    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.onclick = () => deleteTask(id);

    task.append(text, moveBtn, editBtn, delBtn);
    document.body.appendChild(task); // temp attach

    history.add(new Action("CREATE", id, null, "todo"));
    input.value = "";
}

function moveTask(id) {
    const task = document.getElementById(id);
    const from = task.parentElement.id;
    const to = from === "todo" ? "progress" : from === "progress" ? "done" : "todo";
    history.add(new Action("MOVE", id, from, to));
}

function editTask(id) {
    const task = document.getElementById(id);
    const span = task.querySelector("span");
    const newText = prompt("Edit task", span.innerText);
    if (newText === null) return;

    history.add(new Action("EDIT", id, null, null, span.innerText, newText));
}

function deleteTask(id) {
    const task = document.getElementById(id);
    const from = task.parentElement.id;
    history.add(new Action("DELETE", id, from, null));
}

function undo() { history.undo(); }
function redo() { history.redo(); }

/* ---------- TIMELINE ---------- */
function renderTimeline() {
    const t = document.getElementById("timeline");
    t.innerHTML = "";

    let temp = history.head;
    while (temp) {
        const div = document.createElement("div");
        div.className = "event";
        if (temp === history.current) div.classList.add("current");

        div.innerText = `${temp.action.type} : ${temp.action.taskId}`;
        t.appendChild(div);
        temp = temp.next;
    }
}
