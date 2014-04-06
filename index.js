var huxley = require( 'huxley' ),
    through = require( 'through2' ),
    path = require( 'path' ),
    gutil = require( 'gulp-util' );

module.exports = function( options ) {
  options = options || {};

  var browser = options.browser,
      serverUrl = options.server,
      driver = options.driver,
      action = null,
      paths = [];

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

  return through.obj( function( file, enc, callback ) {
    paths.push( path.dirname( file.path ) );
    this.push( file );
    callback();
  }, function( callback ) {
    try {
      action( browser, serverUrl, paths, function( err ) {
        if ( err ) {
          gutil.log( err );
        }
      });
    } catch ( err ) {
      this.emit( 'error', new gutil.PluginError('gulp-huxley', {
        message: err
      }));
    }
    callback();
  } );
};
