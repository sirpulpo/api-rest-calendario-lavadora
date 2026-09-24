const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		unique: true,
	},
	alias: {
		type: String,
		required: [true, 'Alias is required'],
		unique: true,
	},
	nip: {
		type: String,
		required: [true, 'NIP is required'],
		unique: true,
	},
	color: {
		type: String,
		required: [true, 'Color is required'],
		unique: true
	},
});

UserSchema.method('toJSON', function() {
	const { nip, __v, _id, ...object } = this.toObject();
	object.uid = _id;
	return object;
});

module.exports = model('User', UserSchema);