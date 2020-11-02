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
	log.info('\n', this.settings);
	toBuy = this.settings.buyAtStart;
	this.addTulipIndicator('emaBlue', 'ema', {
		optInTimePeriod: this.settings.emaBlue,
	});
	this.addTulipIndicator('emaGreen', 'ema', {
		optInTimePeriod: this.settings.emaGreen,
	});
	this.addTulipIndicator('emaYellow', 'ema', {
		optInTimePeriod: this.settings.emaYellow,
	});
	this.addTulipIndicator('emaRed', 'ema', {
		optInTimePeriod: this.settings.emaRed,
	});
}

strat.compareWithPrevCandle = (blue,green,yellow,red) => {
	if (blue <= 0 || green <= 0 || yellow <= 0 || red <= 0) {
		console.log('indicator not ready');
		console.log([blue,green,yellow,red]);
		return false;
	}
	return blue > prevBlue && green > prevGreen && yellow > prevYellow && red > prevRed;
}

strat.check = function(candle) {
  const emaBlue =  this.tulipIndicators.emaBlue.result.result;
  const emaGreen = this.tulipIndicators.emaGreen.result.result;
  const emaYellow = this.tulipIndicators.emaYellow.result.result;
  const emaRed = this.tulipIndicators.emaRed.result.result;
  if (toBuy && emaBlue > emaGreen && emaGreen > emaYellow && emaYellow > emaRed && strat.compareWithPrevCandle(emaBlue,emaGreen,emaYellow,emaRed)) {
  	this.advice('long');
  	log.debug('\n', {candle});
  	log.debug('\n', {emaBlue, emaGreen, emaYellow, emaRed});
  	toBuy = !toBuy;
  } else if(!toBuy && emaBlue < emaGreen){
  	this.advice('short');
  	log.debug('\n', {candle});
  	log.debug('\n', {emaBlue, emaGreen, emaYellow, emaRed});
  	toBuy = !toBuy;
  }
}
module.exports = strat;