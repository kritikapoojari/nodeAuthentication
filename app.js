const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
var cors = require("cors");
const userRouter = require("./routes/userRoutes");
const protectRoute = require("./middlewares/protectRoute");
const app = express();
dotenv.config({ path: "./config.env" });

app.use(cors());
app.use(function (req, res, next) {
	res.header("Content-Type", "application/json;charset=UTF-8");
	res.header("Access-Control-Allow-Credentials", true);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
app.use(express.json());

mongoose.connect(
	process.env.DATABASE_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err, connection) => {
		if (err) {
			return console.log("Error in connecting to the datatbase", err);
		}
		app.get("/", (req, res) => {
			res.send("Successfully Displaying the Page");
		});
		app.get("/dashboard", protectRoute);
		app.use("/users", userRouter);
		app.listen(process.env.PORT, () => {
			console.log(`Server started on port ${process.env.PORT}`);
		});
	}
);
