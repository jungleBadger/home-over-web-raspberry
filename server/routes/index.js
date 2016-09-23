/*jslint node:true*/
(function () {
    'use strict';

    module.exports = function (app, passport, mqtt, iot_configs) {

        var client = mqtt.connect("mqtt://localhost:1883", {
            "clientId": "a-rasp-node",
            "username": iot_configs.credentials.username,
            "password": iot_configs.credentials.password,
            "clean": false
        });

        client.on("error", function (error) {
            console.log(error);
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
