const express = require('express')
const Route = express.Router()
const { register, login, verify } = require('./auth_controller')

Route.post('/login', login)
Route.post('/register', register)
Route.get('/verify/:hash', verify)
module.exports = Route
