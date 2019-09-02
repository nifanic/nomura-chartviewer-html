import i18next from "../../i18next";
import "jquery-ui/ui/widgets/resizable";
import "jquery-ui/ui/widgets/draggable";
import Finder from "finderjs";
import _ from "finderjs/util";
import * as jsTree from "../../_shared/jstree";
import Split from "split.js";
import hljs from "highlight.js/lib/highlight";
import hljsExcel from "highlight.js/lib/languages/excel";
import {
	capitalizeFirstChar,
	getDefaultModalHeight,
	getViewport,
	maxModalHeight,
	maxModalWidth,
	minModalHeight,
	minModalWidth
} from "../../helpers";
import { ROW_HEIGHT, ROW_MIN_COUNT } from "../constants";
import {
	MODAL_ADD_DATA,
	MODAL_ADD_VIEW,
	MODAL_ADD_DATA_SERIES,
	MODAL_ADD_DATA_FORMULA,
	MODAL_ADD_VIEW_FINDER,
	MODAL_ADD_VIEW_TREE
} from "./constants";
import dataAdd from "./add";
import { tmplProps } from "./templates";

const viewport = getViewport();

export class ModalAdd {
	constructor() {
		hljs.registerLanguage("excel", hljsExcel);
		/**
		 * Adds "id" prop to dataAdd.
		 * @param {string} type - MODAL_ADD_DATA_SERIES, MODAL_ADD_DATA_FORMULA, or "" (both).
		 * @return {*}
		 */
		this.data = (type = "") => {
			if (["", MODAL_ADD_DATA_SERIES, MODAL_ADD_DATA_FORMULA].includes(type)) {
				const data = Object.keys(dataAdd)
					.filter(key => (type ? key === type : key))
					.reduce((obj, key) => {
						return { ...obj, [key]: jsTree.setStructure(dataAdd[key]) };
					}, {});
				const { length } = Object.keys(data);
				if (length) {
					return length > 1 ? data : data[type];
				}
			}
			throw `Unknown type: ${type}.`;
		};
		this.modalAdd = $("#modal-add");
		this.toolbar = new Toolbar(this.modalAdd);
		this.toolbarState = {};
		this.divFinder = this.modalAdd.find("#finder");
		this.divTree = this.modalAdd.find("#tree");
		this.divTreePane = this.divTree.find(".pane-tree");
		this.divTreeProps = this.divTree.find(".pane-properties");
		this.modalHeader = this.modalAdd.find(".modal-header");
		this.modalFooter = this.modalAdd.find(".modal-footer");
		this.breadcrumb = this.modalAdd.find(".breadcrumb");
		this.isToolbarInited = false;
		this.addSplit = undefined;
		this.finderEmitter = null;
		this.addButtonDisabled = false;
		//
		this.activeItem = null;
		// TODO: Use "activeItem" for "id" and "parent". Below two vars to be deleted
		this.activeItemId = null;
		this.activeItemParents = [];
	}

