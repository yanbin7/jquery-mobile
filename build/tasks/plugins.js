var requirejs = require( 'requirejs' ),
	path = require( 'path' ),
	fs = require( 'fs' ),
	glob = require( 'glob-whatev' );

module.exports = function( grunt ) {
  grunt.registerTask( "plugins", function() {
		var globalConfig = pluginConfig = grunt.config.get( 'global' ),
			pluginConfig = globalConfig.plugins,
			done = this.async(),
			filenameToPlugin,
			escapeRegexString,
			extractMetadata;

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

		// Thank you Dojo
		// summary: Regular expressions and Builder resources
		escapeRegexString = function ( /*String*/str, /*String?*/except ) {
			//	summary:
			//		Adds escape sequences for special characters in regular expressions
			// except:
			//		a String with special characters to be left unescaped

			return str.replace( /([\.$?*|{}\(\)\[\]\\\/\+^])/g, function ( ch ) {
				if ( except && except.indexOf( ch ) != -1 ) {
					return ch;
				}
				return "\\" + ch;
			} ); // String
		};

		extractMetadata = function( data ) {
			var lines = data.split( "\n" ),
				matches = lines.filter( function( line, index ) {
					return ( /^.*\/\/>>\s*[^:]+:.*$/ ).test( line );
				}),
				metadata = {};
			if ( matches && matches.length ) {
				matches.forEach( function( meta ) {
					var attr = meta.replace( /^.*\/\/>>\s*([^:]+):.*$/, "$1" ).trim(),
						attrLabelRE = new RegExp( "^.*" + escapeRegexString( "//>>" + attr + ":") + "\\s*", "m" ),
						value = meta.replace( attrLabelRE, "" ).trim(),
						namespace, name,
						indexOfDot = attr.indexOf( "." );
					if ( indexOfDot > 0 ) { // if there is something before the dot
						namespace = attr.split( "." )[0];
						name = attr.substring( indexOfDot+1 );
						metadata[ namespace ] = metadata[ namespace ] || {};
						metadata[ namespace ][ name ] = value;
					} else {
						metadata[ attr ] = value;
					}
				});
			}
			return metadata;
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
						manifest,
						template,
						metadata = extractMetadata( data );

					template = grunt.file.read( pluginConfig.template );

					manifest = filenameToPlugin( filename );

					grunt.file.write( manifest, grunt.template.process( template, {
						name: filename.replace(".json", ""),
						title: metadata.label || "Untitled",
						desc: metadata.description || "",
						version: globalConfig.ver.official
					}));
				});
			});
		});
  });
};