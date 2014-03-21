var $ = require('jquery'),
    container = require('./container'),
    Mock = require('./mock'),
    FakeXMLHttpRequest = require('./fake-xml-http-request'),
    assert = require('./assert');

var originalXhr = null;

module.exports = function(method, url) {
    var mock = new Mock(method, url);
    container.add(mock);
    return mock;
};

module.exports.install = function() {
    if (!originalXhr) {
        originalXhr = $.ajaxSettings.xhr;
        $.ajaxSettings.xhr = function() {
            return new FakeXMLHttpRequest();
        };
    }
};

module.exports.uninstall = function() {
    if (originalXhr) {
        $.ajaxSettings.xhr = originalXhr;
        originalXhr = null;
    }
    container.clear();
};

module.exports.has = container.has;

module.exports.reset = container.reset;

module.exports.assert = assert;