/**
 * Created by nnifadef on 8/16/16.
 */
import i18next from "i18next";
import XHR from "i18next-xhr-backend";
import jI18n from "jquery-i18next";

export default i18next.use(XHR).init(
	{
		ns: ["common"],
		defaultNS: "common",
		lng: $("html").attr("lang"),
		debug: process.env.NODE_ENV === "development",
		fallbackLng: "en",
		backend: {
			loadPath: "{{lng}}/{{ns}}",
			parse: data => data,
			ajax: (url, options, callback, data) => {
				try {
					const waitForLocale = require(`./locales/${url}.json`);
					callback(waitForLocale, { status: "200" });
				} catch (e) {
					callback(null, { status: "404" });
				}
			},
			queryStringParams: { v: "1.3.5" }
		}
	},
	(err, t) => {
		jI18n.init(i18next, $);
		$(document).localize();
	}
);
