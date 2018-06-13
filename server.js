//REMEMBER TO REMOVE THIS FOR EVERY GITHUB COMMIT
//const token = ;

var data_service = require("./data-service.js");
const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");
var node_coinmarketcap = require("node-coinmarketcap");
var coin_market = new node_coinmarketcap();
var broadcasting = false;

//Discord functions
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {

    var received = msg.content.toLowerCase();    //ignore formatting.

    //Show specific coin
    if(received.indexOf("show") === 0 && received.indexOf("top") == -1){
        data_service.getCoin(received).then(data => {
            msg.reply(data);
        }).catch(data => {
            msg.reply(data);
        });
    }

    //Show top coins (Max. 10)
    if(received.indexOf("show top") === 0){
        data_service.getTop(received).then(data => {
            msg.reply(data);
        }).catch(data => {
            msg.reply(data);
        });
    }

    //Watch a specific coin
    if(received.indexOf("watch") === 0){

        msg.channel.send("Processing request...");

        data_service.watch(received).then(data => {
            msg.reply(data + " I will notify you every hour or so.");
        }).then(() => {

            //delete setInterval() if it exists
            if(broadcasting){
                clearInterval(broadcasting);
                broadcasting = false;
            }
            
            //create new broadcast
            broadcasting = setInterval(() => {
                //send the broadcasts
                data_service.getCoin(data_service.createBroadcast()).then(data => {
                    msg.channel.send(data);
                }).catch(data => {
                    msg.channel.send(data);
                });
            }, 3600000);  //create broadcasts every hour
        }).catch(data => {
            msg.reply(data);
        })
    }

    if(received === "show watch list"){
        data_service.getCoin(data_service.createBroadcast()).then(data => {
            msg.channel.send(data);
        }).catch(data => {
            msg.channel.send(data);
        });
    }
});

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