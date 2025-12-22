import React, { useState, useRef } from "react";
import { History, Action } from "./History";
import Board from "./components/Board";
import Timeline from "./components/Timeline";

function App() {
    const [tasks, setTasks] = useState([]);
    const [version, setVersion] = useState(0);
    const history = useRef(new History(() => setVersion(v => v + 1)));

    const applyActions = () => {
        let temp = history.current?.head;
        let result = [];

        let node = history.current?.head;
        while (node && node !== history.current?.next) {
            const a = node.action;
            switch (a.type) {
                case "CREATE":
                    result.push({ ...a.task });
                    break;
                case "MOVE":
                    result = result.map(t =>
                        t.id === a.task.id ? { ...t, status: a.to } : t
                    );
                    break;
                case "EDIT":
                    result = result.map(t =>
                        t.id === a.task.id ? { ...t, title: a.newText } : t
                    );
                    break;
                case "DELETE":
                    result = result.filter(t => t.id !== a.task.id);
                    break;
            }
            node = node.next;
        }
        setTasks(result);
    };

    React.useEffect(applyActions, [version]);

    const addTask = title => {
        const task = { id: Date.now(), title, status: "todo" };
        history.current.add(new Action("CREATE", task));
    };

    const moveTask = task => {
        const next =
            task.status === "todo" ? "progress" :
            task.status === "progress" ? "done" : "todo";

        history.current.add(
            new Action("MOVE", task, task.status, next)
        );
    };

    const editTask = (task, text) => {
        history.current.add(
            new Action("EDIT", task, null, null, task.title, text)
        );
    };

    const deleteTask = task => {
        history.current.add(new Action("DELETE", task));
    };

    return (
        <div>
            <header>
                <h1>React Kanban Timeline</h1>
                <p>Unlimited Undo / Redo using Doubly Linked List</p>
            </header>

            <div className="controls">
                <button onClick={() => {
                    const t = prompt("Task title");
                    if (t) addTask(t);
                }}>Add Task</button>

                <button onClick={() => history.current.undo()}>Undo</button>
                <button onClick={() => history.current.redo()}>Redo</button>
            </div>

            <Board
                tasks={tasks}
                onMove={moveTask}
                onEdit={editTask}
                onDelete={deleteTask}
            />

            <Timeline items={history.current.getTimeline()} />
        </div>
    );
}

export default App;
