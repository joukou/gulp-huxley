var gulp = require( 'gulp' ),
    huxley = require( './index' );

/**
* To run the tests:
* * `npm install`
* * `npm install -g selenium-server http-server`
* * `selenium -r`
* * `http-server -p 8000` in the root of the project
* * `gulp`
*
* This will be improved when gulp-selenium and gulp-httpserver are aavailable.
*/

gulp.task( 'record', function() {
  gulp.src( './test/**/Huxleyfile.json' )
    .pipe( huxley({
      action: 'record'
    }))
    .pipe( huxley({
      action: 'update'
    }));;
});

gulp.task( 'test', function() {
  gulp.src( './test/**/Huxleyfile.json' )
    .pipe( huxley({
      action: 'compare'
    }));
});

gulp.task( 'default', [ 'test' ] );
