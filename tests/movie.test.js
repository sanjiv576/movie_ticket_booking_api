const supertest = require('supertest')
const app = require('../app')
const User = require('../models/User')
const mongoose = require('mongoose')
const Movie = require('../models/Movie')
const Reserve = require('../models/Reserve')
const api = supertest(app)

let adminToken = ''

beforeAll(async () => {
    await User.deleteMany({})
    await Movie.deleteMany({})


    await api.post('/users/register')
        .send({
            "fullName": "Admin Krishna",
            "email": "krishna@gmail.com",
            "contact": "9876545676",
            "role": "admin",
            "username": "krishna",
            "password": "krishna123"
        })

    const response = await api.post('/users/login')
        .send({
            "username": "krishna",
            "password": "krishna123"
        })
    adminToken = response.body.token
})
afterAll(async () => {
    await User.deleteMany({})
    await Movie.deleteMany({})
    await Reserve.deleteMany({})
    await mongoose.connection.close()
});


let movieId = ''
test('create movie', async () => {
    const response = await api.post('/movies')
        .send({
            "title": "Avenger Endgame",
            "description": "This is a SC-FI and fantasy movie."
        })
        .set('authorization', `bearer ${adminToken}`)

        .expect(201)
    expect(response.body.title).toBe('Avenger Endgame')
    movieId = response.body.id

    await api.post('/movies')
        .send({
            "title": "A Love Couple",
            "description": "This is romancae and family drama."
        })
        .set('authorization', `bearer ${adminToken}`)

})


test('should get all movies', async () => {
    const response = await api.get('/movies')

        .set('authorization', `bearer ${adminToken}`)
        .expect(200)

    expect(response.body).toBeDefined()

})


test('should get a movie', async () => {
    const response = await api.get(`/movies/${movieId}`)

        .set('authorization', `bearer ${adminToken}`)
        .expect(200)

    expect(response.body.id).toBe(movieId)

})


test('should update movie', async () => {
    const response = await api.put(`/movies/${movieId}`)
        .send({
            "title": "Final Avenger Endgame"
        })
        .set('authorization', `bearer ${adminToken}`)
        .expect(200)

    expect(response.body.title).toBe('Final Avenger Endgame')

})

test('should delete movie', async () => {
    const response = await api.delete(`/movies/${movieId}`)
        .set('authorization', `bearer ${adminToken}`)
        .expect(204)

    expect(response.body).toMatchObject({})
})

test('should get 405 error for DELETE', async () => {
    const response = await api.delete('/movies')

        .set('authorization', `bearer ${adminToken}`)
        .expect(405)
    expect(response.body.error).toMatch(/not allowed/)
})


test('should get 405 error for PUT', async () => {
    const response = await api.put('/movies')

        .set('authorization', `bearer ${adminToken}`)
        .expect(405)
    expect(response.body.error).toMatch(/not allowed/)
})


test('should get 405 error for PUT', async () => {
    const response = await api.post(`/movies/${movieId}`)

        .set('authorization', `bearer ${adminToken}`)
        .expect(405)
    expect(response.body.error).toMatch(/not allowed/)
})