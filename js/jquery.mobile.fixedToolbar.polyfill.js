//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Polyfilled behavior for "fixed" headers and footers in browsers that don't support position:fixed
//>>label: Fixedtoolbarpolyfill

define( [ "jquery", "./jquery.mobile.fixedToolbar" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {
	
	// Add option tot he fixedtoolbar plugin for polyfilling fixed support in blacklist browsers
	// Default to true when this file is included	
	$.mobile.fixedtoolbar.prototype.options.polyfillSupport = true;
	
	var blacklistedBrowser = $.mobile.fixedtoolbar.prototype.options.supportBlacklist();
	
	// On mobileinit, check if the polyfill option is still enabled, and if the browser is blacklisted. 
	// If so, override the blacklist function to return false
	$( document ).bind( "mobileinit", function() {		
		if( $.mobile.fixedtoolbar.prototype.options.polyfillSupport && blacklistedBrowser ){
			// Make the blacklist test return false, letting any normally-blacklisted browsers in to be polyfilled
			$.mobile.fixedtoolbar.prototype.options.supportBlacklist = function(){
				return false;
			};
		}
	});
	
	// If the browser is blacklisted, apply polyfill
	if( blacklistedBrowser ){
	
		// Add this behavior on top of the fixedtoolbar plugin, at creation time
		$( document ).delegate( $.mobile.fixedtoolbar.prototype.options.initSelector, "fixedtoolbarcreate", function() {

			var toolbar = $( this ),
				tbType = toolbar.hasClass( "ui-header-fixed") ? "header" : "footer",
				page = toolbar.closest( ":jqmData(role='page')" );
		
			// If the polyfill option is disabled, or the browser is not blacklisted, return here
			if ( !toolbar.data( "fixedtoolbar" ).options.polyfillSupport ) {
				return;
			}
		
			// Add faux support class to toolbar
			toolbar.addClass( "ui-fixed-faux" );
		
			// set up a function that resets the top or bottom value, depending on toolbar type
			var resetPos = (function(){
				if( tbType === "header" ){
					return function(){
						toolbar.css( "top", $( window ).scrollTop() + "px" );
					};	
				}
				else {
					return function(){
						toolbar.css( "bottom", $.mobile.activePage.height() - $( window).scrollTop() - $.mobile.getScreenHeight() + "px" );
					}
				}
			})();
		
			// Per page show, re-set up the event handling
			page.bind( "pagebeforeshow", function( e ){
				var visible;
						
				// Normalize proper object for scroll event
				( ( $( document ).scrollTop() === 0 ) ? $( window ) : $( document ) )
					.bind( "scrollstart.fixedtoolbarpolyfill", function(){
						visible = toolbar.not( ".ui-fixed-hidden" ).fixedtoolbar( "hide", true );
					})
					.bind( "scrollstop.fixedtoolbarpolyfill", function(){
						resetPos();
						visible.fixedtoolbar( "show" );
					});
						
				// on resize, reset positioning
				$( window ).bind( "throttledresize.fixedtoolbarpolyfill", resetPos );

				// on pagehide, unbind the event handlers
				page.one( "pagehide", function(){
					$( this ).add( this ).add( document ).unbind( ".fixedtoolbarpolyfill" );
				});
						
				// align for pageshow
				resetPos();
			});
		});
	}

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
