/**
 * Created by danielabrao on 9/26/16.
 */
(function() {
    'use strict';

    module.exports = function (mqtt, localEnv) {
        return {
            createConnection: function () {
                return new Promise(function (resolve, reject) {
                    var client = mqtt.connect({
                        "clientId": "a-rasp-node",
                        "username": "dcerag",
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
                    });
                    client.publish("mqtt/demo", "hello world!");

                    resolve(client);
                });
            }
        }

    };

}());
