require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.status(200).sendFile(path.join(__dirname, "/index.html"))
);

app.use("/", routes);

app.listen(process.env.API_PORT, () => console.log("API is Running up..."));
