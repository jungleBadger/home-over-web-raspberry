/*jslint node:true*/
(function () {
    'use strict';

    module.exports = function (app, io, passport, mqtt) {

        var client = mqtt.createClient(1883, "localhost");

        client.on("connect", function(packet) {
            console.log("connected to broker");

            // subscribes
            for (var i in in_topics) {
                client.subscribe({
                    topic: in_topics[i]
                });
            }
        });


            app.get('/', function (req, res) {
            console.log(req.session);
            return res.status(200).render('main.ejs', {
                user: req.user || ''
            });
        });
    };

}());
