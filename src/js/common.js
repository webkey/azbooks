/**
 * !resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).resize(function () {
	var currentWidth = $('body').outerWidth();
	resizeByWidth = prevWidth !== currentWidth;
	if (resizeByWidth) {
		$(window).trigger('resizeByWidth');
		prevWidth = currentWidth;
	}
});

/**
 * !debouncedresize only width
 * */
var debouncedresizeByWidth = true;

var debouncedPrevWidth = -1;
$(window).on('debouncedresize', function () {
	var currentWidth = $('body').outerWidth();
	debouncedresizeByWidth = debouncedPrevWidth !== currentWidth;
	if (resizeByWidth) {
		$(window).trigger('debouncedresizeByWidth');
		debouncedPrevWidth = currentWidth;
	}
});

/**
 * !device detected
 * */
var DESKTOP = device.desktop();
var MOBILE = device.mobile();
var TABLET = device.tablet();

/**
 *  Add placeholder for old browsers
 * */
function placeholderInit() {
	$('[placeholder]').placeholder();
}

/**
 * !Show print page by click on the button
 * */
function printShow() {
	$('.view-print').on('click', function (e) {
		e.preventDefault();
		window.print();
	})
}

/**
 * !toggle class for input on focus
 * */
function inputToggleFocusClass() {
	// use for the "focus" state
	var $inputs = $('.field-effects-js');

	if ($inputs.length) {
		var $fieldWrap = $('.input-wrap');
		var $selectWrap = $('.select');
		var classFocus = 'input--focus';

		$inputs.focus(function () {
			var $currentField = $(this);
			var $currentFieldWrap = $currentField.closest($fieldWrap);

			// add class on input
			$currentField.addClass(classFocus);
			// add class on label
			$currentField.prev('label').addClass(classFocus);
			$currentField.closest($selectWrap).prev('label').addClass(classFocus);
			// add class on wrapper
			$currentFieldWrap.addClass(classFocus);
			// add class on label in wrapper
			$currentFieldWrap.find('label').addClass(classFocus);

		}).blur(function () {
			var $currentField = $(this);
			var $currentFieldWrap = $currentField.closest($fieldWrap);

			// remove class on input
			$currentField.removeClass(classFocus);
			// remove class on label
			$currentField.prev('label').removeClass(classFocus);
			$currentField.closest($selectWrap).prev('label').removeClass(classFocus);
			// remove class on wrapper
			$currentFieldWrap.removeClass(classFocus);
			// remove class on label in wrapper
			$currentFieldWrap.find('label').removeClass(classFocus);

		});
	}
}

function inputHasValueClass() {
	// use for the "has-value" state
	var $inputs = $('.field-effects-js');

	if ($inputs.length) {
		var $fieldWrap = $('.input-wrap');
		var $selectWrap = $('.select');
		var classHasValue = 'input--has-value';

		$.each($inputs, function () {
			switchHasValue.call(this);
		});

		$inputs.on('keyup change', function () {
			switchHasValue.call(this);
		});

		function switchHasValue() {
			var $currentField = $(this);
			var $currentFieldWrap = $currentField.closest($fieldWrap);

			//first element of the select must have a value empty ("")
			if ($currentField.val().length === 0) {
				// remove class on input
				$currentField.removeClass(classHasValue);
				// remove class on label
				$currentField.prev('label').removeClass(classHasValue);
				$currentField.closest($selectWrap).prev('label').removeClass(classHasValue);
				// remove class on wrapper
				$currentFieldWrap.removeClass(classHasValue);
				// remove class on label in wrapper
				$currentFieldWrap.find('label').removeClass(classHasValue);
			} else if (!$currentField.hasClass(classHasValue)) {
				// add class on input
				$currentField.addClass(classHasValue);
				// add class on label
				$currentField.prev('label').addClass(classHasValue);
				$currentField.closest($selectWrap).prev('label').addClass(classHasValue);
				// add class on wrapper
				$currentFieldWrap.addClass(classHasValue);
				// add class on label in wrapper
				$currentFieldWrap.find('label').addClass(classHasValue);
			}
		}
	}
}

/**
 * !Plugin HoverClass
 * */
(function ($) {
	var HoverClass = function (settings) {
		var options = $.extend({
			container: 'ul',
			item: 'li',
			drop: 'ul'
		},settings || {});

		var self = this;
		self.options = options;

		var container = $(options.container);
		self.$container = container;
		self.$item = $(options.item, container);
		self.$drop = $(options.drop, container);
		self.$html = $('html');

		self.modifiers = {
			hover: 'hover',
			hoverNext: 'hover_next',
			hoverPrev: 'hover_prev'
		};

		self.addClassHover();

		if (!DESKTOP) {
			$(window).on('debouncedresize', function () {
				self.removeClassHover();
			});
		}
	};

	HoverClass.prototype.addClassHover = function () {
		var self = this,
			_hover = this.modifiers.hover,
			_hoverNext = this.modifiers.hoverNext,
			_hoverPrev = this.modifiers.hoverPrev,
			$item = self.$item,
			item = self.options.item,
			$container = self.$container;

		if (!DESKTOP) {

			$container.on('click', ''+item+'', function (e) {
				var $currentAnchor = $(this);
				var currentItem = $currentAnchor.closest($item);

				if (!currentItem.has(self.$drop).length){ return; }

				e.stopPropagation();

				if (currentItem.hasClass(_hover)){
					// self.$html.removeClass('css-scroll-fixed');

					// if($('.main-sections-js').length) {
					// 	$.fn.fullpage.setAllowScrolling(true); // unblocked fullpage scroll
					// }

					currentItem.removeClass(_hover).find('.'+_hover+'').removeClass(_hover);

					return;
				}

				// self.$html.addClass('css-scroll-fixed');
				// if($('.main-sections-js').length) {
				// 	$.fn.fullpage.setAllowScrolling(false); // blocked fullpage scroll
				// }

				$('.'+_hover+'').not($currentAnchor.parents('.'+_hover+''))
					.removeClass(_hover)
					.find('.'+_hover+'')
					.removeClass(_hover);
				currentItem.addClass(_hover);

				e.preventDefault();
			});

			$container.on('click', ''+self.options.drop+'', function (e) {
				e.stopPropagation();
			});

			$(document).on('click', function () {
				$item.removeClass(_hover);
			});

		} else {
			$container.on('mouseenter', ''+item+'', function () {

				var currentItem = $(this);

				if (currentItem.prop('hoverTimeout')) {
					currentItem.prop('hoverTimeout', clearTimeout(currentItem.prop('hoverTimeout')));
				}

				currentItem.prop('hoverIntent', setTimeout(function () {
					// self.$html.addClass('css-scroll-fixed');
					// if($('.main-sections-js').length) {
					// 	$.fn.fullpage.setAllowScrolling(false); // blocked fullpage scroll
					// }

					currentItem.addClass(_hover);
					currentItem.next().addClass(_hoverNext);
					currentItem.prev().addClass(_hoverPrev);

				}, 50));

			}).on('mouseleave', ''+ item+'', function () {

				var currentItem = $(this);

				if (currentItem.prop('hoverIntent')) {
					currentItem.prop('hoverIntent', clearTimeout(currentItem.prop('hoverIntent')));
				}

				currentItem.prop('hoverTimeout', setTimeout(function () {
					// self.$html.removeClass('css-scroll-fixed');
					// if($('.main-sections-js').length) {
					// 	$.fn.fullpage.setAllowScrolling(true); // unblocked fullpage scroll
					// }

					currentItem.removeClass(_hover);
					currentItem.next().removeClass(_hoverNext);
					currentItem.prev().removeClass(_hoverPrev);
				}, 50));

			});

		}
	};

	HoverClass.prototype.removeClassHover = function () {
		var self = this;
		self.$item.removeClass(self.modifiers.hover );
	};

	window.HoverClass = HoverClass;

}(jQuery));

