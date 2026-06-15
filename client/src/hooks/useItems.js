import { useState, useEffect, useCallback } from 'react';
import { itemsApi } from '../api/itemsApi.js';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await itemsApi.getAll();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const createItem = async (body) => {
    const newItem = await itemsApi.create(body);
    setItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateItem = async (id, body) => {
    const updated = await itemsApi.update(id, body);
    setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
    return updated;
  };

  const deleteItem = async (id) => {
    await itemsApi.remove(id);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  return { items, loading, error, refetch: fetchItems, createItem, updateItem, deleteItem };
}
