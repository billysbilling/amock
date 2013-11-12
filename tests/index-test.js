var $ = require('jquery'),
    amock = require('../src/js/index'),
    container = require('../src/js/container'),
    FakeXMLHttpRequest = require('../src/js/fake-xml-http-request'),
    Mock = require('../src/js/mock');

var a = {a: true};

QUnit.module('index', {
    teardown: function() {
        container.clear();
        amock.uninstall();
    }
});

test('install', function() {
    amock.install();
    ok($.ajaxSettings.xhr() instanceof FakeXMLHttpRequest);
});

test('uninstall', function() {
    amock.install();
    amock.uninstall();
    ok($.ajaxSettings.xhr() instanceof window.XMLHttpRequest);
});

test('reset resets', function() {
    container.add(a);
    amock.reset();
    equal(container.find(function(m) { return true; }), null);
});

test('mock', function() {
    var mock = amock('GET', '/john');
    ok(mock instanceof Mock);
    equal(mock.method, 'GET');
    equal(mock.url, '/john');
    equal(container.find(function(m) { return true; }), mock);
});