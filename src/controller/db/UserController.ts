import { DataTypes, Op } from 'sequelize';
import NFCTags from '../../model/dto/db/NFCTags';
import Role from '../../model/dto/db/Role';
import User from '../../model/dto/db/User';
import { rolesController } from './RoleController';


class UserController {
	sqlConnection;

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
				}
			},
			{ sequelize: SQLConnection.sequelize },
		)
	}

	async getUsers() {
		const users = await User.findAll({ include: [Role, NFCTags] });
		return users
	}

	async getRolesDepuisIdUser(id) {
		return await User.findOne({
			attributes: ["roleId"],
			include: Role,
			where: {
				"id": id
			}
		});
	}

	async getClientIdAndSecret(id) {
		return await User.findOne({
			attributes: ['clientId', 'clientSecret'],
			where: {
				"id": id
			}
		})
	}

	async getUserByUsername(username: string) {
		return await User.findOne({
			where: {
				"username": { [Op.iLike]: username }
			}
		});
	}

	async getUserFromUserNameAndPassword(username, password) {

		return await User.findOne({
			include: Role,
			attributes: ['id', 'username', 'createdAt'],
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
		//console.log("my user name =" + username);
		return await User.update(
			{
				"clientId": clientId,
				"clientSecret": clientSecret
			},
			{
				where: {
					"username": username,
				},
			},
		).then(callback);
	}


	async saveSettings(client_id, secret_client, idUser) {

		return await User.findOne({
			attributes: ['username', 'createdAt'],
			where: {
				"id": idUser,
			},
		});
	}


	async initData() {

		return rolesController.getRoleByName("admin").then((roleAdmin) => {
			const users = User.bulkCreate([
				{ username: "Dwighthaul", clientId: "b6df1ac233ea4d359790c9a95ccb1ebb", clientSecret: "dea14dbcfe904185b99bee1d5d75ede5", passwordHash: "YWRtaW4=", roleId: roleAdmin.id, },
				{ username: "Jorane", clientId: "572c12e9e5c24075a129cb1329b33ca6", clientSecret: "991dcba4bfd744b5bba7c62a98d4d82d", passwordHash: "YWRtaW4=", roleId: roleAdmin.id }
			]).then((tables) => {
				console.log("Users data have been saved : " + tables.length + " users have been added")
			});

		})

	}
}
const userController = new UserController();


export { userController };

