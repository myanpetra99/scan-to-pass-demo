const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
var server = http.createServer(app)
const isAuth = require('./isAuth')
const dotenv = require('dotenv')
dotenv.config()
const path = require('path')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const allowedOrigins = [
  'http://localhost:3000', // Or whatever your local dev port is
  `https://${process.env.VERCEL_URL}`, // This will be set by Vercel during deployment
  'https://scan-to-pass-demo.vercel.app' // Your production URL
];

const io = require('socket.io')(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});
let uuid = ''

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

const user = {
  id: '123',
  email: 'admin@gmail.com',
  pass: '@dmin123'
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

  app.get('/login', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public/login.html'))
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
          res.status(200).sendFile(path.join(__dirname, 'public/success.html'))          
          io.to(uuid).emit('qrsuccess', token)
        } else {
          res.sendStatus(403)
          console.log('wrong password')
        }
      } else {
        res.sendStatus(403)
        console.log('email not found')
      }
    }else{
      res.sendStatus(403)
      console.log('no uuid found')
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

server.listen(process.env.PORT || 3000, '0.0.0.0', function () {
  console.log('Listening to port:  ' + 3000)
})
