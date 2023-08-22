require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const app = express()

const user_routes = require('./routes/user_routes')
const movie_routes = require('./routes/movies_routes')
const reserve_routes = require('./routes/reserve_routes')
const { verifyAdmin, verifyUser } = require('./middlewares/auth')

app.use(express.json())
const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL
mongoose.connect(MONGODB_URI)
    .then(() => console.log(`Database connected on ${MONGODB_URI}`))
    .catch(() => console.log('Failed in database connection.'))


app.get('/', (req, res) => {
    res.json('Testing')
})

app.use('/users', user_routes)
app.use('/movies', verifyUser, movie_routes)
app.use('/reservations', verifyUser, reserve_routes)


app.use((req, res, next, err) => {

    if (err.name === 'ValidationError') return res.status(400)
    else if (err.name === 'CastError') return res.status(400)
    else {
        res.json({ error: err.message })
    }
})

// unkown path
app.use((req, res) => res.status(404).json({ error: 'Path not found' }))

module.exports = app

