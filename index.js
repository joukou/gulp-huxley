var httpServer = require( 'http-server' ),
    remote = require( 'selenium-webdriver/remote' ),
    jar = require( 'selenium-server-standalone-jar' ),
    huxley = require( 'huxley' );

module.exports = function( options, cb ) {
  options = options || {};
  cb = cb || function() {};

  var server,
      root = options.root || '../..',
      port = options.port || 8000,
      huxleyGlob = options.huxleyGlob || '';

  server = httpServer.createServer({
    root: root
  });

  server.listen(port, function() {
    try {
      selenium = new remote.SeleniumServer( jar.path, {
        port: 4444
      } );
      selenium.start();
      // Use defaults, code doesn't allow varargs unfortunately
      huxley.playbackTasksAndCompareScreenshots( '', '', huxleyGlob, function( err ) {
        selenium.stop();
        server.close();
        cb( err );
      });
    } catch (e) {
      cb( e );
    }
  });
};
