const { response, request } = require('express');
const mongoose = require('mongoose');
const Reservation = require('../models/reservation');

const handleError = (res = response, error) => {
	if (error.code === 11000) {
		return res.status(409).json({
			msg: 'There is already a reservation for that day',
		});
	}

	if (error instanceof mongoose.Error.ValidationError) {
		return res.status(400).json({
			msg: 'Invalid reservation data',
			errors: error.errors,
		});
	}

	console.error(error);
	res.status(500).json({
		msg: 'Unexpected error, please contact the administrator',
	});
};

const getReservations = async (req = request, res = response) => {
	const { from, to } = req.query;

	try {
		const filter = {};
		if (from || to) {
			filter.date = {};
			if (from) filter.date.$gte = new Date(from);
			if (to) filter.date.$lte = new Date(to);
		}

		const reservations = await Reservation.find(filter)
			.sort({ date: 1 })
			.populate('user', 'name alias color');

		res.json({
			reservations,
		});
	} catch (error) {
		handleError(res, error);
	}
};

const getReservation = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const reservation = await Reservation.findById(id)
			.populate('user', 'name alias color');

		if (!reservation) {
			return res.status(404).json({
				msg: `There is no reservation with id ${id}`,
			});
		}

		res.json({
			reservation,
		});
	} catch (error) {
		handleError(res, error);
	}
};

const createReservation = async (req = request, res = response) => {
	const { date, comments } = req.body;

	try {
		const reservation = new Reservation({
			date,
			comments,
			user: req.uid,
		});

		await reservation.save();
		await reservation.populate('user', 'name alias color');

		res.status(201).json({
			msg: 'Reservación creada correctamente',
			reservation,
		});
	} catch (error) {
		handleError(res, error);
	}
};

const updateReservation = async (req = request, res = response) => {
	const { id } = req.params;
	const { date, comments } = req.body;

	try {
		const reservation = await Reservation.findById(id);

		if (!reservation) {
			return res.status(404).json({
				msg: `There is no reservation with id ${id}`,
			});
		}

		if (reservation.user.toString() !== req.uid) {
			return res.status(403).json({
				msg: 'Tú no puedes modificar esta reservación',
			});
		}

		if (date !== undefined) reservation.date = date;
		if (comments !== undefined) reservation.comments = comments;

		await reservation.save();
		await reservation.populate('user', 'name alias color');

		res.json({
			msg: 'Reservación actualizada correctamente',
			reservation,
		});
	} catch (error) {
		handleError(res, error);
	}
};

const deleteReservation = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const reservation = await Reservation.findById(id);

		if (!reservation) {
			return res.status(404).json({
				msg: `There is no reservation with id ${id}`,
			});
		}

		if (reservation.user.toString() !== req.uid) {
			return res.status(403).json({
				msg: 'Tú no puedes borrar esta reservación',
			});
		}

		await reservation.deleteOne();

		res.json({
			msg: 'Reservación eliminada correctamente',
			reservation,
		});
	} catch (error) {
		handleError(res, error);
	}
};

module.exports = {
	getReservations,
	getReservation,
	createReservation,
	updateReservation,
	deleteReservation,
};
