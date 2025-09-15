//  there are the interface for the todos
export interface ITodo {
  _id?: string; // Optional because MongoDB generates this
  title: string;
  description?: string; // Optional field
  completed: boolean;
  createdAt?: Date; // Optional, can be set by the database
  updatedAt?: Date; // Optional, can be set by the database
}
