const express = require('express')
const Route = express.Router()
const authRouter = require('../modules/auth/auth_routes')
const user = require('../modules/user/user_routes')
const contact = require('../modules/contact/contact_routes')
const roomchat = require('../modules/roomchat/roomchat_routes')
const chat = require('../modules/chat/chat_routes')

Route.use('/auth', authRouter)
Route.use('/user', user)
Route.use('/contact', contact)
Route.use('/roomchat', roomchat)
Route.use('/chat', chat)

module.exports = Route
