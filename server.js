(function () {
    "use strict";

    var express = require('express'),
        cfenv = require('cfenv'),
        app = express(),
        appEnv = cfenv.getAppEnv(),
        localEnv = require('node-env-file')(__dirname + '/.env', {raise: false}),
        iot_configs = require('./server/configs/mosquitto_iotf.js')(localEnv),
        engines = require('consolidate'),
        path = require('path'),
        ejs = require('ejs'),
        compress = require('compression'),
        morgan = require('morgan'),
        server = require('http').createServer(app),
        passport = require('passport'),
        mqtt = require('mqtt'),
        io = require('socket.io')(server);

    // app.use(express['static'](path.join(__dirname, './server/public/'), { maxAge: 16400000 }));
    app.use(express['static'](path.join(__dirname, './server/public/')));
    app.use(express['static'](path.join(__dirname, './client/')));

    app.use(compress());
    app.use(morgan('dev'));

    app.set('views', __dirname + '/client');
    app.engine('html', engines.ejs);
    app.set('view engine', 'html');

    require('./server/routes/index.js')(app, io, passport, mqtt, iot_configs);

    app.listen(appEnv.port, '0.0.0.0', function() {
        console.log("server starting on " + appEnv.url);
    });
}());

