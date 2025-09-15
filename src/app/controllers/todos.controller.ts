import { Request, Response } from "express";
import express from "express";
import Todos from "../models/todos.models"; // Your Mongoose model

export const todosRouter = express.Router();

// ================== GET Routes ==================

// GET all todos or by title query
todosRouter.get("/", async (req: Request, res: Response) => {
  try {
    const title = req.query.title as string | undefined;

    if (title) {
      const todo = await Todos.findOne({ title });
      if (!todo) return res.status(404).json({ message: "Todo not found" });
      return res.status(200).json(todo);
    }

    const todos = await Todos.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos", error: err });
  }
});

// GET todo by ID
todosRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const todo = await Todos.findById(id); // ✅ no need for ObjectId

    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todo", error: err });
  }
});

// ================== POST Route ==================

// POST new todo
todosRouter.post("/create-todo", async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    // Check for duplicate title
    const existingTodo = await Todos.findOne({ title });
    if (existingTodo)
      return res.status(400).json({ message: "Todo already exists" });

    const newTodo = await Todos.create(req.body); // ✅ use create

    res.status(201).json({
      message: "Todo added successfully",
      todo: newTodo,
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding todo", error: err });
  }
});

// ================== PATCH Route ==================

// UPDATE todo by ID
todosRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const updatedTodo = await Todos.findByIdAndUpdate(id, req.body, {
      new: true, // return updated doc
      runValidators: true, // validate schema rules
    });

    if (!updatedTodo)
      return res.status(404).json({ message: "Todo not found" });

    res.status(200).json({
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating todo", error: err });
  }
});

// ================== DELETE Route ==================

// DELETE todo by ID
todosRouter.delete("/delete-todo/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deletedTodo = await Todos.findByIdAndDelete(id); // ✅

    if (!deletedTodo)
      return res.status(404).json({ message: "Todo not found" });

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo", error: err });
  }
});
