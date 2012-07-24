var requirejs = require( 'requirejs' ),
	path = require( 'path' ),
	fs = require( 'fs' ),
	glob = require( 'glob-whatev' );

module.exports = function( grunt ) {
  grunt.registerTask( "plugins", function() {
		var global_config = grunt.config.get( 'global' ),
			done = this.async(),
		output = global_config.plugins.output;

		requirejs.tools.useLib( function ( require ) {
			require( [ 'parse' ], function ( parse ) {
				// grab all the files that still use the original convention
				var files = [], distFiles;

				global_config.plugins.globs.forEach(function( globstr ) {
					// glob glob glob ... namespace fail
					files = files.concat( glob.glob( globstr ) );
				});

				files.forEach( function( filename, i ) {
					var data = fs.readFileSync( filename, 'utf8' ),
						tree = parse.findDependencies( filename, data ),
						pathless = filename.replace( /js\//, "" ),
						newFilename, manifest, template;

					// TODO splitting this out using the above globs would be faster/better
					if( /jquery\.mobile/.test( filename )){
						newFilename = pathless;
						grunt.file.copy( filename, output + newFilename );
					} else {
						newFilename = "jquery.mobile." + pathless.split("/").join(".");
						grunt.file.copy( filename, output + newFilename );
					}

					manifest = "dist." + newFilename.replace( ".js", ".json" );
					template = grunt.file.read( global_config.plugins.template );
					grunt.file.write( manifest, grunt.template.process( template, {
						name: "foo",
						title: "bar",
						desc: "baz",
						version: global_config.ver.official,
						dependencies: ""
					}));
				});
			});
		});
  });
};