const apiai = require('apiai');
const { RTMClient } = require('@slack/client');
const bodyParser = require('body-parser');
const request = require('request');
const uuid = require('uuid');
const bm = require('./broker');
const conf = require('../Clients/clients');
const conversationId = 'CAZULSQG5';
// Get an API token by creating an app at <https://api.slack.com/apps?new_app=1>
// It's always a good idea to keep sensitive data like the token outside your source code. Prefer environment variables.
const token = tokenSlack;
//const token = "xoxp-374726385334-373972903845-392223421383-4dd2f247ea3e9365b04a6df66565ece0";
if (!token) {
    console.log('You must specify a token to use this example');
    process.exitCode = 1;
    return;
}
const sessionIds = new Map();


const apiAiService = apiai("bc7acd62224f44a68843b76779496643", {
    language: "es",
    requestSource: "SLACK"
});

// Initialize an RTM API client
const rtm = new RTMClient(token);
// Start the connection to the platform
rtm.start();

// Log all incoming messages
rtm.on('message', (event) => {
    // Structure of `event`: <https://api.slack.com/events/message>
    console.log(`Message from ${event.user}: ${event.text} entrando a message`);

    if (!sessionIds.has(event.channel)) {
        sessionIds.set(event.channel, uuid.v1());
    }
    sendToApiAi(event.channel, event.text);
})

// Log all reactions
rtm.on('reaction_added', (event) => {
    // Structure of `event`: <https://api.slack.com/events/reaction_added>
    console.log(`Reaction from ${event.user}: ${event.reaction} entrando a reaction_added`);
});
rtm.on('reaction_removed', (event) => {
    // Structure of `event`: <https://api.slack.com/events/reaction_removed>
    console.log(`Reaction removed by ${event.user}: ${event.reaction} entrando a reaction_removed `);
});

// Send a message once the connection is ready
rtm.on('ready', (event) => {
    console.log('entro a Ready');
    // Getting a conversation ID is left as an exercise for the reader. It's usually available as the `channel` property
    // on incoming messages, or in responses to Web API requests.

    rtm.sendMessage('Hola Equipo!', conversationId);
});


function sendToApiAi(sender, text) {

    //        sendTypingOn(sender);
    let apiaiRequest = apiAiService.textRequest(text, {
        sessionId: sessionIds.get(sender)
    });

    apiaiRequest.on('response', (response) => {
        if (isDefined(response.result)) {
            handleApiAiResponse(sender, response);
        }

        console.log("sender:" + sender);
        console.log("respuesta: " + response.result);

    });

    apiaiRequest.on('error', (error) => console.error(error));
    apiaiRequest.end();
}

function isDefined(obj) {
    if (typeof obj == 'undefined') {
        return false;
    }

    if (!obj) {
        return false;
    }

    return obj != null;
}


function handleApiAiResponse(sender, response) {
    let responseText = response.result.fulfillment.speech;
    let responseData = response.result.fulfillment.data;
    let messages = response.result.fulfillment.messages;
    let action = response.result.action;
    let contexts = response.result.contexts;
    let parameters = response.result.parameters;
    //       let responseSlack = response.result.fulfillmentMessages.text;

    console.log("responseSlack messages[i].speech ---->:" + messages[0].speech);
    console.log("responseSlack2 ---->messages[0].type :" + messages[0].type);
    console.log("responseSlack3------> platform:" + messages[0].platform);

    if (responseText == '' && !isDefined(action)) {
        //api ai could not evaluate input.
        console.log('Unknown query' + response.result.resolvedQuery);
        sendTextMessage(sender, "I'm not sure what you want. Can you be more specific?");
    } else if (isDefined(action)) {
        handleApiAiAction(sender, action, responseText, contexts, parameters, messages);

        // console.log("SlackDialog -- [resp]: "+resp);
        //if(isDefined(responseText) && isDefined(conversationId)){
        //	rtm.sendMessage(resp , conversationId);
        //}else{console.log("SlackDialogo HandleApiAiResponse else")}
    }
}



