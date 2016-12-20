module.exports = function() {
  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.locals.pretty = true;

  app.set('views', './views/mysql');
  app.set('view engine', 'jade');
  
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);

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
  return app;
}