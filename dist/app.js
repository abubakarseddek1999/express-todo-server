"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todos_route_1 = require("./app/totdos/todos.route");
const app = (0, express_1.default)();
app.use(express_1.default.json()); // <-- parse JSON bodies
// ================= ROUTES ==================
app.use('/todos', todos_route_1.todosRouter);
// Root route
app.get('/', (req, res) => {
    res.send('My todo app is running');
});
// ================= 404 Handler ==================
// যদি কোনো route match না হয়
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
// ================= GLOBAL ERROR HANDLER ==================
app.use((err, req, res, next) => {
    console.error(err); // console log for debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        error: err.stack || null
    });
});
exports.default = app;
