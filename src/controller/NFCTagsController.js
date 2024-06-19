
const { DataTypes } = require('sequelize');
const NFCTags = require('../model/NFCTags');
const User = require('../model/User');
const userController = require('./UserController');

class NFCTagsController {
	initSchema(SQLConnection) {
		this.sqlConnection = SQLConnection
		NFCTags.init(
			{
				tagName: {
					type: DataTypes.STRING,
					unique: true,
					notNull: true,
					notEmpty: true
				},
				playlist: {
					type: DataTypes.STRING,
					notNull: true,
					notEmpty: true
				},
				device: {
					type: DataTypes.STRING,
					notNull: true,
					notEmpty: true
				}
			},
			{ sequelize: SQLConnection.sequelize },
		)
	}

	async initData() {

		userController.getUserByUsername().then((data) => {
			//console.log("Id trouve : ", data[0].id)
			NFCTags.bulkCreate([
				{ tagName: "METAL fuck yeah - tag 1", playlist: "b6df1ac233ea4d359790c9a95ccb1ebb_2", device: "dea14dbcfe904185b99bee1d5d75ede5_2", userId: data[0].id },
				{ tagName: "Ma playlist du matin", playlist: "b6df1ac233ea4d359790c9a95ccb1ebb_2", device: "dea14dbcfe904185b99bee1d5d75ede5_2", userId: data[0].id }

			]).then((tables) => {
				//console.log("Tags data have been saved")
			});


		})

	}

	async getTags() {

		return await NFCTags.findAll();
	}

}
const nfcTagsController = new NFCTagsController();


module.exports = nfcTagsController