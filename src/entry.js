/**
 * Created by nnifadef on 7/11/16.
 */
require('jquery-ui/ui/widgets/resizable');
require('jquery-ui/ui/widgets/draggable');
require('velocity-animate/velocity');
require('velocity-animate/velocity.ui');
require('bootstrap-sass/assets/javascripts/bootstrap');
require('bootstrap_dropdowns_enhancement');
require('./assets/js/app');

const Raphael = require('raphael');
const numeral = require('numeral');

const getViewport = function() {
	const viewport = {};
	const browserWidth = $(window).width(),
		browserHeight = $(window).height();
	
	switch (true) {
		case (browserWidth < 768):
			viewport.bs = 'XS';
			break;
		case (browserWidth >= 768 && browserWidth < 992):
			viewport.bs = 'SM';
			break;
		case (browserWidth >= 992 && browserWidth < 1200):
			viewport.bs = 'MD';
			break;
		case (browserWidth >= 1200):
			viewport.bs = 'LG';
			break;
		default:
			viewport.bs = undefined;
	}
	
	viewport.width = browserWidth;
	viewport.height = browserHeight;
	
	return viewport;
};

(function($) {
	$.fn.hasScrollBar = function() {
		return this.get(0).scrollHeight > this.height();
	};
})(jQuery);

/**
 * i18next
 */
const i18next = require('./assets/js/_i18next').default;

/**
 * Highcharts
 */
const Highcharts = require('highcharts/highstock');
let chart;
const chartDiv = $('#chartviewer');
const chartOptions = {
	exporting: {
		enabled: false,
		scale: 1,
		sourceWidth: 1600,
		sourceHeight: 900,
		chartOptions: {
			rangeSelector: {
				enabled: false
			},
			title: {
				text: 'Runtime Title'
			}
		}
	},
	credits: {
		enabled: true,
		href: 'https://www.nomura.com/',
		text: 'Source: <b>Nomura</b>',
		position: {
			x: -4
		}
	},
	title: {
		text: 'FX spot rate JPY-GBP',
		style: {
			fontSize: '18px',
			fontWeight: 'bold',
			color: '#9d9d9d'
		}
	},
	subtitle: {
		text: 'Subtitle',
		style: {
			fontSize: '14px',
			fontWeight: 'normal',
			color: '#9d9d9d'
		}
	},
	chart: {
		backgroundColor: 'transparent',
		zoomType: 'x',
		style: {
			fontFamily: 'inherit'
		},
		spacing: [ 15, 4, 0, 0 ]
	},
	xAxis: {
		type: 'datetime',
		labels: {}
	},
	yAxis: [
		{
			title: {
				text: null,
				style: {
					fontWeight: 'bold',
					color: '#9d9d9d'
				},
				margin: 20
			},
			labels: {
				align: 'right',
				format: '{value:.4f}',
				formatter: function() {
					return numeral(this.value).multiply(1).format('0,0.0');
				}
			}
		},
		{
			title: {
				text: 'USD 2y/10y spread',
				style: {
					fontWeight: 'bold'
				},
				margin: 20
			},
			labels: {
				align: 'left',
				format: '{value:.4f}',
				formatter: function() {
					return numeral(this.value).multiply(1).format('0,0');
				}
			},
			opposite: true
		}
	],
	rangeSelector: {
		selected: 5,
		enabled: true,
		buttonTheme: {
			fill: 'transparent',
			width: 31,
			height: 17,
			stroke: 'none',
			'stroke-width': 0,
			r: 3,
			padding: 2,
			style: {
				color: 'black',
				fontWeight: 'normal',
				fontSize: '12px'
			},
			states: {
				hover: {
					fill: 'transparent',
					stroke: '#b6b6b6',
					'stroke-width': 1
				},
				select: {
					fill: 'transparent',
					stroke: '#b6b6b6',
					'stroke-width': 1,
					style: {
						color: '#b6b6b6',
						fontWeight: 'normal',
						cursor: 'default'
					}
				}
			}
		},
		buttonSpacing: 0,
		buttons: [
			{
				type: 'month',
				count: 1,
				text: '1M'
			}, {
				type: 'month',
				count: 3,
				text: '3M'
			}, {
				type: 'month',
				count: 6,
				text: '6M'
			}, {
				type: 'ytd',
				text: 'YTD'
			}, {
				type: 'year',
				count: 1,
				text: '1Y'
			}, {
				type: 'all',
				text: 'ALL'
			}
		],
		buttonPosition: {
			// y: 0
		},
		labelStyle: {
			color: '#b6b6b6',
			fontWeight: 'normal',
			fontSize: '12px'
		},
		// inputBoxHeight: 17,
		// height: 30,
		// inputBoxHeight: 10,
		inputBoxBorderColor: '#b6b6b6',
		inputStyle: {
			color: 'black'
		},
		inputPosition: {
			// y: 0,
			verticalAlign: 'top'
		}
	},
	plotOptions: {
		area: {
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[ 0, Highcharts.Color(Highcharts.getOptions().colors[ 0 ]).setOpacity(.15).get('rgba') ],
					[ 1, Highcharts.Color(Highcharts.getOptions().colors[ 0 ]).setOpacity(0).get('rgba') ]
				]
			},
			marker: {
				radius: 2
			},
			lineWidth: 1,
			states: {
				hover: {
					lineWidth: 2
				}
			},
			threshold: null
		}
	},
	navigator: {
		enabled: false,
		maskInside: true,
		maskFill: 'rgba(0,0,0,.1)',
		series: {
			includeInCSVExport: false,
			type: 'line',
			color: 'black'
		},
		handles: {
			backgroundColor: '#f3f3f3'
		}
	}
};

const dataHighchart = require('./assets/js/data-highcharts-eg1');

require('highcharts/modules/exporting')(Highcharts);
// require('highcharts/modules/canvas-tools')(Highcharts);
// require('export-csv');
// require('jspdf/dist/jspdf.min');

Highcharts.setOptions({
	colors: [
		'#c72420',
		'#00305c',
		'#00713b',
		'#737373',
		'#00677a',
		'#d9b640',
		'#80003f',
		'#979200',
		'#80a6ab',
		'#c98a19'
	]
});

if (chartOptions.title.text.length) {
	chartOptions.chart.spacingTop = 30;
} else {
	chartOptions.chart.spacingTop = 15;
}

