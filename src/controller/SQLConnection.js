const { Sequelize, DataTypes } = require('sequelize');
const User = require('../model/User');
const UserController = require('./UserController');

class SQLConnection {
	sequelize;

	async connect() {
		this.sequelize = new Sequelize('postgres://postgres:root@localhost:5432/NFT_spotify_DB',
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
		UserController.initSchema(this)

		this.sequelize.sync({ force: true })
			.then(() => {
				console.log('Database and tables created successfully');
				UserController.initData()
			})
			.catch(err => {
				console.error('Unable to create database and tables', err);
			});
	}
}




module.exports = SQLConnection;
