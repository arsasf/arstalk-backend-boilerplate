const connection = require('../../config/mysql')

module.exports = {
  getAllHistoryChat: (idUser) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM room_chat JOIN chat ON room_chat.room_chat = chat.room_chat WHERE user_id = ?',
        idUser,
        (error, result) => {
          // console.log(error)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getChatById: (room) => {
    console.log(room)
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM chat WHERE room_chat = ${room}`,
        (error, result) => {
          // console.log(error)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  addChat: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO chat SET ?', setData, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...setData
          }
          resolve(newResult)
        } else {
          reject(new Error(error))
        }
      })
    })
  }
}
