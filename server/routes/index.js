/*jslint node:true*/
(function () {
    'use strict';

    module.exports = function (app, io, passport, mqtt, iot_configs) {

        console.log(iot_configs);
        var client = mqtt.connect({
            "host": "localhost",
            "port": 1883,
            "username": iot_configs.username,
            "password": iot_configs.password
        });
        client.subscribe("mqtt/demo");

        client.on("message", function (topic, payload) {
            console.log([topic, payload].join(": "));
            client.end();
        });

        client.publish("mqtt/demo", "hello world!");

        app.get('/', function (req, res) {
        console.log(req.session);
            return res.status(200).render('main.ejs', {
                user: req.user || ''
            });
        });
    };

}());
