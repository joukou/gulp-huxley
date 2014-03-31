var gulp = require( 'gulp' ),
    huxley = require( './index' );

gulp.task( 'test', function() {
  huxley({
    root: './'
  });
});

gulp.task( 'default', [ 'test' ] );
