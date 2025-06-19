const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const baseRoutes = require("./routes/baseRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/", baseRoutes);
app.use("/auth", authRoutes);


module.exports = app;
