/*jslint node:true*/
(function () {
    'use strict';

    module.exports = function (app, io, passport, mqtt) {

        var client = mqtt.connect();
        client.subscribe("mqtt/demo");

        client.on("message", function (topic, payload) {
            console.log([topic, payload].join(": "));
            client.end();
        });

        client.publish("mqtt/demo", "hello world!")

        app.get('/', function (req, res) {
        console.log(req.session);
            return res.status(200).render('main.ejs', {
                user: req.user || ''
            });
        });
    };

}());
