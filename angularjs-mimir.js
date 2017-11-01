(function () {
	'use strict';

	function MimirInitValidation(config) {
		if (!config) {
			config = {}
		}
		if (config.auto === undefined) {
			config.auto = true;
		}
		if (config.path === undefined) {
			throw new Error('Please define path to MimirProvider.');
		}
		if (config.path.length === 0 || config.path[config.path.length -1] !== '/') {
			config.path += '/';
		}
		return config;
	}


	function Mimir($rootScope, config) {
		MimirInitValidation(config);

		var src = function(ext, lang) {
			if (lang) {
				return config.path + "mimir." + lang + "." + ext;
			} else {
				return config.path + "mimir." + ext;
			}
		}

		if (!config.lang) {
			config.lang = "en";
		}
    // auto := true - load Mimir from the distant URL
    // auto := false - the user loaded by himself in index.html
    if (config.auto) {
			var s = document.createElement('script');
			s.src = src("js", config.lang);
			document.head.appendChild(s);
			s = document.createElement('link');
			s.href = src("css");
			s.rel = "stylesheet";
			document.head.appendChild(s);
		}

		$rootScope.$on('$translateChangeSuccess', function(event, params) {
			if (config.lang === params.language) {
				return;
			}
			config.lang = params.language

			var r = new XMLHttpRequest();
			r.open('GET', src("html", config.lang));
			r.onreadystatechange = function() {
				window.updateMimir(r.responseText)
			}
			r.send();
		});
	}

	angular.module('angularMimir', []).provider('mimir', function MimirProvider() {
		var config = {'auto': true, 'path': null};

		this.setAuto = function(value) {
			config.auto = value;
		};

		this.setPath = function(value) {
			config.path = value;
		};

		this.setLang = function(value) {
			config.lang = value;
		};

	  this.$get = [function mimirFactory() {
		  return {
			 	'run': function($rootScope) {
					Mimir($rootScope, config);
				}
			}
		}];
	});
})();
