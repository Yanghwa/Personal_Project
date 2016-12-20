var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/count', function(req, res){
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count : '+req.session.count);
});
app.get('/auth/logout', function(req, res){
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');
  });
});
app.get('/welcome', function(req, res){
	console.log(req.user);
	// console.log(req.user.displayName);
  if(req.user && req.user.displayName) {
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});
passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  // console.log(session);
  done(null, user.authId);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  // console.log(session);
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(user.authId === id){
      return done(null, user);
    }
  }
  done('There is no user.');
});
passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    for(var i=0; i<users.length; i++){
      var user = users[i];
      if(uname === user.username) {
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user);
          } else {
            done(null, false);
          }
        });
      }
    }
    done(null, false);
  }
));
passport.use(new FacebookStrategy({
    clientID: '195980897527589',
    clientSecret: '3798aeb2082a82c30872049d2e1e32fb',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log(profile);
  	var authId = 'facebook:' + profile.id;
  	for(var i = 0; i < users.length; i++) {
  		var user = users[i];
  		if(user.authId === authId) {
  			return done(null, user);
  		}
  	}
  	var newuser = {
  		'authId':authId,
  		'displayName':profile.displayName,
  		'email':profile.emails[0].value
  	};
  	users.push(newuser);
  	done(null, newuser);
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  }
));
app.post(
  '/auth/login',
  passport.authenticate(
    'local',
    {
      // successRedirect: '/welcome',
      failureRedirect: '/auth/login',
      failureFlash: false
    }), function (req, res) {
  	req.session.save(function() {
  		console.log(req.session);
  		res.redirect('/welcome');
  	})
  }
);
app.get('/auth/facebook', passport.authenticate('facebook', {scope:'email'}));
app.get(
	'/auth/facebook/callback',
  	passport.authenticate(
  		'facebook', 
  		{ 
  			// successRedirect: '/welcome',
  			failureRedirect: '/auth/login' 
  		}), function (req, res) {
	  	req.session.save(function() {
	  		console.log(req.session);
	  		res.redirect('/welcome');
	  	})
	  }
  	);
var users = [
  {
	authId:'local:nn',
	username: 'nn',
	salt: 'XujFLTxUp2zDmB0Y21L9Z2PzCanoB34UHtCulQnzu7EMCOm5m3PMxL3U58avvt03PDJwynaoYRehKGP1dzrVyw==',
	password:'QwpsGPmtphf4uzPpME8cbSdljdyn6SIQb2Gk6sJ5lzwUoDY/UmY/cTC5WroNI4wJD8bzluW80gE723CsxVKnJzo4DkCzImXbVMMD+zMoCXe4z/+oEPypguvPmq+kPEgoRBfm08AFfQiLNGsz+pUkMYiO8RWrnfHqhMGJk2WCkEA=',
	displayName: 'Yag'
  }
];
app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
    	authId:'local:'+req.body.username,
	    username:req.body.username,
	    password:hash,
	    salt:salt,
	    displayName:req.body.displayName
    };
    users.push(user);
    req.login(user, function(err){
      req.session.save(function(){
        res.redirect('/welcome');
      });
    });
  });
});
app.get('/auth/register', function(req, res){
  var output = `
  <h1>Register</h1>
  <form action="/auth/register" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displayName">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});
app.get('/auth/login', function(req, res){
  var output = `
  <h1>Login</h1>
  <form action="/auth/login" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  <a href='/auth/facebook'>faceboock</a>
  `;
  res.send(output);
});
app.listen(3000, function(){
  console.log('Connected 3000 port!!!');
});