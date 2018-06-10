
//const token = /* token goes here */;

const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");
var node_coinmarketcap = require("node-coinmarketcap");
var coin_market = new node_coinmarketcap();
var data_service = require("./data-service.js");

//Discord functions
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {

    var received = msg.content.toLowerCase();    //ignore capitalization formatting.

    //Show top coins (Max. 10)
    if(received.indexOf("show top") == 0){
        data_service.getTop(received).then(data => {
            msg.reply(data);
        }).catch(data => {
            msg.reply(data);
        });
    }

    //Show specific coin
    if(received.indexOf("show") == 0 && received.indexOf("top") == -1){
        data_service.getCoin(received).then(data => {
            msg.reply(data);
        }).catch(data => {
            msg.reply(data);
        });
    }

    //Alert when coin is certain price
    if(received.indexOf("alert when") == 0 && received.indexOf("hits") > -1){
        data_service.alertWhen(received).then(data => {
            console.log(data);
        }).catch(data => {
            console.log(data);
        });
    }
});

client.login(token);

