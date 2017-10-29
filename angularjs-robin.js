
(function () {
	'use strict';

	function RobinInitValidation(auto, path) {
		if (auto === undefined) {
			auto = true;
		}
		if (path === undefined) {
			throw new Error('Please define path to RobinProvider.');
		}
		if (path.length === 0 || path[path.length -1] !== '/') {
			path += '/';
		}
		return {auto: auto, path: path};
	}


	function Robin($rootScope, auto, path) {
		var $ctrl = this;
		$ctrl.params = RobinInitValidation(auto, path);

		var src = function(lang, file, ext) {
			return $ctrl.params.path + "robin." + lang + "." + ext;
		}
    // auto := true - load Robin from the distant URL
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
				window.updateRobin(r.responseText)
			}
			r.send();
		});
	}

	angular.module('app').provider('robin', function RobinProvider() {
	  var auto = true;

		this.setAuto = function(value) {
			auto = value;
		};

		this.setPath = function(value) {
			path = value;
		};

	  this.$get = [function robinFactory(auto, path) {
		  return new Robin($rootScope, auto, path);
		}];
	});
})();
