import express, { Request, Response } from 'express';
import { client } from '../../config/mongodb';
import { ObjectId } from 'mongodb';

export const todosRouter = express.Router();

// Ensure MongoDB client is connected
const db = client.db('todo-app');
const todosCollection = db.collection('todos');

// ================== GET Routes ==================

// GET all todos or by title query
todosRouter.get('/', async (req: Request, res: Response) => {
    try {
        const title = req.query.title as string | undefined;

        if (title) {
            const todo = await todosCollection.findOne({ title });
            if (!todo) return res.status(404).json({ message: 'Todo not found' });
            return res.status(200).json(todo);
        }

        const todos = await todosCollection.find({}).toArray();
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching todos', error: err });
    }
});

// GET todo by ID
todosRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const todo = await todosCollection.findOne({ _id: new ObjectId(id) });

        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json(todo);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching todo', error: err });
    }
});

// ================== POST Route ==================

// POST new todo
todosRouter.post('/create-todo', async (req: Request, res: Response) => {
    try {
        const newTodo = req.body;

        // Check for duplicate title
        const existingTodo = await todosCollection.findOne({ title: newTodo.title });
        if (existingTodo) return res.status(400).json({ message: 'Todo already exists' });

        const result = await todosCollection.insertOne(newTodo);
        res.status(201).json({
            message: 'Todo added successfully',
            todo: { _id: result.insertedId, ...newTodo }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error adding todo', error: err });
    }
});

// ================== PUT Route ==================

// UPDATE todo by ID
// Update todo partially by ID
todosRouter.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("ID received:", id);

        // Validate ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const updatedFields = req.body;
        if (!updatedFields || Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update provided' });
        }

        // Convert string to ObjectId
        const objectId = new ObjectId(id);

        const updateResult = await todosCollection.updateOne(
            
            { _id: objectId },
            { $set: updatedFields }
        );
        
        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        const updatedTodo = await todosCollection.findOne({ _id: objectId });
        res.status(200).json({
            message: 'Todo updated successfully',
            todo: updatedTodo
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating todo', error: err });
    }
});

// ================== DELETE Route ==================

// DELETE todo by ID
todosRouter.delete('/delete-todo/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const result = await todosCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) return res.status(404).json({ message: 'Todo not found' });

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting todo', error: err });
    }
});
