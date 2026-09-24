const {Router} = require('express');
const { check, body } = require('express-validator');
const { createUser, updateNip } = require('../controllers/user');
const { validarCampos, validarJWT } = require('../middlewares');
const {
	validName,
	validAlias,
	validColor,
} = require('../helpers/db-validator');

const router = Router();

router.post(
	'/createUser',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('name').custom(validName),
		check('alias', 'Alias is required').not().isEmpty(),
		check('alias').custom(validAlias),
		check('nip', 'NIP is required').not().isEmpty(),
		check('nip', 'NIP must be 4 digits').isLength({ min: 4, max: 4 }),
		check('color', 'Color is required').not().isEmpty(),
		check('color').custom(validColor),
		validarCampos
	],
	createUser
);

router.patch(
	'/nip',
	[
		validarJWT,
		body('currentNip', 'Current NIP is required').notEmpty(),
		body('newNip', 'New NIP is required').notEmpty().bail()
			.isLength({ min: 4, max: 4 }).withMessage('NIP must be 4 digits').bail()
			.isNumeric({ no_symbols: true }).withMessage('NIP must be 4 digits').bail()
			.custom((value, { req }) => value !== req.body.currentNip)
			.withMessage('New NIP must be different from current NIP'),
		validarCampos,
	],
	updateNip
);

module.exports = router;