const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const AppError = require("../helpers/appError");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const fileName = path.join(__dirname, "..", "data", "users.json");
const users = JSON.parse(fs.readFileSync(fileName, "utf-8"));

const checkRequestBody = (req, res, next) => {
	console.log("checkReq");
	let validationArray;
	switch (req.url) {
		case "/singup":
			validationArray = ["email", "password", "checkPassword"];
			break;
		case "/login":
			validationArray = ["email", "password"];
			break;
		default:
			return sendErrorMessage(
				new AppError(404, "Unsucessful", "Requested url is not avaible"),
				req,
				res
			);
			break;
	}
	let result = validationArray.every((key) => {
		return req.body[key] && req.body[key].trim().length;
	});
	if (!result) {
		return sendErrorMessage(
			new AppError(400, "Unsuceesful", "Invalid Body"),
			req,
			res
		);
	}
	next();
};

const isEmailValid = (req, res, next) => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const isValid = re.test(req.body.email.toLowerCase());

	if (!isValid) {
		return sendErrorMessage(
			new AppError(400, "unsuccessful", "Email is not valid"),
			req,
			res
		);
	}
	next();
};

const checkConfirmPassword = (req, res, next) => {
	if (req.body.password === req.body.confirmPassword) {
		return sendErrorMessage(
			new AppError(400, "Unsucessful", "Password  does not match"),
			req,
			res
		);
	}
	next();
};

const isEmailUnquie = (req, res, next) => {
	let findUser = users.find((user) => {
		return user.email == req.body.email;
	});
	if (findUser) {
		return sendErrorMessage(
			new AppError(401, "Unsucessul", "Already registered"),
			req,
			res
		);
	}

	next();
};

const createPasswordHash = async (req, res, next) => {
	try {
		let salt = await bcrypt.genSalt(10);
		req.body.password = await bcrypt.hash(req.body.password, salt);
		next();
	} catch (err) {
		console.log(err);
		return sendErrorMessage(
			new AppError(500, "Unsuceesful", "Intrnal Error"),
			req,
			res
		);
	}
};

const isUserRegistered = (req, res, next) => {
	let findUser = users.find((user) => {
		return user.email == req.body.email;
	});

	if (!findUser) {
		return sendErrorMessage(
			new AppError(422, "Unsucessful", "requested user not registed"),
			req,
			res
		);
	}
	req.currentUser = { ...findUser };
	console.log(req.currentUser);
	next();
};

module.exports.checkRequestBody = checkRequestBody;
module.exports.isEmailValid = isEmailValid;
module.exports.checkConfirmPassword = checkConfirmPassword;
module.exports.isEmailUnquie = isEmailUnquie;
module.exports.createPasswordHash = createPasswordHash;
module.exports.isUserRegistered = isUserRegistered;
