
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const { verifyUser } = require('../middlewares/auth');


router.route('/register')
    .post(userController.userRegister)
    .get((req, res, next) => res.status(405).json({ error: "GET method is not allowed" }))
    .delete((req, res, next) => res.status(405).json({ error: "DELETE method is not allowed" }))
    .put((req, res, next) => res.status(405).json({ error: "PUT method is not allowed" }))

router.route('/login')
    .post(userController.userLogin)
    .get((req, res, next) => res.status(405).json({ error: "GET method is not allowed" }))
    .delete((req, res, next) => res.status(405).json({ error: "DELETE method is not allowed" }))
    .put((req, res, next) => res.status(405).json({ error: "PUT method is not allowed" }))



module.exports = router;