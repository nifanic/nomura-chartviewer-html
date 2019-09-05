/**
 * Created by nifanic on 2019-09-04.
 */
import numeral from "numeral";
import Raphael from "raphael";
import Highcharts from "highcharts/highstock";
import dataHighchart from "./highcharts-eg1";
import { getViewport } from "../helpers";

import exporting from "highcharts/modules/exporting";
exporting(Highcharts);
// require('highcharts/modules/canvas-tools')(Highcharts);
// require('export-csv');
// require('jspdf/dist/jspdf.min');

const getMaxId = (arr, prop) => {
	let maxId;
	if (arr && arr.length > 0) {
		for (let i = 0; i < arr.length; i++) {
			if (!maxId || parseInt(arr[i][prop]) > parseInt(maxId[prop])) {
				maxId = arr[i];
			}
		}
	} else {
		maxId = { id: 1 };
	}
	return maxId;
};

/**
 * Counting with A, B, C, D instead of 0, 1, 2, 3, …
 * @param {number} num
 * @return {string}
 */
const getVarAlphaName = num => {
	const mod = num % 26;
	let pow = (num / 26) | 0;
	const out = mod ? String.fromCharCode(64 + mod) : (pow--, "Z");
	return pow ? getVarAlphaName(pow) + out : out;
};

