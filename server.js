/*
 * 静态服务启动程序, 通过node server.js命令启动，便于本地调试
 * 启动后通过htt://127.0.0.1:8000即可访问到development目录
 * 
 * 访问/test始终返回{ret: 0, result: {}}串，便于接口调试
 */
var http = require('http');
var express = require('express');
var tab = express();
tab.use("/", express.static(__dirname + '/development'));
tab.all("/test", function(req, res){
	res.json({ret: 0, result: {}});
    res.end();
});

// 创建服务端
http.createServer(tab).listen('8000', function() {
	console.log('静态服务器已启动');
});