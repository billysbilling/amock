var mocks = [];

module.exports.add = function(mock) {
    mocks.unshift(mock);
};

module.exports.remove = function(mock) {
    for (var i = 0; i < mocks.length; i++) {
        if (mocks[i] === mock) {
            mocks.splice(i, 1);
            break;
        }
    }
};

module.exports.reset = function() {
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

module.exports.clear = function() {
    mocks = [];
};

module.exports.find = function(callback) {
    var mock;
    for (var i = 0; i < mocks.length; i++) {
        mock = mocks[i];
        if (callback(mock) === true) {
            return mock;
        }
    }
    return null;
};