	/**
	 * Init FinderJS
	 * @param {string} dataType - "series" (default) or "formula".
	 */
	initFinder(dataType = MODAL_ADD_DATA_SERIES) {
		const { divFinder, propertiesToHtmlControls } = this;
		let { addButtonDisabled } = this;
		const createItemContent = (cfg, item) => {
			const data = item.children || cfg.data;
			const frag = document.createDocumentFragment();
			const label = _.el("span");
			const iconPrependStackWrapper = _.el("span");
			const iconPrepend = _.el("i");
			const prependClasses = ["fa", "fa-stack-1x"];
			const iconInternal = _.el("i");
			const iconDownloadable = _.el("i");
			const iconAppendWrapper = _.el("span");
			const iconAppend = _.el("i");
			const appendClasses = [];

			/**
			 * Prepended Icon
			 */
			if (data) {
				prependClasses.push("fa-folder");
			} else if (item.type === MODAL_ADD_DATA_SERIES) {
				prependClasses.push("fa-line-chart");
			} else {
				prependClasses.push("fa-file-o");
			}

			_.addClass(iconPrepend, prependClasses);
			_.addClass(iconPrependStackWrapper, "fa-stack");
			iconPrependStackWrapper.appendChild(iconPrepend);
			if (item.internal) {
				_.addClass(iconInternal, "fa fa-lock fa-stack-2x");
				iconPrependStackWrapper.appendChild(iconInternal);
			}

			/**
			 * Text Label
			 */
			_.append(label, [iconPrependStackWrapper, _.text(item.label)]);
			frag.appendChild(label);

			/**
			 * Appended Icon
			 */
			data && appendClasses.push("caret-right");
			_.addClass(iconAppend, appendClasses);
			_.addClass(iconAppendWrapper, "append");

			if (item.hasOwnProperty("downloadable") && item.downloadable) {
				_.addClass(iconDownloadable, "fa fa-arrow-circle-down downloadable");
				iconAppendWrapper.appendChild(iconDownloadable);
			}
			iconAppendWrapper.appendChild(iconAppend);
			frag.appendChild(iconAppendWrapper);

			return frag;
		};
		const createSimpleColumn = item => {
			const { label, icon, properties, definition, formula, syntax } = item;
			if ([MODAL_ADD_DATA_SERIES, MODAL_ADD_DATA_FORMULA].includes(dataType)) {
				const tmpl = $(
					tmplProps(dataType, {
						icon,
						label,
						properties: propertiesToHtmlControls(properties),
						formula,
						syntax,
						definition
					})
				)[0];
				return _.append(_.el("div.fjs-col.leaf-col.properties"), tmpl);
			}
		};
		const container = divFinder[0];
		/**
		 * .empty() facilitates "dataType" change, from "Series" to "Formula".
		 * Otherwise, Finder will not be updating with new data.
		 */
		divFinder.empty();
		this.finderEmitter && this.finderEmitter.removeAllListeners();

		if (container && Finder) {
			this.finderEmitter = Finder(container, jsTree.getStructure(), {
				createItemContent,
				labelKey: "id"
			});
			this.finderEmitter
				.on("leaf-selected", item => {
					this.finderEmitter.emit("create-column", createSimpleColumn(item));
					container
						.querySelectorAll(".syntax + dd > code")
						.forEach(codeElement => {
							hljs.highlightBlock(codeElement);
						});
					/**
					 * @type {jQuery | HTMLElement}
					 */
					const helpBtn = $(".properties .btn.help");
					$("#formulaHelp").collapse("hide");
					helpBtn.off();
					helpBtn.on("click", () => {
						$("#formulaHelp").collapse("toggle");
					});
				})
				.on("column-created", () => {
					container.scrollLeft = container.scrollWidth - container.clientWidth;
				})
				.on("item-selected", ({ col, item }) => {
					const { _item, classList } = item;
					addButtonDisabled = classList.contains("fjs-has-children");

					this.activeItem = {
						..._item,
						col,
						parents: [
							...container.querySelectorAll(".fjs-has-children.fjs-active")
						].map(parent => parent._item.id.toString())
					};
					this.activeItemId = this.activeItem.id;

					this.setBreadcrumb(this.activeItem);

					if (this.activeItem.parents.length) {
						this.activeItemParents = this.activeItem.parents.slice();
					}

					$(".btn-group.add")
						.children("button")
						.each(function() {
							$(this).prop("disabled", addButtonDisabled);
						});
				});
		} else {
			console.error("Finder is not initialized.");
		}
	}

