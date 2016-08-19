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
        vendorResources: [],
        appResources : [],
        cssResources: [],
        clean: {
            build: {
                dot: true,
                src: [ './client/build/**/*' ]
            }

        },
        copy: {
            build: {
                files: [
                    {
                        cwd: './client/',
                        dest: './client/build/',
                        expand: true,
                        //Copy over the index.html file and all the files in the "views" directory
                        src: [ 'index.html', 'app/**/*.html' ]
                    }
                ]
            }
        },
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
        },
        replace: {
            gather: {
                files: [
                    {
                        cwd: './client/',
                        dest: './client/build/',
                        expand: true,
                        src: [ 'index.html' ]
                    }
                ],
                options: {
                    patterns: [
                        {
                            //Grab the <!--build-js-start--> and <!--build-js-end--> comments and everything in-between
                            match: /\<\!\-\- bower\:js[\s\S]* endbower \-\-\>/,
                            replacement: function ( matchedString ) {
                                //Grab all of the src attributes from the <script> tags
                                var jsArray = matchedString.match( /(src\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/g );
                                jsArray.forEach( function( element ) {
                                    //Get just the value of the src attribute (the file path to the JS file)
                                    var resourceTarget = element.match( /(src\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/ )[ 2 ];
                                    console.log(resourceTarget);
                                    targetConfig = grunt.config( 'vendorResources' );
                                    //Alter the path for use with the concat task
                                    targetConfig.push( '.' + resourceTarget );
                                    //Add the path to the JS file to the jsResources configuration property
                                    grunt.config( 'vendorResources', targetConfig );
                                });

                                //Replace the entire build-js-start to build-js-end block with this <script> tag
                                return '<script type="text/javascript" src="vendor.min.js"></script>';
                            }
                        },
                        {
                            match : /\<script src="\/\/localhost:35729\/livereload.js"><\/script>/,
                            replace : ''
                        },
                        {
                            //Grab the <!--build-js-start--> and <!--build-js-end--> comments and everything in-between
                            match: /\<\!\-\- injector\:js[\s\S]* endinjector \-\-\>/,
                            replacement: function ( matchedString ) {
                                //Grab all of the src attributes from the <script> tags
                                var jsArray = matchedString.match( /(src\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/g );
                                jsArray.forEach( function( element ) {
                                    //Get just the value of the src attribute (the file path to the JS file)
                                    var resourceTarget = element.match( /(src\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/ )[ 2 ];
                                    console.log(resourceTarget);
                                    targetConfig = grunt.config( 'appResources' );
                                    //Alter the path for use with the concat task
                                    targetConfig.push( '.' + resourceTarget );
                                    //Add the path to the JS file to the jsResources configuration property
                                    grunt.config( 'appResources', targetConfig );
                                });

                                //Replace the entire build-js-start to build-js-end block with this <script> tag
                                return '<script type="text/javascript" src="app.min.js"></script>';
                            }
                        }/*,
                        {
                            //Grab the <!--build-css-start--> and <!--build-css-end--> comments and everything in-between
                            match: /\<\!\-\-build\-css\-start[\s\S]*build\-css\-end\-\-\>/,
                            replacement: function ( matchedString ) {
                                //Grab all of the href attributes from the <href> tags
                                var cssArray = matchedString.match( /(href\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/g );
                                cssArray.forEach( function( element ) {
                                    var resourceTarget = element.match( /(href\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/ )[ 2 ];
                                    var targetConfig = grunt.config( 'cssResources' );
                                    //Alter the path for use with the concat task
                                    targetConfig.push( '../app/' + resourceTarget );
                                    //Add the path to the CSS file to the cssResources configuration property
                                    grunt.config( 'cssResources', targetConfig );
                                });

                                //Replace the entire build-css-start to build-css-end block with this <link> tag
                                return '<link rel="stylesheet" media="screen" href="combined.css"/>';
                            }
                        }*/
                    ]
                }
            }
        },
        concat: {
            vendor: {
                //Concatenate all of the files in the jsResources configuration property
                src: [ '<%= vendorResources %>' ],
                dest: './client/build/vendor.js',
                options: {
                    separator: '\n;'
                }
            },
            app: {
                //Concatenate all of the files in the jsResources configuration property
                src: [ '<%= appResources %>' ],
                dest: './client/build/app.js',
                options: {
                    separator: ';\n'
                }
            }/*,

            css: {
                //Concatenate all of the files in the cssResources configuration property
                src: [ '<%= cssResources %>' ],
                dest: '../build/combined.css'
            }*/

        },
        uglify: {
            build: {
                files: {
                    './client/build/app.min.js': ['./client/build/app.js'],
                    './client/build/vendor.min.js': [ './client/build/vendor.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks( 'grunt-replace' );
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('serve',[
        'injector:bower_dependencies',
        'injector:local_dependencies',
        'injector:stylus',
        'watch'
    ]);
    grunt.registerTask( 'build', 'Crea el dist', function() {
        //So the user doesn't have to add '--force' to the command to clean the build directory
        //grunt.option( 'force', true );

        grunt.task.run ( [
            'clean:build',
            'copy:build',
            'replace:gather',
            //'concat:css',
            'concat:vendor',
            'concat:app',
            'uglify:build'
        ]);

    });
};
