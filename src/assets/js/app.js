import '../../../node_modules/finderjs/example/finderjs.css';
import '../../../node_modules/bootstrap_dropdowns_enhancement/dist/css/dropdowns-enhancement.css';
import '../../../node_modules/bootstrap-colorselector/lib/bootstrap-colorselector-0.2.0/css/bootstrap-colorselector.css';
import '../../../node_modules/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.css';
import '../../../node_modules/jstree/dist/themes/default/style.css';
import '../../../node_modules/highlight.js/styles/darcula.css';
import '../../assets/styles/app.scss';

/**
 * Sticky footer height recalc
 */
function stickyFooter() {
	function getHeight() {
		const footer = $('footer.global');
		if (footer.length) {
			return footer.outerHeight();
		}
		return false;
	}
	
	if (!$('body').hasClass('browser-not-supported')) {
		$('body').css('margin-bottom', getHeight());
	}
}

const Raphael = require('raphael');

$(document).ready(function() {
	/**
	 * Draw Nomura Signature on Toolbar
	 */
	try {
		var p = new Raphael(document.getElementById('nomura-signature'), 54, 45);
		
		var base = p.path('M2866,0v45H54L42,15l-3,7.5L48,45H36l-3-7.5L30,45h-2164V0H2866z'),
			dark = p.path('M30,0l9,22.5l-6,15L24,15L12,45H0L18,0H30z M36,0l6,15l6-15H36z'),
			darkest = p.path('M24,15L18,0h12L24,15z');
		
		base.node.id = 'base';
		base.attr({ fill: '#C92417', stroke: null, opacity: 0.9 });
		
		dark.node.id = 'dark';
		dark.attr({ fill: '#9B0501', stroke: null, opacity: 0.9 });
		
		darkest.node.id = 'darkest';
		darkest.attr({ fill: '#7B0100', stroke: null, opacity: 0.9 });
	} catch (err) {
	}
	
	/**
	 * Sticky footer
	 */
	stickyFooter();
	
	/**
	 * Password Masking
	 */
	try {
		$('.password').focus(function() {
			this.type = 'text';
		}).blur(function() {
				this.type = 'password';
			}
		)
	} catch (err) {
		console.log('[] problem. Error: ' + err);
	}
	
	/**
	 * Clear button
	 */
	try {
		$('input.clearable')
			.wrap('<div class="input-clear"></div>')
			.after(
				'<button type="button" class="btn btn-link clear" data-toggle="button" aria-pressed="false" tabindex="0">Clear</button>')
			.keyup(function() {
				$(this).siblings('button').toggle(Boolean($(this).val()));
			})
			.css('padding-right', function() {
				var $btnClear = $(this).siblings('button');
				$btnClear.css({position: 'absolute', visibility: 'hidden', display: 'block'});
				
				var $btnClearWidth = $btnClear.outerWidth(true);
				$btnClear.css({position: '', visibility: '', display: ''});
				return $btnClearWidth + 'px';
			})
		;
		$('.clear')
			.hide($(this).siblings('input').val())
			.click(function() {
				// FIXME: SlickGrid/Input is not focused on when "Clean" button is clicked.
				$(this).siblings('input').val('');
				$(this).hide();
				$(this).siblings('input').focus();
			})
		;
	} catch (err) {
		console.log('[] problem. Error: ' + err);
	}

	/**
	 * User Menu: 'Log Off' and 'Cancel' buttons
	 */
	try {
		$('header.global .user-menu footer').children('button.cancel').dropdown('toggle');
		$('header.global .user-menu footer').children('button.logoff').click(function() {
			$('#modal-logoff').modal('toggle');
		});
		$('#modal-logoff .modal-footer button.add').click(function() {
			window.location = '/grp/en-US/sign-in/';
		});
	} catch (err) {
		console.log('Footer button(s) not working. Error: ' + err);
	}
	
	/**
	 * Search Inputs: background 'Search' icon
	 */
	try {
		$('input.bg-icon')
			.after('<span class="fa fa-search"></span>')
			.css('padding-left', 19)
		;
	} catch (err) {
		console.log('[] problem. Error: ' + err);
	}
	
	/**
	 * Bootstrap JS components
	 */
	/*$(function() {
		$('[data-toggle="popover"]').popover({
			html: true
		})
	});*/

	/*$(function() {
		$('[data-toggle="tooltip"]').tooltip();
	});*/
});

$(window).resize(function() {
	stickyFooter();
});