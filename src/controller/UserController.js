
const { DataTypes, Op } = require('sequelize');
const User = require('../model/User');

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
		const users = await User.findAll();
		return users
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

	async initData() {
		const users = User.bulkCreate([
			{ username: "Dwighthaul", clientId: "b6df1ac233ea4d359790c9a95ccb1ebb_2", clientSecret: "dea14dbcfe904185b99bee1d5d75ede5_2", passwordHash: "YWRtaW4=" },
			{ username: "Jorane", clientId: "b6df1ac233ea4d359790c9a95ccb1ebb", clientSecret: "dea14dbcfe904185b99bee1d5d75ede5", passwordHash: "YWRtaW4=" }
		]).then((tables) => {
			tables.forEach((user) => {
				//user.save()
			})
			console.log("Users data have been saved")
		});
	}

}
const userController = new UserController();


module.exports = userController