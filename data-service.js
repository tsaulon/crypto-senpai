const data_service = require("./data-service.js");  //use this module's exports.
const request = require("request");
var node_coinmarketcap = require("node-coinmarketcap");
var coin_market = new node_coinmarketcap();

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
                    errorMsg += "I don't recognize " + str[x].toUpperCase() + " as a symbol.";
                    errorFlag = true;                    
                }
            }

            //if no error was caught
            (!errorFlag) ? resolve(reply) : reject(errorMsg + reply);
        });
    });
   
}

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

module.exports.alertWhen = (query) => {
    return new Promise((resolve, reject) => {
        
        //parsing string
        var pile = query.split(" ");
        pile = pile.slice(2);   // remove 'alert when'
        pile.splice(1, 1);  //remove element at index 1 and remove 1 element...
        
        //check if coin exists  
        //TODO: Look over this function.
        data_service.getCoin("show " + pile[0]).then(
            console.log("Coin found!")
        ).catch(data => {
            reject(data);
        });
        
    });
}

function showCoin(x) {

    var str = "\n\n" + x.name  + " (" + x.symbol + ")" + ":\t$" + parseFloat(x.price_usd).toFixed(3) + " USD";
        str += "\n\t\t\t\t\t>Percent changes: (1h) " + x.percent_change_1h; 
        str += "% (24h) " + x.percent_change_24h;
        str += "% (7d) " + x.percent_change_7d + "%";
        str += "\n\t\t\t\t\t>Market Cap: $" + parseFloat(x.market_cap_usd).toFixed(2) + "\n";

    return str;
}