/**
 * !Toggle "hover" class by hover on the item of the list
 * */
function initHoverClass() {
	if ($('.nav__list-js').length) {
		new HoverClass({
			container: '.nav__list-js', drop: '.nav__drop-js'
		});
	}
}

/**
 * !Equal height of blocks by maximum height of them
 */
function equalHeight() {
	// equal height
	var $equalHeight = $('.equal-height-js');

	if($equalHeight.length) {
		$equalHeight.children().matchHeight({
			byRow: true, property: 'height', target: null, remove: false
		});
	}
}

/**
 * !multi accordion jquery plugin
 * */
(function ($) {
	var MultiAccordion = function (settings) {
		var options = $.extend({
			collapsibleAll: false, // если установить значение true, сворачиваются идентичные панели НА СТРАНИЦЕ, кроме текущего
			resizeCollapsible: false, // если установить значение true, при ресайзе будут соворачиваться все элементы
			container: null, // общий контейнер
			item: null, // непосредственный родитель открывающегося элемента
			handler: null, // открывающий элемента
			handlerWrap: null, // если открывающий элемент не является непосредственным соседом открывающегося элемента, нужно указать элемент, короный является оберткой открывающего элемета и лежит непосредственно перед открывающимся элементом (условно, является табом)
			panel: null, // открывающийся элемент
			openClass: 'active', // класс, который добавляется при открытии
			currentClass: 'current', // класс текущего элемента
			animateSpeed: 300, // скорость анимации
			collapsible: false // сворачивать соседние панели
		}, settings || {});

		this.options = options;
		var container = $(options.container);
		this.$container = container;
		this.$item = $(options.item, container);
		this.$handler = $(options.handler, container);
		this.$handlerWrap = $(options.handlerWrap, container);
		this._animateSpeed = options.animateSpeed;
		this.$totalCollapsible = $(options.totalCollapsible);
		this._resizeCollapsible = options.resizeCollapsible;

		this.modifiers = {
			active: options.openClass,
			current: options.currentClass
		};

		this.bindEvents();
		this.totalCollapsible();
		this.totalCollapsibleOnResize();

	};

	MultiAccordion.prototype.totalCollapsible = function () {
		var self = this;
		self.$totalCollapsible.on('click', function () {
			self.$panel.slideUp(self._animateSpeed, function () {
				self.$container.trigger('accordionChange');
			});
			self.$item.removeClass(self.modifiers.active);
		})
	};

	MultiAccordion.prototype.totalCollapsibleOnResize = function () {
		var self = this;
		$(window).on('resize', function () {
			if (self._resizeCollapsible) {
				self.$panel.slideUp(self._animateSpeed, function () {
					self.$container.trigger('accordionChange');
				});
				self.$item.removeClass(self.modifiers.active);
			}
		});
	};

	MultiAccordion.prototype.bindEvents = function () {
		var self = this;
		var $container = this.$container;
		var $item = this.$item;
		var panel = this.options.panel;

		$container.on('click', self.options.handler, function (e) {
			var $currentHandler = self.options.handlerWrap ? $(this).closest(self.options.handlerWrap) : $(this);
			var $currentItem = $currentHandler.closest($item);

			if ($currentItem.has($(panel)).length) {
				e.preventDefault();

				if ($currentHandler.next(panel).is(':visible')) {
					self.closePanel($currentItem);

					return;
				}

				if (self.options.collapsibleAll) {
					self.closePanel($($container).not($currentHandler.closest($container)).find($item));
				}

				if (self.options.collapsible) {
					self.closePanel($currentItem.siblings());
				}

				self.openPanel($currentItem, $currentHandler);
			}
		})
	};

	MultiAccordion.prototype.closePanel = function ($currentItem) {
		var self = this;
		var panel = self.options.panel;
		var openClass = self.modifiers.active;

		$currentItem.removeClass(openClass).find(panel).filter(':visible').slideUp(self._animateSpeed, function () {
			self.$container.trigger('mAccordionAfterClose').trigger('mAccordionAfterChange');
		});

		$currentItem
			.find(self.$item)
			.removeClass(openClass);
	};

	MultiAccordion.prototype.openPanel = function ($currentItem, $currentHandler) {
		var self = this;
		var panel = self.options.panel;

		$currentItem.addClass(self.modifiers.active);

		$currentHandler.next(panel).slideDown(self._animateSpeed, function () {
			self.$container.trigger('mAccordionAfterOpened').trigger('mAccordionAfterChange');
		});
	};

	window.MultiAccordion = MultiAccordion;
}(jQuery));

/**
 * !multi accordion initial
 * */
function multiAccordionInit() {

	var navMenu = '.nav__list-js';

	if ($(navMenu).length) {
		new MultiAccordion({
			container: navMenu,
			item: 'li',
			handler: '.nav-handler-js',
			handlerWrap: '.nav__tab-js',
			panel: '.nav__drop-js',
			openClass: 'is-open',
			animateSpeed: 200,
			collapsible: true
		});
	}
}

