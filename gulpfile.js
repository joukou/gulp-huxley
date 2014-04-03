var gulp = require( 'gulp' ),
    huxley = require( './index' );

gulp.task( 'test', function() {
  gulp.src('test/**/Huxleyfile.json')
    .pipe( huxley( {
      root: __dirname
    } ) );
});

gulp.task( 'default', [ 'test' ] );
