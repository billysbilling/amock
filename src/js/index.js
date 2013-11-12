var $ = require('jquery'),
    container = require('./container'),
    Mock = require('./mock'),
    FakeXMLHttpRequest = require('./fake-xml-http-request');

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
};

module.exports.reset = container.reset;