/**
 * !Initial custom select for cross-browser styling
 * */
function customSelect(select) {
	$.each(select, function () {
		var $thisSelect = $(this);
		// var placeholder = $thisSelect.attr('data-placeholder') || '';
		$thisSelect.select2({
			language: "ru",
			width: '100%',
			containerCssClass: 'cselect-head',
			dropdownCssClass: 'cselect-drop'
			// , placeholder: placeholder
		});
	})
}

/**
 * !Plugin collapse and expand blocks by fire events on the title of these blocks
 * !Extended capabilities
 * */
(function ($) {
	var JsAccordion = function (settings) {
		var options = $.extend(true, {
			accordionContainer: null,
			accordionItem: null,
			accordionHeader: null, // wrap for accordion's switcher
			accordionHand: null, // accordion's switcher
			accordionContent: null,
			indexInit: 0, // if "false", all accordion are closed
			showFromHash: true, // if "false", all accordion are closed
			animateSpeed: 300,
			scrollToTop: false, // if true, scroll to current accordion;
			scrollToTopSpeed: 300,
			scrollToTopOffset: 0,
			clickOutside: false, // if true, close current accordion's content on click outside accordion;
			collapseInside: true, // collapse attachments,
			modifiers: {
				activeItem: 'is-open',
				activeHeader: 'is-open',
				activeHand: 'is-open',
				activeContent: 'is-open',
				noHoverClass: 'is-open'
			}
		}, settings || {});

		this.options = options;
		var container = $(options.accordionContainer);

		this.$accordionContainer = container;
		this.$accordionItem = $(options.accordionItem, container);
		this.$accordionHeader = $(options.accordionHeader, container);
		this.$accordionHand = $(options.accordionHand, container);
		this.$accordionContent = options.accordionContent ?
			$(options.accordionContent, container) :
			this.$accordionHeader.next();

		this.scrollToTop = options.scrollToTop;
		this._scrollToTopSpeed = options.scrollToTopSpeed;
		this._scrollToTopOffset = options.scrollToTopOffset;
		this.clickOutside = options.clickOutside;
		this._indexInit = options.indexInit;
		this._animateSpeed = options.animateSpeed;
		this._collapseInside = options.collapseInside;

		this.modifiers = options.modifiers;

		this.bindEvents();
		if (options.indexInit !== false) {
			this.activeAccordion();
		}
		this.hashAccordion();
	};

	JsAccordion.prototype.bindEvents = function () {
		var self = this,
			$accordionContent = self.$accordionContent,
			animateSpeed = self._animateSpeed,
			modifiers = self.modifiers;

		self.$accordionHand.on('click', 'a', function (e) {
			e.stopPropagation();
		});

		self.$accordionHand.on('mouseenter', 'a', function () {
			$(this).closest(self.$accordionHand).addClass(modifiers.noHoverClass);
		}).on('mouseleave', 'a', function () {
			$(this).closest(self.$accordionHand).removeClass(modifiers.noHoverClass);
		});

		self.$accordionHand.on('click', function (e) {
			e.preventDefault();

			var $currentHand = $(this),
				$currentHeader = $currentHand.closest(self.$accordionHeader),
				$currentItem = $currentHand.closest(self.$accordionItem),
				$currentItemContent = $currentHeader.next();

			if ($accordionContent.is(':animated')) return;

			if ($currentHeader.hasClass(modifiers.activeHeader)){

				$currentItem.removeClass(modifiers.activeItem);
				$currentHeader.removeClass(modifiers.activeHeader);
				$currentHand.removeClass(modifiers.activeHand);
				$currentItemContent.removeClass(modifiers.activeContent);

				$currentItemContent.slideUp(animateSpeed, function () {

					if (self._collapseInside) {
						var $internalContent = $currentItem.find(self.$accordionHeader).next();

						$.each($internalContent, function () {
							if ($(this).hasClass(self.modifiers.activeContent)) {

								// self.scrollPosition($currentItem);

								$(this).slideUp(self._animateSpeed, function () {
									self.scrollPosition($currentItem);
								});
							}
						});


						$currentItem.find(self.$accordionItem).removeClass(self.modifiers.activeItem);
						$currentItem.find(self.$accordionHeader).removeClass(self.modifiers.activeHeader);
						$currentItem.find(self.$accordionHand).removeClass(self.modifiers.activeHand);
						$internalContent.removeClass(self.modifiers.activeContent);
					}
				});

				return;
			}

			var $siblings = $currentItem.siblings();

			$siblings.find(self.$accordionHeader).next().slideUp(self._animateSpeed);

			$siblings.removeClass(modifiers.activeItem);
			$siblings.find(self.$accordionHeader).removeClass(modifiers.activeHeader);
			$siblings.find(self.$accordionHand).removeClass(modifiers.activeHand);
			$siblings.find(self.$accordionHeader).next().removeClass(modifiers.activeContent);

			$currentItemContent.slideDown(animateSpeed, function () {
				self.scrollPosition($currentItem);
			});

			$currentItem.addClass(modifiers.activeItem);
			$currentHeader.addClass(modifiers.activeHeader);
			$currentHand.addClass(modifiers.activeHand);
			$currentItemContent.addClass(modifiers.activeContent);

			e.stopPropagation();
		});

		$(document).click(function () {
			if (self.clickOutside) {
				self.closeAllAccordions();
			}
		});

		$accordionContent.on('click', function(e){
			e.stopPropagation();
		});
	};

	// show accordion's content from hash tag
	JsAccordion.prototype.hashAccordion = function() {
		var self = this;
		var modifiers = self.modifiers,
			hashTag = window.location.hash;

		if ( !hashTag ) return false;

		var activeItemClass = modifiers.activeItem;
		var activeHeaderClass = modifiers.activeHeader;
		var activeHandClass = modifiers.activeHand;
		var activeContentClass = modifiers.activeContent;

		var $accordionHeader = self.$accordionHeader;
		var $accordionItem = self.$accordionItem;

		var $currentItem = $(hashTag);
		var $currentItemParents = $currentItem.parents().filter($accordionItem);

		// open parents accordion

		if ($currentItemParents.length) {
			var $currentHeaderParents = $currentItemParents.children($accordionHeader),
				$currentHandParents = $currentItemParents.children($accordionItem),
				$currentItemContentParents = $currentHeaderParents.next();

			$currentItemContentParents.slideDown(0);

			$currentItemParents.addClass(activeItemClass);
			$currentHeaderParents.addClass(activeHeaderClass);
			$currentHandParents.addClass(activeHandClass);
			$currentItemContentParents.addClass(activeContentClass);
		}

		// open current accordion

		var $currentHeader = $currentItem.children($accordionHeader),
			$currentHand = $currentHeader.children($accordionItem),
			$currentItemContent = $currentHeader.next();

		$currentItemContent.slideDown(0, function () {
			self.scrollPosition($currentItem);
		});

		$currentItem.addClass(activeItemClass);
		$currentHeader.addClass(activeHeaderClass);
		$currentHand.addClass(activeHandClass);
		$currentItemContent.addClass(activeContentClass);
	};

	// show current accordion's content
	JsAccordion.prototype.activeAccordion = function() {
		var self = this;
		var indexInit = self._indexInit;

		if ( indexInit === false ) return false;

		$.each(self.$accordionContainer, function () {
			var $currentItem = $(this).children().eq(indexInit);

			$currentItem.addClass(self.modifiers.activeItem);
			$currentItem.children(self.$accordionHeader).addClass(self.modifiers.activeHeader);
			$currentItem.children(self.$accordionHeader).find(self.$accordionHand).addClass(self.modifiers.activeHand);

			// self.scrollPosition($currentItem);

			$currentItem.children(self.$accordionHeader).next().addClass(self.modifiers.activeContent).slideDown(self._animateSpeed);
		});
	};

	// close all accordions
	JsAccordion.prototype.closeAllAccordions = function() {
		var self = this;

		self.$accordionHeader.next().slideUp(self._animateSpeed);

		var modifiers = self.modifiers;

		self.$accordionItem.removeClass(modifiers.activeItem);
		self.$accordionHeader.removeClass(modifiers.activeHeader);
		self.$accordionHand.removeClass(modifiers.activeHand);
		self.$accordionHeader.next().removeClass(modifiers.activeContent);
	};

	// open all accordions
	JsAccordion.prototype.openAllAccordions = function() {
		var self = this;

		self.$accordionHeader.next().slideDown(self._animateSpeed);

		var modifiers = self.modifiers;

		self.$accordionItem.addClass(modifiers.activeItem);
		self.$accordionHeader.addClass(modifiers.activeHeader);
		self.$accordionHand.addClass(modifiers.activeHand);
		self.$accordionHeader.next().addClass(modifiers.activeContent);
	};

	JsAccordion.prototype.scrollPosition = function (element) {
		var self = this;
		if (self.scrollToTop && !$('html, body').is('animated')) {
			$('html, body').animate({ scrollTop: element.offset().top - self._scrollToTopOffset }, self._scrollToTopSpeed);
		}
	};

	window.JsAccordion = JsAccordion;
}(jQuery));

