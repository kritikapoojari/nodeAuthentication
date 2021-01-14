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
	const newUser = new User(req.body);
	newUser
		.save()
		.then((data) => {
			return res.status(200).json({
				status: "Successful",
				message: "New User Registred",
			});
		})
		.catch((err) => {
			console.log(err);
			return res.send({ message: err.message });
		});
};

const loginUser = async (req, res, next) => {
	try {
		let jwtToken = await generateToken(
			{ email: req.currentUser.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);
		res.cookie("jwt", jwtToken);
		res.status(200).json({
			status: "Successful",
			message: "Sucess Login",
			data: [
				{
					jwt: jwtToken,
				},
			],
		});
	} catch (err) {
		console.log(err);
		return sendErrorMessage(
			new AppError(400, "Unsucessful", "Internal Error"),
			req,
			res
		);
	}
};

module.exports.singUpUser = singUpUser;
module.exports.loginUser = loginUser;
