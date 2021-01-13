const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
const { protectRoute } = require("./middlewares/protectRoute");
const app = express();
dotenv.config({ path: "./config.env" });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/users", userRouter);
app.get("/dashboard", (req, res) => {
    console.log("headers", req.headers);
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.listen(
    process.env.PORT,
    console.log(`Server started on port ${process.env.PORT}`)
);