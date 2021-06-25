const qrgenerator = require('qrcode');
const axios = require('axios');
const url = 'http://192.168.1.5:3000/';

const canvas = document.getElementById('canvas');

qrgenerator.toCanvas(canvas,url+'loginqr',(e)=>{
    if (e) { console.log(e)}
});

var socket = io('http://192.168.1.5:3000', { transport : ['websocket'] });


axios.default.post(
    url+'loginqr',{
            "email" : "myanpetra99@gmail.com",
            "password" : "Vinno2605"
    }
);