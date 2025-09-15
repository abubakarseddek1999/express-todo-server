import express, { Application, NextFunction, Request, Response } from 'express';
import { todosRouter } from './app/controllers/todos.controller';


const app: Application = express();
app.use(express.json());  // <-- parse JSON bodies

// ================= ROUTES ==================
app.use('/todos', todosRouter);

// Root route
app.get('/', (req: Request, res: Response) => {
    res.send('My todo app is running');
});

// ================= 404 Handler ==================
// যদি কোনো route match না হয়
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        
        success: false,
        message: 'Route not found'
    });
});

// ================= GLOBAL ERROR HANDLER ==================
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // console log for debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        error: err.stack || null
    });
});

export default app;
