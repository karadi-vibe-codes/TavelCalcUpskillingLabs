import { useState } from 'react';
import { useItems } from '../hooks/useItems.js';
import ItemForm from '../components/ItemForm.jsx';
import ItemCard from '../components/ItemCard.jsx';

export default function ItemsPage() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useItems();
  const [editTarget, setEditTarget] = useState(null);
  const [formError, setFormError] = useState(null);

  async function handleCreate(data) {
    setFormError(null);
    try {
      await createItem(data);
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleUpdate(data) {
    setFormError(null);
    try {
      await updateItem(editTarget._id, data);
      setEditTarget(null);
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteItem(id);
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <div className="page">
      <h2>Items</h2>

      <section className="form-section">
        <h3>{editTarget ? 'Edit Item' : 'New Item'}</h3>
        <ItemForm
          key={editTarget?._id ?? 'new'}
          initialValues={editTarget}
          onSubmit={editTarget ? handleUpdate : handleCreate}
          onCancel={editTarget ? () => setEditTarget(null) : undefined}
        />
        {formError && <p className="error">{formError}</p>}
      </section>

      <section className="items-section">
        {loading && <p>Loading…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && items.length === 0 && <p>No items yet. Create one above.</p>}
        <div className="items-grid">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onEdit={() => setEditTarget(item)}
              onDelete={() => handleDelete(item._id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
