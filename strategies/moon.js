var _ = require('lodash');
var log = require('../core/log.js');

var strat = {};
var toBuy;
var prevBlue = 0;
var prevGreen = 0;
var prevYellow = 0;
var prevRed = 0;

strat.init = function() {
	log.info('To the Moooooooon!');
	this.requiredHistory = this.tradingAdvisor.historySize;
	log.info('\n', this.settings);
	toBuy = this.settings.buyAtStart;
	this.addTulipIndicator('ovr__emaBlue', 'ema', {
		optInTimePeriod: this.settings.emaBlue,
	});
	this.addTulipIndicator('ovr__emaGreen', 'ema', {
		optInTimePeriod: this.settings.emaGreen,
	});
	this.addTulipIndicator('ovr__emaYellow', 'ema', {
		optInTimePeriod: this.settings.emaYellow,
	});
	this.addTulipIndicator('ovr__emaRed', 'ema', {
		optInTimePeriod: this.settings.emaRed,
	});
}


strat.check = function(candle) {
  const emaBlue =  this.tulipIndicators.ovr__emaBlue.result.result;
  const emaGreen = this.tulipIndicators.ovr__emaGreen.result.result;
  const emaYellow = this.tulipIndicators.ovr__emaYellow.result.result;
  const emaRed = this.tulipIndicators.ovr__emaRed.result.result;
  if (toBuy && emaBlue > emaGreen && emaGreen > emaYellow && emaYellow > emaRed) {
  	this.advice('long');
  	log.debug('\n', {candle});
  	log.debug('\n', {emaBlue, emaGreen, emaYellow, emaRed});
  	toBuy = !toBuy;
  } else if(!toBuy && (emaBlue <= emaGreen || emaGreen <= emaYellow || emaYellow <= emaRed)){
  	this.advice('short');
  	log.debug('\n', {candle});
  	log.debug('\n', {emaBlue, emaGreen, emaYellow, emaRed});
  	toBuy = !toBuy;
  }
  prevBlue = emaBlue;
  prevGreen = emaGreen;
  prevYellow = emaYellow;
  prevRed = emaRed;
}
module.exports = strat;