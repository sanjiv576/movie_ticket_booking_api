const supertest = require('supertest')
const app = require('../app')
const User = require('../models/User')
const mongoose = require('mongoose')
const api = supertest(app)


beforeAll(async () => await User.deleteMany({}))
// afteerAll( async () => await mongoose.connection.close())
afterAll(async () => await mongoose.connection.close());


// admin registration
test('user registeration with valid credentials', async () => {
    const response = await api.post('/users/register')
        .send({
            "fullName": "Admin Krishna",
            "email": "krishna@gmail.com",
            "contact": "9876545676",
            "role": "admin",
            "username": "krishna",
            "password": "krishna123"
        })

        .expect(201)
    expect(response.body.username).toBe('krishna')
})

// user registration
test('user registeration with valid credentials', async () => {
    const response = await api.post('/users/register')
        .send({
            "fullName": "Virat Kholi",
            "email": "virat@gmail.com",
            "contact": "9876511676",
            "role": "user",
            "username": "virat",
            "password": "virat123"
        })

        .expect(201)
    expect(response.body.username).toBe('virat')
})

// login test
test('login with valid account credentials', async () => {
    const response = await api.post('/users/login')
        .send({
            "username": "krishna",
            "password": "krishna123"
        })
        .expect(200)
    expect(response.body.token).toBeDefined()
})

test('login with invalid username', async () => {
    const response = await api.post('/users/login')
        .send({
            "username": "krishnaKrishna",
            "password": "krishna123"
        })
        .expect(404)
    expect(response.body.error).toMatch(/not found/)

})


test('login with invalid password', async () => {
    const response = await api.post('/users/login')
        .send({
            "username": "krishna",
            "password": "krishna122323"
        })

        .expect(400)
    expect(response.body.error).toMatch(/does not match/)

})

test('should get 405 error for PUT', async () => {
    const response = await api.put('/users/register')
        .expect(405)
    expect(response.body.error).toMatch(/not allowed/)
})
test('should get 405 error for DELETE', async () => {
    const response = await api.delete('/users/register')
        .expect(405)
    expect(response.body.error).toMatch(/not allowed/)
})


test('should get 405 error for GET', async () => {
    const response = await api.get('/users/register')
        .expect(405)
    expect(response.body.error).toMatch(/not allowed/)
})


test('should get 405 error for PUT', async () => {
    const response = await api.put('/users/login')
        .expect(405)
    expect(response.body.error).toMatch(/not allowed/)
})
test('should get 405 error for DELETE', async () => {
    const response = await api.delete('/users/login')
        .expect(405)
    expect(response.body.error).toMatch(/not allowed/)
})


test('should get 405 error for GET', async () => {
    const response = await api.get('/users/login')
        .expect(405)
    expect(response.body.error).toMatch(/not allowed/)
})
