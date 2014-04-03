var httpServer = require( 'http-server' ),
    remote = require( 'selenium-webdriver/remote' ),
    jar = require( 'selenium-server-standalone-jar' ),
    huxley = require( 'huxley' ),
    through = require( 'through2' ),
    path = require( 'path' ),
    gutil = require( 'gulp-util' );

module.exports = function( options ) {
  options = options || {};

  var server,
      root = options.root || '../..',
      port = options.port || 8000,
      browser = options.browser,
      serverUrl = options.server,
      driver = options.driver,
      action = null,
      paths = [],
      selenium = null;

  if (typeof driver === 'function') {
    huxley.injectDriver(options.driver);
  }

  switch( options.action ) {
    case 'record':
      action = huxley.recordTasks;
      break;
    case 'update':
      action = huxley.playbackTasksAndSaveScreenshots;
      break;
    default:
      action = huxley.playbackTasksAndCompareScreenshots;
  }

  // Create HTTP server
  server = httpServer.createServer({
    root: root
  });

  server.listen( port, '', function() {
      try {
        // Create Selenium server
        selenium = new remote.SeleniumServer( jar.path, {
          port: 4444
        } );
        selenium.start();
      } catch (err) {
        selenium.stop();
        server.close();
        callback(err);
      }
    });

  return through.obj( function( file, enc, callback ) {
    paths.push( path.dirname( file.path ) );
    this.push( file );
    callback();
  }, function(callback) {
    try {
      action( browser, serverUrl, paths, function( err ) {
        if ( err ) {
          gutil.log( err );
        }
        selenium.stop();
        server.close();
      });
    } catch ( err ) {
      this.emit('error', new gutil.PluginError('gulp-huxley', {
        message: err
      }));
      selenium.stop();
      server.close();
    }
    callback();
  } );
};
