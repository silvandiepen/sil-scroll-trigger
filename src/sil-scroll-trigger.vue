<script>
/* eslint-disable */
/*

A Vue directive to check if the element is under or above the fold and add a class when the element is above.
<element v-scroll-trigger="{activeClass: 'is-active', offset: 30, relative: false }" ></element>

*/
export default {
	bind: function(el, binding) {
		// Get the absolute position of the element without translates
		let get = {
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
				let bottom =
					(window.pageYOffset || document.scrollTop) -
					(document.clientTop || 0) +
					window.innerHeight;
				if (isNaN(bottom)) {
					bottom = settings.windowHeight;
				}
				return bottom;
			},
			scrollTop: function() {
				let bottom =
					(window.pageYOffset || document.scrollTop) -
					(document.clientTop || 0);
				if (isNaN(bottom)) {
					bottom = 0;
				}
				return bottom;
			}
		};

		// Set the default settings
		let settings = {
			active: false,
			debug: false,
			relative: true,
			elementClass: 'trigger',
			activeClass: 'active',
			inActiveClass: 'inactive',
			once: false,
			bemClass: null,
			startInactive: true,
			offset: 0,
			startDelay: 0,
			elRect: el.getBoundingClientRect(),
			elPos: get.position(el),
			windowHeight: window.innerHeight
		};
		let init = {
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
					if (binding.value.debug) {
						settings.debug = binding.value.debug;
					}
					if (binding.value.startDelay) {
						settings.startDelay = binding.value.startDelay;
					}
					if (binding.value.activeClass) {
						settings.activeClass = binding.value.activeClass;
					}
					if (binding.value.inActiveClass) {
						settings.inActiveClass = binding.value.inActiveClass;
					}
					if (binding.value.elementClass) {
						settings.elementClass = binding.value.elementClass;
					}
					if (binding.value.bemClass) {
						settings.elementClass = `${binding.value.bemClass}__trigger`;
						settings.activeClass = `${binding.value.bemClass}__trigger--active`;
						settings.inActiveClass = `${
							binding.value.bemClass
						}__trigger--inactive`;
					}
					if (binding.value.offset) {
						settings.offset = binding.value.offset;
					}
					if (binding.value.startInactive) {
						settings.startInactive = binding.value.startInactive;
					}
					if (binding.value.debug) {
						settings.debug = binding.value.debug;
					}
				}
				el.classList.add(settings.elementClass);
				if (settings.startInactive) {
					el.classList.add(settings.inActiveClass);
				}
			}
		};

		// The main function.
		let check = {
			position: function(initial = false) {
				let isActive = false;

				// Check if relative or absolute (read: If the element is translated, use the relative.
				// If you want to use its original (or non translated) position, use absolute).
				if (settings.relative) {
					if (settings.elRect.top + settings.offset < get.scrollBottom()) {
						isActive = true;
					} else {
						isActive = false;
					}
				} else {
					if (el.getBoundingClientRect().top - window.innerHeight < 0) {
						isActive = true;
					} else {
						isActive = false;
					}
				}

				// Set the class
				if (isActive) {
					if (!settings.active) {
						settings.active = true;
						if (initial) {
							el.classList.add(settings.inActiveClass);
							setTimeout(() => {
								el.classList.add(settings.activeClass);
								el.classList.remove(settings.inActiveClass);
							}, settings.bindtime);
						} else {
							el.classList.add(settings.activeClass);
							el.classList.remove(settings.inActiveClass);
						}
					}
				} else {
					if (settings.active && !settings.once) {
						settings.active = false;
						el.classList.remove(settings.activeClass);
						el.classList.add(settings.inActiveClass);
					}
				}
			}
		};

		// Initialize the position.
		init.settings();
		setTimeout(function() {
			check.position(true);
		}, settings.startDelay);

		// Add a event listener to a resizing window.
		window.addEventListener('resize', function() {
			settings.windowHeight = window.innerHeight;
		});

		let curScrollY = 0,ticking = false;
		
		function update(){
			ticking = false;
			requestAnimationFrame(update);
			if (settings.elRect.top == 0 && settings.elRect.width == 0) {
				init.settings();
			}
			check.position();
		}
		
		window.addEventListener('scroll', ()=>{
			curScrollY = window.scrollY;
			requestTick();	
		},false);

		function requestTick(){
			if(!ticking){
				requestAnimationFrame(update);
			}
			ticking = true;
		}		
	}
};
</script>
