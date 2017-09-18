var odin = require('./odin.js');

exports.handler = (event, context, callback) => {
    try{
        if (event.session.new) {
            console.log("NEW SESSION")
        }
        switch (event.request.type) {
            case "LaunchRequest":
                console.log('LAUNCH REQUEST')
                context.succeed(generateResponse(buildSpeechletResponse("Heimdall, at your service!", true),{}))
                break;
            case "IntentRequest":
                console.log('INTENT REQUEST')
                processIntent(context, event.request.intent)
                break;
            case "SessionEndedRequest":
                console.log('SESSION ENDED REQUEST')
                break;
            default:
                context.fail('INVALID REQUEST TYPE: ${event.request.type}') 
        }
    } catch(error){context.fail('Exception: '+ error)}
};

//helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }
}

generateResponse = (speechletResponse, sessionAttributes) => {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}

processIntent = (context, intent) => {
    var slot = intent.slots;
    switch(intent.name){
        case "OpenBifrost":executeIntent("open", "bifrost", context, "Heimdall at your service!");break;
        case "CloseBifrost":executeIntent("close", "bifrost", context, "Good bye!");break;
        case "OpenDialogue":executeIntent("open", "text", context, "Done!", slot.Dialogue.value);break;
        case "CloseDialogue":executeIntent("close", "text", context, "As you say!");break;
        case "OpenCountDown":executeIntent("open", "countdown", context, "Count down started with " + slot.CountMins.value + " minutes",
                                            slot.CountMins.value);break;
        case "CloseCountDown":executeIntent("close", "countdown", context, "Done!");break;
        case "ToggleCountDown":executeIntent("poke", "countdown", context, "Sure!");break;
        case "OpenStopWatch":executeIntent("open", "stopwatch", context, "Opening stopwatch");break;
        case "CloseStopWatch":executeIntent("close", "stopwatch", context, "As you say!");break;
        case "ToggleStopWatch":executeIntent("poke", "stopwatch", context, "Sure!");break;
        case "StartRagnarok":executeIntent("open", "ragnarok", context, "Ragnarok begins! All the best");break;
        case "EndRagnarok":executeIntent("close", "ragnarok", context, "Ended");break;
        case "CloseAllGates":executeIntent("close", "all", context, "Closed");break;
        case "UpdateWeather":executeIntent("poke", "weather", context, "Thunders!");break;
        default: odinHandler(context, 1, "");break;
    }
}

executeIntent = (intent, mode, context, output, data) => {
    odin.whisper(intent, mode, data, function(err){
        odinHandler(context, err, output);
    });
}


odinHandler = function(context, err, message){
    if(err)
        context.succeed(generateResponse(buildSpeechletResponse("Unworthy Command!", true),{}));
    else
        context.succeed(generateResponse(buildSpeechletResponse(message, true),{}));
}