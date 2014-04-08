var gulp = require( 'gulp' ),
    gutil = require('gulp-util'),
    huxley = require( './index' ),
    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer,
    jar = require('selenium-server-standalone-jar'),
    HttpServer = require('http-server');

var selenium = null;

gulp.task( 'http', function() {
  HttpServer.createServer().listen( 8000 );
} );

gulp.task( 'selenium', function() {
  selenium = new SeleniumServer( jar.path, { });
  selenium.start();
} );

gulp.task( 'test', [ 'selenium' ], function() {
  gulp.src( './test/**/Huxleyfile.json' )
    .pipe( huxley( {
      action: 'record',
      browser: 'chrome',
      server: selenium.address()
    } ) );
});

gulp.task( 'default', [ 'http', 'test' ] );
