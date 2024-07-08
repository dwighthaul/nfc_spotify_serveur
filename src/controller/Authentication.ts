import { userController } from "./db/UserController";

class Authentication {

	constructor() {
	}

	verifyLogin(username: string, password: string, callback: Function) {

		userController.getUserFromUserNameAndPassword(username, password).then((data) => {
			if (data) {
				callback({ status: "OK", data: data })
			} else {
				callback({ status: "KO", msg: "User not found" })
			}

		});
	}
}

const authentication = new Authentication()

export { authentication };

