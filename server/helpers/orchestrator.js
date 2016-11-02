/**
 * Created by danielabrao on 9/26/16.
 */
(function () {
    "use strict";

    module.exports = function (app, iot_cloud, iot_local, io, GPIO) {

        var led = new GPIO(8, "out"),
            ledStatus = 0;

        iot_cloud.subscribe("iot-2/cmd/status/fmt/json");

        iot_cloud.on("message", function (topic, msg) {
            console.log("message received");
            console.log(topic);
            console.log(msg);

            ledStatus = ledStatus ? 0 : 1;

            led.writeSync(ledStatus);

            iot_cloud.publish("iot-2/evt/status/fmt/json", JSON.stringify({oi: "olá"}));
        });


        iot_local.on("message", function (topic, payload) {
            console.log([topic, payload].join(": "));
        });

    };

}());