/**
 * Initial accordion
 * */
function accordionInit() {
	// accordion default
	var $accordion = $('.accordion__container-js');

	if($accordion.length){
		new JsAccordion({
			accordionContainer: '.accordion__container-js',
			accordionItem: '.accordion__item-js',
			accordionHeader: '.accordion__header-js',
			accordionHand: '.accordion__hand-js',
			// scrollToTop: true,
			// scrollToTopSpeed: 300,
			// scrollToTopOffset: $('.header').outerHeight(),
			indexInit: false,
			clickOutside: false,
			animateSpeed: 200
		});
	}

	// filters roll up
	// var $filtersRollUp = $('.p-filters-list-js');
	//
	// if($filtersRollUp.length){
	// 	new JsAccordion({
	// 		accordionContainer: '.p-filters-list-js',
	// 		accordionItem: '.p-filters-item-js',
	// 		accordionHeader: '.p-filters-select-js',
	// 		accordionHand: '.p-filters-head-js',
	// 		// scrollToTop: true,
	// 		// scrollToTopSpeed: 300,
	// 		// scrollToTopOffset: $('.header').outerHeight(),
	// 		indexInit: false,
	// 		clickOutside: false,
	// 		animateSpeed: 200
	// 	});
	// }
}

/**
 * Filter drop
 * */
function filterDrop() {
	var $container = $('.p-filters-list-js'),
		$item = $('.p-filters-item-js'),
		select = '.p-filters-select-js',
		activeClass = 'is-open',
		$drop = $(select).next(),
		$wrap = $('<div/>');

	if($drop.length) {
		$.each($drop, function () {
			var $curDrop = $(this);
			$curDrop.children().wrapInner($wrap);
		})
	}

	function $setMaxHeight() {
		if($drop.length) {
			$.each($drop, function () {
				var $curDrop = $(this);
				$curDrop.css('max-height', $curDrop.children().children().outerHeight());
			})
		}
	}

	if ($container.length) {
		$setMaxHeight();

		$(window).on('debouncedresize', function () {
			$setMaxHeight();
		})
	}

	$container.on('click', select, function (e) {
		e.preventDefault();

		var $currentItem = $(this).closest($item);

		$currentItem.toggleClass(activeClass);
	});
}

/**
 * Shutters
 * */
