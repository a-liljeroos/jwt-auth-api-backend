require("dotenv").config();
const express = require("express");
var cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const corsOptions = require("./options");
app.use(cors());
app.use(express.json());
const port = 5000;

app.use("/api/auth", cors(corsOptions), require("./routes/auth"));

app.listen(port, () => {
  console.log("server is running at port: ", port);
});
