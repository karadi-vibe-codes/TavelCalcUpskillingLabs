import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

const COLLECTION = 'items';

// GET /api/items
export async function getItems(_req, res, next) {
  try {
    const items = await getDB().collection(COLLECTION).find({}).toArray();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

// GET /api/items/:id
export async function getItemById(req, res, next) {
  try {
    const item = await getDB()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

// POST /api/items
export async function createItem(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });

    const result = await getDB().collection(COLLECTION).insertOne({
      name,
      description: description || '',
      createdAt: new Date(),
    });

    res.status(201).json({ _id: result.insertedId, name, description });
  } catch (err) {
    next(err);
  }
}

// PUT /api/items/:id
export async function updateItem(req, res, next) {
  try {
    const { name, description } = req.body;
    const result = await getDB()
      .collection(COLLECTION)
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: { name, description, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

    if (!result) return res.status(404).json({ message: 'Item not found' });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/items/:id
export async function deleteItem(req, res, next) {
  try {
    const result = await getDB()
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ message: 'Item not found' });

    res.json({ message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
}
