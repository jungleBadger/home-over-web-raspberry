/**
 * Created by danielabrao on 9/26/16.
 */
/*jslint node:true*/
(function () {
    "use strict";


    module.exports = function (app, request, device_info) {

        app.get('/x', function (req, res) {
            return res.status(200).send(device_info);
        });

        request({
            "method": "POST",
            "uri": "http://192.168.25.130:6026/createDevice",
            "form": {
                "serialNo": device_info.Serial,
                "deviceModel": device_info.Hardware,
                "location": "casa",
                "deviceId": [device_info.Hardware, device_info.Serial].join(""),
                "userId": "jungle"
            }
        }, function (error, response, body) {
            console.log(error);
            console.log(body);
            // request({
            //     "method": "POST",
            //     "uri": "http://192.168.25.130:6026/subscribeTopic",
            //     "form": {
            //         "type": "dev",
            //         "id": [device_info.Hardware, device_info.Serial].join(""),
            //         "evt": "test"
            //     }
            // }, function (err, resp, body) {
            //     console.log(err);
            //     console.log(body);
            // });
            // return res.status(200).send(body);
        });




    };

}());