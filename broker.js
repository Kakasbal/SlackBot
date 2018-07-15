const tools = require('./SlackDialog');
module.exports = {
handleApiAiAction: function(sender, action, responseText, contexts, parameters) {



if( isDefined(responseText)  && isDefined(action)) {
console.log("[responseText]: "+responseText);
//tools.SendMjsSlack(responseText, 'CAZULSQG5');
return responseText;
} else{
console.log("else --> [responseText]: "+ isDefined(responseText) );

switch (action) {
case 'get-wiki':
console.log("Entrando a GET-WIKI");
if (parameters.hasOwnProperty("Titulos") && parameters["Titulos"]!= ''){
        console.log("parameters[Titulos2]:  "+parameters["Titulos"]);
var request = require('request');
var reply;
console.log("parameters[Titulos]:  "+parameters["Titulos"]);
var V =  parameters["Titulos"].trim();
var P = V.split(' ').join('_');
console.log("parametro:"+V);
request({
//      url: 'https://es.wikipedia.org/api/rest_v1/page/related/'+V,
url : 'https://es.wikipedia.org/api/rest_v1/page/summary/'+V,
},function(error,response,body){
if(!error && response.statusCode == 200){
let N = JSON.parse(body);
          reply = `${responseText} ${"Titulo: "+N.displaytitle}  ${"Url: "+N.content_urls.mobile.page}  ${"Extracto: "+N.extract}`;
return reply;
     //   tools.SendMjsSlack(responseText, 'CAZULSQG5');
        // sendTextMessage(sender, reply);
        }else{
        console.error(response.error);
        console.log(" IntentWiki --> Entro a Error   "+response.statusCode );
        return responseText;
        }
        });
         }else {
                         console.log(" Intentwiki --> entro a Else ");
         return responseText;
         //sendTextMessage(sender,responseText);
         }
break;


case 'get-admin':
console.log("Entrando a GET-ADMIN");
break;

case "no-interest":
console.log("Ningun interes");
break;
}
}
}
};


function isDefined(obj) {
	if (typeof obj == 'undefined') {
		return false;
	}

	if (!obj) {
		return false;
	}

	return obj != null;
}