;(function($){
	'use strict';

	var $doc = $(document),
		$html = $('html'),
		countFixedScroll = 0;

	var TClass = function(element, config){
		var self,
			$element = $(element),
			dataStopRemove = '[data-tc-stop]',
			classIsAdded = false;

		var callbacks = function() {
				/** track events */
				$.each(config, function (key, value) {
					if(typeof value === 'function') {
						$element.on('tClass.' + key, function (e, param) {
							return value(e, $element, param);
						});
					}
				});
			},
			add = function () {
				if (classIsAdded) return;

				// callback before added class
				$element.trigger('tClass.beforeAdded');

				var arr = [
					$element,
					$(config.switchBtn),
					config.toggleClassTo
				];

				$.each(arr, function () {
					var curElem = this;
					// если массив, то устанавливаем класс на каждый из элемент этого массива
					if ($.isArray(curElem)) {
						$.each(curElem, function () {
							var $curElem = $(this);
							if ($curElem.length) {
								$curElem.addClass(config.modifiers.currentClass);

								$element.trigger('tClass.afterEachAdded', $curElem);
							} else {
								// В консоль вывести предуприждение,
								// если указанного элемента не существует.
								console.warn('Element "' + this + '" does not exist!')
							}
						});
					} else {
						$(this).addClass(config.modifiers.currentClass);

						$element.trigger('tClass.afterEachAdded', $(this));
					}
				});

				if (config.cssScrollFixed) {
					countFixedScroll = ++countFixedScroll;
				}

				classIsAdded = true;

				toggleScroll();

				// callback after added class
				$element.trigger('tClass.afterAdded');
			},
			remove = function () {
				if (!classIsAdded) return;

				// callback beforeRemoved
				$element.trigger('tClass.beforeRemoved');

				var arr = [
					$element,
					$(config.switchBtn),
					config.toggleClassTo
				];

				$.each(arr, function () {
					var curElem = this;
					// если массив, то удаляем класс с каждого элемент этого массива
					if ($.isArray(curElem)) {
						$.each(curElem, function () {
							var $curElem = $(this);
							if ($curElem.length) {
								$curElem.removeClass(config.modifiers.currentClass);

								$element.trigger('tClass.afterEachRemoved', $curElem);
							} else {
								// В консоль вывести предуприждение,
								// если указанного элемента не существует.
								console.warn('Element "' + this + '" does not exist!')
							}
						});
					} else {
						$(this).removeClass(config.modifiers.currentClass);

						$element.trigger('tClass.afterEachRemoved', $(this));
					}
				});

				classIsAdded = false;

				if (config.cssScrollFixed) {
					countFixedScroll = --countFixedScroll;
				}
				toggleScroll();

				// callback afterRemoved
				$element.trigger('tClass.afterRemoved');
			},
			events = function () {
				$element.on('click', function (event) {
					if (classIsAdded) {
						remove();

						event.preventDefault();
						return false;
					}

					add();

					event.preventDefault();
					event.stopPropagation();
				});

				if (config.switchBtn) {
					$html.on('click', config.switchBtn, function (event) {
						var $this = $(this);

						event.preventDefault();

						if ($this.attr('data-tc-only-add') !== undefined) {
							add();

							return false;
						}

						if ($this.attr('data-tc-only-remove') !== undefined) {
							remove();

							return false;
						}

						if (classIsAdded) {
							remove();

							return false;
						}

						add();

						event.stopPropagation();
					})
				}
			},
			toggleScroll = function () {
				if (config.cssScrollFixed) {
					var mod = (config.cssScrollFixed === true) ? 'css-scroll-fixed' : config.cssScrollFixed;
					if (!countFixedScroll) {
						// Удаляем с тега html
						// класс блокирования прокрутки
						$html.removeClass(mod);
					} else {
						// Добавляем на тег html
						// класс блокирования прокрутки.
						$html.addClass(mod);
					}
				}
			},
			closeByClickOutside = function () {
				$doc.on('click', function(event){
					if(classIsAdded && config.removeOutsideClick && !$(event.target).closest(dataStopRemove).length) {
						remove();
						// event.stopPropagation();
					}
				});
			},
			closeByClickEsc = function () {
				$doc.keyup(function(event) {
					if (classIsAdded && event.keyCode === 27) {
						remove();
					}
				});
			},
			init = function () {
				$element.addClass(config.modifiers.init);
				$element.trigger('tClass.afterInit');
			};

		self = {
			callbacks: callbacks,
			remove: remove,
			events: events,
			closeByClickOutside: closeByClickOutside,
			closeByClickEsc: closeByClickEsc,
			init: init
		};

		return self;
	};

	// $.fn.tClass = function (options, params) {
	$.fn.tClass = function () {
		var _ = this,
			opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;
		for (i = 0; i < l; i++) {
			if (typeof opt === 'object' || typeof opt === 'undefined') {
				_[i].tClass = new TClass(_[i], $.extend(true, {}, $.fn.tClass.defaultOptions, opt));
				_[i].tClass.callbacks();
				_[i].tClass.events();
				_[i].tClass.closeByClickOutside();
				_[i].tClass.closeByClickEsc();
				_[i].tClass.init();
			}
			else {
				ret = _[i].tClass[opt].apply(_[i].tClass, args);
			}
			if (typeof ret !== 'undefined') {
				return ret;
			}
		}
		return _;
	};

	$.fn.tClass.defaultOptions = {
		switchBtn: null,
		toggleClassTo: null,
		removeOutsideClick: true,
		cssScrollFixed: false,
		modifiers: {
			init: 'tc--initialized',
			currentClass: 'tc--active'
		}
	};

})(jQuery);

function toggleShutters() {
	var $nav = $('.nav-opener-js'),
		nav,
		$filters = $('.filters-opener-js'),
		filters,
		$search = $('.search-opener-js'),
		search,
		searchForm = '.search-form-js',
		$request = $('.request-opener-js'),
		$requestForm = $('form', $request),
		request;

	if ($nav.length) {
		nav = $nav.tClass({
			toggleClassTo: ['html', '.nav-overlay-js', '.shutter--nav-js']
			, modifiers: {
				currentClass: 'nav-is-open open-only-mob'
				// open-only-mob - используется для адаптива
			}
			, cssScrollFixed: true
			, removeOutsideClick: true
			, beforeAdded: function () {
				$search.length && search.tClass('remove');
				$filters.length && filters.tClass('remove');
				$request.length && request.tClass('remove');
			}
		});
	}

	// filters
	if ($filters.length) {
		filters = $filters.tClass({
			toggleClassTo: ['html', '.filters-overlay-js', '.shutter--filters-js']
			, switchBtn: '.filter-closer-js'
			, modifiers: {
				currentClass: 'filters-is-open open-only-mob'
			}
			, cssScrollFixed: true
			, removeOutsideClick: true
			, beforeAdded: function () {
				$search.length && search.tClass('remove');
				$nav.length && nav.tClass('remove');
				$request.length && request.tClass('remove');
			}
		});
	}

	if ($search.length) {
		search = $search.tClass({
			toggleClassTo: ['html', searchForm]
			, modifiers: {
				currentClass: 'search-is-open'
			}
			, cssScrollFixed: false
			, removeOutsideClick: true
			, switchBtn: '.search-closer-js'
			, beforeAdded: function () {
				$nav.length && nav.tClass('remove');
				$filters.length && filters.tClass('remove');
				$request.length && request.tClass('remove');
			}
			, afterAdded: function () {
				setTimeout(function () {
					$(searchForm).find('input[type=search]').focus();
				}, 100)
			}
			, afterRemoved: function () {
				$(searchForm).find('input[type=search]').blur();
			}
		});
	}

	if ($request.length) {
		request = $request.tClass({
			toggleClassTo: ['html', '.filters-overlay-js', '.shutter--request-js']
			, modifiers: {
				currentClass: 'request-is-open'
			}
			, cssScrollFixed: true
			, removeOutsideClick: true
			, switchBtn: '.request-closer-js'
			, beforeAdded: function () {
				$nav.length && nav.tClass('remove');
				$filters.length && filters.tClass('remove');
				$search.length && search.tClass('remove');
			}
			// , afterAdded: function () {
			// 	setTimeout(function () {
			// 		$requestForm.find('input[type=search]').focus();
			// 	}, 100)
			// }
			// , afterRemoved: function () {
			// 	$(searchForm).find('input[type=search]').blur();
			// }
		});
	}
}

