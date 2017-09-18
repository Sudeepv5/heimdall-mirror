
var AWS = require('aws-sdk');
var config = require('./config');

var odin = {};
AWS.config.region = config.iot.region;
odin.client = new AWS.IotData({endpoint: config.iot.endpoint});  
odin.params = {
    topic:config.iot.topic,
    qos:0
};

odin.whisper = function(intent, mode, data, callback){
    odin.params.payload = JSON.stringify({"i":config.intent[intent], "m":config.mode[mode], "d":data});
    odin.client.publish(odin.params, function(err, data){
        callback(err);
    });
};

module.exports = odin;



