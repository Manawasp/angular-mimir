
(function () {
	'use strict';

	function MimirInitValidation(auto, path) {
		if (auto === undefined) {
			auto = true;
		}
		if (path === undefined) {
			throw new Error('Please define path to MimirProvider.');
		}
		if (path.length === 0 || path[path.length -1] !== '/') {
			path += '/';
		}
		return {auto: auto, path: path};
	}


	function Mimir($rootScope, auto, path) {
		var $ctrl = this;
		$ctrl.params = MimirInitValidation(auto, path);

		var src = function(lang, file, ext) {
			return $ctrl.params.path + "mimir." + lang + "." + ext;
		}
    // auto := true - load Mimir from the distant URL
    // auto := false - the user loaded by himself in index.html
    if ($ctrl.params.auto) {
			var defaultLang = "en"
			var s = document.createElement('script');
			s.src = src(defaultLang, "js");
			location.appendChild(s);
		}

		$rootScope.$on('$translateChangeSuccess', function(event, params) {
			console.log("event cached !")
			var r = new XMLHttpRequest();
			r.open('GET', src(params.lang, "html"));
			r.onreadystatechange = function() {
				window.updateMimir(r.responseText)
			}
			r.send();
		});
	}

	angular.module('app').provider('mimir', function MimirProvider() {
	  var auto = true;

		this.setAuto = function(value) {
			auto = value;
		};

		this.setPath = function(value) {
			path = value;
		};

	  this.$get = [function mimirFactory(auto, path) {
		  return new Mimir($rootScope, auto, path);
		}];
	});
})();
