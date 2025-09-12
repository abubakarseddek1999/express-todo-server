"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todosRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("../../config/mongodb");
const mongodb_2 = require("mongodb");
exports.todosRouter = express_1.default.Router();
// Ensure MongoDB client is connected
const db = mongodb_1.client.db('todo-app');
const todosCollection = db.collection('todos');
// ================== GET Routes ==================
// GET all todos or by title query
exports.todosRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const title = req.query.title;
        if (title) {
            const todo = yield todosCollection.findOne({ title });
            if (!todo)
                return res.status(404).json({ message: 'Todo not found' });
            return res.status(200).json(todo);
        }
        const todos = yield todosCollection.find({}).toArray();
        res.status(200).json(todos);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching todos', error: err });
    }
}));
// GET todo by ID
exports.todosRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const todo = yield todosCollection.findOne({ _id: new mongodb_2.ObjectId(id) });
        if (!todo)
            return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json(todo);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching todo', error: err });
    }
}));
// ================== POST Route ==================
// POST new todo
exports.todosRouter.post('/create-todo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTodo = req.body;
        // Check for duplicate title
        const existingTodo = yield todosCollection.findOne({ title: newTodo.title });
        if (existingTodo)
            return res.status(400).json({ message: 'Todo already exists' });
        const result = yield todosCollection.insertOne(newTodo);
        res.status(201).json({
            message: 'Todo added successfully',
            todo: Object.assign({ _id: result.insertedId }, newTodo)
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error adding todo', error: err });
    }
}));
// ================== PUT Route ==================
// UPDATE todo by ID
// Update todo partially by ID
exports.todosRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log("ID received:", id);
        // Validate ID
        if (!mongodb_2.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const updatedFields = req.body;
        if (!updatedFields || Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update provided' });
        }
        // Convert string to ObjectId
        const objectId = new mongodb_2.ObjectId(id);
        const updateResult = yield todosCollection.updateOne({ _id: objectId }, { $set: updatedFields });
        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        const updatedTodo = yield todosCollection.findOne({ _id: objectId });
        res.status(200).json({
            message: 'Todo updated successfully',
            todo: updatedTodo
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating todo', error: err });
    }
}));
// ================== DELETE Route ==================
// DELETE todo by ID
exports.todosRouter.delete('/delete-todo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield todosCollection.deleteOne({ _id: new mongodb_2.ObjectId(id) });
        if (result.deletedCount === 0)
            return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json({ message: 'Todo deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting todo', error: err });
    }
}));