/**
 * !Initial sliders on the project
 * */
function slidersInit() {
	/**promo slider*/
	var $promoSlider = $('.promo-slider-js');

	if($promoSlider.length){
		$promoSlider.each(function () {
			var $curSlider = $(this);
			var dur = 200;

			$curSlider.slick({
				speed: dur,
				slidesToShow: 1,
				slidesToScroll: 1,
				// lazyLoad: 'ondemand',
				autoplay: true,
				autoplaySpeed: 3000,
				infinite: true,
				dots: true,
				arrows: true
				// responsive:[
				// 	{
				// 		breakpoint: 768,
				// 		settings: {
				// 			arrows: false
				// 		}
				// 	}
				// ]
			});

		});
	}

	/**similar slider*/
	var $similarSlider = $('.similar-slider-js');

	if($similarSlider.length){
		$similarSlider.each(function () {
			var $curSlider = $(this);
			var dur = 200;

			$curSlider.on('init', function (event, slick) {
				$(slick.$slides).matchHeight({
					byRow: true,
					property: 'height',
					target: null,
					remove: false
				});
			}).slick({
				speed: dur,
				slidesToShow: 4,
				slidesToScroll: 2,
				infinite: false,
				dots: false,
				arrows: true,
				responsive: [
					{
						breakpoint: 1100,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 3
						}
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2
						}
					},
					{
						breakpoint: 640,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
							dots: true,
							arrows: false
						}
					}
				]
			});
		});
	}
}

/**
 * !tab switcher
 * */
;(function($){
	'use strict';

	var MsTabs = function(element, config){
		var self,
			$element = $(element),
			$anchor = $element.find(config.anchor),
			$panels = $element.find(config.panels),
			$panel = $element.find(config.panel),
			isAnimated = false,
			activeId,
			isOpen = false,
			collapsed = $element.data('tabs-collapsed') || config.collapsed;

		var callbacks = function () {
			/** track events */
			$.each(config, function (key, value) {
				if (typeof value === 'function') {
					$element.on('msTabs.' + key, function (e, param) {
						return value(e, $element, param);
					});
				}
			});
		}, show = function () {
			// Определяем текущий таб
			var $activePanel = $panel.filter('[id="' + activeId + '"]'),
				$otherPanel = $panel.not('[id="' + activeId + '"]'),
				$activeAnchor = $anchor.filter('[href="#' + activeId + '"]');

			if (!isAnimated) {
				// console.log('Показать таб:', activeId);
				isAnimated = true;

				// Удалить активный класс со всех элементов
				toggleClass([$panel, $anchor], false);

				// Добавить класс на каждый активный элемент
				toggleClass([$activePanel, $activeAnchor], true);

				// Анимирование высоты табов
				$panels.animate({
					'height': $activePanel.outerHeight()
				}, config.animationSpeed, function () {
					$panels.css({
						'height': ''
					});
				});

				// Скрыть все табы, кроме активного
				hideTab($otherPanel);

				// Показать активный таб
				$activePanel
					.css({
						'z-index': 2,
						'visibility': 'visible'
					})
					.animate({
						'opacity': 1
					}, config.animationSpeed, function () {
						$activePanel.css({
							'position': 'relative',
							'left': 'auto',
							'top': 'auto'
						}).attr('tabindex', 0);

						$panels.css({
							'height': ''
						});

						// Анимация полностью завершена
						isOpen = true;
						isAnimated = false;
					});
			}

			// callback after showed tab
			$element.trigger('msTabs.afterShowed');
		}, hide = function () {
			// Определить текущий таб
			var $activePanel = $panel.filter('[id="' + activeId + '"]');

			if (!isAnimated) {
				// console.log("Скрыть таб: ", activeId);

				isAnimated = true;

				// Удалить активный класс со всех элементов
				toggleClass([$panel, $anchor], false);

				// Анимирование высоты табов
				$panels.animate({
					'height': 0
				}, config.animationSpeed);

				hideTab($activePanel, function () {
					$panels.css({
						'height': ''
					});

					isOpen = false;
					isAnimated = false;
				});
			}

			// callback after tab hidden
			$element.trigger('msTabs.afterHidden');
		}, hideTab = function (tab) {
			var callback = arguments[1];
			tab
				.css({
					'z-index': -1
				})
				.attr('tabindex', -1)
				.animate({
					'opacity': 0
				}, config.animationSpeed, function () {
					tab.css({
						'position': 'absolute',
						'left': 0,
						'top': 0,
						'visibility': 'hidden'
					});

					// Анимация полностью завершена
					if (typeof callback === "function") {
						callback();
					}
				});
		}, toggleClass = function (arr) {
			var remove = arguments[1] === false;
			$.each(arr, function () {
				var iElem = this;
				// если массив, то устанавливаем класс на каждый из элемент этого массива
				if ($.isArray(iElem)) {
					$.each(iElem, function () {
						var $curElem = $(this);
						if ($curElem.length) {
							// Если второй аргумент false, то удаляем класс
							if (remove) {
								$curElem.removeClass(config.modifiers.activeClass);
							} else {
								// Если второй аргумент не false, то добавляем класс
								$curElem.addClass(config.modifiers.activeClass);
							}
						} else {
							// В консоль вывести предупреждение,
							// если указанного элемента не существует.
							console.warn('Element "' + this + '" does not exist!')
						}
					});
				} else {
					// Если второй аргумент false, то удаляем класс
					if (remove) {
						$(iElem).removeClass(config.modifiers.activeClass);
					} else {
						// Если второй аргумент не false, то добавляем класс
						$(iElem).addClass(config.modifiers.activeClass);
					}
				}
			});
		}, events = function () {
			$element.on('click', config.anchor, function (event) {
				event.preventDefault();

				var curId = $(this).attr('href').substring(1);

				if (isAnimated || !collapsed && curId === activeId) {
					return false;
				}

				if (collapsed && isOpen && curId === activeId) {
					hide();
				} else {
					activeId = curId;
					show();
				}
			});
		}, init = function () {
			activeId = $anchor.filter('.' + config.modifiers.activeClass).length && $anchor.filter('.' + config.modifiers.activeClass).attr('href').substring(1);

			// console.log("activeId (сразу после инициализации): ", !!activeId);

			$panels.css({
				'display': 'block',
				'position': 'relative',
				'overflow': 'hidden'
			});

			$panel.css({
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'opacity': 0,
				'width': '100%',
				'visibility': 'hidden',
				'z-index': -1
			}).attr('tabindex', -1);

			if (activeId) {
				var $activePanel = $panel.filter('[id="' + activeId + '"]');

				// Добавить класс на каждый элемен
				toggleClass([$activePanel], true);

				// Показать активный таб
				$activePanel
					.css({
						'position': 'relative',
						'left': 'auto',
						'top': 'auto',
						'opacity': 1,
						'visibility': 'visible',
						'z-index': 2
					})
					.attr('tabindex', 0);

				isOpen = true;
			}


			$element.addClass(config.modifiers.init);

			$element.trigger('msTabs.afterInit');
		};

		self = {
			callbacks: callbacks,
			events: events,
			init: init
		};

		return self;
	};

	$.fn.msTabs = function () {
		var _ = this,
			opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;
		for (i = 0; i < l; i++) {
			if (typeof opt === 'object' || typeof opt === 'undefined') {
				_[i].msTabs = new MsTabs(_[i], $.extend(true, $.fn.msTabs.defaultOptions, opt));
				_[i].msTabs.init();
				_[i].msTabs.callbacks();
				_[i].msTabs.events();
			}
			else {
				ret = _[i].msTabs[opt].apply(_[i].msTabs, args);
			}
			if (typeof ret !== 'undefined') {
				return ret;
			}
		}
		return _;
	};

	$.fn.msTabs.defaultOptions = {
		anchor: '.tabs__anchor-js',
		panels: '.tabs__panels-js',
		panel: '.tabs__panel-js',
		animationSpeed: 300,
		collapsed: false,
		modifiers: {
			init: 'tabs--initialized',
			activeClass: 'tabs--active'
		}
	};

})(jQuery);

