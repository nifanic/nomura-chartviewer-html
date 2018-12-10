/**
 * Created by nnifadef on 9/16/16.
 */
require('jstree');
const moment = require('moment');

let structure = [];
let exports = module.exports = {};
let id = 0;

const getCurrentLevel = function(data) {
	const result = [];
	for (let i = 0; i < data.length; i++) {
		const element = data[ i ];
		let newElement = {};
		const getIcon = function(item) {
			const ICON_CHART = 'fa-line-chart';
			const ICON_FOLDER = 'fa-folder';
			const ICON_FORMULA_MATH = 'fa-calculator';
			const ICON_FORMULA_DATE = 'fa-calendar-o';
			const ICON_FORMULA_SPEC = 'fa-star-o';
			
			const iconClass = [ 'fa', 'fa-stack-1x' ];
			
			if (item.children && item.children.length > 0) {
				iconClass.push(ICON_FOLDER);
			} else {
				iconClass.push(ICON_CHART);
			}
			
			if (iconClass.length > 0) {
				return iconClass.join(' ');
			}
			
			return false;
		};
		const getText = function(item) {
			if (item.text) {
				var text = item.text;
			} else {
				var formula = item.formula,
					label = item.label;
				
				if (formula) {
					text = '<span class="formula">' + formula + '</span>';
					if (formula !== label) {
						text += ' ' + '<span class="formula-description">' + label + '</span>';
					}
				} else {
					text = '<span class="formula-description">'+ label +'</span>';
				}
			}
			if (text) {
				return text;
			}
			return false;
		};
		const getKeys = function(obj) {
			const keys = [];
			for (const key in obj) {
				keys.push(key);
			}
			return keys;
		};
		
		newElement = {
			id: ++id,
			text: getText(element),
			icon: getIcon(element)
		};
		
		for (let j = 0, keys = getKeys(element); j < keys.length; j++) {
			const key = keys[ j ];
			let keyValue = null;
			
			switch (true) {
				case (key === 'children'):
					if (element[key].length > 0) {
						keyValue = getCurrentLevel(element[key]);
					}
					break;
				case (key === 'properties'):
					keyValue = $.extend(true, {}, element[key]);
					break;
				case (key === 'dateModified'):
					const item = element[key];
					if (item && item.length > 0) {
						const formattedD = moment(item).format('MMM D, YYYY, h:mm');
						const am_pm = moment(item).format('a'), // Get AM/PM less last char to meet format "11:30a"
							a_p = am_pm.substring(0, am_pm.length - 1);
						keyValue =  formattedD + a_p;
					}
					break;
				default:
					keyValue = element[key];
			}
			newElement[key] = keyValue;
		}
		
		result.push(newElement);
	}
	return result;
};

exports.loadFolders = function(json) {
	json = json.folders;
	structure = getCurrentLevel(json);
};

exports.reset = function() {
	structure = [];
};

exports.setStructure = function(array) {
	id = 0;
	if (array) {
		structure = getCurrentLevel(array);
		return true;
	}
	return false;
};

exports.getStructure = function() {
	return structure;
};

exports.getChildren = (ids, parents) => {
	console.log('ids:', ids,'parents:',parents, 'structure:', structure);
	const allChildren = [];
	const filterByValue = (array, val) => {
		return array.filter(o => Object.keys(o).some(k => String(o[ k ]).toLowerCase().includes(val.toLowerCase())));
	};
	if (Array.isArray(ids) && ids.length) {
		ids.map(id => {
			const strFiltered = structure.filter(strItem => strItem.id === id);
			console.log('strFiltered:', strFiltered);
			
			console.log('filterByValue:', filterByValue(structure, id));
			
			if (Array.isArray(strFiltered) && strFiltered.length) {
				strFiltered.map(strItem => {
					if (strItem.children && strItem.children.length) {
						strItem.children.map(s => allChildren.push(s));
					}
				});
			}
		});
	}
	return allChildren.length ? allChildren : false;
};