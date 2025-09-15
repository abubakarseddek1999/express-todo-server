import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const port = process.env.PORT || 3000;
let server: any;

const startServer = async () => {
    try {
        // Store sensitive data in env instead of hardcoding
        // Connect to MongoDB
        await mongoose.connect( process.env.MONGODB_URI || "");

        console.log("✅ Connected to MongoDB using Mongoose!");

        server = app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err);
        process.exit(1);
    }
};

// Graceful shutdown (important for production)
process.on("SIGINT", async () => {
    console.log("🔌 Closing MongoDB connection...");
    await mongoose.connection.close();
    process.exit(0);
});

startServer();
