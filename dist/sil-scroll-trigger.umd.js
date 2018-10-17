(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.silScrollTrigger = {})));
}(this, (function (exports) { 'use strict';

	(function(){ if(typeof document !== 'undefined'){ var head=document.head||document.getElementsByTagName('head')[0], style=document.createElement('style'), css=""; style.type='text/css'; if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style); } })();
	/*

	A Vue directive to check if the element is under or above the fold and add a class when the element is above.
	<element v-scroll-trigger="{activeClass: 'is-active', offset: 30, relative: false }" ></element>

	*/
	var directive = {
		bind: function(el, binding) {
			// Get the absolute position of the element without translates
			var get = {
				position: function(elem) {
					var _x = 0;
					var _y = 0;
					while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
						_x += elem.offsetLeft - elem.scrollLeft;
						_y += elem.offsetTop - elem.scrollTop;
						elem = elem.offsetParent;
					}
					return { top: _y, left: _x };
				},
				scrollBottom: function() {
					var bottom =
						(window.pageYOffset || document.scrollTop) -
						(document.clientTop || 0) +
						window.innerHeight;
					if (isNaN(0)) {
						bottom = settings.windowHeight;
					}
					return bottom;
				},
				scrollTop: function() {
					var bottom =
						(window.pageYOffset || document.scrollTop) -
						(document.clientTop || 0);
					if (isNaN(0)) {
						bottom = 0;
					}
					return bottom;
				}
			};

			// Set the default settings
			var settings = {
				active: false,
				debug: false,
				relative: true,
				activeClass: 'active',
				offset: 0,
				elRect: el.getBoundingClientRect(),
				elPos: get.position(el),
				windowHeight: window.innerHeight,
				rectzero: false
			};
			var init = {
				settings: function() {
					// Check if there are alternative settings.
					settings.elRect = el.getBoundingClientRect();
					settings.elPos = get.position(el);
					if (binding.value) {
						if (
							binding.value.relative == true ||
							binding.value.relative == false
						) {
							settings.relative = binding.value.relative;
						}
						if (binding.value.activeClass) {
							settings.activeClass = binding.value.activeClass;
						}
						if (binding.value.offset) {
							settings.offset = binding.value.offset;
						}
						if (binding.value.debug) {
							settings.debug = binding.value.debug;
						}
						if (binding.value.rectzero) {
							settings.rectzero = true;
						}
					}
				}
			};

			// The main function.
			var check = {
				position: function() {
					var isActive = false;

					// Check if relative or absolute (read: If the element is translated, use the relative.
					// If you want to use its original (or non translated) position, use absolute).
					if (settings.rectzero) {
						if (el.getBoundingClientRect().top - window.innerHeight < 0) {
							isActive = true;
						} else {
							isActive = false;
						}
					} else if (settings.relative) {
						if (settings.elRect.top + settings.offset < get.scrollBottom()) {
							isActive = true;
						} else {
							isActive = false;
						}
					} else {
						if (settings.elPos.top + settings.offset < get.scrollBottom()) {
							isActive = true;
						} else {
							isActive = false;
						}
					}

					// Set the class
					if (isActive) {
						if (!settings.active) {
							settings.active = true;
							el.classList.add(settings.activeClass);
						}
					} else {
						if (settings.active) {
							settings.active = false;
							el.classList.remove(settings.activeClass);
						}
					}
				}
			};

			// Initialize the position.
			init.settings();
			check.position();

			window.addEventListener('resize', function() {
				settings.windowHeight = window.innerHeight;
			});
			// When scrolling, check the position.
			window.addEventListener('scroll', function() {
				if (settings.elRect.top == 0 && settings.elRect.width == 0) {
					init.settings();
				}
				check.position();
			});
		}
	};

	// Import vue component

	// install function executed by Vue.use()
	function install(Vue) {
		if (install.installed) { return; }
		install.installed = true;
		Vue.directive('silScrollTrigger', directive);
	}

	// Create module definition for Vue.use()
	var plugin = {
		install: install
	};

	// To auto-install when vue is found
	var GlobalVue = null;
	if (typeof window !== 'undefined') {
		GlobalVue = window.Vue;
	} else if (typeof global !== 'undefined') {
		GlobalVue = global.Vue;
	}
	if (GlobalVue) {
		GlobalVue.use(plugin);
	}

	// It's possible to expose named exports when writing components that can
	// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
	// export const RollupDemoDirective = component;

	exports.install = install;
	exports.default = directive;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
