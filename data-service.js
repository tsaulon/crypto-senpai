const request = require("request");
var node_coinmarketcap = require("node-coinmarketcap");
var coin_market = new node_coinmarketcap({events: true, refresh: 5, convert: "USD"});

var watchList = []; //holds lists of coins being watched.

/*
 * This function receives a parametered string, parses the coin symbol,
 * creates a request for the coin and resolves a string of the coin's details
 * or rejects a string with an error message.
 */
module.exports.getCoin = (query) => {
    return new Promise((resolve, reject) => {
        var str = query.split(" ");
        str = str.slice(1); //remove "show"

        coin_market.multi(coins => {

            var errorFlag = false;
            var reply = "";
            var errorMsg = "";
            
            //build string
            for(x in str){
                //catch non-symbols
                try{
                    reply += showCoin(coins.get(str[x].toUpperCase()));
                } catch(e){
                    errorMsg += str[x].toUpperCase() + " either does not exist or is not a part of the top 100.";
                    errorFlag = true;                    
                }
            }

            //if no error was caught
            (!errorFlag) ? resolve(reply) : reject(errorMsg + reply);
        });
    });
   
}

/*
 * This function receives a parametered string, parses the amount to be displayed, 
 * creates a request for the coin and resolves a 
 * string of the coin list's details or rejects a string with an error message.
 */
module.exports.getTop = (query) => {
    return new Promise((resolve, reject) => {

            //if remaining characters are numbers
            var num = query.split(" ");
            num = num.slice(2); //still an array

        try{
            //if only single element
            if(num.length == 1 && !isNaN(num[0]) && num < 11){
                    
                //request top coins
                coin_market.multi( coins => {
                    var list = coins.getTop(num[0]);
                    
                    //build string
                    var reply = "";
                    for(x in list){
                        reply += showCoin(list[x]);
                    }

                    resolve(reply);
                });
            } else if(isNaN(num[0])){
                throw "how can I show you the top '" + num + "' of a coin list?";
            } else if(num[0] > 10){
                throw "that's " + (num - 10) + " too many. Sorry.";
            } else{
                throw "I think something went wrong with your request.";
            }
        } catch(e){
            reject(e);
        }
    });
}

/*
 * This function receives a parametered string, parses the coin, and
 * adds a scheduler for coin details to the coin_market object. This function
 * also resolves a string that confirms the coin has been added to the watch list.
 * It also rejects a string that contains the error details.
 */
module.exports.watch = (query) => {

    return new Promise((resolve, reject) => {

        var parsed = query.split(" ");
        parsed = parsed.slice(1);
        parsed = parsed[0];
        
        coin_market.on(parsed, (coin, event) => {
            
            var exists = false;

            watchList.forEach((x) => {
                if(x.toLowerCase() == parsed){
                    exists = true;                 
                }
            });  

            if(!exists){
                watchList.push(coin.symbol);
                resolve(coin.name + " has been added to watch list!");
            } else{
                reject(coin.name + " already exists in the watch list.");
            }
        });
    });
}

/*
 * This function builds a string query to be parsed
 * for the getCoin() function. [Consider polishing...]
 */ 
module.exports.createBroadcast = () => {
    
    var str = "Watch list is empty!";

    if(watchList.length > 0){
        str = "show";   //build string

        for(x in watchList){
            str += " " + watchList[x];
        }
    }

    return str;
}

/*
 * This function receives a coin object, creates, and returns
 * a string using the object's properties.
 */ 
function showCoin(x) {

    var str = "\n\n" + x.name  + " (" + x.symbol + ")" + ":\t$" + parseFloat(x.price_usd).toFixed(3) + " USD";
        str += "\n\t\t\t\t\t>Percent changes: (1h) " + x.percent_change_1h; 
        str += "% (24h) " + x.percent_change_24h;
        str += "% (7d) " + x.percent_change_7d + "%";
        str += "\n\t\t\t\t\t>Market Cap: $" + parseFloat(x.market_cap_usd).toFixed(2) + "\n";

    return str;
}