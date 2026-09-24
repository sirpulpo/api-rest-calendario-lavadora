const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require('../middlewares');
const { login } = require("../controllers/auth");

const router = Router();

router.post(
	'/login',
	[
		check('alias', 'Alias is required').not().isEmpty(),
		check('nip', 'NIP is required').not().isEmpty(),
		validarCampos
	],
	login
);

module.exports = router;