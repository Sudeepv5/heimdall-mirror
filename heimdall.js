const express = require('express');
const app = express();
const https = require('https');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const opn = require('opn');
let config = require("./asgard/config.json");

//setup
app.use(express.static(__dirname + '/asgard/'));

server.listen(config.server.port,function(){
    console.log("Firing from:" + config.server.port);
});

app.get('/',function(req, res){
    res.sendFile(config.server.page);
});

//all misc
require('./horn')(config, io);
opn('http://localhost:'+config.server.port);



//weather 
var wOptions = {
    host: config.weather.api.host,
    path: config.weather.api.path + config.weather.api.key + "/" + 
          config.weather.location.latitude + "," + config.weather.location.longitude + 
          "?units=" + config.weather.units
};

app.get('/weather',function(request, response){
    getSonOfJ(wOptions, function(err, result){
        if(err)
            response.status(500).send({error: err});
        response.json(result);
    });
});


//util
function getSonOfJ(options, callback){
    https.request(options, function(res){
        var dump = '';
        res.on('data',function(d){
            dump += d;
        });
        res.on('end',function(){
            callback(null, JSON.parse(dump));
        });
        res.on('error', callback)
    })
    .on('error', callback)
    .end();
}



