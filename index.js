import express from "express";
import { join } from "path";
import {dirname} from "path";
import {fileURLToPath} from "url";
import restaurantRoutes from "./Routes/restaurants.routes.js";

//Initialization
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//Settings
app.set("port", process.env.PORT || 4000);


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

//Routes
app.get("/", (req, res) => {
    res.send("API REST");
});

//Public files
app.use(express.static(join(__dirname, 'public')));

app.use(restaurantRoutes);


//Run server
app.listen(app.get("port"), ()=>
    console.log("Server on port", app.get("port")));

