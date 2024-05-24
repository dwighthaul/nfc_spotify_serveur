
const { DataTypes, Op } = require('sequelize');
const User = require('../model/User');
const NFCTags = require('../model/NFCTags');

class UserController {
	initSchema(SQLConnection) {
		this.sqlConnection = SQLConnection
		User.init(
			{
				username: {
					type: DataTypes.STRING,
					unique: true,
					notNull: true,
					notEmpty: true
				},
				passwordHash: {
					type: DataTypes.STRING,
					notNull: true,
					notEmpty: true
				},
				clientId: {
					type: DataTypes.STRING,
					unique: true,
					notNull: true,
					notEmpty: true
				},
				clientSecret: {
					type: DataTypes.STRING,
					unique: true,
					notNull: true,
					notEmpty: true
				},
			},
			{ sequelize: SQLConnection.sequelize },
		)
	}

	async getUsers() {
		const users = await User.findAll({ include: NFCTags });
		return users
	}

	async getClientIdAndSecret(username) {
		return await User.findOne({
			attributes: ['clientId', 'clientSecret'],
			where: {
				"username": username
			}
		})
	}
	
	async getUserByUsername(username) {
		return await User.findOne({
			where: {
				"username": username
			}
		});
	}

	async getUserByUsername() {
		return await User.findAll();
	}

	async getUserFromUserNameAndPassword(username, password) {

		return await User.findOne({
			attributes: ['username', 'createdAt'],
			where: {
				[Op.and]: [
					this.sqlConnection.sequelize.where(
						this.sqlConnection.sequelize.fn('lower', this.sqlConnection.sequelize.col('username')),
						this.sqlConnection.sequelize.fn('lower', username)
					),
					this.sqlConnection.sequelize.where(
						this.sqlConnection.sequelize.fn('lower', this.sqlConnection.sequelize.col('passwordHash')),
						this.sqlConnection.sequelize.fn('lower', btoa(password))
					)
				]
			}
		});
	}

	async updateSettings(clientId, clientSecret, username, callback) {
		console.log("my user name =" + username);
		return await User.update(
			{ "clientId" :  clientId,
			  "clientSecret" : clientSecret
			},
			{
			  where: {
				"username": username,
			  },
			},
		  ).then(callback);
	}


	async saveSettings(client_id, secret_client) {

		return await User.findOne({
			attributes: ['username', 'createdAt'],
			where: {
				[Op.and]: [
					this.sqlConnection.sequelize.where(
						this.sqlConnection.sequelize.fn('lower', this.sqlConnection.sequelize.col('username')),
						this.sqlConnection.sequelize.fn('lower', username)
					),
					this.sqlConnection.sequelize.where(
						this.sqlConnection.sequelize.fn('lower', this.sqlConnection.sequelize.col('passwordHash')),
						this.sqlConnection.sequelize.fn('lower', btoa(password))
					)
				]
			}
		});
	}


	async initData() {


		const users = User.bulkCreate([
			{ username: "Dwighthaul", clientId: "b6df1ac233ea4d359790c9a95ccb1ebb_2", clientSecret: "dea14dbcfe904185b99bee1d5d75ede5_2", passwordHash: "YWRtaW4=", NFCTags: [{ tagId: "1234_2", playlist: "b6df1ac233ea4d359790c9a95ccb1ebb_3", device: "dea14dbcfe904185b99bee1d5d75ede5_4" }] },
			{ username: "Jorane", clientId: "b6df1ac233ea4d359790c9a95ccb1ebb", clientSecret: "dea14dbcfe904185b99bee1d5d75ede5", passwordHash: "YWRtaW4=" }
		]).then((tables) => {
			console.log("Users data have been saved : " + tables.length + " users have been added")
		});
	}
}
const userController = new UserController();


module.exports = userController
