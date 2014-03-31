var gulp = require( 'gulp' ),
    huxley = require( './index' );

gulp.task( 'test', function() {
  huxley();
});

gulp.task( 'default', [ 'test' ] );
