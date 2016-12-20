var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();
var mysql      = require('mysql');
var con = mysql.createConnection({
  host     : 'sql.computerstudi.es',
  user     : 'gc200320739',
  password : 'suXabtJE',
  database : 'gc200320739',
});
con.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + con.threadId);
});

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
    host     : 'sql.computerstudi.es',
    user     : 'gc200320739',
    password : 'suXabtJE',
    database : 'gc200320739'
  })
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
  var sql = 'SELECT * FROM users WHERE authId = ?';
  con.query(sql, [id], function(err, results) {
    if(err) {
      console.log(err);
      done('There is no user.');
    } else {
      done(null, results[0]);
    }
  });
});
passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    var sql = 'SELECT * FROM users WHERE authId = ?';
    con.query(sql, ['local:' + uname], function(err, results) {
      console.log(results);
      if(err) {
        return done('There is no user.');
      }
      var user = results[0];
      return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
        if(hash === user.password){
          console.log('LocalStrategy', user);
          done(null, user);
        } else {
          done(null, false);
        }
      });
    });
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
    var sql = 'SELECT * FROM users WHERE authId = ?';
    con.query(sql, [authId], function(err, results) {
      if(results.length > 0) {
        done(null, results[0]);
      } else {
        var newuser = {
          'authId':authId,
          'displayName':profile.displayName,
          'email':profile.emails[0].value
        };
        var sql = 'INSERT INTO users SET ?';
        con.query(sql, newuser, function(err, results) {
          if(err) {
            console.log(err);
            done('Error');
          } else {
            done(null, newuser);
          }
        });
      }
    });
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
app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
    	authId:'local:'+req.body.username,
	    username:req.body.username,
	    password:hash,
	    salt:salt,
	    displayName:req.body.displayName
    };
    var sql = 'INSERT INTO users SET ?';
    con.query(sql, user, function(err, results) {
      if(err) {
        console.log(err);
        res.send(500);
      } else {
        req.login(user, function(err){
          req.session.save(function(){
            res.redirect('/welcome');
          });
        });
      }
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