const User = require('../models/user');

const validName = async (name = '') => {
	const nameExists = await User.findOne({ name });
	if (nameExists) {
		throw new Error(`The name ${name} is already registered`);
	}
}

const validAlias = async (alias = '') => {
	const aliasExists = await User.findOne({ alias });
	if (aliasExists) {
		throw new Error(`The alias ${alias} is already registered`);
	}
}

const validColor = async (color = '') => {
	const colorExists = await User.findOne({ color });
	if (colorExists) {
		throw new Error(`The color ${color} is already registered`);
	}
}

module.exports = {
	validName,
	validAlias,
	validColor,
}