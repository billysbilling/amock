var container = require('./container');

var FakeXMLHttpRequest = function() {
    this.requestHeaders = {};
};

module.exports = FakeXMLHttpRequest;

FakeXMLHttpRequest.prototype = {
    open: function(method, url) {
        this.method = method;
        this.url = url;
        this.readyState = 1;
    },

    setRequestHeader: function(header, value) {
        this.requestHeaders[header] = value;
    },

    abort: function() {
        this.readyState = 0;
    },

    readyState: 0,

    onreadystatechange: function(isTimeout) {
    },

    onload: function() {
    },

    status: null,

    send: function(data) {
        var self = this,
            mock = null,
            errorMessage,
            jsonPayload;
        this.readyState = 2;
        mock = container.findBy(this.method, this.url);
        if (!mock) {
            setTimeout(function() {
                errorMessage = self.method + ' ' + self.url + ' was not found in mock requests.';
                throw new Error(errorMessage);
            }, 0);
            return;
        }
        mock.count++;
        if (!mock.isInfinite && mock.count >= mock.expectedCount) {
            mock.remove();
        }
        if (mock.jsonCallback) {
            jsonPayload = JSON.parse(data);
            mock.jsonCallback(jsonPayload);
        }
        if (mock.dataCallback) {
            mock.dataCallback(data);
        }
        setTimeout(function() {
            var responseText,
                mockResponseBody = mock.responseBody;
            if (typeof mockResponseBody === 'function') {
                responseText = mockResponseBody(self, data);
            } else {
                responseText = mockResponseBody;
            }
            if (typeof responseText === 'object') {
                responseText = JSON.stringify(responseText);
            }

            self.status = mock.status;
            self.responseText = responseText;
            self.readyState = 4;
            self.responseHeaders = mock.responseHeaders;
            if (self.onload) {
                self.onload();
            }
            self.onreadystatechange();
        }, 0);
    },

    getResponseHeader: function(name) {
        return this.responseHeaders[name];
    },

    getAllResponseHeaders: function() {
        var responseHeaders = [];
        for (var i in this.responseHeaders) {
            if (this.responseHeaders.hasOwnProperty(i)) {
                responseHeaders.push(i + ': ' + this.responseHeaders[i]);
            }
        }
        return responseHeaders.join('\r\n');
    },

    responseText: null
};