function tabSwitcher() {
	var $tabs = $('.tabs-js');

	if ($tabs.length) {
		$tabs.msTabs();
	}
}

/**
 * !Sticky element on page
 */
function stickyInit() {
	var offsetTop = (window.innerWidth < 992) ? 80 : 90;

	// aside sticky
	if ($('.m-aside').length) {
		stickybits('.m-aside__layout', {
			useStickyClasses: true,
			stickyBitStickyOffset: offsetTop
		});
	}
}
// if sticky is stuck

/**
 * !Show, fixed filters result
 * !Clear filters
 * !Filters count
 * */
$(function () {
	// fixed filters result

	var $mContainer = $('.m-container');

	if ($mContainer.length) {
		$(window).on('load scroll resize', function () {
			toggleClassFixed();
		});
	}

	var $html = $('html'),
		mContainerOffset = 0,
		currentScrollTop,
		filterResultFixedClass = 'filters-result-fixed';

	function toggleClassFixed() {
		mContainerOffset = $mContainer.offset().top + $mContainer.outerHeight();
		currentScrollTop = $(window).scrollTop() + window.innerHeight;

		var cond = mContainerOffset < currentScrollTop;

		$html.toggleClass(filterResultFixedClass, !cond);
	}

	var $filtersList = $('.p-filters-list-js');

	function changeEvents() {
		var _ = $(this);
		var cond = $('.p-filters-drop-list input:checked', _.closest('.p-filters-list-js')).length > 0;

		$html.toggleClass('filters-results-show', cond);

		// toggle disabled clear button
		$('.clear-filters-js', _.closest('.p-filters-js')).prop('disabled', !cond);

		// filters count
		var $items = $('.p-filters-item-js', _.closest('.p-filters-js')), count = 0;
		$.each($items, function () {
			var $curItem = $(this);
			if ($('.p-filters-drop-list input:checked', $curItem).length) {
				++count;
			}
		});
		$('.filters-count-js', _.closest('.p-filters-js')).html(count).toggleClass('hide', !count);
	}

	$filtersList.on('change', '.p-filters-drop-list input:checkbox', function () {
		changeEvents.call(this);
	});

	// clear filters
	$('.p-filters-js').on('click', '.clear-filters-js', function (e) {
		e.preventDefault();
		var _ = $(this);

		$('.p-filters-drop-list input:checked', _.closest('.p-filters-js')).prop('checked', false).trigger('change');
	});

	// trigger change after load
	// $('.p-filters-drop-list input:checked', $('.p-filters-list-js')).trigger('change');

	$(window).on('load', function () {
		if ($filtersList.length) {
			var $fltr = $('.p-filters-drop-list input:checkbox', $filtersList);
			$.each($fltr, function () {
				changeEvents.call(this);
			})
		}
	});
});

/**
 * !fotorama init
 * */
function fotoramaInit() {
	var $gallery = $('.gallery-js'),
		thumbwidth = 100,
		thumbheight = 100,
		ratio = 598/410;

	if (window.innerWidth < 640) {
		thumbwidth = 50;
		thumbheight = 50;
		ratio = 1 / 1;
	}

	$.each($gallery, function () {
		var $this = $(this);
		$this.fotorama({
			click: false,
			width: '100%',
			fit: 'scaledown',
			nav: 'thumbs',
			navposition: 'bottom',
			allowfullscreen: true,
			// arrows: 'always',
			thumbmargin: 10,
			thumbwidth: thumbwidth,
			thumbheight: thumbheight,
			thumbfit : 'scaledown',
			thumbborderwidth: 2,
			ratio: ratio
		});
	})
}

/**
 * !map initial
 * */
