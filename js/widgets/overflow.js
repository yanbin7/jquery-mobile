//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Sliding Panel
//>>label: Sliding Panel
//>>group: Widgets
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css
//>>css.structure: ../css/structure/jquery.mobile.overflow.css

define( [ "jquery",	"../jquery.mobile.core", "../jquery.mobile.widget" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");


(function($) {

	$.widget("mobile.overflow", $.mobile.widget, {

		options: {
			initSelector: ":jqmData(role='overflow')",
			theme: "a",
			position: "left",
			behavior: "push"

		},
		_init: function(){},
		_create: function() {
			this.options.theme = this.element.jqmData('theme') || this.options.theme;
			this.options.behavior = this.element.jqmData( "behavior" ) || this.options.behavior;
			this.options.position = this.element.jqmData('position') || this.options.position;
			this.overflowMenuContent = $( this.element );
			this.overflowMenu = $(document.createElement('div'))
				.addClass("ui-body-"+this.options.theme)
				.addClass("overflowMenu")
				.addClass(this.options.position);
			if (this.options.behavior === "push") {
				this.overflowMenu
					.addClass('push')
					.css('display', "none");
				this.element.closest( '.ui-page' ).first().before(this.overflowMenu);
			} else {
				this.overflowMenu.addClass('over');
				this.overflowMenu.insertBefore(this.overflowMenuContent);
			}
			this.overflowMenuContent.appendTo(this.overflowMenu);

		},
		show: function() {
			if (this.options.behavior === "push") {
				this.overflowMenu.css('display', 'inline');
				$('.ui-page-active, .ui-footer-fixed, .ui-header-fixed')
					.addClass('showTabHelper')
					.addClass('showTabOverflow')
					.addClass(this.options.position);

			} else {
				this.overflowMenu.addClass("showMenu");
			}
		},
		hide: function() {
			var self = this;
			if (this.options.behavior === "push") {
				$('.ui-page-active, .ui-footer-fixed, .ui-header-fixed')
					.removeClass('showTabOverflow')
					.removeClass(this.options.position)
					.one("webkitTransitionEnd",function() {
						$(this).removeClass('showTabHelper');
						self.overflowMenu.css('display', 'none');
					});
			} else {
				this.overflowMenu.removeClass("showMenu");
			}
		}

	});
	$( document ).bind( "pagecreate create", function( e ){
		$.mobile.overflow.prototype.enhanceWithin( e.target );
	});
})(jQuery);

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");

