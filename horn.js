module.exports = function(config, io){
    var mqtt_config = {
        "keyPath": config.iot.key,
        "certPath": config.iot.cert,
        "caPath": config.iot.ca,
        "host": config.iot.endpoint,
        "region": config.iot.region,
        "debug":true
    };
    var horn = require('aws-iot-device-sdk').device(mqtt_config);
    horn.on("connect",function(){
        horn.subscribe(config.iot.topic);
        console.log("Listening to Odin!");
        io.emit(config.iot.intent[1] + ":" + config.iot.mode[2], { data : true });
    });
    horn.on("message",function(topic, payload){
        console.log("Odin whispers!");
        payload = JSON.parse(payload.toString());
        console.log(config.iot.intent[payload.i] + ":" + config.iot.mode[payload.m], { data : payload.d });
        io.emit(config.iot.intent[payload.i] + ":" + config.iot.mode[payload.m], { data : payload.d });
    });
    horn.on("close",function(){
        console.log("IoT closed");
    });
    horn.on("error",function(err){
        console.log("IoT Error: " + err);
    });
}




