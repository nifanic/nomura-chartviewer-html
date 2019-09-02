import "bootstrap-touchspin";

/**
 * Attaches Bootstrap TouchSpin component to given jQuery element.
 * @param {jQuery} element
 * @param {number} initval=1 - Initial value for TouchSpin.
 * @param {number} min=1 - Min value for TouchSpin.
 * @param {number} max=10 - Max value for TouchSpin.
 * @return {jQuery | *}
 * @author nifanic
 * @version 2019-08-21
 */
const setTouchSpin = (element, { initval, min, max }) => {
	if (typeof $().TouchSpin == "function") {
		if (element instanceof jQuery && element.length) {
			return element.TouchSpin({
				buttonup_class: "btn btn-default",
				buttondown_class: "btn btn-default",
				initval: initval || 1,
				min: min || 1,
				max: max || 10
			});
		}
		console.error("Unknown jQuery element:", element);
	}
	console.error("Bootstrap TouchSpin is unavailable.");
};

export function touchSpin(customProps) {
	if (customProps && Array.isArray(customProps) && customProps.length) {
		document.body
			.querySelectorAll(".properties[data-properties]")
			.forEach(properties => {
				const { value: propertiesName } = properties.attributes.getNamedItem(
					"data-properties"
				);
				if (propertiesName) {
					properties
						.querySelectorAll("input[type=number]")
						.forEach(inputNumElement => {
							const foundProps = customProps.find(
								element => element.propertiesName === propertiesName
							);
							if (foundProps) {
								setTouchSpin($(inputNumElement), foundProps);
							}
						});
				}
			});
		return true;
	}
	console.warn(
		"Provided custom properties are not a filled array:",
		customProps
	);
}
