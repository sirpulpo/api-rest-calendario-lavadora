const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
	return new Promise((resolve, reject) => {
		const payload = { uid };

		jwt.sign(payload, process.env.SECRET_KEY, {
			expiresIn: '2h'
		}, (err, token) => {
			if (err) {
				console.error(err);
				reject('Error generating JWT');
			} else {
				resolve(token);
			}
		})
	})
}

module.exports = {
	generateJWT
}