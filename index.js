var httpServer = require( 'http-server' ),
    remote = require( 'selenium-webdriver/remote' ),
    jar = require( 'selenium-server-standalone-jar' ),
    huxley = require( 'huxley' ),
    through = require( 'through2' );

module.exports = function( options ) {
  options = options || {};

  var server,
      root = options.root || '../..',
      port = options.port || 8000;

  server = httpServer.createServer({
    root: root
  });

  return through.obj( function( file, enc, callback ) {
    server.listen( port, '', function() {
      try {
        var selenium = new remote.SeleniumServer( jar.path, {
          port: 4444
        } );
        selenium.start();
        // Use defaults, code doesn't allow varargs unfortunately
        huxley.playbackTasksAndCompareScreenshots( '', '', [ file.path ], function( err ) {
          selenium.stop();
          server.close();
          callback( err );
        });
      } catch (e) {
        selenium.stop();
        server.close();
        callback( e );
      }
    });
  } );
};
