/**
 * Created by clement on 7/8/16.
 */
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.initConfig({
        nggettext_extract: {
            pot: {
                files: {
                    'po/template.pot': ['app/welcome/*.html']
                }
            }
        },
        nggettext_compile: {
            all: {
                files: {
                    'src/js/translations.js': ['po/*.po']
                }
            }
        }
    });
    grunt.registerTask("default", ["nggettext_compile"]);
};
