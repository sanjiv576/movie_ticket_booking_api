const Reserve = require("../models/Reserve");

const reserveAMovieById = (req, res) => {
    const { movieId } = req.params;
    // const { userId } = req.user.id;
    const { time, date, seatNumber, charge, movieName } = req.body;

    console.log(`User full name is ${req.user.fullName}`);
    const reservation = new Reserve({
        movieId,
        userId: req.user.id,
        time,
        date,
        seatNumber,
        charge,
        userName : req.user.fullName,
        movieName
    });

    reservation.save()
        .then(savedReservation => {
            res.status(201).json(savedReservation);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to reserve a movie' });
        });
}

const getAReservationById = (req, res) => {
    const { reservationId } = req.params;

    Reserve.findById(reservationId)
        .then(reservation => {
            if (!reservation) {
                return res.status(404).json({ error: 'Reservation not found' });
            }

            res.json(reservation);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to get the reservation' });
        });
}

const updateReservation = (req, res) => {
    const { reservationId } = req.params;
    const { time, date, seatNumber, charge } = req.body;

    Reserve.findByIdAndUpdate(reservationId, { time, date, seatNumber, charge }, { new: true })
        .then(updatedReservation => {
            if (!updatedReservation) {
                return res.status(404).json({ error: 'Reservation not found' });
            }

            res.json(updatedReservation);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to update the reservation' });
        });

}

const getAllReservations = (req, res) => {

    Reserve.find()
        .then(reservations => {
            res.json(reservations);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to get all reservations' });
        });

}

const getMyReservation = (req, res) => {

    Reserve.find({ userId: req.user.id })
        .then(reservations => {
            res.json(reservations);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to get all reservations' });
        });
}

module.exports = { reserveAMovieById, updateReservation, getAllReservations, getAReservationById, getMyReservation }