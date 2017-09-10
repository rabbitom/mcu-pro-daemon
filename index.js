#!/usr/bin/env node
var CCTool = require('./cc-tool.js');

var cctool = new CCTool();

// local http server
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);

server.listen(process.env.HTTP_LISTEN_PORT || 8000);

app.use(bodyParser.json());

app.get('/programmers', (req,res)=>{
    cctool.getStatus().then(object=>{
        res.status(200).json({
            code: 0,
            data: [object]
        });
    }, error=>{
        res.status(500).json({
            code: 1,
            msg: error.toString()
        });
    });
});

app.post('/program', (req,res)=>{
    cctool.program(req.body.configs).then(msg=>{
        res.status(200).json({
            code: 0,
            msg: msg
        });
    }, (msg)=>{
        res.status(500).json({
            code: 1,
            msg: msg
        })
    });
});

var utils = require('./utils.js');
const firmwarePath = utils.getFirmwarePath();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.post('/firmwares', multipartMiddleware, function(req, res) {
    var fileKey = 'firmware';
    var file = req.files[fileKey];
    for(var key in req.files)
        console.log('key: ' + key);
    saveFile(fileKey, file).then(function(data){
        res.status(200).json({
            code: 0,
            data: data,
            msg: "OK"
        });
    }, function(msg){
        res.status(500).json({
            code: 1,
            msg: msg
        });
    });
});

const fs = require("fs");

function saveFile(fileKey, file) {
    return new Promise(function(resolve,reject){
        var tmpPath = file.path;
        console.log("uploaded firmware file: " + tmpPath);
        var targetPath = firmwarePath + file.name;
        fs.rename(tmpPath, targetPath, function(err){
            if(err)
                reject("move file failed: " + err);
            else
                resolve({
                    file: file.name
                });
        });
    });
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/static/index.html');
});

app.use(express.static(__dirname + '/static'));
