import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import route from "./router/routes.js";
import cors from 'cors'

const app = express();
const port = 3000;

// Activate logging middleware
app.use(morgan('dev'))

app.use(cors());
app.use(bodyParser.json())

// Load routes
app.use(route)

app.listen(port, () => console.log(`server running on port: ${port}`))