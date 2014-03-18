module.exports = function(mockUrl, requestedUrl) {
    if (typeof mockUrl === 'string') {
        return mockUrl === requestedUrl;
    }
    
    if (mockUrl instanceof RegExp) {
        return mockUrl.test(requestedUrl);
    }
    
    return false;
};