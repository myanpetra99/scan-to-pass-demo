const qrgenerator = require('qrcode')
const axios = require('axios')
const { v4 } = require('uuid')
const url = 'https://loginusingqrtest.herokuapp.com/'

const canvas = document.getElementById('canvas')
const uuidv4 = v4()
console.log(uuidv4)
qrgenerator.toCanvas(canvas, url+'login/?uuid='+uuidv4, e => {
  if (e) {
    console.log(e)
  }
})
var socket = io(url, { transport: ['websocket'] })



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
  document.getElementById('ifsuccess').innerHTML =  'When u see this, that means QR Codes is working! &#127881'
})