if (dataHighchart) {
	const processJsonSeries = [];
	d = dataHighchart.series;
	for (let j = 0; j < d.length; j++) {
		const processedJsonData = [];
		for (let i = 0; i < d[ j ].data.length; i++) {
			const date = new Date(d[ j ].data[ i ].date),
				dateYear = date.getUTCFullYear(),
				dateMonth = date.getUTCMonth(),
				dateDay = date.getUTCDate();
			processedJsonData.push([ Date.UTC(dateYear, dateMonth, dateDay), d[ j ].data[ i ].value ]);
		}
		processJsonSeries.push({
			type: 'line',
			yAxis: d[ j ].yAxis,
			expression: d[ j ].expression,
			name: d[ j ].name,
			color: d[ j ].color,
			data: processedJsonData
		});
	}
	chartOptions.series = processJsonSeries;
//	
	chart = new Highcharts.chart(
		chartDiv.selector.slice(1),
		chartOptions
	);
	
	// Resizable for Highchart
	if (chartDiv.length) {
		try {
			$(chartDiv).resizable({
				handles: 's'
			});
			
			const p = new Raphael(chartDiv.find('.ui-resizable-handle')[ 0 ], 32, 9);
			const border = p.rect(0.5, 0.5, 31, 8),
				line = p.path('M12 3.5h8m-8 2h8')
			;
			border.node.id = 'grip-border';
			border.attr({
				'fill': '#f3f3f3',
				'stroke': '#b6b6b6',
				'stroke-width': 1
			});
			line.node.id = 'grip-lines';
			line.attr({
				'fill': null,
				'stroke': '#b6b6b6',
				'stroke-width': 1
			});
		} catch (e) {
			console.error('Problem with resizing chart.', e);
		}
	}
	
	function chartResize(chart) {
		chart.setSize(
			chartDiv.parent().width(),
			null,
			false
		);
	}
	
	/**
	 * SlickGrid
	 */
	function getMaxId(arr, prop) {
		var maxId;
		if (arr && arr.length > 0) {
			for (var i = 0; i < arr.length; i++) {
				if (!maxId || parseInt(arr[ i ][ prop ]) > parseInt(maxId[ prop ])) {
					maxId = arr[ i ];
				}
			}
		} else {
			maxId = { 'id': 1 };
		}
		return maxId;
	}
	
	function getVarAlphaName(num) {
		var mod = num % 26;
		var pow = num / 26 | 0;
		var out = mod ? String.fromCharCode(64 + mod) : (pow--, 'Z');
		return pow ? getVarAlphaName(pow) + out : out;
	}
	
	require('slickgrid/lib/jquery.event.drag-2.3.0');
	require('slickgrid/slick.core');
	require('slickgrid/slick.grid');
	require('slickgrid/slick.dataview');
	
	require('slickgrid/slick.formatters');
	require('slickgrid/plugins/slick.checkboxselectcolumn');
	require('slickgrid/plugins/slick.rowselectionmodel');
	require('slickgrid/controls/slick.columnpicker');
	
	const data = [];
	for (let i = 0; i < processJsonSeries.length; i++) {
		data.push({
			'id': i,
			'key': '',
			'var': getVarAlphaName(i + 1),
			'expression': processJsonSeries[ i ].expression,
			'color': processJsonSeries[ i ].color,
			'name': processJsonSeries[ i ].name,
			'yAxis': processJsonSeries[ i ].yAxis,
			'action': 'showhide'
		});
	}
	
	const dataView = new Slick.Data.DataView();
	const cols = [
		{
			'id': 'key',
			'name': 'Key',
			'field': 'key',
			'cssClass': 'key',
			'min-width': 60,
			'width': 60,
			'formatter': function() {
				return '<hr/>';
			}
		},
		{
			'id': '_var',
			'name': 'Var',
			'field': 'var',
			'cssClass': 'var',
			'minWidth': 60,
			'width': 60,
			'sortable': true,
			'formatter': function(row, cell, value) {
				return '<input class="form-control input-sm" type="text" value="' + value + '" />';
			}
		},
		{
			'id': '_expression',
			'name': 'Expression',
			'field': 'expression',
			'cssClass': 'expression',
			'width': 312,
			'formatter': function(row, cell, value) {
				return '<input class="form-control input-sm clearable" type="text" value="' + value + '" />';
			}
		},
		{
			'id': '_name',
			'name': 'Name',
			'field': 'name',
			'cssClass': 'name',
			'width': 312,
			'formatter': function(row, cell, value) {
				return (
					'<input class="form-control input-sm clearable-" type="text" value="' + value + '" />'
				);
			}
		},
		{
			'id': '_yaxis',
			'name': 'Axis',
			'field': 'yAxis',
			'cssClass': 'axis',
			'resizable': false,
			'width': 62,
			'formatter': function(row, cell, value) {
				var yAxisLeft, yAxisRight;
				
				if (value == 0) {
					yAxisLeft = [ ' active', ' checked' ];
					yAxisRight = [ '', '' ];
				} else if (value == 1) {
					yAxisLeft = [ '', '' ];
					yAxisRight = [ ' active', ' checked' ];
				}
				
				return (
					'<div class="btn-group" data-toggle="buttons">' +
					'<label class="btn btn-default btn-sm' + yAxisLeft[ 0 ] + '">' +
					'<input type="radio" name="options" id="axis-left" autocomplete="off"' + yAxisLeft[ 1 ] + '>L' +
					'</label>' +
					'<label class="btn btn-default btn-sm' + yAxisRight[ 0 ] + '">' +
					'<input type="radio" name="options" id="axis-right" autocomplete="off"' + yAxisRight[ 1 ] + '>R' +
					'</label>' +
					'</div>'
				);
			}
		},
		{
			'id': '_action',
			'name': 'Action',
			'field': 'action',
			'cssClass': 'action',
			'minWidth': 100,
			'width': 100,
			'formatter': function(row, cell, value, columnDef, dataContext) {
				return (
					'<button type="button" class="btn btn-default showhide" data-toggle="button" aria-pressed="false"><span class="fa fa-eye"></span></button>' +
					'<button type="button" class="btn btn-default duplicate"><span class="fa fa-files-o"></span></button>' +
					'<button type="button" class="btn btn-default delete" id="' + dataContext.id + '"><span class="fa' +
					' fa-trash-o"></span></button>'
				);
			}
		}
	];
	const options = {
		autoHeight: true,
		enableCellNavigation: true,
		enableColumnReorder: false,
		fullWidthRows: true,
		forceFitColumns: true,
		headerrowHeight: 28,
		rowHeight: 30
	};
	
	const checkboxSelector = new Slick.CheckboxSelectColumn({
		'cssClass': 'checkbox-select',
		'width': 39
	});
	
	cols.unshift(checkboxSelector.getColumnDefinition());
	
	dataView.setItems(data);
	const grid = new Slick.Grid('#sgrid-expressions', dataView, cols, options);
	grid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
	grid.registerPlugin(checkboxSelector);
	dataView.syncGridSelection(grid, true);
	
	// grid = this.grid;
	
	grid.onSelectedRowsChanged.subscribe(function() {
		const numRowsTotal = data.length,
			numRowsSelected = grid.getSelectedRows().length,
			checkboxAllSelected = $('#sgrid-expressions').find('.slick-header-column').find('input[type=checkbox]'),
			dropdownActions = $('#series').find('header').find('.actions > button.dropdown-toggle');
		
		if ((numRowsTotal > numRowsSelected) && (numRowsSelected != 0)) {
			checkboxAllSelected.prop('indeterminate', true);
			dropdownActions.prop('disabled', false);
		} else if (numRowsTotal === numRowsSelected) {
			dropdownActions.prop('disabled', false);
		} else {
			checkboxAllSelected.prop('indeterminate', false);
			dropdownActions.prop('disabled', true);
		}
	});
	
	/**
	 * onReady
	 */
	$('#toolbar-download').next('.dropdown-menu').each(function() {
		const jThis = $(this),
			chartSelector = jThis.data('chartSelector');
		
		/*var chartTitle = function() {
			var currTitle = chart.options.title.text,
				titlePrefix = 'chartv';
			
			if (currTitle && currTitle !== 'Chart title') {
				currTitle = titlePrefix + '  ' + currTitle;
			} else {
				currTitle = 'Title not set';
			}
			
			currTitle =
				currTitle.split(' ').join('-').replace(/[\%]/gi, 'pc').replace(/[^a-z0-9_\-]/gi, '_')
				         .toLowerCase();
			return currTitle;
		};
		
		$('*[data-type]', this).each(function() {
			var jThis = $(this),
				type = jThis.data('type');
			
			if (Highcharts.exporting.supports(type)) {
				jThis.click(function() {
					chart.exportChartLocal({
						type: type,
						filename: chartTitle()
					});
				});
			} else {
				jThis.parent().addClass('disabled');
			}
		});*/
	});
	
	$('button.print').click(function() {
		chart.setTitle('Runtime Title');
		chart.print();
	});
	
	$('button.config').click(function() {});
	
	$('#modal-add')
		.find('.btn-group.add').find('.dropdown-menu')
		.on('click', 'li a', function(e) {
				$('.btn-group.add > .btn:first-child')
					.text($(this).text())
					.val($(this).text())
				;
				$(this).parent().siblings()
				       .removeClass('active')
				       .end()
				       .addClass('active')
				;
				e.preventDefault();
			}
		)
	;
	
	$('.toolbar').find('button.container-type').click(function() {
		$(this).find('i').toggleClass(function() {
			if ($(this).hasClass('fa-expand')) {
				$(this).removeClass('fa-expand');
				return 'fa-compress';
			} else {
				$(this).removeClass('fa-compress');
				return 'fa-expand';
			}
		});
		chartDiv.parent().toggleClass(function() {
			if ($(this).hasClass('container')) {
				$(this).removeClass('container');
				return 'container-fluid';
			} else {
				$(this).removeClass('container-fluid');
				return 'container';
			}
		});
		chartResize(chart);
	});
	
	$('#series ').find('.toolbar').children('button.add-row').click(function() {
		let nextId = getMaxId(data, 'id').id;
		nextId++;
		data.push({
			'id': nextId,
			'key': '',
			'var': getVarAlphaName(nextId),
			'expression': '',
			'color': '',
			'name': '',
			'yAxis': 0,
			'action': 'showhide'
		});
		
		if ($('.grid-canvas').hasClass('empty')) {
			$('.grid-canvas')
				.removeClass('empty')
				.css({ 'display': '' })
				.find('div').remove()
			;
		}
		
		dataView.setItems(data);
		grid.updateRowCount();
		grid.render();
		
		$('#sgrid-expressions')
			.find('.slick-header-column').find('input:checkbox')
			.removeProp('disabled')
		;
		
		if (data.length === 1) {
			grid.setSelectedRows([]);
		}
	});
	
	$('.grid-canvas')
		.on('click', 'button.showhide', function() {
			const icon = 'fa fa-' + ($(this).hasClass('active') ? 'eye' : 'eye-slash');
			$(this).children().first().removeClass().addClass(icon);
		})
		.on('click', 'button.duplicate', function() {
			// TODO: "Expressions" Tab: row duplication to implement
		})
		.on('click', 'button.delete', function() {
			const id = $(this).attr('id');
			
			dataView.deleteItem(id);
			grid.invalidate();
			grid.render();
			
			if (!data.length) {
				grid.invalidateAllRows();
				$('.grid-canvas')
					.addClass('empty')
					.html('<div>Nothing to show. To add series, please click <span class="button-like"><i class="fa fa-plus"></i> Add Row</span> button above.</div>')
					.css({ 'display': 'table', 'height': '' })
				;
				$('#sgrid-expressions')
					.find('.slick-header-column').find('input:checkbox')
					.prop('disabled', 'disabled')
				;
				$('#series')
					.find('header').find('.actions > button.dropdown-toggle')
					.prop('disabled', 'disabled')
				;
			}
		})
		.bind('mousewheel DOMMouseScroll', function(e) {
			if ($('.grid-canvas').hasScrollBar()) {
				var e0 = e.originalEvent,
					delta = e0.wheelDelta || -e0.detail;
				this.scrollTop += (delta < 0 ? 1 : -1) * 30;
				e.preventDefault();
			}
		})
	;
	$('#series')
		.children('header')
		.on('click', '.actions .remove-selected', function() {
			const selectedRows = grid.getSelectedRows();
			const selectedRowsIds = dataView.mapRowsToIds(selectedRows.sort());
			
			for (let i = 0; i < selectedRows.length; i++) {
				const d = selectedRowsIds[ i ];
				if (d) {
					dataView.deleteItem(d);
					grid.invalidate();
					grid.updateRowCount();
					grid.render();
				}
			}
		})
	;
	
	/**
	 * Window.Resize
	 */
	$(window).resize(function() {
		chartResize(chart);
		getViewport();
	});
}

