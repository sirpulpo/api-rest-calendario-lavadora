const { Router } = require('express');
const { check, query } = require('express-validator');
const {
	getReservations,
	getReservation,
	createReservation,
	updateReservation,
	deleteReservation,
} = require('../controllers/reservation');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();

router.use(validarJWT);

const isNotInThePast = (date) => {
	if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
		throw new Error('Date cannot be in the past');
	}
	return true;
};

router.get(
	'/',
	[
		query('from', 'From must be a valid date').optional().isISO8601(),
		query('to', 'To must be a valid date').optional().isISO8601(),
		validarCampos,
	],
	getReservations
);

router.get(
	'/:id',
	[
		check('id', 'Not a valid id').isMongoId(),
		validarCampos,
	],
	getReservation
);

router.post(
	'/',
	[
		check('date', 'Date is required').not().isEmpty(),
		check('date', 'Date must be a valid date').isISO8601(),
		check('date').custom(isNotInThePast),
		check('comments', 'Comments must be a string of at most 500 characters')
			.optional()
			.isString()
			.isLength({ max: 500 }),
		validarCampos,
	],
	createReservation
);

router.put(
	'/:id',
	[
		check('id', 'Not a valid id').isMongoId(),
		check('date', 'Date must be a valid date').optional().isISO8601(),
		check('date').optional().custom(isNotInThePast),
		check('comments', 'Comments must be a string of at most 500 characters')
			.optional()
			.isString()
			.isLength({ max: 500 }),
		validarCampos,
	],
	updateReservation
);

router.delete(
	'/:id',
	[
		check('id', 'Not a valid id').isMongoId(),
		validarCampos,
	],
	deleteReservation
);

module.exports = router;