export function highchart() {
	const chartDiv = $("#chartviewer");
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
					text: "Runtime Title"
				}
			}
		},
		credits: {
			enabled: true,
			href: "https://www.nomura.com/",
			text: "Source: <b>Nomura</b>",
			position: {
				x: -4
			}
		},
		title: {
			text: "FX spot rate JPY-GBP",
			style: {
				fontSize: "18px",
				fontWeight: "bold",
				color: "#9d9d9d"
			}
		},
		subtitle: {
			text: "Subtitle",
			style: {
				fontSize: "14px",
				fontWeight: "normal",
				color: "#9d9d9d"
			}
		},
		chart: {
			backgroundColor: "transparent",
			zoomType: "x",
			style: {
				fontFamily: "inherit"
			},
			spacing: [15, 4, 0, 0]
		},
		xAxis: {
			type: "datetime",
			labels: {}
		},
		yAxis: [
			{
				title: {
					text: null,
					style: {
						fontWeight: "bold",
						color: "#9d9d9d"
					},
					margin: 20
				},
				labels: {
					align: "right",
					format: "{value:.4f}",
					formatter: function() {
						return numeral(this.value)
							.multiply(1)
							.format("0,0.0");
					}
				}
			},
			{
				title: {
					text: "USD 2y/10y spread",
					style: {
						fontWeight: "bold"
					},
					margin: 20
				},
				labels: {
					align: "left",
					format: "{value:.4f}",
					formatter: function() {
						return numeral(this.value)
							.multiply(1)
							.format("0,0");
					}
				},
				opposite: true
			}
		],
		rangeSelector: {
			selected: 5,
			enabled: true,
			buttonTheme: {
				fill: "transparent",
				width: 31,
				height: 17,
				stroke: "none",
				"stroke-width": 0,
				r: 3,
				padding: 2,
				style: {
					color: "black",
					fontWeight: "normal",
					fontSize: "12px"
				},
				states: {
					hover: {
						fill: "transparent",
						stroke: "#b6b6b6",
						"stroke-width": 1
					},
					select: {
						fill: "transparent",
						stroke: "#b6b6b6",
						"stroke-width": 1,
						style: {
							color: "#b6b6b6",
							fontWeight: "normal",
							cursor: "default"
						}
					}
				}
			},
			buttonSpacing: 0,
			buttons: [
				{
					type: "month",
					count: 1,
					text: "1M"
				},
				{
					type: "month",
					count: 3,
					text: "3M"
				},
				{
					type: "month",
					count: 6,
					text: "6M"
				},
				{
					type: "ytd",
					text: "YTD"
				},
				{
					type: "year",
					count: 1,
					text: "1Y"
				},
				{
					type: "all",
					text: "ALL"
				}
			],
			buttonPosition: {
				// y: 0
			},
			labelStyle: {
				color: "#b6b6b6",
				fontWeight: "normal",
				fontSize: "12px"
			},
			inputBoxBorderColor: "#b6b6b6",
			inputStyle: {
				color: "black"
			},
			inputPosition: {
				// y: 0,
				verticalAlign: "top"
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
						[
							0,
							Highcharts.Color(Highcharts.getOptions().colors[0])
								.setOpacity(0.15)
								.get("rgba")
						],
						[
							1,
							Highcharts.Color(Highcharts.getOptions().colors[0])
								.setOpacity(0)
								.get("rgba")
						]
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
			maskFill: "rgba(0,0,0,.1)",
			series: {
				includeInCSVExport: false,
				type: "line",
				color: "black"
			},
			handles: {
				backgroundColor: "#f3f3f3"
			}
		}
	};
	const {
		title: { text: title },
		chart
	} = chartOptions;

	Highcharts.setOptions({
		colors: [
			"#c72420",
			"#00305c",
			"#00713b",
			"#737373",
			"#00677a",
			"#d9b640",
			"#80003f",
			"#979200",
			"#80a6ab",
			"#c98a19"
		]
	});
	chart.spacingTop = title.length ? 30 : 15;

	if (dataHighchart) {
		const { series } = dataHighchart;
		const updatedChartOptions = {
			...chartOptions,
			...(series && {
				series: series.reduce((newSeries, serie) => {
					const data = () => {
						const { data: datas } = serie;
						if (datas && datas.length) {
							return datas.reduce((newDatas, data) => {
								const date = new Date(data.date);
								newDatas.push([
									Date.UTC(
										date.getUTCFullYear(),
										date.getUTCMonth(),
										date.getUTCDate()
									),
									data.value
								]);
								return newDatas;
							}, []);
						}
						return "";
					};
					newSeries.push({
						...serie,
						type: "line",
						data: data()
					});
					return newSeries;
				}, [])
			})
		};
		const hichart = new Highcharts.chart(
			chartDiv.attr("id"),
			updatedChartOptions
		);

		// Resizable for Highchart
		if (chartDiv.length) {
			try {
				chartDiv.resizable({
					handles: "s"
				});

				const p = new Raphael(chartDiv.find(".ui-resizable-handle")[0], 32, 9);
				const border = p.rect(0.5, 0.5, 31, 8);
				const line = p.path("M12 3.5h8m-8 2h8");

				border.node.id = "line-border";
				border.attr({
					fill: "#f3f3f3",
					stroke: "#b6b6b6",
					"stroke-width": 1
				});
				line.node.id = "line-lines";
				line.attr({
					fill: null,
					stroke: "#b6b6b6",
					"stroke-width": 1
				});
			} catch (e) {
				console.error("Problem with resizing chart.", e);
			}
		}

		const chartResize = chart => {
			chart.setSize(chartDiv.parent().width(), null, false);
		};

		/**
		 * SlickGrid
		 */
		require("slickgrid/lib/jquery.event.drag-2.3.0");
		require("slickgrid/slick.core");
		require("slickgrid/slick.grid");
		require("slickgrid/slick.dataview");

		require("slickgrid/slick.formatters");
		require("slickgrid/plugins/slick.checkboxselectcolumn");
		require("slickgrid/plugins/slick.rowselectionmodel");
		require("slickgrid/controls/slick.columnpicker");

		const data = [];
		for (let i = 0; i < series.length; i++) {
			const { expression, color, name, yAxis } = series[i];
			data.push({
				id: i,
				key: "",
				var: getVarAlphaName(i + 1),
				expression,
				color,
				name,
				yAxis,
				action: "showhide"
			});
		}

		const dataView = new Slick.Data.DataView();
		const cols = [
			{
				id: "key",
				name: "Key",
				field: "key",
				cssClass: "key",
				"min-width": 60,
				width: 60,
				formatter: function() {
					return "<hr/>";
				}
			},
			{
				id: "_var",
				name: "Var",
				field: "var",
				cssClass: "var",
				minWidth: 60,
				width: 60,
				sortable: true,
				formatter: function(row, cell, value) {
					return (
						'<input class="form-control input-sm" type="text" value="' +
						value +
						'" />'
					);
				}
			},
			{
				id: "_expression",
				name: "Expression",
				field: "expression",
				cssClass: "expression",
				width: 312,
				formatter: function(row, cell, value) {
					return (
						'<input class="form-control input-sm clearable" type="text" value="' +
						value +
						'" />'
					);
				}
			},
			{
				id: "_name",
				name: "Name",
				field: "name",
				cssClass: "name",
				width: 312,
				formatter: function(row, cell, value) {
					return (
						'<input class="form-control input-sm clearable-" type="text" value="' +
						value +
						'" />'
					);
				}
			},
			{
				id: "_yaxis",
				name: "Axis",
				field: "yAxis",
				cssClass: "axis",
				resizable: false,
				width: 62,
				formatter: function(row, cell, value) {
					let yAxisLeft, yAxisRight;

					switch (value) {
						case 0:
							yAxisLeft = [" active", " checked"];
							yAxisRight = ["", ""];
							break;
						case 1:
							yAxisLeft = ["", ""];
							yAxisRight = [" active", " checked"];
					}

					return `<div class="btn-group" data-toggle="buttons"><label class="btn btn-default btn-sm${
						yAxisLeft[0]
					}"><input
	type="radio"
	name="options"
	id="axis-left"
	autocomplete="off"
	${yAxisLeft[1]}
>L</label><label class="btn btn-default btn-sm${yAxisRight[0]}"><input
	type="radio"
	name="options"
	id="axis-right"
	autocomplete="off"
	${yAxisRight[1]}
>R</label></div>`;
				}
			},
			{
				id: "_action",
				name: "Action",
				field: "action",
				cssClass: "action",
				minWidth: 100,
				width: 100,
				formatter: function(row, cell, value, columnDef, dataContext) {
					return (
						'<button type="button" class="btn btn-default showhide" data-toggle="button" aria-pressed="false"><span class="fa fa-eye"></span></button>' +
						'<button type="button" class="btn btn-default duplicate"><span class="fa fa-files-o"></span></button>' +
						'<button type="button" class="btn btn-default delete" id="' +
						dataContext.id +
						'"><span class="fa' +
						' fa-trash-o"></span></button>'
					);
				}
			}
		];
		const slickGridOptions = {
			autoHeight: true,
			enableCellNavigation: true,
			enableColumnReorder: false,
			fullWidthRows: true,
			forceFitColumns: true,
			headerrowHeight: 28,
			rowHeight: 30
		};
		const checkboxSelector = new Slick.CheckboxSelectColumn({
			cssClass: "checkbox-select",
			width: 39
		});

		cols.unshift(checkboxSelector.getColumnDefinition());
		dataView.setItems(data);

		const grid = new Slick.Grid(
			"#sgrid-expressions",
			dataView,
			cols,
			slickGridOptions
		);

		grid.setSelectionModel(
			new Slick.RowSelectionModel({ selectActiveRow: false })
		);
		grid.registerPlugin(checkboxSelector);
		dataView.syncGridSelection(grid, true, true);

		grid.onSelectedRowsChanged.subscribe(function() {
			const numRowsTotal = data.length,
				numRowsSelected = grid.getSelectedRows().length,
				checkboxAllSelected = $("#sgrid-expressions")
					.find(".slick-header-column")
					.find("input[type=checkbox]"),
				dropdownActions = $("#series")
					.find("header")
					.find(".actions > button.dropdown-toggle");

			if (numRowsTotal > numRowsSelected && numRowsSelected !== 0) {
				checkboxAllSelected.prop("indeterminate", true);
				dropdownActions.prop("disabled", false);
			} else if (numRowsTotal === numRowsSelected) {
				dropdownActions.prop("disabled", false);
			} else {
				checkboxAllSelected.prop("indeterminate", false);
				dropdownActions.prop("disabled", true);
			}
		});

		$(".toolbar")
			.find("button.container-type")
			.click(function() {
				$(this)
					.find("i")
					.toggleClass(function() {
						if ($(this).hasClass("fa-expand")) {
							$(this).removeClass("fa-expand");
							return "fa-compress";
						} else {
							$(this).removeClass("fa-compress");
							return "fa-expand";
						}
					});
				chartDiv.parent().toggleClass(function() {
					if ($(this).hasClass("container")) {
						$(this).removeClass("container");
						return "container-fluid";
					} else {
						$(this).removeClass("container-fluid");
						return "container";
					}
				});
				chartResize(hichart);
			});

		$("#series ")
			.find(".toolbar")
			.children("button.add-row")
			.click(function() {
				let nextId = getMaxId(data, "id").id;
				nextId++;
				data.push({
					id: nextId,
					key: "",
					var: getVarAlphaName(nextId),
					expression: "",
					color: "",
					name: "",
					yAxis: 0,
					action: "showhide"
				});

				if ($(".grid-canvas").hasClass("empty")) {
					$(this)
						.removeClass("empty")
						.css({ display: "" })
						.find("div")
						.remove();
				}

				dataView.setItems(data);
				grid.updateRowCount();
				grid.render();

				$("#sgrid-expressions")
					.find(".slick-header-column")
					.find("input:checkbox")
					.removeProp("disabled");

				if (data.length === 1) {
					grid.setSelectedRows([]);
				}
			});

		$(".grid-canvas")
			.on("click", "button.showhide", function() {
				const icon =
					"fa fa-" + ($(this).hasClass("active") ? "eye" : "eye-slash");
				$(this)
					.children()
					.first()
					.removeClass()
					.addClass(icon);
			})
			.on("click", "button.duplicate", function() {
				// TODO: "Expressions" Tab: row duplication to implement
			})
			.on("click", "button.delete", function() {
				const id = $(this).attr("id");

				dataView.deleteItem(id);
				grid.invalidate();
				grid.render();

				if (!data.length) {
					grid.invalidateAllRows();
					$(".grid-canvas")
						.addClass("empty")
						.html(
							'<div>Nothing to show. To add series, please click <span class="button-like"><i class="fa fa-plus"></i> Add Row</span> button above.</div>'
						)
						.css({ display: "table", height: "" });
					$("#sgrid-expressions")
						.find(".slick-header-column")
						.find("input:checkbox")
						.prop("disabled", "disabled");
					$("#series")
						.find("header")
						.find(".actions > button.dropdown-toggle")
						.prop("disabled", "disabled");
				}
			})
			.bind("mousewheel DOMMouseScroll", function(e) {
				if ($(".grid-canvas").hasScrollBar()) {
					const {
						originalEvent: { wheelDelta, detail }
					} = e;
					const delta = wheelDelta || -detail;
					$(this).scrollTop += (delta < 0 ? 1 : -1) * 30;
					e.preventDefault();
				}
			});
		$("#series")
			.children("header")
			.on("click", ".actions .remove-selected", function() {
				const selectedRows = grid.getSelectedRows();
				const selectedRowsIds = dataView.mapRowsToIds(selectedRows.sort());

				for (let i = 0; i < selectedRows.length; i++) {
					const d = selectedRowsIds[i];
					if (d) {
						dataView.deleteItem(d);
						grid.invalidate();
						grid.updateRowCount();
						grid.render();
					}
				}
			});

		$("button.print").on("click", () => {
			hichart.setTitle({ text: "Runtime Title" });
			hichart.print();
		});

		$(window).resize(() => {
			chartResize(hichart);
			getViewport();
		});
	}
}
