module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      build: {
        files: {
          'assets/dist/js/lib.min.js': ['bower_components/angular/angular.min.js', 'bower_components/d3/d3.min.js', 'bower_components/oi.select/dist/select.js', 'bower_components/angular-smart-table/dist/smart-table.min.js'],
          'assets/dist/js/client.min.js': ['assets/client/**/*.js'],
          'assets/dist/js/app.min.js': ['app/**/*.js']
        }
      }
    },
    uglify: {
      build: {
        files: {
          'assets/dist/js/lib.min.js': ['bower_components/angular/angular.min.js','bower_components/d3/d3.min.js', 'bower_components/oi.select/dist/select.js', 'bower_components/angular-smart-table/dist/smart-table.min.js'],
          'assets/dist/js/client.min.js': ['assets/client/**/*.js'],
          'assets/dist/js/app.min.js': ['app/**/*.js']
        }
      }
    },

    cssmin: {
      target: {
        files: {
          'assets/dist/css/lib.min.css': ['bower_components/oi.select/dist/select.min.css'],
          'assets/dist/css/client.min.css' : ['assets/client/**/*.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'assets/client/**/*.js',
          'app/**/**.js',
        ],
        tasks: [
          'concat'
        ]
      },
      css: {
        files: 'assets/client/**/*.css',
        tasks: ['cssmin']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////
  grunt.registerTask('build', [
    'uglify','cssmin'
  ]);

};