	/**
	 * Init jsTree
	 * @param {string} dataType
	 */
	initTree(dataType = MODAL_ADD_DATA_SERIES) {
		const { divTreePane, divTreeProps } = this;
		let { addButtonDisabled } = this;
		divTreePane
			.jstree("destroy")
			.jstree({
				core: {
					data: jsTree.getStructure(),
					themes: {
						stripes: true
					},
					html_titles: true,
					multiple: false
				},
				plugins: ["wholerow", "themes", "types", "html_data"]
			})
			.on("ready.jstree", () => {
				this.setTreeActiveNode(this.activeItemId);
				/**
				 * Create "Property" panel
				 */
				if (!divTreeProps.children(".properties").length) {
					divTreeProps.append(
						$("<div/>")
							.addClass("properties")
							.append(
								$("<header/>")
									.append($("<h3/>").append($("<code/>").text("code")))
									.append(
										$("<span/>")
											.append($("<small/>").text("small"))
											.append(
												$("<a/>")
													.attr("role", "button")
													.attr("data-toggle", "collapse")
													.attr("href", "#formula-help")
													.attr("aria-expanded", "false")
													.attr("aria-controls", "formula-help")
													.addClass("btn help collapsed")
													.text("Help")
											)
									)
							)
							.append(
								$("<dl/>")
									.append(
										$("<dd/>")
											.attr("id", "formula-help")
											.addClass("collapse help")
											.append(
												$("<dl/>")
													.append(
														$("<dt/>")
															.addClass("syntax")
															.text("Syntax")
													)
													.append(
														$("<dd/>").append(
															$("<pre/>").append(
																$("<code/>")
																	.addClass("excel")
																	.text("code")
															)
														)
													)
													.append(
														$("<dt/>")
															.addClass("description")
															.text("Description")
													)
													.append(
														$("<dd/>").text("Description text goes here.")
													)
											)
									)
									.append(
										$("<dt/>")
											.addClass("apply-to")
											.text("Apply to:")
									)
									.append(
										$("<dd/>")
											.addClass("pink-10")
											.text("text")
									)
							)
					);
				}
				divTreeProps.children(".properties").hide();
			})
			.on("select_node.jstree", (e, { node }) => {
				const {
					original: {
						id,
						label,
						definition,
						example,
						formula,
						syntax,
						properties
					},
					parents,
					children,
					icon
				} = node;

				this.activeItem = {
					id,
					label,
					definition,
					example,
					formula,
					syntax,
					parents,
					children,
					properties,
					icon
				};
				this.activeItemId = id;

				this.setBreadcrumb(this.activeItem);

				if (parents.length) {
					this.activeItemParents = parents.slice(0);
					this.activeItemParents.reverse().shift();
				}
				/**
				 * The activeItem is not a folder (not having "children" prop), and should have a property panel
				 */
				if (!(children && children.length)) {
					const { propertiesToHtmlControls } = this;
					divTreeProps.children(".zero").hide(0, () => {});
					divTreeProps
						.children(".properties")
						.empty()
						.show(0, function() {
							if (
								[MODAL_ADD_DATA_SERIES, MODAL_ADD_DATA_FORMULA].includes(
									dataType
								)
							) {
								$(
									tmplProps(dataType, {
										icon,
										label,
										properties: propertiesToHtmlControls(properties),
										formula,
										syntax,
										definition
									})
								).appendTo(this);
							}
						});
				} else {
					divTreeProps.children(".zero").show();
					divTreeProps.children(".properties").hide();
				}
				addButtonDisabled = !(children && children.length === 0);
				$(".btn-group.add")
					.children("button")
					.each(function() {
						$(this).prop("disabled", addButtonDisabled);
					});
			});
	}

	/**
	 * Translates "Properties" object into HTML controls (as string).
	 * @param {{}} properties
	 * @return {string} - HTML output as string.
	 */
	propertiesToHtmlControls(properties) {
		const htmlOutput = [];
		if (properties && typeof properties === "object") {
			const htmlControls = [];
			Object.keys(properties).forEach(key => {
				const keyProperties = properties[key];
				if (key && keyProperties && typeof keyProperties === "object") {
					htmlControls.push({ label: key, ...keyProperties });
				}
			});
			if (htmlControls.length) {
				htmlControls.map(htmlControl => {
					const { controlType, value } = htmlControl;
					switch (controlType) {
						case "select":
							const options =
								value
									.map(({ label }) => {
										return `<option value="${label}">${label}</option>`;
									})
									.join("") || undefined;
							htmlOutput.push(
								`<select class="form-control input-sm meta-item">${options}</select>`
							);
							break;
						case "input":
							htmlOutput.push(
								`<input class="form-control input-sm meta-item" type="text" name="${value}" value="${value}">`
							);
							break;
						default:
							console.warn("Unknown HTML control type:\n", controlType);
							return;
					}
				});
			}
		} else {
			const metaItems = [
				{ label: "Size", value: undefined },
				{ label: "Modified", value: undefined }
			];
			htmlOutput.push(
				metaItems
					.map(metaItem => {
						const { label, value } = metaItem;
						if (label || value) {
							return `<div class="meta-item"><strong>${label}: </strong>${value ||
								"unavailable"}</div>`;
						}
					})
					.join("")
			);
		}
		return (
			htmlOutput.length && `<div class="meta">${htmlOutput.join("")}</div>`
		);
	}

