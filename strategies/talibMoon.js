var _ = require('lodash');
var log = require('../core/log.js');

var strat = {};
var toBuy = true;
var prevBlue = 0;
var prevGreen = 0;
var prevYellow = 0;
var prevRed = 0;

strat.init = function() {
	log.info('To the TALIB-Moooooooon!');
	log.info('\n', this.settings);
	// toBuy = this.settings.buyAtStart;
	this.addTalibIndicator('ovr__emaBlue', 'ema', {
		optInTimePeriod: this.settings.emaBlue,
	});
	this.addTalibIndicator('ovr__emaGreen', 'ema', {
		optInTimePeriod: this.settings.emaGreen,
	});
	this.addTalibIndicator('ovr__emaYellow', 'ema', {
		optInTimePeriod: this.settings.emaYellow,
	});
	this.addTalibIndicator('ovr__emaRed', 'ema', {
		optInTimePeriod: this.settings.emaRed,
	});
}

strat.check = function(candle) {
  const emaBlue =  this.talibIndicators.ovr__emaBlue.result.outReal;
  const emaGreen = this.talibIndicators.ovr__emaGreen.result.outReal;
  const emaYellow = this.talibIndicators.ovr__emaYellow.result.outReal;
  const emaRed = this.talibIndicators.ovr__emaRed.result.outReal;
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