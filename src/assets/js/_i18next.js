/**
 * Created by nnifadef on 8/16/16.
 * Updated by nnifadef on 12/7/18.
 */
const
	i18n = require('i18next'),
	XHR = require('i18next-xhr-backend'),
	jI18n = require('jquery-i18next')
;

function loadLocales(url, options, callback, data) {
	try {
		const waitForLocale = require('../locales/' + url + '.json');
		callback(waitForLocale, { status: '200'});
	} catch (e) {
		callback(null, { status: '404' });
	}
}

export default i18n
	.use(XHR)
	.init(
		{
			lng: $('html').attr('lang'),
			debug: false,
			backend: {
				loadPath: '{{lng}}/{{ns}}', 
				parse: data => data,
				ajax: loadLocales,
				queryStringParams: { v: '1.3.5' }
			}
		},
		function() {
			jI18n.init(i18n, $);
			$(document).localize();
		}
	)
;