	setBreadcrumb(activeItem) {
		const { breadcrumb, toolbarState, divFinder, divTreePane } = this;
		if (breadcrumb.length) {
			this.activeItemParents = [];
			breadcrumb.empty();

			if (activeItem) {
				const item = new Item(activeItem, {
					toolbarState,
					divFinder,
					divTreePane
				}).initObject();
				if (typeof item == "object") {
					// Add parents
					const { id, label, parent } = item;
					$.each(parent, function(i) {
						this.activeItemParents &&
							this.activeItemParents.push(String(parent[i].id));
						const li = $("<li/>")
							.attr({
								id: parent[i].id,
								role: "listitem",
								class: "breadcrumb-link"
							})
							.appendTo(breadcrumb);

						// The very first breadcrumb item is non-clickable
						if (i === 0) {
							li.addClass("root").text(parent[i].label);
						} else {
							$("<a/>")
								.attr({
									role: "button"
								})
								.text(parent[i].label)
								.appendTo(li);
						}
					});
					//	Add current item
					$("<li/>")
						.attr({
							id,
							role: "listitem",
							class: "breadcrumb-item"
						})
						.text(label)
						.appendTo(breadcrumb);
				}
			}
		}
	}

	// TODO: Implement setActiveItem
	/*setActiveItem(itemId) {
		const { data: dataAdd, divFinder, divTreePane } = this;
		if (itemId && dataAdd && typeof dataAdd == "object") {
			const { data: dataType, view } = this.toolbarState;
			let parents = [];
			// Data source doesn't contain "Home" element, so index should start with 0
			itemId--;
			//
			switch (view) {
				case MODAL_ADD_VIEW_FINDER:
					if (divFinder) {
						parents = [
							...divFinder[0].querySelectorAll(".fjs-has-children.fjs-active")
						].map(parent => parent._item.id.toString());
					}
					break;
				case MODAL_ADD_VIEW_TREE:
					if (divTreePane) {
					}
					break;
				default:
					console.error("Unknown view:", view);
					return;
			}
			
			const activeItem = dataAdd(dataType).find((element, i) => i === itemId);
			if (activeItem) {
				return (this.activeItem = (({ label }) => ({
					id: itemId,
					label,
					...(parents.length && { parents })
				}))(activeItem));
			}
		}
	}*/

	setFinderActiveNode(itemId) {
		const { divFinder } = this;
		if (divFinder && itemId) {
			divFinder
				.find(`[data-fjs-item="${itemId}"]`)
				.click()
				.find("a")
				.focus();
		}
		// this.setActiveItem(itemId);
	}

	setTreeActiveNode(itemId) {
		const { divTreePane } = this;
		if (divTreePane && itemId) {
			divTreePane
				.jstree("deselect_all")
				.jstree("close_all")
				.jstree("select_node", itemId);
		}
		// this.setActiveItem(itemId);
	}

