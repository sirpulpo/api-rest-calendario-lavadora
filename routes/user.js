const {Router} = require('express');
const { check } = require('express-validator');
const { createUser } = require('../controllers/user');
const { validarCampos } = require('../middlewares');
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

module.exports = router;