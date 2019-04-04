var http=require('http');
var fs = require('fs');
var querystring = require('querystring');
// var express = require('express');
// var app = express();
// var router = express.Router();
var count = 0;
let body="";
let msg="",messages=[];
let obj={
    msg:msg,
}
var server = http.createServer((req,res)=>{
    fs.readFile('./index.html',(error,data)=>{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data,'utf-8');
    })
    // console.log("开始访问",querystring.parse(req.body))
    req.on('data',(chunk)=>{
        messages=[];
        body += chunk;//decodeURIComponent(chunk.toString())
        console.log(decodeURIComponent(body.toString()));
        msg = (decodeURIComponent(body.toString()).split('msg='));
        msg.forEach(item => {
            if(item){
                messages.push(item);
                console.log('messages' + messages);
            }
        });
    })
    req.on('end', function(){
        // console.log("ok")
    });
}).listen(3000,"127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');
var io = require('socket.io').listen(server);
io.sockets.on('connection',(socket)=>{
    count++;
    console.log('User connected' + count + 'user(s) present');
    socket.emit('users',{number:count,msg:messages});
    socket.broadcast.emit('users',{number:count,msg:messages});
    socket.on('disconnect',()=>{
        count--;
        console.log('User disconnected');
        socket.broadcast.emit('users',{number:count});
    })
})