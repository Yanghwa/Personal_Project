
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
// var md5 = require('md5');
// var sha256 = require('sha256');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'random what I want',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
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
			<a href='/auth/register'>Register</a>
			`);
	}
	
});
var salt = 'samfi2j582jb@!';
app.post('/auth/login', function(req, res) {
	
	var uname = req.body.username;
	var pwd = req.body.password;
	// if(uname === user.username && md5(pwd+salt) === user.password) {
	// 	req.session.displayName = user.displayName;
	// 	res.redirect('/welcome');
	// } else {
	// 	res.send('Who are you? <a href="/auth/login>login</a>"');
	// }
	for(i = 0; i < users.length; i++) {
		if(uname === users[i].username) {
			return hasher({password:pwd, salt:users[i].salt }, function(err, pass, salt, hash) {
				if(hash === users[i].password) {
					req.session.displayName = users[i].displayName;
					req.session.save(function() {
						res.redirect('/welcome');
					});
				} else {
					res.send('Who are you? <a href="/auth/login>login</a>"');
				}
			});
		}
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
app.post('/auth/register', function(req, res) {
	hasher({password:req.body.password}, function(err, pass, salt, hash) {
		var user = {
			username: req.body.username,
			password: hash,
			salt: salt,
			displayName: req.body.displayName
		};
		users.push(user);
		req.session.displayName = req.body.displayName;
		req.session.save(function() {
			res.redirect('/welcome');
		});
	});
});
app.get('/auth/register', function(req, res) {
	var output = `
		<h1>Login</h1>
		<form action='/auth/register' method='post'>
			<p>
				<input type='text' name='username' placeholder='username'>
			</p>
			<p>
				<input type='password' name='password' placeholder='password'>
			</p>
			<p>
				<input type='password' name='displayName' placeholder='displayName'>
			</p>
			<p>
				<input type='submit'>
			</p>
		</form>`;
	res.send(output);
});
var users = [{
		username: 'nn',
		salt: 'XujFLTxUp2zDmB0Y21L9Z2PzCanoB34UHtCulQnzu7EMCOm5m3PMxL3U58avvt03PDJwynaoYRehKGP1dzrVyw==',
		password:'QwpsGPmtphf4uzPpME8cbSdljdyn6SIQb2Gk6sJ5lzwUoDY/UmY/cTC5WroNI4wJD8bzluW80gE723CsxVKnJzo4DkCzImXbVMMD+zMoCXe4z/+oEPypguvPmq+kPEgoRBfm08AFfQiLNGsz+pUkMYiO8RWrnfHqhMGJk2WCkEA=',
		displayName: 'Yag'
	}	
]
app.listen(3000, function() {
	console.log("connected to port 3000");
});