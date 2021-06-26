const qrgenerator = require('qrcode')
const axios = require('axios')
const { v4 } = require('uuid')
const url = 'http://192.168.1.5:3000/'

const canvas = document.getElementById('canvas')
const uuidv4 = v4()
console.log(uuidv4)
qrgenerator.toCanvas(canvas, 'http://192.168.1.5:5500/test.html', e => {
  if (e) {
    console.log(e)
  }
})
var socket = io('http://192.168.1.5:3000', { transport: ['websocket'] })


socket.emit('join', uuidv4)
socket.on('qrsuccess', async (token) => {
socket.emit('passjwt',token)
})

socket.on('disconnectifexist',(uuid)=>{
  if(document.getElementById('ifsuccess').innerText == uuid){
    alert('DUPLICATE LOGIN FOUND')
    socket.close();
  }
})

socket.on('fullyauth', (resp)=>{
  document.getElementById('ifsuccess').innerHTML = resp._id
})

/*axios.default.post(
    url+'loginqr/'+uuidv4,{
            "email" : "myanpetra99@gmail.com",
            "password" : "Vinno2605"
    }
);*/
