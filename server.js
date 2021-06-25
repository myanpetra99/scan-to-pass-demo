const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
var server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://192.168.1.5:5500",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

app.get('/',( req, res) => {
    res.status(200).send('SCAN TO LOGIN')
    console.log('OK')
});

app.post('/loginqr',async ( req, res) => {
   res.send("OK");
   console.log(req.body.email)
});

app.get('/passed',( req, res) => {
    res.status(200).send('U LOGGED IN USING QR')
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', ()=>{
    console.log('a user has been disconnected')
  })
});

server.listen(3000, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 3000);
});