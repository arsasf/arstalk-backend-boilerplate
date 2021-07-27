const helper = require('../../helpers/wrapper')
// const chatRoom = require('../roomchat/roomchat_model')
const chat = require('./chat_model')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  geHistoryChat: async (req, res) => {
    try {
      const idUser = req.params.id
      const result = await chat.getAllHistoryChat(idUser)
      // if (result.length > 0) {
      client.setex(`getHistoryChat:${idUser}`, 3600, JSON.stringify(result))
      return helper.response(res, 200, 'user found !', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  geHistoryById: async (req, res) => {
    try {
      const { id } = req.params
      console.log(req.params)
      const result = await chat.getChatById(id)
      console.log(result)
      // if (result.length > 0) {
      // client.setex(`getHistoryChat:${id}`, 3600, JSON.stringify(result))
      return helper.response(res, 200, 'Succcess get chat by room!', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  createChat: async (req, res) => {
    try {
      const { room, senderId, receiverId, image, message } = req.body
      const setData = {
        room_chat: room,
        sender_id: senderId,
        receiver_id: receiverId,
        image: image,
        message: message
      }
      const result = await chat.addChat(setData)
      console.log('Succes send chat !')
      return helper.response(res, 200, 'Succes send chat !', result)
    } catch (error) {
      console.log(false)
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
