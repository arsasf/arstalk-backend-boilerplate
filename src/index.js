const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const xss = require('xss-clean')
const helmet = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser')
const routerNavigation = require('./routes')
const socket = require('socket.io')

const app = express()
const port = process.env.DB_PORT

app.use(morgan('dev'))
app.use(cors())
app.options('*', cors())
app.use(xss())
app.use(helmet())
app.use(compression())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use('/backend3/api/v1', routerNavigation)
app.use('/backend3/api', express.static('src/uploads'))

// ====================================
const server = require('http').createServer(app)
const io = socket(server, {
  cors: {
    origin: '*'
  },
  path: '/backend3/socket.io'
})
let listUserOnline = []

io.on('connection', (socket) => {
  console.log('Socket.io Connect !')

  socket.on('connect-server', (id) => {
    if (!listUserOnline.includes(id)) {
      listUserOnline.push(id)
    }
    io.emit('list-user-online', listUserOnline)
    socket.join(id)
  })

  socket.on('disconnect-server', ({ id, room }) => {
    listUserOnline = listUserOnline.filter((element) => element !== id)
    io.emit('list-user-online', listUserOnline)
    socket.leave(id)
    socket.leave(room)
  })

  socket.on('join-room', ({ room, oldRoom }) => {
    if (oldRoom) {
      socket.leave(oldRoom)
    }
    socket.join(room)
  })

  socket.on('send-message', (data) => {
    io.to(data.room).emit('chat-message', data)
  })

  socket.on('notif-message', (data) => {
    socket.broadcast.to(data.receiverId).emit('notif-message', data)
  })

  socket.on('typing-message', (data) => {
    socket.broadcast.to(data.room).emit('typing-message', data)
  })
})

server.listen(port, () => {
  console.log(`Express app is listen on port ${port} !`)
})