	setBody(btnType, btnName) {
		const { divFinder, divTree, modalAdd, modalHeader, toolbar } = this;
		let { isToolbarInited } = this;
		if (!modalAdd.hasClass("active") || isToolbarInited) {
			this.toolbarState = toolbar.getState() || {};
			this.toolbarState[btnType] = btnName;
			toolbar.setState(this.toolbarState);

			switch (btnType) {
				case MODAL_ADD_DATA:
					this.activeItemId = null;
					if (btnName) {
						if (this.data(btnName)) {
							this.initFinder(btnName);
							this.initTree(btnName);
						}
					}
					// Set searchbox placeholder with data type
					modalHeader
						.find(".search .form-control")
						.prop("placeholder", `Search ${capitalizeFirstChar(btnName)}`);

					divFinder
						.find(
							this.activeItemId
								? `[data-fjs-item="${this.activeItemId}"]`
								: ".fjs-item"
						)
						.first()
						.click()
						.find("a")
						.focus();
					break;
				case MODAL_ADD_VIEW:
					switch (this.toolbarState[btnType]) {
						case MODAL_ADD_VIEW_FINDER:
							divTree.hide(0, () => {
								if (this.activeItemParents && this.activeItemParents.length) {
									this.activeItemParents.push(this.activeItemId.toString());
									this.activeItemParents.map(parent => {
										this.setFinderActiveNode(parent);
									});
								} else {
									this.setFinderActiveNode(this.activeItemId);
								}
							});
							divFinder.show();
							break;
						case MODAL_ADD_VIEW_TREE:
							divFinder.hide(0, () => {
								this.setTreeActiveNode(this.activeItemId);
							});
							divTree.show();
							break;
						default:
							console.error("toolbarState[btnType] is of unknown type.");
					}
					break;
				default:
					console.error("btnType undefined.");
			}
		}
	}

	show() {
		const {
			modalAdd,
			modalHeader,
			modalFooter,
			toolbar,
			breadcrumb,
			divTreePane,
			divTreeProps
		} = this;
		let { toolbarState, isToolbarInited, addSplit } = this;

		modalAdd
			.on("show.bs.modal", () => {
				const toolbarBtns = modalHeader.find(".toolbar .btn");

				toolbarState = toolbar.getState();
				toolbarBtns.click(button => {
					const { currentTarget } = button;
					const {
						firstChild: { id }
					} = currentTarget;

					$(currentTarget).button("reset");

					if (id.indexOf("-") > -1) {
						const [dataType, btnName] = id.split("-");
						if (currentTarget.classList.contains(btnName)) {
							this.setBody(dataType, btnName);
						}
					}
				});

				if (toolbar.init(toolbarState)) {
					isToolbarInited = true;
					const btnClicked = modalHeader
						.find(".toolbar .btn.active")
						.trigger("click");
					$.each(btnClicked, function(i) {
						if (i === btnClicked.length - 1) {
							isToolbarInited = false;
						}
					});
				}

				modalAdd
					.find(".modal-dialog")
					.css({
						height: getDefaultModalHeight(modalAdd, ROW_HEIGHT, ROW_MIN_COUNT)
					})
					.draggable({
						handle: ".modal-header"
					})
					.mousedown(() => modalHeader.addClass("mouse-down"))
					.mouseup(() => modalHeader.removeClass("mouse-down"));

				modalFooter
					.find(".btn-group.add button")
					.first()
					.click(function() {
						console.log(`"${$(this).text()}" button just clicked.`);
						modalAdd.modal("hide");
					});

				/**
				 * Add "click" events to Breadcrumb's <a/> elements
				 */
				breadcrumb.on("click", event => {
					const { target } = event;
					const { id } = target.parentElement;

					// All non-anchor tags to be ignored as non-clickable
					if (target.tagName !== "A") {
						return;
					}

					const { parents } = this.activeItem;

					if (parents) {
						const { length } = parents;
						if (length) {
							// "+1" offset for "Home"
							const position = parents.indexOf(id) + 1;
							parents.splice(position, length - position);
							// Navigate in Finder but clicking the parents chierarchy from the beginning (to generate Finder columns)
							parents.map(p => this.setFinderActiveNode(p));
							// Navigate in Tree
							this.setTreeActiveNode(id);
						}
					}
				});
			})
			.on("shown.bs.modal", () => {
				/**
				 * Make dialog resizable with "Resizable" jQueryUI plugin
				 */
				if (typeof $().resizable == "function") {
					modalAdd.find(".modal-dialog").resizable({
						resize: function(event, ui) {
							// ui.size.width += ui.size.width - ui.originalSize.width;
							// ui.position.left = ui.originalPosition.left;
							// ui.size.width = (ui.size.width - ui.originalSize.width) * 1 + ui.originalSize.width;
							// console.log('ui.size.width', ui.size.width);
							// console.log('ui.originalSize.width', ui.originalSize.width);
						},
						minHeight: minModalHeight(modalAdd),
						maxHeight: maxModalHeight(modalAdd, viewport),
						minWidth: minModalWidth(viewport),
						maxWidth: maxModalWidth(modalAdd, viewport),
						grid: [1, ROW_HEIGHT]
					});
				}
				/**
				 * Add split between Tree and Props in "Tree" view
				 */
				if (divTreePane.length && divTreeProps.length) {
					addSplit = Split([divTreePane[0], divTreeProps[0]], {
						sizes: [66.7, 33.3],
						minSize: 200,
						gutterSize: 5
					});
				}
			})
			.on("hide.bs.modal", () => {
				modalHeader.find(".toolbar .btn").off();
				this.activeItemParents = [];
			})
			.on("hidden.bs.modal", () => {
				addSplit.destroy();
				toolbar.setState(toolbarState);
				modalAdd.data("bs.modal", null);
				this.destroy();
			})
			.modal("show");
	}

