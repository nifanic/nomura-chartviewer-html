import "jstree";
import {
	ICON_CHART,
	ICON_DEFAULT,
	ICON_FOLDER,
	ICON_FORMULA_MATH
} from "../../modal/constants";
import { MODAL_ADD_DATA_SERIES } from "../../modal/add/constants";

let structure = [];
let id = 0;

function getCurrentLevel(data) {
	const result = [];
	for (let i = 0; i < data.length; i++) {
		const element = data[i];
		let newElement = {};
		const getIcon = function(item) {
			const { children, type, formula } = item;
			let iconClass = null;
			const iconClasses = ["fa", "fa-stack-1x"];

			switch (true) {
				case children && children.length > 0:
					iconClass = ICON_FOLDER;
					break;
				case type && type === MODAL_ADD_DATA_SERIES:
					iconClass = ICON_CHART;
					break;
				case formula && formula !== "":
					iconClass = ICON_FORMULA_MATH;
					break;
				default:
					iconClass = ICON_DEFAULT;
			}
			iconClasses.push(iconClass);

			if (iconClasses.length) {
				return iconClasses.join(" ");
			}
		};
		/**
		 * @param item
		 * @return {string} - HTML string.
		 */
		const getText = item => {
			const { text, formula, label } = item;
			const description = `<span class="formula-description">${label}</span>`;

			if (text) {
				return text;
			}
			if (formula) {
				return `<span class="formula">${formula}</span>${
					formula !== label ? " " + description : ""
				}`;
			}
			return description;
		};
		const getKeys = obj => {
			const keys = [];
			for (const key in obj) {
				if (obj.hasOwnProperty(key)) {
					keys.push(key);
				}
			}
			return keys;
		};

		newElement = {
			id: ++id,
			text: getText(element),
			icon: getIcon(element)
		};

		for (let j = 0, keys = getKeys(element); j < keys.length; j++) {
			const key = keys[j];
			let keyValue = null;

			switch (key) {
				case "children":
					if (element[key] && element[key].length) {
						keyValue = getCurrentLevel(element[key]);
					}
					break;
				case "properties":
					keyValue = $.extend(true, {}, element[key]);
					break;
				// case "dateModified":
				// 	break;
				default:
					keyValue = element[key];
			}
			newElement[key] = keyValue;
		}
		result.push(newElement);
	}
	return result;
}

export function setStructure(data) {
	id = 0;
	if (data) {
		return (structure = getCurrentLevel(data));
	}
}

export function getStructure() {
	return structure;
}

/**
 * Checks and fixes shape of given node.
 * @param {Object} node
 * @return {{icon: (string|null), dateModified: (string|null), id: (string), text: (string|null), type: (string|null)}}
 */
export function fixNodeShape(node) {
	if (node && typeof node == "object") {
		return (({ id, text, type, dateModified, icon, children }) => ({
			id: id.toString(),
			text: text || null,
			type: type || null,
			dateModified: dateModified || null,
			icon: icon || ICON_DEFAULT,
			...(children && { children })
		}))(node);
	}
	throw `Given "node" argument is undefined, or not an object.`;
}

/**
 * Returns children elements, if any, by given path, an array of "id" fields of its parents.
 * @param {Array} path
 * @return {Array|null}
 */
export function getChildren(path) {
	if (Array.isArray(path) && path.length) {
		let structureToProcess = [...structure];
		let out = [];
		path.map(id => {
			// Ignore the "#" element. It's a "virtual" item representing "home",
			// which doesn't exist in actual json file, and hence should be ignored
			if (id === "#") {
				return;
			}
			if (structureToProcess) {
				structureToProcess = structureToProcess.find(
					structureItem => structureItem.id === Number(id)
				);

				if (structureToProcess.children && structureToProcess.children.length) {
					structureToProcess = structureToProcess.children;
					out = structureToProcess.map(child => fixNodeShape(child));
				}
			}
		});
		return out || null;
	} else {
		throw `"path" is either (a) not an array, or (b) an empty array.`;
	}
}

/**
 * Returns array of parent objects: those without "children" field are removed.
 * @param datas
 * @return {Array|null}
 */
export function hideChildren(datas) {
	return !!!datas
		? null
		: datas.reduce((list, entry /*, index, array*/) => {
				let clone = null;
				if (entry.children && entry.children.length) {
					const children = hideChildren(entry.children);
					if (children.length) {
						clone = { ...entry, children };
					}
				} else {
					// Remove empty "children" field
					// delete entry.children;
					clone = { state: { hidden: true }, ...entry };
				}
				clone && list.push(clone);
				return list;
		  }, []);
}
