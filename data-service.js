const request = require("request");
var node_coinmarketcap = require("node-coinmarketcap");
var coin_market = new node_coinmarketcap();

module.exports.getCoin = (query) => {
    return new Promise((resolve, reject) => {
        var str = query.split(" ");
        str = str.slice(1); //remove "show"

        coin_market.multi(coins => {

            var errorFlag = false;
            var reply = "\n\nPrices are in USD.";
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
            num = num.slice(2);
    
            //if only single element
            if(num.length == 1){
                num = num[0];
                
                //request top coins
                coin_market.multi( coins => {
                    var list = coins.getTop(num);
                    
                    //build string
                    var reply = "\n\nPrices are in USD.";
                    for(x in list){
                        reply += showCoin(list[x]);
                    }

                    resolve(reply);
                });
            }else if(num.length > 1){
                reject("Uh-oh, I think there is something wrong with your query.");
            }
    });
}

function showCoin(x) {

    var str = "\n\n" + x.symbol + ":\t$" + parseFloat(x.price_usd).toFixed(3);
        str += "\n\t\t\t\t\t>Percent changes: (1h) " + x.percent_change_1h; 
        str += "% (24h) " + x.percent_change_24h;
        str += "% (7d) " + x.percent_change_7d + "%";
        str += "\n\t\t\t\t\t>Market Cap: $" + parseFloat(x.market_cap_usd).toFixed(2) + "\n";

    return str;
}