//js loader
var Loader = function() {}
Loader.prototype = {
	require: function(scriptOrCss, callback) {
		this.loadCount = 0;
		this.totalRequired = (scriptOrCss ? scriptOrCss.length : 0);
		this.callback = callback;
		if (scriptOrCss) {
			for (var i = 0; i < scriptOrCss.length; i++) {
				this.writeScriptOrCss(scriptOrCss[i].type, scriptOrCss[i].src);
			}
		}
	},
	loaded: function(evt) {
		this.loadCount++;
		if (this.loadCount == this.totalRequired && typeof this.callback == 'function') this.callback.call();
	},
	writeScriptOrCss: function(filetype, src) {
		var self = this;
		if (filetype == "js") {
			var s = document.createElement('script');
			s.type = "text/javascript";
			s.async = true;
			s.src = src;
		}
		if (filetype == "css") {
			var s = document.createElement('link');
			s.type = "text/css";
			s.rel = "stylesheet";
			s.href = src;
		}
		if (s.addEventListener) {
			s.addEventListener('load', function(e) {
				self.loaded(e);
			}, false);
		} else if (s.readyState) {
			s.onreadystatechange = function() {
				if (s.readyState in {
						loaded: 1,
						complete: 1
					}) {
					s.onreadystatechange = null;
					self.loaded(e);
				}
			};
		}
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(s);
	}
}

//load jquery and css
var requireResource = [];
if (typeof jQuery != 'function') {
	requireResource.push({
		type: "js",
		src: "https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"
	});
}

requireResource.push({
	//     type: "css",
	//     src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"
	// }, {
	type: "css",
	src: "https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css"
}, {
	type: "css",
	src: "https://cdn.jsdelivr.net/gh/chiahao0923/js/kkday2.css"
}, {
	type: "js",
	src: "https://www.kkday.com/assets/js/kkday-affi-style.js"
});

//accroding to kkdayLang to map locale
var langCountryMap = {
	'vi': 'vn',
	'th': 'th',
	'zh-tw': 'tw',
	'zh-hk': 'hk',
	'ja': 'jp',
	'ko': 'kr',
	'zh-cn': 'cn',
	'en': 'kk'
};

var l = new Loader();
l.require(requireResource, function() {
	// Callback Function to SetContent
	setContent();
});

//setContent
function setContent() {
	for (var i = 0; i < kkdayad.coll.length; i++) {
		var id = kkdayad.coll[i].id;
		var style = getAffiStyle(kkdayad.coll[i].kkdayStyleId);
		if (style) {
			showAffiRecs(id, style);
		}
	}
}

function showAffiRecs(id, style) {
	var prodSize = style.prodSize || 10;
	var prodLang = typeof kkdayLang != 'undefined' ? ('&lang=' + kkdayLang) : '';
	var prodLocale = typeof langCountryMap[kkdayLang] != 'undefined' ? ('&locale=' + langCountryMap[kkdayLang]) : '';
	var prodCurrency = typeof kkdayCurrency != 'undefined' ? ('&currency=' + kkdayCurrency) : '';
	var prodArea = typeof kkdayArea != 'undefined' ? ('&area=' + kkdayArea) : '';
	jQuery.ajax({
		type: "GET",
		url: 'https://recommend.kkday.com/v2/recommend/getRecList?size=' + prodSize + prodLang + prodLocale + prodCurrency + prodArea,
		dataType: "jsonp",
		success: function(data) {
			renderAffiRecsHtml(id, style, data);
		},
		complete: function() {
			if(typeof kkdayCurrency != 'undefined') {
				kkdayCurrency = undefined;
			}
			if(typeof kkdayArea != 'undefined') {
				kkdayArea = undefined;
			}
		}
	});
}

function renderAffiRecsHtml(id, style, reclist) {
	var _contentHtml = style.contentHtml;
	for (var i = 0; i < reclist.prod.length; i++) {
		var rec = reclist.prod[i];
		var price_cur = rec.currency ? rec.currency : 'USD';
		var prodUrl = getKkdayProdUrl(rec.id, kkdayLang);
		_contentHtml = _contentHtml
			.replace("{currency}", price_cur)
			.replace("{prodUrl_" + (i + 1) + "}", prodUrl + "?cid=" + kkdayCid + "&ccy=" + price_cur + "&ud1=htmlad")
			.replace("{imgUrl_" + (i + 1) + "}", rec.img_url)
			.replace("{prodName_" + (i + 1) + "}", rec.name)
			.replace("{prodPrice_" + (i + 1) + "}", rec.display_price);
	}
	jQuery('#' + id).append(_contentHtml);
}

function getKkdayProdUrl(id, lang) {
	return 'https://www.kkday.com/' + lang + '/product/' + id;
}
