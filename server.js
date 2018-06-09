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

    //if "show top" is included in string
    if(received.indexOf("show top") > -1){
        data_service.getTop(received).then(data => {
            msg.reply(data);
        }).catch(data => {
            msg.reply(data);
        });
    }

    //if only "show" is included in string
    if(received.indexOf("show") > -1 && received.indexOf("top") == -1){
        data_service.getCoin(received).then(data => {
            msg.reply(data);
        }).catch(data => {
            msg.reply(data);
        });
    }

    //TODO: Create alert functions
});

client.login(token);

