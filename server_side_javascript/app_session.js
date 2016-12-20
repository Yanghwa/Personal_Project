var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'random what I want',
  resave: false,
  saveUninitialized: true
}));
app.get('/count', function(req, res) {
	if(req.session.count) {
		req.session.count++;
	} else {
		req.session.count = 1;	
	}
	res.send('count: ' + req.session.count);
});
app.get('/auth/logout', function(req, res) {
	delete req.session.displayName;
	res.redirect('/welcome');
});
app.get('/welcome', function(req, res) {
	if(req.session.displayName) {
		res.send(`
			<h1>Hello, ${req.session.displayName}</h1>
			<a href='/auth/logout'>Logout</a>
			`);
	} else {
		res.send(`
			<h1>Welcome</h1>
			<a href='/auth/login'>Login</a>
			`);
	}
	
});
app.post('/auth/login', function(req, res) {
	var user = {
		username: 'nn',
		password: '1111',
		displayName: 'Yag'
	};
	var uname = req.body.username;
	var pwd = req.body.password;
	if(uname === user.username && pwd === user.password) {
		req.session.displayName = user.displayName;
		res.redirect('/welcome');
	} else {
		res.send('Who are you? <a href="/auth/login>login</a>"');
	}

});
app.get('/auth/login', function(req, res) {
	var output = `
		<h1>Login</h1>
		<form action='/auth/login' method='post'>
			<p>
				<input type='text' name='username' placeholder='username'>
			</p>
			<p>
				<input type='password' name='password' placeholder='password'>
			</p>
			<p>
				<input type='submit'>
			</p>
		</form>`;
	res.send(output);
});
app.listen(3000, function() {
	console.log("connected to port 3000");
});