var amock = require('../src/js/index'),
    container = require('../src/js/container'),
    FakeXMLHttpRequest = require('../src/js/fake-xml-http-request');

var a = {a: true},
    r;

QUnit.module('fake-xml-http-request', {
    setup: function() {
        r = new FakeXMLHttpRequest();
    },

    teardown: function() {
        container.clear();
    }
});

test('defaults', function() {
    deepEqual(r.requestHeaders, {});
    equal(r.readyState, 0);
});

test('open', function() {
    r.open('GET', '/john');
    equal(r.method, 'GET');
    equal(r.url, '/john');
    equal(r.readyState, 1);
});

test('setRequestHeader', function() {
    r.setRequestHeader('Accept', 'application/john');
    r.setRequestHeader('If-Modified-Since', 'the future');
    deepEqual(r.requestHeaders, {'Accept': 'application/john', 'If-Modified-Since': 'the future'});
});

test('abort', function() {
    r.open('GET', '/john');
    r.abort();
    equal(r.readyState, 0);
});

test('send when url is not found throws', function() {
    amock('GET', '/john');
    r.open('GET', '/jane');
    throws(function() {
        r.send();
    }, /GET \/jane was not found in mock requests/);
});

test('send when url is not found throws', function() {
    amock('GET', '/john');
    r.open('POST', '/john');
    throws(function() {
        r.send();
    }, /POST \/john was not found in mock requests/);
});

test('send works when url is string', function() {
    expect(0);
    var mock = amock('GET', '/john');
    r.open('GET', '/john');
    r.send();
    mock.done();
});

test('send works when url is regex', function() {
    expect(0);
    var mock = amock('GET', /^\/johns\/\d+$/);
    r.open('GET', '/johns/123');
    r.send();
    mock.done();
});

test('send increases count', function() {
    var mock = amock('GET', '/john');
    r.open('GET', '/john');
    r.send();
    equal(mock.count, 1);
});

test('send removes mock', function() {
    amock('GET', '/john');
    r.open('GET', '/john');
    r.send();
    equal(container.find(function() {return true;}), null);
});

test('send only removes mock when expectedCount has been reached', function() {
    var mock = amock('GET', '/john')
        .expect(2);

    r.open('GET', '/john');
    r.send();
    equal(container.find(function() {return true;}), mock);

    var r2 = new FakeXMLHttpRequest();
    r2.open('GET', '/john');
    r2.send();
    equal(container.find(function() {return true;}), null);
});

test('send does not remove infinite mocks', function() {
    var mock = amock('GET', '/john')
        .infinite();

    r.open('GET', '/john');
    r.send();
    equal(container.find(function() {return true;}), mock);

    var r2 = new FakeXMLHttpRequest();
    r2.open('GET', '/john');
    r2.send();
    equal(container.find(function() {return true;}), mock);
});

test('send calls jsonCallback', function() {
    expect(1);

    amock('POST', '/john')
        .json(function(json) {
            equal(json.name, 'John');
        });

    r.open('POST', '/john');
    r.send('{"name":"John"}');
});

test('send responds async', function() {
    stop();

    amock('GET', '/john')
        .reply(200, {name: 'John'}, {'X-Rate-Limit': '2000'});

    var onloadCalled = false,
        onreadystatechangeCalled = false;

    r.onload = function() {
        onloadCalled = true;
    };

    r.onreadystatechange = function() {
        onreadystatechangeCalled = true;
    };

    r.open('GET', '/john');
    r.send();

    ok(!onloadCalled);
    ok(!onreadystatechangeCalled);

    setTimeout(function() {
        equal(r.status, 200);
        equal(r.responseText, '{"name":"John"}');
        equal(r.readyState, 4);
        deepEqual(r.responseHeaders, {'X-Rate-Limit': '2000', 'content-type': 'application/json'});

        ok(onloadCalled);
        ok(onreadystatechangeCalled);

        start();
    }, 1);
});

test('getResponseHeader(s)', function() {
    stop();

    amock('GET', '/john')
        .reply(200, {name: 'John'}, {'X-Rate-Limit': '2000'});

    r.open('GET', '/john');
    r.send();

    setTimeout(function() {
        equal(r.getResponseHeader('X-Rate-Limit'), '2000');
        equal(r.getAllResponseHeaders(), 'X-Rate-Limit: 2000\r\ncontent-type: application/json');

        start();
    }, 1);
});