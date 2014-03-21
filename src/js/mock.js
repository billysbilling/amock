var container = require('./container'),
    assert = require('./assert');

var Mock = function(method, url) {
    this.method = method;
    this.url = url;
};

module.exports = Mock;

Mock.prototype = {
    expectedCount: 1,

    count: 0,

    isInfinite: false,

    isPersistent: false,

    jsonCallback: null,

    status: null,
    
    responseBody: null,
    
    responseHeaders: null,

    json: function(callback) {
        this.jsonCallback = callback;
        return this;
    },

    reply: function(status, body, headers) {
        headers = headers || {};
        if (typeof body === 'object') {
            body = JSON.stringify(body);
            if (!headers['content-type']) {
                headers['content-type'] = 'application/json';
            }
        }
        this.status = status;
        this.responseBody = body || null;
        this.responseHeaders = headers;
        return this;
    },

    expect: function(expectedCount) {
        this.expectedCount = expectedCount;
        return this;
    },

    infinite: function() {
        this.isInfinite = true;
        return this;
    },

    persistent: function() {
        this.isPersistent = true;
        this.infinite();
        return this;
    },

    done: function() {
        assert.ok(this.count === this.expectedCount, 'Expects '+this.expectedCount+' requests to `'+this.method+' '+this.url+'`. '+this.count+' was made.');
    },

    remove: function() {
        container.remove(this);
    }
};