/**
 * Created by danielabrao on 9/26/16.
 */
(function () {
    "use strict";

    module.exports = function (app, iot_cloud, iot_local, io, usonic, Gpio) {

        var sensor = 0;
        var led0 = new Gpio(26, 'out'),
            led1 = new Gpio(19, 'out'),
            alarm = new Gpio(13, 'out');

        var lights = {
            "light0": 0,
            "light1": 0
        };


        function changeLedStatus(ledNum, ledAction) {
            lights[["light" + ledNum].join("")] = ledAction;
        }


        usonic.init(function (error) {
            if (error) {
                console.log(error);
            } else {
                sensor = usonic.createSensor(18, 17, 1000);
            }
        });

        setInterval(function () {
            var value = sensor().toFixed(2);

            if (value <= 10) {
                alarm.writeSync(1);
            } else {
                alarm.writeSync(0);
            }

            iot_cloud.publish("iot-2/evt/status/fmt/json", JSON.stringify({
                "sensor": [{
                    "ultrasonic": {
                        "distance": value
                    }
                }],
                "lights": lights
            }));
        }, 1000);


        iot_cloud.on("message", function (topic, msg) {
            console.log("message received");
            console.log(topic);

            if (topic === "iot-2/cmd/lightUp0/fmt/json") {
                changeLedStatus(0, 1);
                led0.writeSync(1);

            }

            if (topic === "iot-2/cmd/lightDown0/fmt/json") {
                changeLedStatus(0, 0);
                led0.writeSync(0);
            }

            if (topic === "iot-2/cmd/lightUp1/fmt/json") {
                changeLedStatus(1, 1);
                led1.writeSync(1);
            }

            if (topic === "iot-2/cmd/lightDown1/fmt/json") {
                changeLedStatus(1, 0);
                led1.writeSync(0);
            }

        });


        iot_local.on("message", function (topic, payload) {
            console.log([topic, payload].join(": "));
        });

    };

}());