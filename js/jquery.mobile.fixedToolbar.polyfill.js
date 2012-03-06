//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Polyfilled behavior for "fixed" headers and footers in browsers that don't support position:fixed
//>>label: Fixedtoolbarpolyfill

define( [ "jquery", "./jquery.mobile.fixedToolbar" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {
				
		var supportBlacklist = $.mobile.fixedtoolbar.prototype.options.supportBlacklist;
					
		// If the browser is blacklisted for position:fixed support, polyfill it
		if( supportBlacklist() ){
				
			// Add class for CSS hookage 
			$( document.documentElement ).addClass( "ui-faux-fixed" );
				
			// Make the blacklist test return false, letting any normally-blacklisted browsers in to be polyfilled
	  		$.mobile.fixedtoolbar.prototype.options.supportBlacklist = function(){ return false; };
					
			// Per page show, re-set up the event handling
			$( document ).bind( "pagebeforeshow", function( e ){
						
				var page = $( e.target ),
					fixies = page.find( ".ui-header-fixed, .ui-footer-fixed" ),
					visibleAtStart,
					resetPos = function(){
						fixies.each(function(){
							if( $(this).hasClass( "ui-header-fixed") ){
								$( this ).css( "top", $( window ).scrollTop() + "px" );
							}
							else {
								$( this ).css( "bottom", $.mobile.activePage.height() - $( window).scrollTop() - $.mobile.getScreenHeight() + "px" );
							}
						});
					};
						
				// Normalize proper object for scroll event
				( ( $( document ).scrollTop() === 0 ) ? $( window ) : $( document ) )
					.bind( "scrollstart.fixed", function(){
						visibleAtStart = fixies.not( ".ui-fixed-hidden" ).fixedtoolbar( "hide", true );
					})
					.bind( "scrollstop.fixed", function(){
						resetPos();
						visibleAtStart.fixedtoolbar( "show" );
					});
						
				// on resize, reset positioning
				$( window ).bind( "throttledresize.fixed", resetPos );

				// on pagehide, unbind the event handlers
				page.one( "pagehide", function(){
					$( window ).add( this ).add( document ).unbind( ".fixed" );
				});
						
				// align for pageshow
				resetPos();
			});
		}

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
