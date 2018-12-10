/**
 * Created by nnifadef on 7/29/16.
 */
'use strict';

var finder = require('finderjs/index');
var _ = require('finderjs/util');
var exports = module.exports = {};

var numeral = require('numeral');
var emitter;
var activeItem = null;

// module.exports = create;

exports.create = function(container, data) {
	emitter = finder(
		container,
		data,
		{
			createItemContent: createItemContent
		}
	);
	
	emitter.on('leaf-selected', function selected(item) {
		emitter.emit('create-column', createSimpleColumn(item));
		
	});
	
	emitter.on('column-created', function columnCreated() {
		container.scrollLeft = container.scrollWidth - container.clientWidth;
	});
	
	emitter.on('item-selected', function(leaf) {
		var addButtonDisabled = leaf.item.classList.contains('fjs-has-children');
		
		setActiveItem(leaf.item.id);
		
		$('.btn-group.add').children('button').each(function() {
			if (addButtonDisabled) {
				$(this).prop('disabled', 'disabled');
			} else {
				$(this).removeProp('disabled');
			}
		});
	})
};

function setActiveItem(item) {
	if (item) {
		activeItem = item;
		return true;
	}
	return false;
}

exports.getActiveItem = function() {
	if (activeItem) {
		return activeItem;
	}
	return false;
};

