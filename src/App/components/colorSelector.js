/**
 * Created by nifanic on 2019-08-21.
 */
/**
 * Colorselector
 */
import "bootstrap-colorselector/lib/bootstrap-colorselector-0.2.0/js/bootstrap-colorselector";

const colorselector = $(".colorselector"),
	colorselectorMenu = colorselector.next().find(".dropdown-toggle");
colorselector.colorselector();

if (colorselectorMenu.length) {
	colorselectorMenu.append('<span class="caret"></span>');
}

/**
 * nav-tabs collapsible
 */
export function colorSelector() {
	$(".nav-tabs")
		.on("dblclick", 'li[role="presentation"]', function() {
			$(this)
				.parent()
				.toggleClass("nav-tabs-collapsed");
		})
		.on("click", "li.chevron", function() {
			$(this)
				.parent()
				.toggleClass("nav-tabs-collapsed");
		});
}
