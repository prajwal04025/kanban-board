import Task from "./Task";

export default function Column({ title, status, tasks, ...handlers }) {
    return (
        <div className="column">
            <h2>{title}</h2>
            {tasks.filter(t => t.status === status)
                .map(task => (
                    <Task key={task.id} task={task} {...handlers} />
                ))}
        </div>
    );
}
