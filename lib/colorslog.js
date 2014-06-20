"use strict";

var messageTypes = {
    log: 'yellow',
    info: 'blue',
    success: 'green',
    warn: 'yellow',
    error: 'red',
    command: 'white',
    debug: 'cyan'
};

// For flightplan transport log
var colors = require('colors');
colors.setTheme(messageTypes);
