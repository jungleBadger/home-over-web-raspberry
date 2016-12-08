/**
 * Created by danielabrao on 9/26/16.
 */
(function () {
    "use strict";

    module.exports = function (app, iot_cloud, iot_local, io, usonic) {

        var sensor = 0,
            ledStatus = 0;

        usonic.init(function (error) {
            if (error) {
                console.log(error);
            } else {
                sensor = usonic.createSensor(18, 17, 1000);
            }
        });

        setInterval(function () {
            iot_cloud.publish("iot-2/evt/status/fmt/json", JSON.stringify({
                "sensor": [{
                    "ultrasonic": {
                        "distance": sensor
                    }
                }],
                "controller": {
                    "led01": ledStatus
                }
            }));
        }, 1000);


        iot_cloud.subscribe("iot-2/cmd/+/fmt/json");

        iot_cloud.on("message", function (topic, msg) {
            console.log("message received");
            console.log(topic);
            console.log(msg);

            iot_cloud.publish("iot-2/evt/status/fmt/json", JSON.stringify({oi: "olá"}));
        });


        iot_local.on("message", function (topic, payload) {
            console.log([topic, payload].join(": "));
        });

    };

}());