import Column from "./Column";

export default function Board({ tasks, onMove, onEdit, onDelete }) {
    return (
        <div className="board">
            <Column title="To Do" status="todo" {...{ tasks, onMove, onEdit, onDelete }} />
            <Column title="In Progress" status="progress" {...{ tasks, onMove, onEdit, onDelete }} />
            <Column title="Done" status="done" {...{ tasks, onMove, onEdit, onDelete }} />
        </div>
    );
}
