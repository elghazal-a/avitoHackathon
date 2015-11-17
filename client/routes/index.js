'use strict';
var path = require('path');
exports.initRoutes  = function (app) {

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/partials/index', function(req, res){
		res.render('partials/chat');
    });
        
    console.log('Routes handling initialized');
};