var matchUrl = require('../src/js/match-url');

var getInvoiceRegex = /^\/v2\/invoices\/[^\/]+$/;

QUnit.module('match-url');

test('string match', function() {
    ok(matchUrl('/v2/invoices', '/v2/invoices'));
    ok(matchUrl('/v2/invoices?q=hey&page=88', '/v2/invoices?q=hey&page=88'));
});

test('string mismatch', function() {
    ok(!matchUrl('/v2/invoices', '/v2/bills'));
    ok(!matchUrl('/v2/invoices?q=hey&page=88', '/v2/invoices?q=hey&page=99'));
});

test('regex match', function() {
    ok(matchUrl(getInvoiceRegex, '/v2/invoices/123'));
    ok(matchUrl(getInvoiceRegex, '/v2/invoices/abc'));
});

test('regex mismatch', function() {
    ok(!matchUrl(getInvoiceRegex, '/v2/invoices'));
    ok(!matchUrl(getInvoiceRegex, '/v2/bills/abc'));
});

test('other mismatch', function() {
    ok(!matchUrl({}, '/anything'));
});