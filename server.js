const express = require('express')
const http = require('http')
const cors = require('cors')
const e = require('cors')
const app = express()
var server = http.createServer(app)
const isAuth = require('./isAuth')
const dotenv = require('dotenv')
dotenv.config()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://192.168.1.5:5500',
    methods: ['GET', 'POST']
  }
})
let uuid = ''

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(cors())

const user = {
  id: '260199',
  email: 'myanpetra99@gmail.com',
  pass: 'hyouka1999'
}

io.on('connection', socket => {
  console.log('a user connected')

  socket.on('join', uuid => {
    socket.join(uuid)
  })

  app.get('/', (req, res) => {
    res.status(200).send('SCAN TO LOGIN')
    console.log('OK')
  })

  app.post('/loginqr', async (req, res) => {
    io.emit('disconnectifexist',user.id)
    console.log('Request has been made')
    if (req.body.uuid) {
      uuid = req.body.uuid
      if (req.body.email == user.email) {
        if (req.body.password == user.pass) {
          const token = await jwt.sign(
            { _id: user.id },
            process.env.TOKEN_SECRET
          )

          //res.cookie('token', token, { httpOnly: true})

          res.status(200).send(token)
         
          
          io.to(uuid).emit('qrsuccess', token)
        } else {
          res.sendStatus(403)

          console.log('wrong password')
        }
      } else {
        res.sendStatus(403)

        console.log('email not found')
      }
    }
  })

  socket.on('passjwt', token => {
    console.log('PASSING JWT')
    const resp = isAuth(token)
    io.to(uuid).emit('fullyauth', resp)
    console.log('UUID = ' + uuid)
  })



  socket.on('disconnect', () => {
    console.log('a user has been disconnected')
  })
})

server.listen(3000, '0.0.0.0', function () {
  console.log('Listening to port:  ' + 3000)
})
