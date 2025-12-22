export default function Timeline({ items }) {
    return (
        <div className="timeline">
            <h2>Action Timeline</h2>
            {items.map((i, idx) => (
                <div key={idx} className={`event ${i.active ? "current" : ""}`}>
                    {i.type}
                </div>
            ))}
        </div>
    );
}
