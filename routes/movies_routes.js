const express = require('express')
const router = express.Router();
const movieController = require('../controllers/movie_controller');
const { verifyAdmin, verifyUser } = require('../middlewares/auth');

router.route('/')
    // only for admin
    .post(verifyAdmin, movieController.createMovie)
    .get(movieController.getAllMovies)
    .put((req, res) => res.status(405).json({ error: 'PUT method is not allowed' }))
    .delete((req, res) => res.status(405).json({ error: 'DELETE method is not allowed' }))

    router.route('/:id')
    // only for admin
    .put(verifyAdmin, movieController.updateAMovieById)
    .get(movieController.getAMovieById)
    .delete(verifyAdmin, movieController.deleteAMovieById)
    .post((req, res) => res.status(405).json({ error: 'POST method is not allowed' }))

module.exports = router