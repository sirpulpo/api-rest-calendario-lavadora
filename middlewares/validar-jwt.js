const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validarJWT = async (req, res, next) => {
	const authHeader = req.header('Authorization') || '';
	const [scheme, token] = authHeader.split(' ');

	if (scheme !== 'Bearer' || !token) {
		return res.status(401).json({
			msg: 'No token provided',
		});
	}

	try {
		const { uid, iat } = jwt.verify(token, process.env.SECRET_KEY);

		const user = await User.findById(uid);
		if (!user) {
			return res.status(401).json({
				msg: 'Invalid token - user does not exist',
			});
		}

		if (user.nipChangedAt && Math.floor(user.nipChangedAt.getTime() / 1000) > iat) {
			return res.status(401).json({
				msg: 'Invalid token - NIP was changed, please log in again',
			});
		}

		req.uid = uid;
		req.user = user;

		next();
	} catch (error) {
		console.error(error);
		res.status(401).json({
			msg: 'Invalid token',
		});
	}
};

module.exports = {
	validarJWT,
};
