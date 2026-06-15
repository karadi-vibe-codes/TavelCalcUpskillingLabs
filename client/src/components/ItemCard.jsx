export default function ItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="item-card">
      <h4>{item.name}</h4>
      {item.description && <p>{item.description}</p>}
      <div className="card-actions">
        <button className="btn btn-sm" onClick={onEdit}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
