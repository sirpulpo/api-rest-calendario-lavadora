const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt-gen');

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

const updateNip = async (req = request, res = response) => {
	const { currentNip, newNip } = req.body;
	const user = req.user;

	try {
		const validNip = await bcryptjs.compare(currentNip, user.nip);
		if (!validNip) {
			return res.status(400).json({
				msg: 'Current NIP is incorrect',
			});
		}

		user.nip = await bcryptjs.hash(newNip, 11);
		user.nipChangedAt = new Date();
		await user.save();

		const token = await generateJWT(user.id);

		res.json({
			msg: 'NIP updated successfully',
			token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			msg: 'Error occurred while updating NIP',
		});
	}
}

module.exports = {
	createUser,
	updateNip,
}