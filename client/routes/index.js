'use strict';
var path = require('path');
exports.initRoutes  = function (app) {

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/partials/index', function(req, res){
		res.render('partials/chat');
    });

    app.get('/partials/login', function(req, res){
		res.render('partials/login');
    });

    app.get('/*', function(req, res){
    	res.render('index');
    });
        
    console.log('Routes handling initialized');
};