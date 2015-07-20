var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jasmine = require('gulp-jasmine'),
    path = require('path'),
    GJC = require('gulp-jsx-coverage');

var GJCoptions = {
    istanbul: {
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules|test[0-9]/
    },
    transpile: {
        babel: {
            include: /\.jsx?$/,
            exclude: /node_modules/
        }
    },
    coverage: {
        reporters: ['text', 'json', 'lcov'],
        directory: 'coverage'
    },
    babel: {
        sourceMap: 'inline'
    },
    coffee: {
        sourceMap: true
    }
};

gulp.task('js', function(){
        browserify('./Test.jsx')
            .transform(reactify)
            .bundle()
            .pipe(source(''))
            .pipe(gulp.dest('./build/js/'));
});

gulp.task('start', function () {
    nodemon({
        ext: 'jsx',
        script: 'server.js'
    }).on('restart', function () {
              console.log('restarted!')
    });
});

gulp.task('test', function () {
    GJC.initIstanbulHook(GJCoptions);

    return gulp.src(['test/test.jsx'])
    .pipe(jasmine())
    .on('end', GJC.colloectIstanbulCoverage(GJCoptions));
});
