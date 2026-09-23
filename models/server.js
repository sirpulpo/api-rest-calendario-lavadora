const express = require('express');
const cors = require('cors');


class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT || 4000;

		this.middlewares();
		this.routes();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Lectura y parseo del body
		this.app.use(express.json());
	}

	routes() {
		this.app.get('/', (req, res) => {
			res.send('API is running');
		})
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`Servidor corriendo en puerto ${this.port}`);
		})
	}
}

module.exports = Server;