var styleMap = [
	{"featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{"color": "#f7f1df"}]}, {
		"featureType": "landscape.natural",
		"elementType": "geometry",
		"stylers": [{"color": "#d0e3b4"}]
	}, {"featureType": "landscape.natural.terrain", "elementType": "geometry", "stylers": [{"visibility": "off"}]}, {
		"featureType": "poi",
		"elementType": "labels",
		"stylers": [{"visibility": "off"}]
	}, {"featureType": "poi.business", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "poi.medical", "elementType": "geometry", "stylers": [{"color": "#fbd3da"}]}, {
		"featureType": "poi.park",
		"elementType": "geometry",
		"stylers": [{"color": "#bde6ab"}]
	}, {"featureType": "road", "elementType": "geometry.stroke", "stylers": [{"visibility": "off"}]}, {"featureType": "road", "elementType": "labels"}, {
		"featureType": "road.highway",
		"elementType": "geometry.fill",
		"stylers": [{"color": "#ffe15f"}]
	}, {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#efd151"}]}, {
		"featureType": "road.arterial",
		"elementType": "geometry.fill",
		"stylers": [{"color": "#ffffff"}]
	}, {"featureType": "road.local", "elementType": "geometry.fill", "stylers": [{"color": "black"}]}, {
		"featureType": "transit.station.airport",
		"elementType": "geometry.fill",
		"stylers": [{"color": "#cfb2db"}]
	}, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#a2daf2"}]}
];

function mapInit(){
	if (!$('[id*="-map"]').length) {return;}

	function mapCenter(index){
		var localObject = localObjects[index];

		return{
			lat: localObject[0].lat + localObject[1].latBias,
			lng: localObject[0].lng + localObject[1].lngBias
		};
	}

	var mapOptions = {};

	var markers = [],
		elementById = [
			document.getElementById('local-01-map')
		];

	if($(elementById[0]).length){
		mapOptions = {
			zoom: localObjects[0][3],
			center: mapCenter(0),
			styles: styleMap,
			mapTypeControl: false,
			scaleControl: false,
			scrollwheel: false
		};

		var map0 = new google.maps.Map(elementById[0], mapOptions);
		addMarker(0,map0);

		/*aligned after resize*/
		var resizeTimer0;
		$(window).on('debouncedresize', function () {
			clearTimeout(resizeTimer0);
			resizeTimer0 = setTimeout(function () {
				moveToLocation(0,map0);
			}, 500);
		});
	}

	// if($(elementById[1]).length){
	// 	mapOptions = {
	// 		zoom: 15,
	// 		center: mapCenter(1),
	// 		styles: styleMap,
	// 		mapTypeControl: false,
	// 		scaleControl: false,
	// 		scrollwheel: false
	// 	};
	//
	// 	var map1 = new google.maps.Map(elementById[1], mapOptions);
	// 	addMarker(1,map1);
	//
	// 	/*aligned after resize*/
	// 	var resizeTimer1;
	// 	$(window).on('resize', function () {
	// 		clearTimeout(resizeTimer1);
	// 		resizeTimer1 = setTimeout(function () {
	// 			moveToLocation(1,map1);
	// 		}, 500);
	// 	});
	// }

	/*move to location*/
	function moveToLocation(index, map){
		var object = localObjects[index];
		var center = new google.maps.LatLng(mapCenter(index));
		map.panTo(center);
		map.setZoom(object[3]);
	}

	var infoWindow = new google.maps.InfoWindow({
		maxWidth: 220
	});

	function addMarker(index,map) {
		var object = localObjects[index];

		var marker = new google.maps.Marker({
			position: object[0],
			//animation: google.maps.Animation.DROP,
			map: map,
			icon: object[2],
			title: object[4].title
		});

		markers.push(marker);

		function onMarkerClick() {
			var marker = this;

			infoWindow.setContent(
				'<div class="map-popup">' +
				'<h4>'+object[4].title+'</h4>' +
				'<div class="map-popup__list">' +
				'<div class="map-popup__row">'+object[4].address+'</div>' +
				'<div class="map-popup__row">'+object[4].email+'</div>' +
				// '<div class="map-popup__row">'+object[4].works+'</div>' +
				'</div>' +
				'</div>'
			);

			infoWindow.close();

			infoWindow.open(map, marker);
		}

		map.addListener('click', function () {
			infoWindow.close();
		});

		marker.addListener('click', onMarkerClick);
	}
}
/*map init end*/

/**
 * !Testing form validation (for example). Do not use on release!
 * */
function formSuccessExample() {
	var $form = $('.user-form form, .subs-form form');

	if ( $form.length ) {

		$form.submit(function (event) {
			var $thisForm = $(this);

			if ($thisForm.parent().hasClass('success-form')) return;

			event.preventDefault();

			testValidateForm($thisForm);
		});

		// $(':text, input[type="email"], textarea', $form).on('keyup change', function () {
		// 	var $form = $(this).closest('form');
		// 	if ($form.parent().hasClass('error-form')) {
		// 		testValidateForm($form);
		// 	}
		// })

	}

	function testValidateForm(form) {
		var $thisFormWrap = form.parent();

		var $inputs = $(':text, input[type="email"], input[type="password"], textarea', form);

		var inputsLength = $inputs.length;
		var inputsHasValueLength = $inputs.filter(function () {
			return $(this).val().length;
		}).length;

		$thisFormWrap.toggleClass('error-form', inputsLength !== inputsHasValueLength);
		$thisFormWrap.toggleClass('success-form', inputsLength === inputsHasValueLength);

		$.each($inputs, function () {
			var $thisInput = $(this);
			var thisInputVal = $thisInput.val();
			var $thisInputWrap = $thisInput.parent();

			$thisInput.toggleClass('error', !thisInputVal.length);
			$thisInput.toggleClass('success', !!thisInputVal.length);

			$thisInputWrap.toggleClass('error', !thisInputVal.length);
			$thisInputWrap.toggleClass('success', !!thisInputVal.length);
		});
	}
}

/**
 * =========== !ready document, load/resize window ===========
 */

$(window).on('load', function () {
	// add functions
});

$(window).on('debouncedresize', function () {
	// $(document.body).trigger("sticky_kit:recalc");
});

$(document).ready(function () {
	placeholderInit();
	printShow();
	inputToggleFocusClass();
	inputHasValueClass();
	initHoverClass();
	equalHeight();
	multiAccordionInit();
	customSelect($('select.cselect'));
	accordionInit();
	filterDrop();
	toggleShutters();
	slidersInit();
	tabSwitcher();
	stickyInit();
	fotoramaInit();
	mapInit();
	objectFitImages(); // object-fit-images initial

	formSuccessExample();
});
