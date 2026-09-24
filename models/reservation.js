const { Schema, model } = require('mongoose');

const ReservationSchema = new Schema({
	date: {
		type: Date,
		required: [true, 'Date is required'],
		index: true,
	},
	day: {
		type: String,
		unique: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User is required'],
		index: true,
	},
	comments: {
		type: String,
		trim: true,
		maxlength: [500, 'Comments must be at most 500 characters'],
		default: '',
	},
}, {
	timestamps: true,
});

ReservationSchema.pre('validate', function() {
	if (this.date) {
		const timeZone = process.env.APP_TIMEZONE || 'America/Mexico_City';
		this.day = new Intl.DateTimeFormat('en-CA', { timeZone }).format(this.date);
	}
});

ReservationSchema.method('toJSON', function() {
	const { __v, _id, ...object } = this.toObject();
	object.uid = _id;
	return object;
});

module.exports = model('Reservation', ReservationSchema);
