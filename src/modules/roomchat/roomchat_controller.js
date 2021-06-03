const helper = require('../../helpers/wrapper')
// const contactModel = require('../contact/contact_model')
const chatRoom = require('./roomchat_model')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  geRoomChat: async (req, res) => {
    try {
      // console.log(req.query)
      const idUser = req.params.id
      // let { search } = req.query
      // search = search || ''
      const result = await chatRoom.getAllRoomChat(idUser)
      // if (result.length > 0) {
      client.setex(`getAllRoomChat:${idUser}`, 3600, JSON.stringify(result))
      return helper.response(res, 200, 'user found !', result)
      // } else {
      //   return helper.response(res, 404, 'user not found !')
      // }
    } catch (error) {
      console.log(error)
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
      console.log(contactFriendId, 'adalah id friend')
      console.log(id, 'adalah id user')
      console.log(checkFriend)
      if (checkFriend.length === 0) {
        console.log(true, 'roomchat can create')
        const roomChat = Math.ceil(Math.random() * 9001) + 998
        console.log('roomchat :', roomChat)
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
        console.log('This isi room chat user side', setDataUser)
        console.log('This is room chat friend side', setDataFriend)
        await chatRoom.addRoomChat(setDataUser)
        const result = await chatRoom.addRoomChat(setDataFriend)
        console.log('Succes add room chat !')
        return helper.response(res, 200, 'Succes add room chat !', result)
      } else {
        return helper.response(
          res,
          408,
          `Room Chat with contact friend id : ${idFriend} was added before`
        )
      }
    } catch (error) {
      console.log(false)
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
