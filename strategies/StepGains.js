var _ = require('lodash');
var log = require('../core/log.js');

var strat = {};
let stage = 'INIT';
var highestPrice = 0.0;
var lowestPrice = 0.0;
var startPrice = 0.0;
var sellAtTarget;
var buyAtTarget;
var stopLoss;
var stopLossSellAt;
var directPrice;
var fixedDirectPrice;

strat.init = function() {
	log.info('Go!');
	log.info('\n', this.settings);
    sellAtTarget = this.settings.sellAtTarget;
    buyAtTarget = this.settings.buyAtTarget;
    stopLoss = this.settings.stopLoss;
    stopLossSellAt = this.settings.stopLossSellAt;
    fixedDirectPrice = this.settings.fixedDirectPrice;
}

strat.buy = (candle,advice) => {
    advice('long');
    stage = 'WAITING_FOR_SELL_PRICE';
    directPrice=candle.close*sellAtTarget;
    startPrice = candle.close;
    highestPrice = candle.close;
    lowestPrice = candle.close;
}
strat.sell = (candle,advice) => {
    advice('short');
    stage = 'WAITING_FOR_BUY_PRICE';
    directPrice=candle.close*buyAtTarget;
    startPrice = candle.close;
    highestPrice = candle.close;
    lowestPrice = candle.close;
}

strat.check = function(candle) {

    if (stage !== 'INIT') {
        let date = new Date();
        date.setHours(date.getHours()+1);
        highestPrice = candle.close > highestPrice ? candle.close : highestPrice;
        lowestPrice = candle.close < lowestPrice ? candle.close : lowestPrice;
        console.log('\n', `[${date.getHours()<10 ? '0' : '' + date.getHours()}:${date.getMinutes()<10 ? '0' + date.getMinutes() : date.getMinutes()}]`);
        console.log({
            stage
            ,startPrice
            ,highestPrice
            ,lowestPrice
            ,directPrice
            ,currentPrice: candle.close
            ,pnl: (candle.close/startPrice).toFixed(4)
        });
    } else {
        console.log(this.settings);
    }
    if (stage==='INIT'){
            console.log('INIT');
            startPrice = candle.close;
            highestPrice = candle.close;
            lowestPrice = candle.close;
            if (this.settings.toBuyAtStart) {
                stage = 'WAITING_FOR_BUY_PRICE';
                directPrice = fixedDirectPrice > 0 ? fixedDirectPrice : buyAtTarget * startPrice;
            } else {
                stage = 'WAITING_FOR_SELL_PRICE';
                directPrice = fixedDirectPrice > 0 ? fixedDirectPrice : sellAtTarget * startPrice;
            }
        }
        if (stage==='WAITING_FOR_BUY_PRICE'){
            if (candle.close <= directPrice) {
                stage = 'BUY_PRICE_MET';
            }
            else if (candle.close/directPrice >= 1.10) {
                directPrice = buyAtTarget * candle.close;
                console.log('*New buy price*: ', directPrice);
                stage = 'WAITING_FOR_BUY_PRICE';
            }
            else {
                stage = 'WAITING_FOR_BUY_PRICE';
            }
        }
        if (stage==='BUY_PRICE_MET') {
            if (candle.close <= lowestPrice) {
                stage = 'BUY_PRICE_MET';
            } else if (candle.close <= directPrice*1.01) {
                strat.buy(candle,this.advice);
            } else {
                stage = 'WAITING_FOR_SELL_PRICE';
            }
        }
        if (stage==='WAITING_FOR_SELL_PRICE'){
            if (candle.close >= directPrice) {
                stage = 'SELL_PRICE_MET';
            } else if (stopLoss && candle.close*stopLossSellAt <= startPrice) {
                console.log('Stop Loss @ ', candle.close);
                strat.sell(candle,this.advice);
            } else {
                stage = 'WAITING_FOR_SELL_PRICE';
            }
        }
        if (stage==='SELL_PRICE_MET'){
            if (candle.close >= highestPrice) {
                stage = 'SELL_PRICE_MET';
            } else if (candle.close >= directPrice*0.99) {
                strat.sell(candle,this.advice);
            } else {
                stage = 'WAITING_FOR_SELL_PRICE';
            }
        }
}
module.exports = strat;