/*
  StepGains - Crypto49er 2018-04-21
 */
// helpers
var _ = require('lodash');
var log = require('../core/log.js');

var startAt = 0.0;
var sellAt = 0.0;
var buyAt = 0.0;
var curHigh = 0.0;
var curLow = 0.0;


var toSell;
var toBuy;
var sellAtTarget;
var buyAtTarget;
var stopLoss;
var stopLossSellAt;
var afterStopLose = false;

// Let's create our own buy and sell strategy 
var strat = {};

// Prepare everything our strat needs
strat.init = function () {
    // how many candles do we need as a base
    // before we can start giving advice?
    this.requiredHistory = this.tradingAdvisor.historySize;
    toSell = !this.settings.toBuyAtStart;
    toBuy = this.settings.toBuyAtStart;

    sellAtTarget = this.settings.sellAtTarget;
    buyAtTarget = this.settings.buyAtTarget;
    stopLoss = this.settings.stopLoss;
    stopLossSellAt = this.settings.stopLossSellAt;
    jumper = this.settings.jumper;
}

// What happens on every new candle?
strat.update = function (candle) {
    // Display close price in terminal
    log.debug('candle time', candle.start);
    log.debug('candle close price:', candle.close);
}

// For debugging purposes.
strat.log = function () {

}

var atStopLoss = (candle) => {

}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function (candle) {



    let date = new Date();
    console.log(`[${date.getHours()<10 ? '0' : '' + date.getHours()+1}:${date.getMinutes()<10 ? '0' + date.getMinutes() : date.getMinutes()}] Candle close: ${candle.close}`);
    if (startAt == 0.0) {
        console.log({ sellAtTarget, buyAtTarget, stopLoss, stopLossSellAt, jumper, toSell, toBuy });

        startAt = candle.close;
        curHigh = candle.close;
        curLow = candle.close;
        buyAt = buyAtTarget * candle.close;
        sellAt = sellAtTarget * candle.close;
    } else if (toBuy) {
        console.log('buy at: ' + buyAt);
        if (candle.close <= buyAt) {
            if (jumper && candle.close < curLow) {
                curLow = candle.close;
            } else {
                this.advice("long");
                log.debug('Buying at', candle.close);
                console.log('$$$Buying at: ', candle.close);
                toBuy = false;
                toSell = true;
                curHigh = 0.0;
                sellAt = sellAtTarget * candle.close;
                console.log('->Sell at: ', sellAt);
                curLow = sellAtTarget * candle.close;
                if (afterStopLose) {
                    afterStopLose = false;
                    jumper = this.settings.jumper;
                }
            }
        } else {
            curHigh = curHigh < candle.close ? candle.close : curHigh;
            if (buyAtTarget * curHigh > buyAt) {
                buyAt = buyAtTarget * curHigh;
                console.log('*new* Buy at: ', buyAt);
            }
        }
    } else if (toSell) {
        console.log('sell at: ' + sellAt);
        if (candle.close >= sellAt) {
            if (jumper && candle.close > curHigh) {
                curHigh = candle.close;
            } else {
                this.advice("short");
                log.debug('Selling at', candle.close);
                console.log('$$$Seling at: ', candle.close);
                toBuy = true;
                toSell = false;
                curLow = candle.close;
                buyAt = buyAtTarget * candle.close;
                console.log('->Buy at: ', buyAt);
            }
        } else {
            curLow = candle.close < curLow ? candle.close : curLow;
            if (stopLoss * curLow < sellAt) {
                this.advice("short");
                log.debug('Selling at', candle.close);
                console.log('[STOP LOSS]!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            
                toBuy = true;
                toSell = false;
                curLow = candle.close;
                jumper = false;
                afterStopLose = true;
                buyAt = buyAtTarget * candle.close;
            }

        }
    }
}


module.exports = strat;