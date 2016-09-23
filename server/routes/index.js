/*jslint node:true*/
(function () {
    'use strict';

    module.exports = function (app, passport, mqtt, iot_configs) {

        var client = mqtt.connect({
            "clientId": "a-rasp-node",
            "username": "teste",
            "password": "123",
            "clean": false,
            "keepAlive": 600000
        });

        client.on("error", function (error) {
            console.log(error);
        });

        client.subscribe("mqtt/demo");

        client.on("message", function (topic, payload) {
            console.log([topic, payload].join(": "));
            client.end();
        });

        setInterval(function () {
            client.publish("mqtt/demo", "hello world!");
        }, 1000);



        app.get('/', function (req, res) {
        console.log(req.session);
            return res.status(200).render('main.ejs', {
                user: req.user || ''
            });
        });
    };

}());
