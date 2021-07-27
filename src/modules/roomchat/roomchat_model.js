const connection = require('../../config/mysql')

module.exports = {
  getAllRoomChat: (idUser) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM `room_chat` JOIN user ON user.user_id = room_chat.friend_id WHERE room_chat.user_id = ?',
        idUser,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getRoomById: (idUser, idFriend) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM room_chat WHERE room_chat.user_id = ? AND room_chat.friend_id = ?',
        [idUser, idFriend],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  addRoomChat: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO room_chat SET ?',
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...setData
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  }
}
