export default function Task({ task, onMove, onEdit, onDelete }) {
    return (
        <div className="task">
            <span>{task.title}</span>
            <button onClick={() => onMove(task)}>Move</button>
            <button onClick={() => {
                const t = prompt("Edit task", task.title);
                if (t) onEdit(task, t);
            }}>Edit</button>
            <button onClick={() => onDelete(task)}>Delete</button>
        </div>
    );
}
