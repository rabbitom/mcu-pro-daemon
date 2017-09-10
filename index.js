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
