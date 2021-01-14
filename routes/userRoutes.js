const express = require("express");
const { singUpUser, loginUser } = require("../controllers/userController");
const {
	checkRequestBody,
	isEmailValid,
	isEmailUnquie,
	checkConfirmPassword,
	createPasswordHash,
	isUserRegistered,
} = require("../middlewares/userMiddlewares");

const router = express.Router();

router
	.route("/singup")
	.post(
		checkRequestBody,
		isEmailValid,
		isEmailUnquie,
		checkConfirmPassword,
		createPasswordHash,
		singUpUser,
		isUserRegistered
	);
router.route("/login").post(checkRequestBody, isUserRegistered, loginUser);
// router.route("/logout").get();

module.exports = router;
