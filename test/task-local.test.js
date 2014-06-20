"use strict";

var flit = require('flit');
var t = require('chai').assert;
var plugin = require('../');

describe('flit/task-local', function () {

    describe('taskLocal()', function () {
        it('should start local flight task', function(done) {
            var a, fn;

            a = 0;
            fn = function() {
                ++a;
            };

            flit.taskLocal('test', function (c) {
                t.ok(c);
                c.echo('hello');
                fn();
            });

            flit.loadPlugins(plugin);
            // Act
            flit.start('test', function (err) {
                if (err) throw err;
                t.notOk(err);
                t.equal(a, 1);
                flit.reset();
                done();
            });

        });

        it('should interrupt when flight task abort', function(done) {
            var emsg = 'test error';

            flit.taskLocal('test', function (local) {
                local.abort(emsg);
            });

            flit.taskLocal('test2', function () {
                t.fail();
            });

            flit.loadPlugins(plugin);

            // Act
            flit.start(['test', 'test2'], function (err) {
                t.instanceOf(err, Error);
                t.equal(err.message, emsg);
                flit.reset();
                done();
            });

        });
    });

    describe('task(c.local)', function () {
        it('should start local flight task with ctx support', function(done) {
            var a, fn;

            a = 0;
            fn = function() {
                ++a;
            };

            flit.task('test', function (c) {
                t.ok(c);
                c.local(function (local) {
                    t.ok(local);
                    local.echo('hello');
                    fn();
                });
            });

            flit.loadPlugins(plugin);

            // Act
            flit.start('test', function (err) {
                if (err) throw err;
                t.notOk(err);
                t.equal(a, 1);
                flit.reset();
                done();
            });

        });
    });

});