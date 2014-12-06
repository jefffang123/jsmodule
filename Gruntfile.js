module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',

        concat: {
            options: {
                separator: ';',
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['src/**/*.js', 'lib/tiny-pubsub.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
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
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
};
