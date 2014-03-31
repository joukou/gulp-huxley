var gulp = require( 'gulp' ),
    huxley = require( './index' );

gulp.task( 'test', function() {
  huxley({
    root: './',
    paths: 'test' // paths to `Huxleyfile.json`s
  });
});

gulp.task( 'default', [ 'test' ] );
