const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require("../helpers/jwt-gen");

const login = async (req = request, res = response) => {
	const { alias, nip } = req.body;

	try {
		const user = await User.findOne({ alias });
		if (!user) {
			return res.status(400).json({
				msg: 'Alias or password is incorrect'
			});
		}

		const validPassword = bcryptjs.compareSync(nip, user.nip);
		if (!validPassword) {
			return res.status(400).json({
				msg: 'Alias or password is incorrect'
			});
		}

		const token = await generateJWT(user.id);

		res.json({
			user,
			token
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			msg: 'Error occurred while logging in'
		});
	}
}

module.exports = {
	login,
}