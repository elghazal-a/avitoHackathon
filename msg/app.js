var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');

var mongoose = require('mongoose')
var Chat = require('./models/Chat.js')
var msgs = require('./routes/msgs');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/msgs', msgs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
  	app.use(errorhandler({ log : true}));
  });
}

mongoose.connect('mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_1_PORT_27017_TCP_PORT + '/avito-dev');
mongoose.connection.once('open', function(){
  console.log('Database connection established ');
});


module.exports = app;
