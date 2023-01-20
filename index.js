import express from "express";
import { getLinks, addLink } from "./controllers/linksController.js";
import linkSchema from "./model/link.js";
import { generateShortLink } from "./middleware/generateShortLink.js";
import Ajv from "ajv";
const ajv = new Ajv();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/shortlinks", getLinks);
app.post("/shortlinks", addLink);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
