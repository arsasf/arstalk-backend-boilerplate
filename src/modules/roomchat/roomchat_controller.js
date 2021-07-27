const helper = require('../../helpers/wrapper')
const chatRoom = require('./roomchat_model')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  geRoomChat: async (req, res) => {
    try {
      const idUser = req.params.id
      const result = await chatRoom.getAllRoomChat(idUser)
      client.setex(`getAllRoomChat:${idUser}`, 3600, JSON.stringify(result))
      return helper.response(res, 200, 'user found !', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  createRoom: async (req, res) => {
    try {
      const { contactFriendId } = req.body
      const { id } = req.params
      const idUser = req.params.id
      const idFriend = req.body.contactFriendId
      const checkFriend = await chatRoom.getRoomById(idUser, idFriend)
      if (checkFriend.length === 0) {
        const roomChat = Math.ceil(Math.random() * 9001) + 998
        const setDataUser = {
          room_chat: roomChat,
          user_id: id,
          friend_id: contactFriendId
        }
        const setDataFriend = {
          room_chat: roomChat,
          user_id: contactFriendId,
          friend_id: id
        }
        await chatRoom.addRoomChat(setDataUser)
        const result = await chatRoom.addRoomChat(setDataFriend)
        return helper.response(res, 200, 'Succes add room chat !', result)
      } else {
        return helper.response(
          res,
          408,
          `Room Chat with contact friend id : ${idFriend} was added before`
        )
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
