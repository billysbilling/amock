var container = require('../src/js/container'),
    Mock = require('../src/js/mock'),
    assert = require('../src/js/assert');

var mock = null;

QUnit.module('mock', {
    setup: function() {
        mock = new Mock('GET', '/john');
    },
    
    teardown: function() {
        container.clear();
        assert.ok = ok;
    }
});

test('constructor', function() {
    equal(mock.method, 'GET');
    equal(mock.url, '/john');
    equal(mock.count, 0);
    equal(mock.expectedCount, 1);
    equal(mock.isInfinite, false);
    equal(mock.isPersistent, false);
});

test('json', function() {
    var fn = function() {};
    strictEqual(mock.json(fn), mock);
    equal(mock.jsonCallback, fn);
});

test('reply', function() {
    strictEqual(mock.reply(200, 'Hi there', {'content-type': 'text/plain'}), mock);
    equal(mock.status, 200);
    equal(mock.responseBody, 'Hi there');
    deepEqual(mock.responseHeaders, {'content-type': 'text/plain'});
});

test('reply with json body', function() {
    strictEqual(mock.reply(400, {"error":"Whatever"}), mock);
    equal(mock.status, 400);
    equal(mock.responseBody, '{"error":"Whatever"}');
    deepEqual(mock.responseHeaders, {'content-type': 'application/json'});
});

test('expect', function() {
    strictEqual(mock.expect(5), mock);
    equal(mock.expectedCount, 5);
});

test('infinite', function() {
    strictEqual(mock.infinite(), mock);
    ok(mock.isInfinite);
});

test('persistent', function() {
    strictEqual(mock.persistent(), mock);
    ok(mock.isPersistent);
});

test('done is silent when count matches expectedCount', function() {
    assert.ok = function(passed, message) {
        ok(passed, 'assertion should pass');
        equal(message, 'Expects 4 requests to `GET \/john`. 4 was made.');
    };
    mock.expect(4);
    mock.count = 4;
    mock.done();
});

test('done throws when count is different than expectedCount', function() {
    assert.ok = function(passed, message) {
        ok(!passed, 'assertion should fail');
        equal(message, 'Expects 1 requests to `GET \/john`. 0 was made.');
    };
    mock.done();
});

test('remove removes it from the container', function() {
    container.add(mock);
    mock.remove();
    equal(container.find(function() {return true;}), null);
});