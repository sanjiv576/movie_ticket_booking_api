const express = require('express')
const { verifyUser, verifyAdmin } = require('../middlewares/auth')
const router = express.Router()
const reserveController = require('../controllers/reserve_controller')


router.route('/')
    .get(verifyUser, reserveController.getAllReservations)
    .delete((req, res, next) => res.status(405).json({ error: "DELETE method is not allowed" }))
    .put((req, res, next) => res.status(405).json({ error: "PUT method is not allowed" }))
    .post((req, res, next) => res.status(405).json({ error: "POST method is not allowed" }))


router.route('/my-reservations')
    .get(verifyUser, reserveController.getMyReservation);

router.route('/:movieId')
    .post(verifyUser, reserveController.reserveAMovieById)
    // .get(reserveController.getAReservationById)
    .put((req, res, next) => res.status(405).json({ error: "PUT method is not allowed" }))
    .delete((req, res, next) => res.status(405).json({ error: "DELETE method is not allowed" }))
    .get((req, res, next) => res.status(405).json({ error: "GET method is not allowed" }))

router.route('/movies/:reservationId')
    .get( reserveController.getAReservationById)
    .put(reserveController.updateReservation)
    .delete((req, res, next) => res.status(405).json({ error: "DELETE method is not allowed" }))
    .post((req, res, next) => res.status(405).json({ error: "POST method is not allowed" }))

module.exports = router