function handleApiAiAction(sender, action, responseText, contexts, parameters, messages) {

    console.log("-------Action" + action);
    console.log("-------ResponseText" + responseText);
    if (isDefined(responseText) && isDefined(action)) {
        console.log("[responseText]: " + responseText);
        //tools.SendMjsSlack(responseText, 'CAZULSQG5');
        rtm.sendMessage(responseText, conversationId);;
    } else {
        console.log("else --> [responseText]: " + isDefined(responseText));
        console.log("responseTextAIA" + responseText);

        switch (action) {
            case 'get-wiki':
                console.log("Entrando a GET-WIKI");
                if (parameters.hasOwnProperty("Titulos") && parameters["Titulos"] != '') {
                    console.log("parameters[Titulos2]:  " + parameters["Titulos"]);
                    var request = require('request');
                    var reply;
                    console.log("parameters[Titulos]:  " + parameters["Titulos"]);
                    var V = parameters["Titulos"].trim();
                    var P = V.split(' ').join('_');
                    console.log("parametro:" + V);
                    request({
                        //      url: 'https://es.wikipedia.org/api/rest_v1/page/related/'+V,
                        url: 'https://es.wikipedia.org/api/rest_v1/page/summary/' + V,
                    }, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let N = JSON.parse(body);
                            reply = `${responseText} ${"Titulo: "+N.displaytitle}  ${"Url: "+N.content_urls.mobile.page}  ${"Extracto: "+N.extract}`;
                            console.log("responseText: " + reply);
                            rtm.sendMessage(reply, conversationId);
                            //   tools.SendMjsSlack(responseText, 'CAZULSQG5');
                            // sendTextMessage(sender, reply);
                        } else {
                            console.error(response.error);
                            console.log(" IntentWiki --> Entro a Error   " + response.statusCode);
                            // responseText;
                        }
                    });
                } else {
                    console.log(" Intentwiki --> entro a Else ");
                    //  return responseText;
                    //sendTextMessage(sender,responseText);
                }
                break;


            case 'get-memory':
                console.log("Entrando a GET-MEMORY");
                if (parameters.hasOwnProperty("Sistemas") && parameters["Sistemas"] != '') {
                    var request = require('request');
                    console.log("parameters[Sistemas]:  " + parameters["Sistemas"]);
                    request({
                        url: 'http://ec2-13-58-216-36.us-east-2.compute.amazonaws.com:3000/MEMORIA/' + parameters["Sistemas"],
                        //qs:{from: '', time: +new Date()},
                    }, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let MEMORIA = JSON.parse(body);
                            //let reply = `${responseText} ${IP[0]["IP_ADDR"]}`;
                            for (var i = 0; i < MEMORIA.length; i++) {
                                //  host[i] = IP.getString("Host");
                                //ip[i] = IP.getString("IP_ADDR");
                                console.log("208... entro a status.. 200  host ######   " + MEMORIA[i].Host + "-----" + MEMORIA[i].Disco + "-----" + MEMORIA[i].MemoriaRam + "###--##" + responseText);

                                let reply = `${responseText} ${MEMORIA[i].Host} ${MEMORIA[i].MemoriaRam}`;
                                rtm.sendMessage(reply, conversationId);
                            }

                        } else {
                            console.error(response.error);
                            console.log("213... entro a status CODE error .....   ######   " + response.statusCode);
                        }
                    });
                } else {
                    console.log("217... entro a status CODE error .....   ######   ");
                    //	sendTextMessage(sender,responseText);
                }
                break;





                //Servicios muestra informacion de los DD de los servidores
            case 'get-dd':
                console.log("Entrando a GET-DD");
                if (parameters.hasOwnProperty("Sistemas") && parameters["Sistemas"] != '') {
                    var request = require('request');
                    console.log("parameters[Sistemas]:  " + parameters["Sistemas"]);
                    request({
                        url: 'http://ec2-13-58-216-36.us-east-2.compute.amazonaws.com:3000/MEMORIA/' + parameters["Sistemas"],
                    }, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let DD = JSON.parse(body);
                            for (var i = 0; i < DD.length; i++) {
                                console.log("208... entro a status CODE ..... 200  host ######  responseText " + responseText + "-----");
                                let reply = `${messages[0].speech}\n  ${responseText} ${DD[i].Host} ${DD[i].Disco}`;
                                rtm.sendMessage(reply, conversationId);
                            }
                        } else {
                            console.error(response.error);
                            console.log("213... entro a status CODE error .....   ######   " + response.statusCode);
                        }
                    });
                } else {
                    console.log("217... entro a status CODE error .....   ######   ");
                    //		sendTextMessage(sender,responseText);
                }
                break;



                //Servicios muestra informacion de los BK de los servidores de backup
            case 'get-bk':
                console.log("Entrando a GET-BK");
                if (parameters.hasOwnProperty("Sistemas") && parameters["Sistemas"] != '') {
                    var request = require('request');
                    console.log("parameters[Sistemas]:  " + parameters["Sistemas"]);
                    request({
                        url: 'http://ec2-13-58-216-36.us-east-2.compute.amazonaws.com:3000/BACKUP/' + parameters["Sistemas"],
                    }, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let BK = JSON.parse(body);
                            for (var i = 0; i < BK.length; i++) {
                                console.log("208... entro a status CODE ..... 200  host ######   " + BK[i].Disco + "-----");
                                let reply = `${responseText} ${BK[i].Host} ${BK[i].BACKUP}`;
                                //			 sendTextMessage(sender, reply);
                                rtm.sendMessage(reply, conversationId);

                            }
                        } else {
                            console.error(response.error);
                            console.log("213... entro a status CODE error .....   ######   " + response.statusCode);
                        }
                    });
                } else {
                    console.log("217... entro a status CODE error .....   ######   ");
                    //		sendTextMessage(sender,responseText);
                }
                break;




                //Servicios muestra informacion de las IPS de los servidores
            case 'get-ip':
                console.log("Entrando a GET-IP");
                if (parameters.hasOwnProperty("Sistemas") && parameters["Sistemas"] != '') {
                    var request = require('request');
                    console.log("parameters[Sistemas]:  " + parameters["Sistemas"]);
                    request({
                        url: 'http://ec2-13-58-216-36.us-east-2.compute.amazonaws.com:3000/IP/' + parameters["Sistemas"],
                        //qs:{from: '', time: +new Date()},
                    }, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let IP = JSON.parse(body);
                            //let reply = `${responseText} ${IP[0]["IP_ADDR"]}`;
                            for (var i = 0; i < IP.length; i++) {
                                //  host[i] = IP.getString("Host");
                                //ip[i] = IP.getString("IP_ADDR");
                                console.log("208... entro a status CODE ..... 200  host ######   " + IP[i].Host + "-----" + IP[i].IP_ADDR);

                                let reply = `${responseText} ${IP[i].Host} ${IP[i].IP_ADDR}`;
                                //			 sendTextMessage(sender, reply);

                                rtm.sendMessage(reply, conversationId);
                            }
                        } else {
                            console.error(response.error);
                            console.log("213... entro a status CODE error .....   ######   " + response.statusCode);
                        }
                    });
                } else {
                    console.log("217... entro a status CODE error .....   ######   ");
                    //		sendTextMessage(sender,responseText);
                }
                break;



                //Servicios muestra informacion de los ADMIN de los servidores
            case 'get-admin':
                console.log("Entrando a GET-ADMIN");
                if (parameters.hasOwnProperty("Sistemas") && parameters["Sistemas"] != '') {
                    var request = require('request');
                    console.log("parameters[Sistemas]:  " + parameters["Sistemas"]);
                    request({
                        url: 'http://ec2-13-58-216-36.us-east-2.compute.amazonaws.com:3000/ADMIN/' + parameters["Sistemas"],
                        //qs:{from: '', time: +new Date()},
                    }, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let ADMIN = JSON.parse(body);
                            for (var i = 0; i < ADMIN.length; i++) {
                                console.log("208... entro a status CODE ..... 200  host ######   " + ADMIN[i].Contact + "-----");
                                let reply = `${responseText} ${ADMIN[i].Contact}`;
                                rtm.sendMessage(reply, conversationId);
                            }
                        } else {
                            console.error(response.error);
                            console.log("213... entro a status CODE error .....   ######   " + response.statusCode);
                        }
                    });
                } else {
                    console.log("217... entro a status CODE error .....   ######   ");
                    //sendTextMessage(sender,responseText);
                }
                break;





            case 'get-git':
                console.log("Entrando a GET-GIT");
                if (parameters.hasOwnProperty("usuarios") && parameters["usuarios"] != '') {
                    var request = require('request');
                    console.log("parameters[usuarios]:  " + parameters["usuarios"]);
                    var options = {
                        url: 'https://api.github.com/users/' + parameters["usuarios"] + '/repos',
                        headers: {
                            'User-Agent': 'MarcoTulioGT'
                        }
                    };

                    request(options, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("-------------------ENTRO");
                            let gith = JSON.parse(body);
                            for (var i = 0; i < gith.length; i++) {
                                console.log("208... entro a status CODE ..... 200  host ######   " + gith[i].html_url + "-----");
                                let reply = `${responseText} ${gith[i].html_url}`;
                                rtm.sendMessage(reply, conversationId);
                            }
                        } else {
                            console.error(response.error);
                            console.log("213... entro a status CODE error .....   ######   " + response.statusCode);
                        }
                    });
                } else {
                    console.log("217... entro a status CODE error .....   ######   ");
                }
                break;



            case "no-interest":
                console.log("Ningun interes");
                break;

        }
    }
}

module.exports = {
    SendMjsSlack: function(responseText, conversationId) {

        if (isDefined(responseText) && isDefined(conversationId)) {
            rtm.sendMessage(responseText, conversationId);
        }
    }
};