const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const baseRoutes = require("./routes/baseRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/", baseRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

module.exports = app;
