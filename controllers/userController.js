const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const AppError = require("../helpers/appError");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const User = require("../models/userModel");
const { generateToken } = require("../helpers/jwtAutentication");

const fileName = path.join(__dirname, "..", "data", "users.json");
const users = JSON.parse(fs.readFileSync(fileName, "utf-8"));

const singUpUser = (req, res, next) => {
	let newUser = new User(req.body.email, req.body.password);
	// console.log("New user", newUser);
	users.push(newUser);
	fs.writeFile(fileName, JSON.stringify(users, null, 2), (err) => {
		if (err) {
			res.send("Internal Error");
			return err;
		}
		res.send("New User created");
	});

	res.send("New User created");
};

const loginUser = async (req, res, next) => {
	// console.log("Maine login hu bhai 111  ");

	console.log("Current User", req.currentUser);

	try {
		let result = await bcrypt.compare(
			req.body.password,
			req.currentUser.password
		);
		if (req.body.password != req.currentUser.password) {
			return sendErrorMessage(
				new AppError(400, "Unsucessful", "Incorrect Password"),
				req,
				res
			);
		}
		let jwtToken = await generateToken(
			{ email: req.currentUser.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);
		// console.log("Maine login hu bhai 222");

		//console.log("genertaed token ", jwtToken);
		//login and password
		console.log("User", req.currentUser);
		// res.send("User logged in sucessfully");

		res.cookie("jwt", jwtToken);
		res.status(200).json({
			status: "Sucess Login",
			data: [
				{
					jwt: jwtToken,
				},
			],
		});
		// res.send("USer logged in sucessfully");
	} catch (err) {
		// res.send("Error hai bhai");
		console.log(err);
		return sendErrorMessage(
			new AppError(400, "Unsucessful", "Internal Error"),
			req,
			res
		);
	}
	// console.log("Maine login hu bhai 3rd vala");
};

module.exports.singUpUser = singUpUser;
module.exports.loginUser = loginUser;
