var huxley = require( 'huxley' ),
through = require( 'through2' ),
path = require( 'path' ),
gutil = require( 'gulp-util' );

module.exports = function( options ) {
  options = options || {};
  options.globs = []

  var action = null;

  if ( typeof options.driver === 'function' ) {
    huxley.injectDriver( options.driver );
  }

  switch( options.action ) {
    case 'record':
      action = huxley.recordTasks;
      break;
    case 'update':
      action = huxley.writeScreenshots;
      break;
    case 'compare':
      action = huxley.compareScreenshots;
      break;
    default: // case 'default'
      action = huxley.defaultWorkflow;
  }

  return through.obj( function( file, enc, callback ) {
    options.globs.push( path.dirname( file.path ) );
    this.push( file );
    callback();
  }, function(callback) {
    var self = this;

    action(options).then(function(){
        callback();
    }).catch(function(err){
      if (err) {
        if (err.message == 'ECONNREFUSED connect ECONNREFUSED') {
            gutil.log(gutil.colors.yellow('Cannot connect. Make sure your Webdriver (Selenium/Chromedriver) is running'));
        }
        self.emit( 'error', new gutil.PluginError( 'gulp-huxley', err));
        callback(err);
      }
    });
  });
};
