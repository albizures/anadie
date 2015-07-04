/**
 * Created by josec on 6/26/2015.
 */
module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //wiredep: {
        //    target: {
        //        src: 'client/index.html' // point to your HTML file.
        //    }
        //},
        watch : {
            inject_local_dependencies : {
                files: [
                    'client/app/app.js',
                    'client/{app,components}/**/*.{js,css}'
                ],
                tasks : ['injector:local_dependencies']
            },
            inject_stylus: {
                files: [
                    'client/{app,components}/**/*.styl'],
                tasks: ['injector:stylus']
            },
            stylus: {
                files: [
                    'client/{app,components}/**/*.styl'],
                tasks: ['stylus'/*, 'autoprefixer'*/]
            },
            livereload: {
                files: [
                    'client/{app,components}/**/*.{css,html,js}',
                    'client/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                options: {
                    livereload: true
                }
            }
        },
        injector: {
            options: {},
            bower_dependencies: {
                options : {
                    starttag : '<!-- bower:{{ext}} -->',
                    endtag : '<!-- endbower -->'
                },
                files: {
                    'client/index.html': ['bower.json']
                }

            },
            local_dependencies : {
                files: {
                    'client/index.html': [
                        'client/app/app.js',
                        'client/{app,components}/**/*.{css,js}'
                    ]
                }
            },
            stylus :{
                options : {
                    transform: function(filePath) {
                        filePath = filePath.replace('/client/app/', '');
                        filePath = filePath.replace('/client/components/', '../components/');
                        return '@import \'' + filePath + '\';';
                    },
                    starttag : '// injector',
                    endtag : '// endinjector'
                },
                files: {
                    'client/app/app.styl' : [
                        'client/components/**/*.styl',
                        'client/app/**/*.styl',
                        '!client/app/app.styl'
                    ]
                }
            }
        },
        stylus: {
            server: {
                options: {
                    paths: [
                        'client/bower_components',
                        'client/app',
                        'client/components'
                    ],
                    "include css": true
                },
                files: {
                    'client/app/app.css' : 'client/app/app.styl'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.registerTask('build',[
        'injector:bower_dependencies',
        'injector:local_dependencies',
        'injector:stylus',
        'watch'
    ]);
};
