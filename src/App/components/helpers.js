import { ROW_HEIGHT, ROW_MIN_COUNT } from "./modal/constants";

/**
 * Bootstrap v3.3.7 Modal's predefined elements.
 * @type {*[]}
 */
const modalElements = [
	".modal-header",
	".modal-body .breadcrumb",
	".modal-footer"
];

/**
 * @type {Object} getViewport
 * @return {object} viewport
 */
export function getViewport() {
	const viewport = {};
	const browserWidth = $(window).width();
	const browserHeight = $(window).height();

	switch (true) {
		case browserWidth < 768:
			viewport.bs = "XS";
			break;
		case browserWidth >= 768 && browserWidth < 992:
			viewport.bs = "SM";
			break;
		case browserWidth >= 992 && browserWidth < 1200:
			viewport.bs = "MD";
			break;
		case browserWidth >= 1200:
			viewport.bs = "LG";
			break;
		default:
			viewport.bs = undefined;
	}

	viewport.width = browserWidth;
	viewport.height = browserHeight;

	return viewport;
}

export function capitalizeFirstChar(label) {
	if (label && typeof label == "string") {
		return label.charAt(0).toUpperCase() + label.slice(1);
	}
}

/**
 * Calculate default height of the given modal.
 * @param {jQuery} modal
 * @param {number} rowHeight - row height in Finder/Tree (in pixels).
 * @param {number} numberOfRows - Number of rows in Finder/Tree element (default to ROW_MIN_COUNT).
 * @return {number}
 */
export function getDefaultModalHeight(
	modal,
	rowHeight,
	numberOfRows = ROW_MIN_COUNT
) {
	let heightModal = 0;

	if (modal instanceof jQuery && modal.length) {
		// Display modal as block to height its child elements
		let tempCss = modal.attr("style");
		modal.css({
			position: "absolute",
			visibility: "hidden",
			display: "block"
		});

		modalElements.map(element => {
			const elementToFind = modal.find(element);
			if (elementToFind.length) {
				heightModal += elementToFind.outerHeight();
			}
		});

		modal.attr("style", tempCss ? tempCss : "");

		// Finder/Tree default capacity
		heightModal += rowHeight * numberOfRows;
		// .modal-content top/bottom borders
		heightModal += 2;
		// .modal-body top/bottom borders
		heightModal += 2;

		return heightModal;
	}
}

/**
 * Calculate size of modal element
 * @param {jQuery} modal
 * @return {{getHeight: (function(): *), getHeightOuter: (function(): *), width: {footer: *, header: *, body: *},
 *   getWidth: (function(): *), getWidthOuter: (function(): *), height: {footer: *, header: *, body: *}}|void}
 */
export const getModalSize = modal => {
	if (modal && modal instanceof jQuery) {
		if (modal.hasClass("in")) {
			const modalDialog = modal.find(".modal-dialog");
			return {
				getWidth: () => modalDialog.outerWidth(),
				getWidthOuter: () => modalDialog.outerWidth(true),
				getHeight: () => modalDialog.outerHeight(),
				getHeightOuter: () => modalDialog.outerHeight(true),
				width: {
					header: modal.find(".modal-header").outerWidth(),
					body: modal.find(".modal-body").outerWidth(),
					footer: modal.find(".modal-footer").outerWidth()
				},
				height: {
					header: modal.find(".modal-header").outerHeight(),
					body: modal.find(".modal-body").outerHeight(),
					footer: modal.find(".modal-footer").outerHeight()
				}
			};
		}
		return console.error(`\'${modal}\' argument is not a jQuery selector.`);
	}
};

/**
 * Calculate minimal height of modal popup
 * @param {jQuery} modal
 * @return {number|void}
 */
export const minModalHeight = modal => {
	if (modal && modal instanceof jQuery && typeof getModalSize == "function") {
		const { height } = getModalSize(modal);
		return height.header + ROW_HEIGHT * ROW_MIN_COUNT + height.footer;
	}
};

export const maxModalHeight = (modal, viewport) => {
	return (
		modal &&
		viewport.height -
			(getModalSize(modal).getHeightOuter() - getModalSize(modal).getHeight()) -
			30
	);
};

export const minModalWidth = viewport => {
	switch (true) {
		case viewport.bs === "XS":
			return viewport.width;
		case viewport.bs === "SM":
			return 750;
		case viewport.bs === "MD" || viewport.bs === "LG":
			return 970;
		default:
			return 400;
	}
};

export const maxModalWidth = (modal, viewport) =>
	viewport.width -
	(getModalSize(modal).getWidthOuter() - getModalSize(modal).getWidth()) -
	30;
