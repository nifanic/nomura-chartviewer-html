/**
 * HTML templates for "Property" panel.
 * @param {string} dataType - "series" or "formula".
 * @param {string} icon - Preview icon FontAwesome class.
 * @param {string} label - Property label, shown right below the icon.
 * @param {string} properties - Rendered HTML controls.
 * @param {string} formula - For "formula" dataType only.
 * @param {string} syntax - For "formula" dataType only.
 * @param {string} definition - Short description. For "formula" dataType only.
 * @return {string} - HTML elements that to be inserted into HTML template.
 * @author nifanic <nifanic@users.noreply.github.com>
 * @version 2019-08-17
 */
export const tmplProps = (
	dataType,
	{ icon, label, properties, formula, syntax, definition }
) => {
	if (dataType) {
		const html = {
			series: `<div class="properties-series">
	<div class="leaf-row">
		<i class="${icon}"></i>${label}
		${properties}
	</div>`,
			formula: `<div class="properties-formula">
	<header>
		<h3><code>${formula}</code></h3>
		<span><small>${label}</small><a
			class="btn help"
			role="button"
			data-toggle="collapse"
			href="#formulaHelp"
			aria-expanded="false"
			aria-controls="formulaHelp"
		>Help</a></span>
	</header>
	<dl>
		<dd id="formulaHelp" class="collapse help">
			<dl>
				<dt class="syntax">Syntax</dt>
				<dd><code>${syntax}</code></dd>
				<dt class="description">Description</dt>
				<dd>${definition}</dd>
			</dl>
		</dd>
		<dt class="apply-to">Apply To</dt>
		<dd>
			<div class="checkbox">
				<label><input type="checkbox" value="" />New series</label>
			</div>
			<div class="checkbox">
				<label><input type="checkbox" value="" /><span class="legend">
					<svg width="16" height="12">
						<g class="highcharts-legend-item" transform="translate(0,-5)">
							<path fill="none" d="M 0 11 L 16 11" stroke="#c72420" stroke-width="2"></path>
							<path
								fill="#c72420"
								d="M 8 7 C 13.328 7 13.328 15 8 15 C 2.6719999999999997 15 2.6719999999999997 7 8 7 Z"
							></path>
						</g>
					</svg>
				</span><span class="var">A</span> Interest rate - USD - 2y</label>
			</div>
			<div class="checkbox">
				<label><input type="checkbox" value="" /><span class="legend">
					<svg width="16" height="12">
						<g class="highcharts-legend-item" transform="translate(0,-5)">
							<path fill="none" d="M 0 11 L 16 11" stroke="#00305c" stroke-width="2"></path>
							<path fill="#00305c" d="M 8 7 L 12 11 8 15 4 11 Z"></path>
						</g>
					</svg>
				</span><span class="var">B</span> Interest rate - USD - 10y</label>
			</div>
			<div class="checkbox">
				<label><input type="checkbox" value="" /><span class="legend">
					<svg width="16" height="12">
						<g class="highcharts-legend-item" transform="translate(0,-5)">
							<path fill="none" d="M 0 11 L 16 11" stroke="#00713b" stroke-width="2"></path>
							<path fill="#00713b" d="M 4 7 L 12 7 12 15 4 15 Z"></path>
						</g>
					</svg>
				</span><span class="var">C</span> USD 2s/10s spread</label>
			</div>
		</dd>
	</dl>
</div>`
		};
		return html[dataType];
	}
};
