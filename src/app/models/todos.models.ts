//  there are has many models as there are many schemas :title,description,date etc


import { model, Schema } from "mongoose";
import { ITodo } from "../interface/todos.interface";

export const todosSchema = new Schema< ITodo >({
    title: { type: String, required: true },
    description: String,
    createdAt: Date,
    updatedAt: Date,
    completed: Boolean,
}, { timestamps: true,versionKey:false }); // Automatically manage createdAt and updatedAt

const Todos = model('Todos', todosSchema);

export default Todos;