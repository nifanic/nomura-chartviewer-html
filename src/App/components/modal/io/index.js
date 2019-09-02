import "jquery-ui/ui/widgets/resizable";
import "jquery-ui/ui/widgets/draggable";
import * as jsTree from "../../_shared/jstree";
import moment from "moment";

import Split from "split.js";
import {
	getViewport,
	maxModalHeight,
	maxModalWidth,
	minModalHeight,
	minModalWidth
} from "../../helpers";
import { ROW_HEIGHT, ROW_MIN_COUNT } from "../constants";
import { DATA_IO_ALL, DATA_IO_PARENTS, LABEL_UNKNOWN_FULL } from "./constants";
import dataEntryPoint from "./folders";

const viewport = getViewport();

class ModalIo {
	constructor() {
		/**
		 * Prepare sample data.
		 * @param {string} mode=DATA_IO_PARENTS - Can be either `DATA_IO_ALL`, to get both parents and children,
		 * or `DATA_IO_PARENT`, to get parents only.
		 * @return {undefined|Array}
		 */
		this.data = (mode = DATA_IO_PARENTS) => {
			const rawDataWithId = jsTree.setStructure(
				Object.values(dataEntryPoint.folders)
			);
			if (dataEntryPoint) {
				switch (mode) {
					case DATA_IO_ALL:
						return rawDataWithId;
					case DATA_IO_PARENTS:
						return jsTree.hideChildren(rawDataWithId);
					default:
						throw `${mode}: unknow data mode.`;
				}
			}
			throw `Sample data not loaded.`;
		};
		this.modalIo = $("#modal-io");
		this.divTree = this.modalIo.find("#ioTree");
		this.divGrid = this.modalIo.find("#ioGrid");
		this.split = undefined;
		this.grid = undefined;
		this.defaultNodeId = undefined;
	}

	show() {
		const { modalIo, divTree, divGrid } = this;
		modalIo
			.on("show.bs.modal", () => {
				modalIo.find(".modal-body").css({
					"min-height": ROW_HEIGHT * ROW_MIN_COUNT + "px"
				});
				modalIo.find(".modal-header h4").text("Open");
				modalIo.find(".modal-footer .btn-primary").text("Open");

				const dataView = new Slick.Data.DataView();
				const cols = [
					{
						id: "_name",
						name: "Name",
						field: "text",
						cssClass: "io-name",
						width: 340,
						sortable: true,
						formatter: (row, cell, value, columnDef, dataContext) => {
							const icon = `<span class="fa-stack"><i class="${dataContext.icon}"></i></span>`;
							return icon + value;
						}
					},
					{
						id: "_type",
						name: "Type",
						field: "type",
						cssClass: "io-type",
						minWidth: 130,
						width: 130,
						sortable: true,
						formatter: (row, cell, value) => value
					},
					{
						id: "_dateModified",
						name: "Date modified",
						field: "dateModified",
						cssClass: "io-date-modified",
						width: 170,
						sortable: true,
						formatter: (row, cell, value) => {
							if (value) {
								const formattedD = moment(value).format("MMM D, YYYY, h:mm");
								// Get AM/PM less last char to meet "11:30a" format
								const am_pm = moment(value).format("a");
								const a_p = am_pm.substring(0, am_pm.length - 1);
								return formattedD + a_p;
							}
							return LABEL_UNKNOWN_FULL;
						}
					}
				];
				const options = {
					autoHeight: true,
					enableCellNavigation: true,
					enableColumnReorder: false,
					fullWidthRows: true,
					autosizeColsMode: true,
					headerrowHeight: ROW_HEIGHT,
					rowHeight: ROW_HEIGHT
				};
				const updateGridData = nodes => {
					if (Array.isArray(nodes) && nodes.length) {
						const fixedNodeShape = [];
						nodes.map(node => {
							// Checking shape: if required fields are not presented, add it with null value.
							// SlickGrid cannot process nodes with absent required fields.
							fixedNodeShape.push(jsTree.fixNodeShape(node));
						});
						if (fixedNodeShape) {
							dataView.setItems(fixedNodeShape);
							this.grid.resetActiveCell();
							this.grid.setData(dataView);
							this.grid.render();
						}
					}
				};

				this.grid = new Slick.Grid("#ioGrid", dataView, cols, options);

				// Relative position required to stop horizontal scroll of modal body
				divGrid.css({ position: "relative" });
				this.grid.onDblClick.subscribe((row, cell) => {
					const currentData = cell.grid.getData();
					const currentItem = currentData.getItem(cell.row);
					updateGridData(currentItem.children);
					divTree.jstree(true).deselect_all();
					divTree.jstree(true).select_node(currentItem.id);
				});

				divTree
					.jstree({
						core: {
							data: this.data(DATA_IO_PARENTS),
							multiple: false
						},
						plugins: ["wholerow", "search"]
					})
					.on("loaded.jstree", (element, callback) => {
						// Appoint default node, and select it in Tree
						if (!this.defaultNodeId) {
							const {
								instance: {
									settings: {
										core: { data: treeData }
									}
								}
							} = callback;
							if (Array.isArray(treeData)) {
								const { id } = treeData.find(node => node.text === "My Charts");
								this.defaultNodeId = id;
							}
						}
						if (this.defaultNodeId) {
							divTree.jstree(true).select_node(this.defaultNodeId);
						}
					})
					.on("changed.jstree", (e, { node }) => {
						if (node) {
							const { id, parents } = node;
							const pathToCurrentItem = [id, ...parents].reverse();
							const children = jsTree.getChildren(pathToCurrentItem);

							updateGridData(children);
							this.defaultNodeId = id;
						}
					});
			})
			.on("shown.bs.modal", () => {
				if (divTree.length && divGrid.length) {
					modalIo.find(".modal-dialog").resizable({
						resize: (/*event, ui*/) => {
							// ui.size.width += ui.size.width - ui.originalSize.width;
							// ui.position.left = ui.originalPosition.left;
							// ui.size.width = (ui.size.width - ui.originalSize.width) * 1 + ui.originalSize.width;
						},
						minHeight: minModalHeight(modalIo),
						maxHeight: maxModalHeight(modalIo, viewport),
						minWidth: minModalWidth(viewport),
						maxWidth: maxModalWidth(modalIo, viewport),
						grid: [1, ROW_HEIGHT]
					});
					this.split = Split([divTree[0], divGrid[0]], {
						sizes: [33.3, 66.7],
						minSize: 200,
						gutterSize: 5
					});
				}
			})
			.on("hide.bs.modal", () => {})
			.on("hidden.bs.modal", () => {
				modalIo.data("bs.modal", null);
				this.destroy();
			})
			.modal("show");
	}

	destroy() {
		const { modalIo, divTree, split, grid } = this;
		divTree.jstree("destroy");
		split && split.destroy();
		grid && grid.destroy();
		modalIo.off();
	}
}

export let modalIo = new ModalIo();
