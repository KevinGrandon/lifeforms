var express = require('express');
var app = express();
var debug = require('debug')('particle')

var config = require('./config');
var Engine = require('./engine');

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/entities/current', function(req, res) {
	var entityData = engine.getParticleViewData();

	entityData = JSON.stringify(entityData);
	res.send(entityData);
});

app.use(express.static(__dirname + '/public'));

// Web/socket server
var server = require('http').createServer(app);

var io = require('socket.io')(server);
io.on('connection', function(){
	console.log('Got connection!')
});
server.listen(8080);

var engine = new Engine(config, io);
engine.init();