	destroy() {
		const { modalAdd, finderEmitter } = this;
		finderEmitter && finderEmitter.removeAllListeners();
		modalAdd.off();
	}
}

export let modalAdd = new ModalAdd();

function Toolbar(modalName) {
	const defaultButtons = {
		data: MODAL_ADD_DATA_SERIES,
		view: MODAL_ADD_VIEW_FINDER
	};
	let activeButtons = {};

	this.init = (buttons = defaultButtons) => {
		const tbar = modalName.find(".toolbar");

		if (tbar.length) {
			const btns = tbar[0].querySelectorAll(".btn:not(.clear)");
			btns.forEach(btn => {
				$(btn)
					.removeClass("active")
					.children()
					.first()
					.prop("checked", false);

				Object.values(buttons).map(buttonName => {
					if (btn.classList.contains(buttonName)) {
						$(btn)
							.addClass("active")
							.children()
							.first()
							.prop("checked", true);
					}
				});
			});
			return true;
		}
	};

	this.destroy = () => {
		activeButtons = {};
	};

	this.getState = () => {
		if (typeof activeButtons == "object" && Object.keys(activeButtons).length) {
			return activeButtons;
		}
	};

	this.setState = buttons => {
		if (buttons) {
			return (activeButtons = buttons);
		}
	};
}

function Item(item, { toolbarState, divFinder, divTreePane }) {
	this.getPath = () => {
		const pathItems = [];
		const { view } = toolbarState;
		const rootItem = {
			id: 0,
			label: capitalizeFirstChar(toolbarState.data) || i18next.t("home")
		};

		if (view) {
			switch (view) {
				case MODAL_ADD_VIEW_FINDER:
					if (divFinder) {
						const containingColumn = $(item.col);
						/**
						 * Column index starts from 1. 0 is reserved for root element.
						 */
						const colNumber = containingColumn.index() + 1;

						/**
						 * Prepare array of pathItems
						 * Parent for 1st column is just 'rootItem'
						 */
						if (colNumber > 1) {
							containingColumn
								.prevAll()
								.find(".fjs-active")
								.each((undefined, { _item: { id, label } }) => {
									pathItems.push({
										id,
										label
									});
								});
						}
					}
					break;
				case MODAL_ADD_VIEW_TREE:
					if (divTreePane) {
						const { parents } = item;
						const tree = divTreePane.jstree(true);

						// Get labels for parents by its id
						parents.map(parent => {
							// Check if parent is not a root (#) and number
							if (!(parent === "#" && Number.isNaN(parent))) {
								const { original } = tree.get_node(parent);
								if (original) {
									const { id, label } = original;
									pathItems.push({
										id,
										label
									});
								}
							}
						});
						// Re-order array
						pathItems.reverse();
					}
					break;
				default:
					console.error("Unknown view:", view);
					return;
			}
			// Add rootItem as 1st array item
			pathItems.unshift(rootItem);
			return pathItems;
		}
	};

	this.initObject = () => {
		if (item) {
			const { _item } = item;
			const { id } = item || _item;
			const { label } = item.original || item || _item || "label undefined";
			const pathItems = this.getPath();

			return {
				...($(item).context && { item: $(item).context }),
				id,
				label,
				...(pathItems && pathItems.length && { parent: pathItems })
			};
		}
	};
}
