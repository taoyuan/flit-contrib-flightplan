"use strict";

// hack flight
require('./flight');

// flightplan log requires colors
require('./colorslog');

var chalk = require('chalk');
var LocalFlight = require('flightplan/lib/local');
var RemoteFlight = require('flightplan/lib/remote');

var Briefing = require('./briefing');

module.exports = function (flit) {

    return function (c, next) {

        c.briefing = function (config) {
            if (!config) {
                return c._briefing;
            }
            c._briefing = new Briefing(config);
        };

        c.briefing(c.config.data);

        if (c.destination && (!c.briefing().hasDestination(c.destination))) {
            return next(chalk.yellow(c.destination || '<empty>') + ' is not a valid destination');
        }

        c.hosts = c.briefing().getHostsForDestination(c.destination);

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
    }
};

