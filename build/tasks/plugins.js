var requirejs = require( 'requirejs' ),
	path = require( 'path' ),
	fs = require( 'fs' ),
	glob = require( 'glob-whatev' );

module.exports = function( grunt ) {
  grunt.registerTask( "plugins", function() {
		var globalConfig = pluginConfig = grunt.config.get( 'global' ),
			pluginConfig = globalConfig.plugins,
			done = this.async(), filenameToPlugin;

		filenameToPlugin = function( filename ) {
			var pathless = filename.replace( /js\//, "" ),
				newFilename, template;

			// if the file is one of the old convention top level
			// just strip the js dir, otherwise use the directory
			// names for namespaces
			if( /jquery\.mobile/.test( filename )){
				newFilename = pathless;
			} else {
				newFilename = pathless.split("/").join(".");
			}

			return "mobile." + newFilename
				.replace( "jquery.mobile.", "" )
				.replace( ".js", ".jquery.json" );
		};

		requirejs.tools.useLib( function ( require ) {
			require( [ 'parse' ], function ( parse ) {
				// grab all the files that still use the original convention
				var files = [], distFiles;

				pluginConfig.globs.forEach(function( globstr ) {
					// glob glob glob ... namespace fail
					files = files.concat( glob.glob( globstr ) );
				});

				files.forEach( function( filename, i ) {
					if( pluginConfig.exclude.test(filename) ) {
						return;
					}

					var data = fs.readFileSync( filename, 'utf8' ),
						tree = parse.findDependencies( filename, data ),
						manifest, template;

					template = grunt.file.read( pluginConfig.template );

					manifest = filenameToPlugin( filename );

					grunt.file.write( manifest, grunt.template.process( template, {
						name: filename.replace(".json", ""),
						title: "TODO",
						desc: "TODO",
						version: globalConfig.ver.official
					}));
				});
			});
		});
  });
};