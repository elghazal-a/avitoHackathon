var path              = require('path')
    express           = require('express'),    
    app               = module.exports = express(),
    server            = require('http').Server(app),

    logger            = require('morgan'),
    methodOverride    = require('method-override'),
    bodyParser        = require('body-parser'),
    errorHandler      = require('errorhandler'),
  
    routes            = require('./routes')
;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
routes.initRoutes(app);
if ('development' == app.get('env')) {
  app.use(errorHandler());
}


server.listen(app.get('port'), function(){
  // console.log("Express server listening on " in mode " + app.get('env'));
});
