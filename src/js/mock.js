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

    dataCallback: null,

    jsonCallback: null,

    status: null,
    
    responseBody: null,
    
    responseHeaders: null,

    data: function(callback) {
        this.dataCallback = callback;
        return this;
    },

    json: function(callback) {
        this.jsonCallback = callback;
        return this;
    },

    /**
     * Tells the mock what to reply requests with.
     * 
     * @param {Number} status The HTTP status code to reply with
     * @param {String|Object|Function} [body] The body to reply with. Can either be a string, an object (which will be
     *   JSON.stringify'ed), or a callback function. The callback function receives two parameters: The
     *   `FakeXMLHttpRequest` instance, and the request body as a string.
     * @param {Object} [headers] A dictionary of headers to reply with
     * @returns {Mock}
     */
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