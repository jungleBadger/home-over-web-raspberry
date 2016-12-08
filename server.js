(function () {
    "use strict";

    var express = require("express"),
        cfenv = require("cfenv"),
        app = express(),
        appEnv = cfenv.getAppEnv(),
        localEnv = require("node-env-file")(__dirname + "/.env", {raise: false}),
        engines = require("consolidate"),
        mqtt = require("mqtt"),
        device_configs = require("./server/configs/device_info"),
        iot_configs_local = require("./server/configs/iot_configs-local.js")(localEnv),
        iot_configs_cloud,
        iot_connections_local = require("./server/helpers/iot_connections-local")(mqtt, localEnv),
        iot_connection_cloud,
        path = require("path"),
        ejs = require("ejs"),
        compress = require("compression"),
        request = require("request"),
        morgan = require("morgan"),
        server = require("http").createServer(app),
        tempSensor = require("node-dht-sensor"),
        usonic = require('r-pi-usonic'),
        io = require("socket.io")(server);


    usonic.init(function (error) {
        if (error) {
            console.log(error);
        } else {
            var sensor = usonic.createSensor(18, 17, 1000);
            setTimeout(function() {
                console.log('Distance: ' + sensor().toFixed(2) + ' cm');
            }, 60);
        }
    });


    // app.use(express["static"](path.join(__dirname, "./server/public/"), { maxAge: 16400000 }));
    app.use(express["static"](path.join(__dirname, "./server/public/")));
    app.use(express["static"](path.join(__dirname, "./client/")));

    app.use(compress());
    app.use(morgan("dev"));

    app.set("views", __dirname + "/client");
    app.engine("html", engines.ejs);
    app.set("view engine", "html");

    device_configs.then(function (device_info) {
        iot_configs_cloud = require("./server/configs/iotf_configs-cloud.js")(localEnv, device_info).defaults();
        iot_connection_cloud = require("./server/helpers/iotf_connection-cloud")(mqtt, iot_configs_cloud);
        iot_connection_cloud.createConnection().then(function (cloudMqtt) {

            iot_connections_local = require("./server/helpers/iot_connections-local")(mqtt, localEnv);

            iot_connections_local.createConnection().then(function (localMqtt) {
                require("./server/helpers/orchestrator")(app, cloudMqtt, localMqtt, io);
            }, function (error) {
                console.log("ERROR CREATING");
                console.log(error);
            });

            console.log("fkn created");
        }, function (err) {
            console.log(err);
        });

    }, function errorCB (err) {
        console.log(err);
        require("./server/routes/index.js")(app, request, mqtt, iot_configs_cloud);
    });

    app.listen(8080, "0.0.0.0", function() {
        console.log("server starting on 8080");
    });
}());

