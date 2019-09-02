import Raphael from "raphael";
/**
 * Draw Nomura Signature
 */
export function drawNomuraSignature() {
	const p = new Raphael(document.getElementById("nomura-signature"), 54, 45);
	if (p) {
		const base = p.path(
			"M2866,0v45H54L42,15l-3,7.5L48,45H36l-3-7.5L30,45h-2164V0H2866z"
		);
		const dark = p.path(
			"M30,0l9,22.5l-6,15L24,15L12,45H0L18,0H30z M36,0l6,15l6-15H36z"
		);
		const darkest = p.path("M24,15L18,0h12L24,15z");

		if (base && dark && darkest) {
			base.node.id = "base";
			base.attr({ fill: "#C92417", stroke: null, opacity: 0.9 });

			dark.node.id = "dark";
			dark.attr({ fill: "#9B0501", stroke: null, opacity: 0.9 });

			darkest.node.id = "darkest";
			darkest.attr({
				fill: "#7B0100",
				stroke: null,
				opacity: 0.9
			});
		}
	}
}
