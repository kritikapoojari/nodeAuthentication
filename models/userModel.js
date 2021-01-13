const uniqid = require("uniqid");
class User {
    constructor(email, password) {
        this.userId = uniqid();
        this.email = email;
        this.password = password; //hashed later
        this.createdAt = Date.now();
    }
}

module.exports = User;