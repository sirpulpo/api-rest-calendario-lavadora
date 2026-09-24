const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const createUser = async (req = request, res = response) => {
	const { name, alias, nip, color } = req.body;

	const user = new User({ name, alias, nip, color });

	const salt = bcryptjs.genSaltSync(11);
	user.nip = bcryptjs.hashSync(nip, salt);

	await user.save();

	res.status(201).json({
		msg: 'User created successfully',
		user
	});
}

module.exports = {
	createUser
}