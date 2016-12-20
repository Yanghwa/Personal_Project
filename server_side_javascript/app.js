var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views'); //it's not necessary
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/form', function(req, res) {
	res.render('form');
});
app.get('/form_receiver', function(req, res) {
	var title = req.query.title;
	var description = req.query.description;
	res.send(title+','+description);
});
app.post('/form_receiver', function(req, res) {
	var title = req.body.title;
	var description = req.body.description;
	res.send(title+','+description);
});
app.get('/template', function(req, res) {
	res.render('temp', {time: Date(), title: 'Jade'});
});
app.get('/topic/:id', function(req, res) {
	var topics = [
	"Javascript is ..",
	"Nodejs is...",
	"Express is ..."
	];
	var output = `
	<a href="/topic/0">Javascript</a><br />
	<a href="/topic/1">NodeJs</a><br />
	<a href="/topic/2">Express</a><br /><br />
	// ${topics[req.query.id]}
	${topics[req.params.id]}
	`
	res.send(output);
});
app.get('/topic/:id/:mode', function(req, res) {
	res.send(req.params.id+","+req.params.mode);
});
app.get('/dynamic', function(req, res) {
	var lis = '';
	for(i = 0; i < 5; i++) {
		lis += '<li>coding</li>';
	}
	var time = Date();
	var output = `
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8">
			<title></title>
		</head>
		<body>
			Hello, dynamic!
			<ul>
				${lis}
			</ul>
			${time}
		</body>
	</html>`;
	res.send(output);
});
app.get('/', function(req, res) {
	res.send('Hello home page');
});
app.get('/login', function(req, res) {
	res.send('<h1>Need to login</h1>');
});
app.get('/route', function(req, res) {
	res.send('Hello route, <img src="/route.jpg">');
});
app.listen(3000, function() {
	console.log("Connected 3000 port using Express");
});