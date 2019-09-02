/**
 * Sticky footer height recalc
 */
export function stickyFooter() {
	const elBody = $("body");
	const getHeight = () => {
		const footer = $("footer.global");
		if (footer.length) {
			return footer.outerHeight();
		}
	};

	if (!elBody.hasClass("browser-not-supported")) {
		elBody.css("margin-bottom", getHeight());
	}
}
