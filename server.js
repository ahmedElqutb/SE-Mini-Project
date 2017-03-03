var express = require('express');
var router = require('./app/routes');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var morgan = require('morgan');
var session = require('client-sessions');
var flash = require('req-flash');
var DB_URI = "mongodb://localhost:27017/portfolio";
let User = require('./app/models/RegisteredUser');

var app = express();
var expressValidator = require('express-validator');

app.set('view engine', 'ejs');

// configure app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+ '/public'));
app.use(morgan('dev'));
app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));
app.use(flash());
app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ username: req.session.user.username }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

mongoose.connect(DB_URI);
app.use(expressValidator());
app.use(router);



// start the server
app.listen(8080, function(){
    console.log("server is listening on port 8080");
})