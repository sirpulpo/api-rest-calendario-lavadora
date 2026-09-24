const mongoose = require('mongoose');
const dns = require('node:dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_CNN, {
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
			// useCreateIndex: true,
			// useFindAndModify: false,
		});
		console.log('Base de datos online');
	}
	catch (error) {
		console.error('Error connecting to database:', error);
		throw new Error('Error connecting to database');}
}

module.exports = {
		dbConnection
}