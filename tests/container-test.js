var container = require('../src/js/container');

var a = {a: true},
    b = {b: true},
    p = {isPersistent: true, count: 0};

var getInvoices = {
    method: 'GET',
    url: '/v2/invoices'
};

var postInvoices = {
    method: 'POST',
    url: '/v2/invoices'
};

var getInvoice = {
    method: 'GET',
    url: /^\/v2\/invoices\/[^\/]+$/
};

QUnit.module('container', {
    teardown: function() {
        container.clear();
    }
});

test('add and find', function() {
    container.add(a);
    equal(container.find(function(m) { return m.a; }), a);
});

test('adds by unshifting', function() {
    container.add(a);
    container.add(b);
    equal(container.find(function(m) { return true; }), b);
});

test('remove', function() {
    container.add(a);
    container.remove(a);
    equal(container.find(function(m) { return m.a; }), null);
});

test('reset removes normal ones', function() {
    container.add(a);
    container.add(b);
    container.reset();
    equal(container.find(function(m) { return true; }), null);
});

test('reset does not remove persistent ones, but resets their count', function() {
    container.add(a);
    container.add(b);
    container.add(p);
    p.count = 3;
    container.reset();
    equal(container.find(function(m) { return true; }), p);
    equal(p.count, 0);
});

test('clear removes all', function() {
    container.add(a);
    container.add(b);
    container.add(p);
    container.clear();
    equal(container.find(function(m) { return true; }), null);
});

test('find', function() {
    container.add(a);
    container.add(b);
    container.add(p);
    equal(container.find(function(m) { return m.a === true; }), a);
    equal(container.find(function(m) { return m.b === true; }), b);
    equal(container.find(function(m) { return m.isPersistent === true; }), p);
});

test('findBy', function() {
    container.add(getInvoices);
    container.add(postInvoices);
    container.add(getInvoice);
    
    equal(container.findBy('GET', '/v2/invoices'), getInvoices);
    equal(container.findBy('POST', '/v2/invoices'), postInvoices);
    equal(container.findBy('GET', '/v2/invoices/123'), getInvoice);
    equal(container.findBy('GET', '/v2/invoices/abc'), getInvoice);

    equal(container.findBy('GET', '/v2/bills/abc'), null);
    equal(container.findBy('GET', '/v2/bills'), null);
    equal(container.findBy('PUT', '/v2/invoices'), null);
});

test('has', function() {
    container.add(getInvoices);
    container.add(postInvoices);
    container.add(getInvoice);
    
    ok(container.has('GET', '/v2/invoices'));
    ok(container.findBy('POST', '/v2/invoices'));
    ok(container.findBy('GET', '/v2/invoices/123'));
    ok(container.findBy('GET', '/v2/invoices/abc'));

    ok(!container.findBy('GET', '/v2/bills/abc'));
    ok(!container.findBy('GET', '/v2/bills'));
    ok(!container.findBy('PUT', '/v2/invoices'));
});