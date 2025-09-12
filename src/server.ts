import { MongoClient, ServerApiVersion } from "mongodb";
import app from "./app";
import { client } from "./config/mongodb";

const port = 3000;
let server;






const startServer = async () => {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    server = app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
};
startServer();