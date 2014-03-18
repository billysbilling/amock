var matchUrl = require('./match-url');

var mocks = [];

var container = module.exports = {};

container.add = function(mock) {
    mocks.unshift(mock);
};

container.remove = function(mock) {
    for (var i = 0; i < mocks.length; i++) {
        if (mocks[i] === mock) {
            mocks.splice(i, 1);
            break;
        }
    }
};

container.reset = function() {
    for (var i = 0; i < mocks.length; i++) {
        if (mocks[i].isPersistent) {
            //If persistent, then reset its count
            mocks[i].count = 0;
        } else {
            //Otherwise, remove it
            mocks.splice(i, 1);
            i--;
        }
    }
};

container.clear = function() {
    mocks = [];
};

container.find = function(callback) {
    var mock;
    for (var i = 0; i < mocks.length; i++) {
        mock = mocks[i];
        if (callback(mock) === true) {
            return mock;
        }
    }
    return null;
};

container.findBy = function(method, url) {
    return container.find(function(m) {
        if (method === m.method && matchUrl(m.url, url)) {
            return true;
        }
    });
};

container.has = function(method, url) {
    return container.findBy(method, url) !== null;
};