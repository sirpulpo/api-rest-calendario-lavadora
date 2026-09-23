const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');


class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT || 4000;

		this.authPath = '/api/auth';

		this.middlewares();
		this.dbConnect();
		this.routes();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Lectura y parseo del body
		this.app.use(express.json());
	}

	async dbConnect() {
		await dbConnection();
	}

	routes() {
		this.app.get('/', (req, res) => {
			res.send('API is running');
		});
		this.app.use(this.authPath, require('../routes/user'));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`Servidor corriendo en puerto ${this.port}`);
		})
	}
}

module.exports = Server;