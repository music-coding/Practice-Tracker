var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();


var uri = "mongodb://admin:buttbutt1@ds143132.mlab.com:43132/heroku_h4k7lfnw";

// mongodb connection
mongoose.connect(uri);
// mongoose.connect("mongodb://localhost:27017/practice");
var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions for tracking logins
app.use(session({
  secret: 'Hey',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// make user ID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  res.locals.currentName = req.session.name;
  res.locals.currentRole = req.session.role;
  next();
});


// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);


// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express app listening on port 3000');
});
