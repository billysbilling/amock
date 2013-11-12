module.exports = function(grunt) {
    grunt.initConfig({
        'billy-builder': {
            title: 'amock',
            
            jshint: true
        }
    });

    grunt.loadNpmTasks('billy-builder');
};