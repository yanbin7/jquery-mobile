var requirejs = require( 'requirejs' ),
	path = require( 'path' ),
	fs = require( 'fs' ),
	glob = require( 'glob-whatev' );

module.exports = function( grunt ) {
  grunt.registerTask( "plugins", function() {
		var done = this.async();

		requirejs.tools.useLib( function ( r ) {
			r( [ 'parse' ], function ( parse ) {
				var files = glob.glob( "./js/jquery.mobile.*.js" );

				files = files.concat(glob.glob( "./js/*/*.js" ));

				files.forEach( function( filename, i ) {
					var data = fs.readFileSync( filename, 'utf8' );
					var tree = parse.findDependencies( filename, data );

					// copy file to dist/ - flatten dir structure?

					// dependencies may require rejiggering for flat dir structure

					// add metadata
				});
			});
		});
  });
};