"use strict";

var flit = require('flit');
var t = require('chai').assert;

describe('flit/task-remote', function () {

    describe('task(c.remote)', function () {
        it('should emit error when no destination in briefing', function(done) {
            // Act
            flit.start('test', 'test', function (err) {
                t.ok(err);
                flit.reset();
                done();
            });

        });
    });

});