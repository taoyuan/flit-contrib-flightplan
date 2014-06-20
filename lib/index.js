"use strict";

// hack flight
require('./flight');

// flightplan log requires colors
require('./colorslog');

var chalk = require('chalk');
var LocalFlight = require('flightplan/lib/local');
var RemoteFlight = require('flightplan/lib/remote');

var Briefing = require('./briefing');

module.exports = function (c, next) {

    c.briefing = function (config) {
        if (!config) {
            return this._briefing;
        }
        this._briefing = new Briefing(config);
    };

    c.briefing(c.config.data);

    if (c.destination && (!c.briefing().hasDestination(c.destination))) {
        return next(chalk.warn(c.destination || '<empty>') + ' is not a valid destination');
    }

    c.local = function (fn) {
        var flight = new LocalFlight(c, fn);
        flight.start(c.destination);
        var status = flight.getStatus();
        if(flight.isAborted()) {
            throw new Error(status.crashRecordings || '');
        }
    };

    c.remote = function (fn) {
        var flight = new RemoteFlight(c, fn);
        flight.start(c.destination);
        var status = flight.getStatus();
        if(flight.isAborted()) {
            throw new Error(status.crashRecordings || '');
        }
    };

    next();
};