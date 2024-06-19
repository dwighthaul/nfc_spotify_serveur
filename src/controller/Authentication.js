const userController = require("./UserController")

class Authentication {

	constructor(userController) {
		this.userController = userController;
	}

	verifyLogin(username, password, callback) {
		//console.log("username", username, "| password", password)

		this.userController.getUserFromUserNameAndPassword(username, password).then((data) => {
			// verifier le password
			//console.log("data", data?.username)

			if (data) {
				//console.log("User " + data.username + " connecte")
				callback({ status: "OK", data: data })
			} else {
				callback({ status: "KO", msg: "User not found" })
			}

		});
	}
}

const authentication = new Authentication(userController)

module.exports = authentication