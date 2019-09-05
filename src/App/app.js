import "bootstrap-sass/assets/javascripts/bootstrap/modal";
import "bootstrap-sass/assets/javascripts/bootstrap/dropdown";
import "bootstrap-sass/assets/javascripts/bootstrap/tab";
import "bootstrap-sass/assets/javascripts/bootstrap/button";
import "bootstrap-sass/assets/javascripts/bootstrap/collapse";
import "bootstrap_dropdowns_enhancement";
import "velocity-animate/velocity";
import "velocity-animate/velocity.ui";

import "finderjs/example/finderjs.css";
import "bootstrap_dropdowns_enhancement/dist/css/dropdowns-enhancement.css";
import "bootstrap-colorselector/lib/bootstrap-colorselector-0.2.0/css/bootstrap-colorselector.css";
import "bootstrap-touchspin/dist/jquery.bootstrap-touchspin.css";
import "jstree/dist/themes/default/style.css";
import "highlight.js/styles/darcula.css";
import "./app.scss";

import {
	drawNomuraSignature,
	stickyFooter,
	passwordMasking,
	clearButton,
	userMenuEvents,
	touchSpin,
	colorSelector,
	highchart
} from "./components";

$(document).ready(() => {
	drawNomuraSignature();
	stickyFooter();
	passwordMasking();
	clearButton();
	userMenuEvents();
	touchSpin([
		{ propertiesName: "format-line", initval: 1, min: 1, max: 5 },
		{ propertiesName: "format-point", initval: 1, min: 1, max: 20 },
		{ propertiesName: "axis", initval: 1, min: 1, max: 10 },
		{ propertiesName: "precision", initval: 1, min: 1, max: 10 }
	]);
	colorSelector();
	highchart();
});

$(window).resize(() => {
	stickyFooter();
});
