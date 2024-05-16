const { Sequelize, DataTypes } = require('sequelize');
const userController = require('./UserController');
const nfcTagsController = require('./NFCTagsController');
const NFCTags = require('../model/NFCTags');
const User = require('../model/User');
require('dotenv').config()

class SQLConnection {
	sequelize;

	async connect() {
		this.sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_ENDPOINT}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_NAME}`,
			{
				logging: false, // Disables logging
			}
		)

		try {
			await this.sequelize.authenticate();
			console.log('Connection has been established successfully.');
		} catch (error) {
			console.error('Unable to connect to the database:', error);
		}

	}

	syncDatabase() {
		userController.initSchema(this)
		nfcTagsController.initSchema(this)

		User.hasMany(NFCTags, {
			foreignKey: {
				name: "userId"
			}
		});

		this.sequelize.sync({ force: true })
			.then(() => {
				console.log('Database and tables created successfully');
				userController.initData().then(() => {
					nfcTagsController.initData()

				})
			})
			.catch(err => {
				console.error('Unable to create database and tables', err);
			});
	}
}




module.exports = SQLConnection;
