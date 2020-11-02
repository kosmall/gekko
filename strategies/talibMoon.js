var _ = require('lodash');
var log = require('../core/log.js');

var strat = {};
var toBuy = true;

strat.init = function() {
	log.info('To the TALIB-Moooooooon!');
	log.info('\n', this.settings);
	// toBuy = this.settings.buyAtStart;
	this.addTalibIndicator('emaBlue', 'ema', {
		optInTimePeriod: this.settings.emaBlue,
	});
	this.addTalibIndicator('emaGreen', 'ema', {
		optInTimePeriod: this.settings.emaGreen,
	});
	this.addTalibIndicator('emaYellow', 'ema', {
		optInTimePeriod: this.settings.emaYellow,
	});
	this.addTalibIndicator('emaRed', 'ema', {
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
  const emaBlue =  this.talibIndicators.emaBlue.result.outReal;
  const emaGreen = this.talibIndicators.emaGreen.result.outReal;
  const emaYellow = this.talibIndicators.emaYellow.result.outReal;
  const emaRed = this.talibIndicators.emaRed.result.outReal;
  if (toBuy && emaBlue > emaGreen && emaGreen > emaYellow && emaYellow > emaRed && strat.compareWithPrevCandle) {
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