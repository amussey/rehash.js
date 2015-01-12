module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    strip_code: {
      options: {
        start_comment: "test-code",
        end_comment: "end-test-code",
      },
      your_target: {
        src: 'rehash.js',
        dest: 'rehash.min.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>, ©<%= grunt.template.today("yyyy") %> <%= pkg.author %> */\n' +
          '/*! https://github.com/amussey/rehash.js */\n'
      },
      build: {
        src: 'rehash.min.js',
        dest: 'rehash.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-strip-code');

  // Default task(s).
  grunt.registerTask('default', [
    'strip_code',
    'uglify'
  ]);

};
