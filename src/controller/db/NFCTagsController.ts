import NFCTags from "../../model/dto/db/NFCTags";
import { userController } from "./UserController";

const { DataTypes } = require('sequelize');

class NFCTagsController {
	sqlConnection;
	initSchema(SQLConnection) {
		this.sqlConnection = SQLConnection
		NFCTags.init(
			{
				tagName: {
					type: DataTypes.STRING,
					unique: false,
					notNull: true,
					notEmpty: true
				},
				tagId: {
					type: DataTypes.STRING,
					unique: true,
					notNull: true,
					notEmpty: true
				},
				playlistName: {
					type: DataTypes.STRING,
					notNull: true,
					notEmpty: true
				},
				playlistId: {
					type: DataTypes.STRING,
					notNull: true,
					notEmpty: true
				},
				deviceName: {
					type: DataTypes.STRING,
					notNull: true,
					notEmpty: true
				},
				deviceId: {
					type: DataTypes.STRING,
					notNull: true,
					notEmpty: true
				}
			},
			{ sequelize: SQLConnection.sequelize },
		)
	}

	async initData() {
		console.log("init data NFCTags")
		userController.getUserByUsername("dwighthaul").then((data) => {
			if (!data || !data.id) {
				console.error("User dwighthaul non trouve pour associer les tags")
				return
			}
			console.debug("Id trouve : ", data.id)


			return NFCTags.bulkCreate([
				{ tagName: "Violon - PH - Web player", tagId: "1234", playlistName: "Violon", playlistId: "spotify:playlist:05hA0uwfVRch4T132PRdKX", deviceName: "Web Player (Chrome)", deviceId: "8fd3349b27c089f18c9b0d5df5517d5e19568c71", userId: data.id, },
				{ tagName: "Fuzati Radio - PH - Web player", tagId: "12345", playlistName: "Fuzati Radio", playlistId: "spotify:playlist:37i9dQZF1E4lNliC3J5XhD", deviceName: "Web Player (Chrome)", deviceId: "8fd3349b27c089f18c9b0d5df5517d5e19568c71", userId: data.id, },
				{ tagName: "2001 a Space Odyssey - PH - App", tagId: "123456", playlistName: "2001 a Space Odyssey", playlistId: "spotify:playlist:4xpuPsnCllOgsSCOmSKSU2", deviceName: "DWIGHTHAUL", deviceId: "50c14080a6b470701bbf7baada526a6133acc4da", userId: data.id, },
				{ tagName: "Your Top Songs 2023 - PH - App", tagId: "1234567", playlistName: "Your Top Songs 2023", playlistId: "spotify:playlist:37i9dQZF1EYkqdzj48dyYq", deviceName: "DWIGHTHAUL", deviceId: "50c14080a6b470701bbf7baada526a6133acc4da", userId: data.id, }
			]).then((tables) => {
				console.log("Tags data have been initialized")
			});
		})
	}

	async getTags() {
		return await NFCTags.findAll();
	}

	async getTagById(id: number) {
		return await NFCTags.findOne({
			where: {
				id: id
			}
		});
	}

	async getTagByName(tagName: string) {
		return await NFCTags.findAll({
			where: {
				tagName: tagName
			}
		});
	}

	async getTagByUserId(userId: number) {
		console.log("userId", userId)
		return await NFCTags.findAll({
			where: {
				"userId": userId
			}
		});
	}

}
const nfcTagsController = new NFCTagsController();


export { nfcTagsController };

