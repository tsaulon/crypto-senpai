//const token = "";

var data_service = require("./data-service.js");
const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");
var node_coinmarketcap = require("node-coinmarketcap");
var coin_market = new node_coinmarketcap({events: true, refresh: 1, convert: "USD"});
var broadcasting = false;

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

    //Alert on intervals
    if(received.indexOf("watch") == 0){
        data_service.watch(received).then(data => {
            console.log(data);
        }).then(() => {
            if(broadcasting){
                clearInterval(broadcasting);
                broadcasting = false;
            }
        
            broadcasting = setInterval(() => {
                //msg.channel.send();
                data_service.getCoin(data_service.createBroadcast()).then(data => {
                    msg.channel.send(data);
                }).catch(data => {
                    msg.channel.send(data);
                });
            }, 5000);
        }).catch(data => {
            console.log(data);
        })
    }
});

//TODO: create user deletions from the watch list.

client.login(token);

/* Event Deletions

setTimeout(() => {
            for(x in eventList){
                if(eventList[x].coin == pile[0]){
                    eventList.splice(x, 1);
                    console.log(eventList[0]);
                }
            }
        }, 6000)
*/