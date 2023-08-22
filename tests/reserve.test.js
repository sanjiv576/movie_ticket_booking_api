const supertest = require('supertest')
const app = require('../app')
const User = require('../models/User')
const mongoose = require('mongoose')
const Movie = require('../models/Movie')
const Reserve = require('../models/Reserve')
const api = supertest(app)

let userToken = ''
let movieId = ''
let userId = ''
let reservaitonId = ''

beforeAll(async () => {
    await User.deleteMany({})
    await Movie.deleteMany({})
    // await Reserve.deleteMany({})

    const resp = await api.post('/users/register')
        .send({
            "fullName": "Admin Krishna",
            "email": "krishna@gmail.com",
            "contact": "9876545676",
            "role": "admin",
            "username": "krishna",
            "password": "krishna123"
        })
    userId = resp.body.id
    const response = await api.post('/users/login')
        .send({
            "username": "krishna",
            "password": "krishna123"
        })

    const data = await api.post('/movies')
        .send({
            "title": "Avenger Endgame",
            "description": "This is a SC-FI and fantasy movie."
        })
        .set('authorization', `bearer ${response.body.token}`)
    movieId = data.body.id

    await api.post('/users/register')
        .send({
            "fullName": "Virat Kholi",
            "email": "virat@gmail.com",
            "contact": "9876511676",
            "role": "user",
            "username": "virat",
            "password": "virat123"
        })

    let res = await api.post('/users/login')
        .send({
            "username": "virat",
            "password": "virat123"
        })

    userToken = res.body.token
})



afterAll(async () => {
    await User.deleteMany({})
    await Movie.deleteMany({})
    // await Reserve.deleteMany({})
    await mongoose.connection.close()
})

describe('test cases for resrvattions', () => {


    test('should reserve a movie by its id', async () => {
        const response = await api.post(`/reservations/${movieId}`)
            .send({
                "movieId": movieId,
                "userId": userId,
                "time": "2:30",
                "date": "Oct 11, 2022",
                "seatNumber": "23",
                "charge": "400"

            })
            .set('authorization', `bearer ${userToken}`)
            .expect(201)
        // console.log(response.body)

        reservaitonId = response.body.id

        expect(response.body.seatNumber).toBe(23)
        console.log(`Reservation id: ${reservaitonId}`)
    })

    test('should get 405 error for DELETE', async () => {
        const response = await api.delete(`/reservations/${movieId}`)

            .set('authorization', `bearer ${userToken}`)
            .expect(405)
        expect(response.body.error).toMatch(/not allowed/)
    })

    test('should get 405 error for GET', async () => {
        const response = await api.get(`/reservations/${movieId}`)

            .set('authorization', `bearer ${userToken}`)
            .expect(405)
        expect(response.body.error).toMatch(/not allowed/)
    })

    test('should get all movies by user', async () => {
        const response = await api.get('/reservations')

            .set('authorization', `bearer ${userToken}`)
            .expect(200)
        expect(response.body).toBeDefined()

    })

    test('should get 405 error for DELETE', async () => {
        const response = await api.delete('/reservations')

            .set('authorization', `bearer ${userToken}`)
            .expect(405)
        expect(response.body.error).toMatch(/not allowed/)
    })

    test('should get 405 error for PUT', async () => {
        const response = await api.put(`/reservations`)

            .set('authorization', `bearer ${userToken}`)
            .expect(405)
        expect(response.body.error).toMatch(/not allowed/)
    })


    test('should get 404 with invalid reservationId', async () => {
        const response = await api.get(`/reservations/movies/${reservaitonId}`)

            .set('authorization', `bearer ${userToken}`)
            .expect(404)
        expect(response.body.error).toMatch(/not found/)

    })


    test('should get a single reservation by its id', async () => {
        const response = await api.put(`/reservations/movies/${reservaitonId}`)
            .send({
                "seatNumber": "10",

            })
            .set('authorization', `bearer ${userToken}`)
        // .expect(200)
        // console.log(response.body)
        // console.log(response.status)

        // expect(response.body.seatNumber).toBe(23)
    })

    test('should get 405 error for POST', async () => {
        const response = await api.post(`/reservations/movies/${reservaitonId}`)

            .set('authorization', `bearer ${userToken}`)
            .expect(405)
        expect(response.body.error).toMatch(/not allowed/)
    })
    test('should get 405 error for DELETE', async () => {
        const response = await api.delete(`/reservations/movies/${reservaitonId}`)

            .set('authorization', `bearer ${userToken}`)
            .expect(405)
        expect(response.body.error).toMatch(/not allowed/)
    })
})