$(window).on('load', function() {});
$(document).ready(function() {
	const viewport = getViewport();
	const split = require('split.js').default;
	
	/**
	 * Modal
	 */
	const ROW_HEIGHT = 24;
	const ROW_MIN_COUNT = 5;
	
	const getModalSize = function(modal) {
			if (modal && modal.hasClass('in')) {
				var modalSize = {
					getWidth: function() {
						return modal.find('.modal-dialog').outerWidth();
					},
					getWidthOuter: function() {
						return modal.find('.modal-dialog').outerWidth(true);
					},
					getHeight: function() {
						return modal.find('.modal-dialog').outerHeight();
					},
					getHeightOuter: function() {
						return modal.find('.modal-dialog').outerHeight(true);
					}
				};
				modalSize.width = {
					header: modal.find('.modal-header').outerWidth(),
					body: modal.find('.modal-body').outerWidth(),
					footer: modal.find('.modal-footer').outerWidth()
				};
				modalSize.height = {
					header: modal.find('.modal-header').outerHeight(),
					body: modal.find('.modal-body').outerHeight(),
					footer: modal.find('.modal-footer').outerHeight()
				};
				return modalSize;
			}
			return false;
		},
		minModalHeight = function(modal) {
			return getModalSize(modal).height.header +
				(ROW_HEIGHT * ROW_MIN_COUNT) +
				getModalSize(modal).height.footer;
		},
		maxModalHeight = function(modal) {
			return viewport.height
				- (getModalSize(modal).getHeightOuter() - getModalSize(modal).getHeight())
				- 30;
		},
		minModalWidth = function() {
			switch (true) {
				case (viewport.bs == 'XS'):
					return viewport.width;
					break;
				case (viewport.bs == 'SM'):
					return 750;
					break;
				case (viewport.bs == 'MD' || viewport.bs == 'LG'):
					return 970;
					break;
				default:
					return 400;
			}
		},
		maxModalWidth = function(modal) {
			return viewport.width
				- (getModalSize(modal).getWidthOuter() - getModalSize(modal).getWidth())
				- 30;
		};
	
	/*var BrowserDetect = {
	 init: function() {
	 this.browser = this.searchString(this.dataBrowser) || "Other";
	 this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(
	 navigator.appVersion) || "Unknown";
	 },
	 searchString: function(data) {
	 for (var i = 0; i < data.length; i++) {
	 var dataString = data[ i ].string;
	 this.versionSearchString = data[ i ].subString;
	 
	 if (dataString.indexOf(data[ i ].subString) !== -1) {
	 return data[ i ].identity;
	 }
	 }
	 },
	 searchVersion: function(dataString) {
	 var index = dataString.indexOf(this.versionSearchString);
	 if (index === -1) {
	 return;
	 }
	 
	 var rv = dataString.indexOf("rv:");
	 if (this.versionSearchString === "Trident" && rv !== -1) {
	 return parseFloat(dataString.substring(rv + 3));
	 } else {
	 return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
	 }
	 },
	 
	 dataBrowser: [
	 { string: navigator.userAgent, subString: "Edge", identity: "MS Edge" },
	 { string: navigator.userAgent, subString: "MSIE", identity: "Explorer" },
	 { string: navigator.userAgent, subString: "Trident", identity: "Explorer" },
	 { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
	 { string: navigator.userAgent, subString: "Opera", identity: "Opera" },
	 { string: navigator.userAgent, subString: "OPR", identity: "Opera" },
	 
	 { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
	 { string: navigator.userAgent, subString: "Safari", identity: "Safari" }
	 ]
	 };*/
	
	/*BrowserDetect.init();
	 document.write("You are using <b>" + BrowserDetect.browser + "</b> with version <b>" + BrowserDetect.version + "</b>");*/
	
	const hljs = require('highlight.js/lib/highlight');
	hljs.registerLanguage('excel', require('highlight.js/lib/languages/excel'));
	
	function Toolbar(modalName) {
		var ActiveButtonsByDefault = {
			data: 'series',
			view: 'finder'
		};
		
		var ActiveButtons = {};
		
		this.init = function(ActiveButtons) {
			var tbar = modalName.find('.toolbar');
			
			if (!ActiveButtons) {
				ActiveButtons = ActiveButtonsByDefault;
			}
			
			if (!ActiveButtons.data) {
				ActiveButtons.data = ActiveButtonsByDefault.data;
			}
			if (!ActiveButtons.view) {
				ActiveButtons.view = ActiveButtonsByDefault.view;
			}
			
			if (tbar.length) {
				$.each(tbar.find('.btn'), function(i, btn) {
					if (!$(btn).hasClass('clear')) {
						$(btn).removeClass('active');
						$(btn).children().first().prop('checked', false);
						
						$.each(ActiveButtons, function(j, activeBtnName) {
							if ($(btn).hasClass(activeBtnName)) {
								$(btn).addClass('active');
								$(btn).children().first().prop('checked', true);
							}
						});
					}
				});
				return true;
			}
			return false;
		};
		
		this.destroy = function() {
			ActiveButtons = {};
		};
		
		this.getDefaultState = function() {
			return ActiveButtonsByDefault;
		};
		
		this.getState = function() {
			return ActiveButtons;
		};
		
		this.setState = function(buttons) {
			if (buttons) {
				ActiveButtons = buttons;
				return true;
			}
			return false;
		};
	}
	
	// Animated appearance for all modals.
	$('.modal').on('show.bs.modal', function() {
		var open = $(this).attr('data-easein');
		if (open.length) {
			var velocityEaseIn = [ 'shake', 'pulse', 'tada', 'flash', 'bounce', 'swing' ];
			var velocityType = 'transition';
			
			for (var i = 0; i < velocityEaseIn.length; i++) {
				if (open == velocityEaseIn[ i ]) {
					velocityType = 'callout';
				}
			}
			
			$('.modal-dialog').velocity(velocityType + '.' + open);
		}
	});
	
	const modalAdd = $('#modal-add');
	const toolbar = new Toolbar(modalAdd);
	let toolbarState = {};
	const divFinder = $(this).find('#finder');
	const divTree = $(this).find('#tree');
	const divTreePane = divTree.find('.pane-tree');
	const divTreeProps = divTree.find('.pane-properties');
	let addSplit = '';
	
	// const finder = require('./assets/js/_finder');
	const finder = require('finderjs/index');
	const _ = require('finderjs/util');
	const tree = require('./assets/js/_jstree');
	const modalHeader = modalAdd.find('.modal-header');
	const modalFooter = modalAdd.find('.modal-footer');
	const breadcrumb = modalAdd.find('.breadcrumb');
	let isToolbarInited = false;
	
	let activeItem = null,
		activeItemId = null,
		activeItemParents = [];
	
	modalAdd
		.on('show.bs.modal', function() {
			const dataAdd = require('./assets/js/data-add');
			
			/**
			 * Calculate height for this modal to add as in-line style. This would keep height consistent
			 * when switching on toolbar
			 */
			function getDefaultModalHeight(modal) {
				var heightModal = 0;
				var getOuterHeight = function(el) {
					if (el.length) {
						return el.outerHeight();
					}
					return false;
				};
				var elements = [ '.modal-header', '.modal-body .breadcrumb', '.modal-footer' ];
				
				if (modal.length) {
					$.each(elements, function(i, val) {
						heightModal += getOuterHeight(modal.find(val));
					});
					
					// Finder/Tree default capacity - 15 items in column
					heightModal += ROW_HEIGHT * 15;
					// .modal-content top/bottom borders
					heightModal += 2;
					// .modal-body top/bottom borders
					heightModal += 2;
					
					return heightModal;
				}
				return false;
			}
			
			function setBreadcrumb(item) {
				if (breadcrumb.length > 0) {
					activeItemParents = [];
					breadcrumb.empty();
					
					if (typeof item === 'object') {
						// Add parents
						$.each(item.parent, function(i) {
							activeItemParents.push(String(item.parent[ i ].id));
							var li = $('<li/>')
								.attr({
									'id': item.parent[ i ].id,
									'role': 'listitem',
									'class': 'breadcrumb-link'
								})
								.appendTo(breadcrumb);
							
							if (i == 0) {
								// The very first breadcrumb item is non-clickable
								li
									.addClass('root')
									.text(item.parent[ i ].label)
								;
								
							} else {
								var a = $('<a/>')
									.attr({
										'role': 'button'
									})
									.text(item.parent[ i ].label)
									.appendTo(li)
								;
							}
						});
						
						//	Add current item
						$('<li/>')
							.attr({
								'id': item.id,
								'role': 'listitem',
								'class': 'breadcrumb-item'
							})
							.text(item.label)
							.appendTo(breadcrumb)
						;
					}
				}
			}
			
			function treeSetActiveNode(tree, itemId) {
				if (tree && itemId) {
					tree.jstree('deselect_all');
					tree.jstree('close_all');
					tree.jstree('select_node', itemId);
					return true;
				}
				return false;
			}
			
			function setBody(modal, data, btnType, btnName) {
				if (!modal.hasClass('active') || isToolbarInited) {
					let formattedDataType = (btnName.charAt(0).toUpperCase() + btnName.slice(1));
					formattedDataType = null;
					
					toolbarState = toolbar.getState();
					toolbarState[ btnType ] = btnName;
					toolbar.setState(toolbarState);
					
					function Item(item) {
						this.getPath = function() {
							let pathItems = [];
							const viewType = toolbarState.view;
							
							let rootItem = {
								id: 0,
								label: formattedDataType || i18next.t('home')
							};
							
							if (viewType) {
								if (viewType === 'finder' && divFinder) {
									const colClosest = $(item).closest('.fjs-col'),
										// Numbering cols from 1, not 0
										colNumber = colClosest.index() + 1;
									
									/*
									 * Prepare array of pathItems
									 * Parent for 1st col is just 'rootItem'
									 */
									if (colNumber > 1) {
										var prevCols = colClosest.prevAll().find('.fjs-active');
										
										$.each(prevCols, function(i, parentItem) {
											pathItems.push({
												id: Number(parentItem.id),
												label: parentItem.textContent
											});
										});
									}
								} else if (viewType === 'tree' && divTreePane) {
									
									var parents = item.parents;
									var tree = divTreePane.jstree(true);
									
									$.each(parents, function(i, parentId) {
										if (parentId != '#' && !Number.isNaN(parentId)) {
											var node = tree.get_node(parentId).original;
											pathItems.push({
												id: node.id,
												label: node.label
											});
										}
									});
									pathItems.reverse();
								} else {
									console.warn('Unknown view type.');
									pathItems = false;
								}
								if (rootItem) {
									pathItems.unshift(rootItem);
								}
								return pathItems;
							}
							console.warn('Warning', ' Parent of selected item cannot be established.');
							return false;
						};
						this.initObject = function() {
							if (item) {
								var obj = {};
								var pathItems = this.getPath();
								var id = '',
									label = '';
								
								if ($(item).context) {
									item = $(item).context;
									id = Number(item.id);
									label = item.textContent;
								} else if (item.original) {
									item = item.original;
									id = Number(item.id);
									label = item.label;
								} else {
									id = 'id unidentified.';
									label = 'label unidentified.';
								}
								
								obj.id = id;
								obj.label = label;
								
								if (pathItems.length > 0) {
									obj.parent = pathItems;
								}
								// console.log('obj:', obj);
								
								return obj;
							}
							return false;
						};
					}
					
					if (btnType === 'data') {
						let placeholder = 'Search';
						divFinder.empty();
						activeItemId = null;
						
						let currItem = null;
						
						if (btnName) {
							placeholder += ' ' + formattedDataType;
							
							// console.log('tree:', tree);
							
							if (tree.setStructure(data[ btnName ])) {
								function createItemContent(cfg, item) {
									var data = item.children || cfg.data;
									var frag = document.createDocumentFragment();
									var label = _.el('span');
									var iconPrependStackWrapper = _.el('span');
									var iconPrepend = _.el('i');
									var prependClasses = [ 'fa', 'fa-stack-1x' ];
									
									var iconInternal = _.el('i');
									var iconDownloadable = _.el('i');
									
									var iconAppendWrapper = _.el('span');
									var iconAppend = _.el('i');
									var appendClasses = [];
									
									/**
									 * Prepended Icon
									 */
									if (data) {
										prependClasses.push('fa-folder');
									} else if (item.type === 'series') {
										prependClasses.push('fa-line-chart');
									} else {
										prependClasses.push('fa-file-o');
									}
									_.addClass(iconPrepend, prependClasses);
									_.addClass(iconPrependStackWrapper, 'fa-stack');
									iconPrependStackWrapper.appendChild(iconPrepend);
									if (item.internal === true) {
										_.addClass(iconInternal, 'fa fa-lock fa-stack-2x');
										iconPrependStackWrapper.appendChild(iconInternal);
									}
									
									/**
									 * Text Label
									 */
									_.append(label, [ iconPrependStackWrapper, _.text(item.label) ]);
									frag.appendChild(label);
									
									/**
									 * Appended Icon
									 */
									if (data) {
										appendClasses.push('caret-right');
									}
									/* else {
									 appendClasses.push('fa-external-link');
									 }*/
									_.addClass(iconAppend, appendClasses);
									_.addClass(iconAppendWrapper, 'append');
									
									if (item.downloadable === true) {
										_.addClass(iconDownloadable, 'fa fa-arrow-circle-down downloadable');
										iconAppendWrapper.appendChild(iconDownloadable);
									}
									iconAppendWrapper.appendChild(iconAppend);
									frag.appendChild(iconAppendWrapper);
									
									return frag;
								}
								
								function createSimpleColumn(item) {
									var div = _.el('div.fjs-col.leaf-col');
									var row = _.el('div.leaf-row');
									var leafName = _.text(item.label);
									var i = _.el('i');
									var size = _.el('div.meta');
									var sizeLabel = _.el('strong');
									var mod = _.el('div.meta');
									var modLabel = _.el('strong');
									
									var properties = item.properties;
									
									_.addClass(i, 'fa');
									
									if (btnName === 'series') {
										if (properties) {
											var leafItems = [ i, leafName ];
											var getProperties = [];
											var node = null;
											
											_.addClass(i, 'fa-line-chart');
											
											for (var prop in properties) {
												if (prop) {
													var propObj = properties[ prop ];
													var control = propObj.controlType;
													
													if (control) {
														node = _.el(control.concat('.form-control.input-sm')
														                   .concat('.' + prop));
														
														switch (control) {
															case 'select': {
																$(propObj.value).each(function(i) {
																	node.options[ node.options.length ] = new Option(this.label, i);
																});
																getProperties.push(node);
																break;
															}
															case 'input': {
																node.value = numeral(propObj.value)
																	.format('0.000');
																getProperties.push(node);
																break;
															}
															default: {
															}
														}
													}
												}
											}
											
											leafItems = leafItems.concat(getProperties);
											_.append(row, leafItems);
										} else {
											_.addClass(i, 'fa-file-o');
											_.append(sizeLabel, _.text('Size: '));
											_.append(size, [ sizeLabel, _.text(item.size) ]);
											_.append(modLabel, _.text('Modified: '));
											_.append(mod, [ modLabel, _.text(item.modified) ]);
											_.append(row, [ i, leafName, size, mod ]);
										}
									} else if (btnName === 'formula') {
										// Create Property Panel
										if (row) {
											$(row)
												.append($('<div/>')
													.addClass('properties')
													.append($('<header/>')
														.append($('<h3/>')
															.append($('<code/>').text('%code%')
															)
														)
														.append($('<span/>')
															.append($('<small/>').text('small'))
															.append($('<button/>')
																.attr('type', 'button')
																.attr('data-toggle', 'collapse')
																.attr('href', '#finder-formula-help')
																.attr('aria-expanded', 'false')
																.attr('aria-controls', 'finder-formula-help')
																.addClass('btn help collapsed')
																.text('Help'))
														)
													)
													.append($('<dl/>')
														.append($('<dd/>')
															.attr('id', 'finder-formula-help')
															.addClass('collapse help')
															.append($('<dl/>')
																.append($('<dt/>')
																	.addClass('syntax')
																	.text('Syntax')
																)
																.append($('<dd/>')
																	.append($('<pre/>')
																		.append($('<code/>')
																			.addClass('excel')
																			.text('%code%')
																		)
																	)
																)
																.append($('<dt/>')
																	.addClass('description')
																	.text('Description')
																)
																.append($('<dd/>')
																	.text('%description%')
																)
															)
														)
														.append($('<dt/>')
															.addClass('apply-to')
															.text('Apply to:')
														)
														.append($('<dd/>')
															.addClass('pink-10')
															.text('text')
														)
													)
												)
											;
											
											$(row).find('header').find('small').hide();
											$(row).find('.apply-to').hide();
										}
										
										if (item.formula) {
											$(row).find('header').find('code').text(item.formula);
										}
										
										if (item.label != item.formula) {
											$(row).find('header').find('small').show().text(item.label);
										}
										
										if (item.syntax) {
											$(row).find('header').next('dl').find('.syntax').next('dd')
											      .children('pre')
											      .children('code')
											      .text(item.syntax);
										}
										
										if (item.definition) {
											$(row).find('header').next('dl').find('.description').next('dd')
											      .show()
											      .html(item.definition);
										}
										
										/*_.addClass(i, item.icon);
										 _.append(sizeLabel, _.text('Size: '));
										 _.append(size, [ sizeLabel, _.text(item.size) ]);
										 _.append(row, [ i, leafName, size ]);*/
										if (properties) {
											if ($(row).find('.apply-to').length) {
												$(row).find('.apply-to').show();
												$(row).find('.apply-to').next().text(item.properties);
											} else {
												console.error('"apply-to" doesn\'t exist.');
											}
										}
									}
									
									return _.append(div, row);
								}
								
								// Init FinderJS
								const container = divFinder[ 0 ];
								finder(container, tree.getStructure(), { createItemContent: createItemContent })
									.on('leaf-selected', function selected(item) {
										this.emit('create-column', createSimpleColumn(item));
										$('pre code').each(function(i, block) {
											hljs.highlightBlock(block);
										});
									})
									.on('column-created', function columnCreated() {
										container.scrollLeft = container.scrollWidth - container.clientWidth;
									})
									.on('item-selected', function(leaf) {
										const addButtonDisabled = leaf.item.classList.contains('fjs-has-children');
										
										activeItem = leaf.item._item;
										activeItemId = activeItem.id;
										
										currItem = new Item(activeItem);
										setBreadcrumb(currItem.initObject());
										
										$('.btn-group.add').children('button').each(function() {
											$(this).prop('disabled', addButtonDisabled);
										});
									})
								;
								// Init jsTree
								divTreePane
									.jstree('destroy')
									.jstree({
										core: {
											data: tree.getStructure(),
											themes: { stripes: true },
											html_titles: true,
											multiple: false
										},
										plugins: [ 'wholerow', 'themes', 'types', 'html_data' ]
									})
									.on('ready.jstree', function() {
										treeSetActiveNode(divTreePane, activeItemId);
										
										// Create Property Panel
										if (!divTreeProps.children('.properties').length) {
											divTreeProps
												.append($('<div/>')
													.addClass('properties')
													.append($('<header/>')
														.append($('<h3/>')
															.append($('<code/>').text('code')
															)
														)
														.append($('<span/>')
															.append($('<small/>').text('small'))
															.append($('<a/>')
																.attr('role', 'button')
																.attr('data-toggle', 'collapse')
																.attr('href', '#formula-help')
																.attr('aria-expanded', 'false')
																.attr('aria-controls', 'formula-help')
																.addClass('btn help collapsed')
																.text('Help'))
														)
													)
													.append($('<dl/>')
														.append($('<dd/>')
															.attr('id', 'formula-help')
															.addClass('collapse help')
															.append($('<dl/>')
																.append($('<dt/>')
																	.addClass('syntax')
																	.text('Syntax')
																)
																.append($('<dd/>')
																	.append($('<pre/>')
																		.append($('<code/>')
																			.addClass('excel')
																			.text('code')
																		)
																	)
																)
																.append($('<dt/>')
																	.addClass('description')
																	.text('Description')
																)
																.append($('<dd/>')
																	.text('Description text goes here.')
																)
															)
														)
														.append($('<dt/>')
															.addClass('apply-to')
															.text('Apply to:')
														)
														.append($('<dd/>')
															.addClass('pink-10')
															.text('text')
														)
													)
												)
											;
										}
										divTreeProps.children('.properties').hide();
									})
									.on('select_node.jstree', function(e, data) {
										activeItem = data.node;
										activeItemId = activeItem.original.id;
										// activeItemParents = activeItem.parents;
										
										currItem = new Item(activeItem);
										setBreadcrumb(currItem.initObject());
										
										if (data.node.parents.length > 1) {
											activeItemParents = data.node.parents.slice(0);
											activeItemParents.reverse().shift();
										}
										
										if (activeItem.children.length === 0) {
											divTreeProps.children('.zero').hide(0, function() {});
											
											if (btnName == 'series') {
											} else if (btnName == 'formula') {
												divTreeProps.children('.properties').show(0, function() {
													divTreeProps.find('header').find('code')
													            .text(data.node.original.formula);
													divTreeProps.find('header').find('small')
													            .text(data.node.original.label);
													divTreeProps.find('dl').find('.syntax').next().find('code')
													            .text(data.node.original.syntax);
													divTreeProps.find('dl').find('.description').next()
													            .html(data.node.original.definition);
												});
												
												$('pre code').each(function(i, block) {
													hljs.highlightBlock(block);
												});
											}
										} else {
											divTreeProps.children('.zero').show();
											divTreeProps.children('.properties').hide();
										}
									})
								;
							}
						}
						modalHeader.find('.search').find('.form-control').prop('placeholder', placeholder);
						
						/*if (activeItemId) {
						 divFinder.find('#' + activeItemId).click().find('a').focus();
						 } else {
						 divFinder.find('.fjs-item').first().click().find('a').focus();
						 }*/
						divFinder.find(activeItemId ? ('#' + activeItemId) : ('.fjs-item'))
						         .first().click()
						         .find('a').focus();
					} else if (btnType === 'view') {
						if (toolbarState[ btnType ] === 'finder') {
							divTree.hide(0, function() {
								if (activeItemParents.length > 0) {
									activeItemParents.push(activeItemId);
									$.each(activeItemParents, function(key, value) {
										divFinder.find('#' + value).click().find('a').focus();
									});
								} else {
									divFinder.find('#' + activeItemId).click().find('a').focus();
								}
							});
							divFinder.show();
						} else if (toolbarState[ btnType ] === 'tree') {
							divFinder.hide(0, function() {
								treeSetActiveNode(divTreePane, activeItemId);
							});
							divTree.show();
						}
					}
					return true;
				}
				return false;
			}
			
			if (dataAdd) {
				// Success 1
				const toolbarBtns = modalHeader.find('.toolbar').find('.btn');
				toolbarState = toolbar.getState();
				toolbarBtns.click(function(button) {
					const btnId = button.currentTarget.firstChild.id;
					let dataType = '',
						btnName = '';
					
					if (btnId.indexOf('-') > -1) {
						dataType = btnId.split('-')[ 0 ];
						btnName = btnId.split('-')[ 1 ];
					}
					
					if ($(this).hasClass(btnName)) {
						if (setBody($(this), dataAdd, dataType, btnName)) {}
					}
				});
				if (toolbar.init(toolbarState)) {
					isToolbarInited = true;
					const btnClicked = modalHeader.find('.toolbar').find('.btn.active').trigger('click');
					$.each(btnClicked, function(i) {
						if (i === (btnClicked.length - 1)) {
							isToolbarInited = false;
						}
					});
				}
				// Success 2
				divFinder.on('click', '.properties .btn.help', function() {
					$('#finder-formula-help').collapse('toggle');
				});
				modalAdd
					.find('.modal-dialog').css({ 'height': getDefaultModalHeight(modalAdd) })
					.draggable({
						handle: '.modal-header'
					})
					.on({
						'mousedown': function() {
							modalHeader.addClass('mouse-down');
						},
						'mouseup': function() {
							modalHeader.removeClass('mouse-down');
						}
					})
				;
				modalFooter.find('.btn-group.add').find('button').first().click(function() {
					// TODO: Modal's "Add" button.
					// FIXME: "Add" button is always enabled when in Tree view.
					console.log('"' + $(this).text() + '" button just clicked.');
				});
				$(breadcrumb).on('click', '> li', function(e) {
					if (!$(this).hasClass('breadcrumb-item') && !$(this).hasClass('root')) {
						var item = e.currentTarget;
						
						if (divFinder) {
							var array = activeItemParents.slice();
							var arrayLen = array.length;
							var arrayPos = array.indexOf(item.id) + 1;
							
							console.log('breadcrumb clicked:', item.textContent, item.id);
							
							if (arrayPos > 0) {
								// console.log('len:', arrayLen, 'pos:', arrayPos);
								array.splice(arrayPos, arrayLen - arrayPos);
							}
							
							// Remove Home breadcrumb element as it's not presented in Finder.
							// array.shift();
							
							console.log('array:', array);
							console.log('activeItemParents', activeItemParents);
							
							$.each(array, function(key, value) {
								divFinder.find('#' + value).click().find('a').focus();
							});
						}
						
						if (divTreePane) {
							treeSetActiveNode(divTreePane, item.id);
						}
					}
					return false;
				});
			} else {
				console.error('\'data-add.json\' failed to load.');
			}
		})
		.on('shown.bs.modal', function() {
			if (divTreePane.length && divTreeProps.length) {
				$(this).find('.modal-dialog').resizable({
					resize: function(event, ui) {
						// ui.size.width += ui.size.width - ui.originalSize.width;
						// ui.position.left = ui.originalPosition.left;
						// ui.size.width = (ui.size.width - ui.originalSize.width) * 1 + ui.originalSize.width;
						
						// console.log('ui.size.width', ui.size.width);
						// console.log('ui.originalSize.width', ui.originalSize.width);
					},
					minHeight: minModalHeight($(this)),
					maxHeight: maxModalHeight($(this)),
					minWidth: minModalWidth(),
					maxWidth: maxModalWidth($(this)),
					grid: [ 1, ROW_HEIGHT ]
				});
				
				addSplit = split(
					[ divTreePane[ 0 ], divTreeProps[ 0 ] ],
					{
						sizes: [ 66.7, 33.3 ],
						minSize: 200,
						gutterSize: 8
					}
				);
			}
		})
		.on('hide.bs.modal', function() {
			addSplit.destroy();
			$(this).find('.modal-header').find('.toolbar').find('.btn').off();
			activeItemParents = [];
		})
		.on('hidden.bs.modal', function() {
			toolbar.setState(toolbarState);
			$(this).data('bs.modal', null);
		})
	;
	
	var ioSplit;
	var ioGrid;
	
	$('#modal-io')
		.on('show.bs.modal', function() {
			$(this).find('.modal-body').css({
				'min-height': ROW_HEIGHT * ROW_MIN_COUNT + 'px'
			});
			$(this).find('.modal-header').find('h4').text('Open');
			$(this).find('.modal-footer').find('.btn-primary').text('Open');
			
			const tree = require('./assets/js/_jstree');
			
			
			/*$.getJSON(dataFile, function(f) {
				f = f.folders;
				structure = getCurrentLevel(f);
			})*/
			const dataFolders = require('./assets/js/data-folders');
			
			if (dataFolders) {
				tree.loadFolders(dataFolders);
				const ioDataView = new Slick.Data.DataView();
				const ioCols = [
					{
						'id': '_name',
						'name': 'Name',
						'field': 'text',
						'cssClass': 'io-name',
						'width': 340,
						'sortable': true,
						'formatter': function(row, cell, value, columnDef, dataContext) {
							var icon = '<span class="fa-stack"><i class="' + dataContext.icon + '"></i></span>';
							return icon + value;
						}
					},
					{
						'id': '_type',
						'name': 'Type',
						'field': 'type',
						'cssClass': 'io-type',
						'minWidth': 130,
						'width': 130,
						'sortable': true,
						'formatter': function(row, cell, value) {
							return value;
						}
					},
					{
						'id': '_dateModified',
						'name': 'Date modified',
						'field': 'dateModified',
						'cssClass': 'io-date-modified',
						'width': 170,
						'sortable': true,
						'formatter': function(row, cell, value) {
							return value;
						}
					}
				];
				const options = {
					autoHeight: true,
					enableCellNavigation: true,
					enableColumnReorder: false,
					fullWidthRows: true,
					forceFitColumns: true,
					headerrowHeight: ROW_HEIGHT,
					rowHeight: ROW_HEIGHT
				};
				
				$('#js-tree')
					.jstree({
						core: {
							data: tree.getStructure(),
							multiple: false
						},
						plugins: [ 'wholerow' ]
					})
					.on('changed.jstree', function(e, data) {
						// console.log('data:',data);
						console.log('tree.getChildren:', tree.getChildren(data.selected));
						ioDataView.setItems(tree.getChildren(data.selected, data.node.parents));
						ioGrid = new Slick.Grid('#grid-saved-charts', ioDataView, ioCols, options);
					})
				;
			} else {
				console.error('\'data-folder.json\' failed to load.');
			}
			
			/*tree.loadFolders('./assets/js/data-folders.json')
			    .done(function() {
				    
			    })
			    .fail(function() {
				    console.error('failed to load.');
			    })
			;*/
		})
		.on('shown.bs.modal', function() {
			if ($('#js-tree').length && $('#grid-saved-charts').length) {
				$(this)
					.find('.modal-dialog').resizable({
					resize: function(event, ui) {
						// ui.size.width += ui.size.width - ui.originalSize.width;
						// ui.position.left = ui.originalPosition.left;
						// ui.size.width = (ui.size.width - ui.originalSize.width) * 1 + ui.originalSize.width;
					},
					minHeight: minModalHeight($(this)),
					maxHeight: maxModalHeight($(this)),
					minWidth: minModalWidth(),
					maxWidth: maxModalWidth($(this)),
					grid: [ 1, ROW_HEIGHT ]
				})
				/*.find('.modal-body').enhsplitter({
				 minSize: 100,
				 position: '33.33%',
				 collapse: 'none'
				 }
				 )*/
				;
				ioSplit = split(
					[ '#js-tree', '#grid-saved-charts' ],
					{
						sizes: [ 33.3, 66.7 ],
						minSize: 200,
						gutterSize: 8
					}
				);
			}
		})
		.on('hide.bs.modal', function() {
			ioSplit.destroy();
		})
		.on('hidden.bs.modal', function() {
			$(this).data('bs.modal', null);
			$.jstree.destroy();
			if (ioGrid) {
				ioGrid.destroy();
			}
		})
	;
	
	/**
	 * Colorselector
	 */
	require('bootstrap-colorselector/lib/bootstrap-colorselector-0.2.0/js/bootstrap-colorselector');
	const
		colorselector = $('.colorselector'),
		colorselectorMenu = colorselector.next().find('.dropdown-toggle')
	;
	
	colorselector.colorselector();
	
	if (colorselectorMenu.length) {
		colorselectorMenu.append('<span class="caret"></span>');
	}
	
	/**
	 * TouchSpin +/- rocker
	 */
	$('.properties').find('input[type=number]').each(function() {
		const identifiedInput = $(this);
		const properties = identifiedInput.closest('.properties');
		const enableTouchSpin = function(item, initval, min, max) {
			require('bootstrap-touchspin');
			
			const options = {};
			const targetedInput = properties.hasClass(item);
			
			if (initval) options.initval = initval;
			if (min) options.min = min;
			if (max) options.max = max;
			if (targetedInput && options) return identifiedInput.TouchSpin(options);
			
			return false;
		};
		
		enableTouchSpin('format-line', 1, 1, 10);
		enableTouchSpin('format-point', 1, 1, 20);
		enableTouchSpin('axis', 1, 1, 10);
		enableTouchSpin('precision', 1, 1, 10);
	});
	
	/**
	 * nav-tabs collapsible
	 */
	$('.nav-tabs')
		.on('dblclick', 'li[role="presentation"]', function() {
			$(this).parent().toggleClass('nav-tabs-collapsed');
		})
		.on('click', 'li.chevron', function() {
			$(this).parent().toggleClass('nav-tabs-collapsed');
		})
	;
});