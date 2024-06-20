
const { DataTypes } = require('sequelize');
const Role = require('../../model/Role');

class RoleController {
	initSchema(SQLConnection) {
		this.sqlConnection = SQLConnection
		Role.init(
			{
				rolename: {
					type: DataTypes.STRING,
					unique: true,
					notNull: true,
					notEmpty: true
				},
				permissions: {
					type: DataTypes.STRING,
					notNull: true,
					notEmpty: true
				}
			},
			{ sequelize: SQLConnection.sequelize },
		)
	}

	async initData() {
		Role.bulkCreate([
			{ rolename: "admin", permissions: "read_users,update_user,spotify_login,spotify_run" },
			{ rolename: "user", permissions: "spotify_login,spotify_run" }

		]).then((tables) => {
			console.log("Roles data have been saved")
		});
	}

	async getRoles() {
		return await Role.findAll();
	}


	async getRoleByName(rolename) {
		return await Role.findOne({
			where: {
				"rolename": rolename
			}
		});
	}

}
const rolesController = new RoleController();


module.exports = rolesController