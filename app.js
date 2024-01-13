import express  from "express";
import dotenv  from "dotenv";
dotenv.config();
import getData from "./routers/paginationRoutes.js"
import dbConnection from "./config/db.connection.js"
const port = process.env.PORT
const app = express();
const dbURL = process.env.MONGODB_URL;
app.use(express.json());

app.use('/api/user',getData);

app.listen(port,()=>{
    console.log(`Server listing on port ${port}`);
})