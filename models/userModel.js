const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqid = require("uniqid");

const userSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			default: uniqid(),
		},
		email: {
			type: String,
			required: [true, "Email cannnot be empty"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Password cannot be empty"],
		},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.generateHash = async function () {
	return await bcrypt.hash(this.password, 10);
};
userSchema.pre("save", async function (next) {
	this.password = await this.generateHash();
	next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
