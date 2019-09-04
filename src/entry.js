/**
 * Created by nnifadef on 7/11/16.
 */
import { modalAdd, modalIo } from "./App/components/modal";
import "./App/app";

/**
 * jPlugin to check if scrollbars are visible
 */
(function($) {
	$.fn.hasScrollBar = function() {
		return this.get(0).scrollHeight > this.get(0).clientHeight;
	};
})(jQuery);

$(document).ready(function() {
	$("#addSeries").on("click", () => {
		modalAdd.show();
	});

	$("#modalIo").on("click", () => {
		modalIo.show();
	});

	$("#toolbar-download")
		.next(".dropdown-menu")
		.each(function() {
			// const jThis = $(this);
			// const chartSelector = jThis.data("chartSelector");
			// var chartTitle = function() {
			// 	var currTitle = chart.options.title.text,
			// 		titlePrefix = "chartv";
			//
			// 	if (currTitle && currTitle !== "Chart title") {
			// 		currTitle = titlePrefix + "  " + currTitle;
			// 	} else {
			// 		currTitle = "Title not set";
			// 	}
			//
			// 	currTitle = currTitle
			// 		.split(" ")
			// 		.join("-")
			// 		.replace(/[\%]/gi, "pc")
			// 		.replace(/[^a-z0-9_\-]/gi, "_")
			// 		.toLowerCase();
			// 	return currTitle;
			// };
			//
			// $("*[data-type]", this).each(function() {
			// 	var jThis = $(this),
			// 		type = jThis.data("type");
			//
			// 	if (Highcharts.exporting.supports(type)) {
			// 		jThis.click(function() {
			// 			chart.exportChartLocal({
			// 				type: type,
			// 				filename: chartTitle()
			// 			});
			// 		});
			// 	} else {
			// 		jThis.parent().addClass("disabled");
			// 	}
			// });
		});

	$("button.config").click(function() {});

	// var BrowserDetect = {
	// 	init: function() {
	// 		this.browser = this.searchString(this.dataBrowser) || "Other";
	// 		this.version =
	// 			this.searchVersion(navigator.userAgent) ||
	// 			this.searchVersion(navigator.appVersion) ||
	// 			"Unknown";
	// 	},
	// 	searchString: function(data) {
	// 		for (var i = 0; i < data.length; i++) {
	// 			var dataString = data[i].string;
	// 			this.versionSearchString = data[i].subString;
	//
	// 			if (dataString.indexOf(data[i].subString) !== -1) {
	// 				return data[i].identity;
	// 			}
	// 		}
	// 	},
	// 	searchVersion: function(dataString) {
	// 		var index = dataString.indexOf(this.versionSearchString);
	// 		if (index === -1) {
	// 			return;
	// 		}
	//
	// 		var rv = dataString.indexOf("rv:");
	// 		if (this.versionSearchString === "Trident" && rv !== -1) {
	// 			return parseFloat(dataString.substring(rv + 3));
	// 		} else {
	// 			return parseFloat(
	// 				dataString.substring(index + this.versionSearchString.length + 1)
	// 			);
	// 		}
	// 	},
	//
	// 	dataBrowser: [
	// 		{ string: navigator.userAgent, subString: "Edge", identity: "MS Edge" },
	// 		{ string: navigator.userAgent, subString: "MSIE", identity: "Explorer" },
	// 		{
	// 			string: navigator.userAgent,
	// 			subString: "Trident",
	// 			identity: "Explorer"
	// 		},
	// 		{
	// 			string: navigator.userAgent,
	// 			subString: "Firefox",
	// 			identity: "Firefox"
	// 		},
	// 		{ string: navigator.userAgent, subString: "Opera", identity: "Opera" },
	// 		{ string: navigator.userAgent, subString: "OPR", identity: "Opera" },
	//
	// 		{ string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
	// 		{ string: navigator.userAgent, subString: "Safari", identity: "Safari" }
	// 	]
	// };

	// BrowserDetect.init();
	// document.write(
	// 	"You are using <b>" +
	// 		BrowserDetect.browser +
	// 		"</b> with version <b>" +
	// 		BrowserDetect.version +
	// 		"</b>"
	// );

	// Animated appearance for all modals.
	$(".modal").on("show.bs.modal", function() {
		const open = $(this).attr("data-easein");
		if (open && open.length) {
			const velocityEaseIn = [
				"shake",
				"pulse",
				"tada",
				"flash",
				"bounce",
				"swing"
			];
			let velocityType = "transition";

			for (let i = 0; i < velocityEaseIn.length; i++) {
				if (open === velocityEaseIn[i]) {
					velocityType = "callout";
				}
			}

			$(".modal-dialog").velocity(velocityType + "." + open);
		}
	});
});
