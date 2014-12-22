module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.task.current.target %>, <%= grunt.template.today("dd-mm-yyyy") %> */\n',

        clean: ['dist'],
        concat: {
            options: {
                separator: ';',
                banner: '<%= banner %>',
                stripBanners: true
            },
            standard: {
                src: ['src/module.js', 'lib/tiny-pubsub.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
            drupal7: {
                src: ['src/module.js', 'src/drupal7-ext.js', 'lib/tiny-pubsub.js'],
                dest: 'dist/<%= pkg.name %>-drupal7.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            standard: {
                files: {
                    'dist/jsmodule.min.js': ['dist/jsmodule.js']
                }
            },
            drupal7: {
                files: {
                    'dist/jsmodule-drupal7.min.js': ['dist/jsmodule-drupal7.js']
                }
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'concat', 'uglify']);
};
