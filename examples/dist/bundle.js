require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _utilsStripDiacritics = require('./utils/stripDiacritics');

var _utilsStripDiacritics2 = _interopRequireDefault(_utilsStripDiacritics);

var propTypes = {
	autoload: _react2['default'].PropTypes.bool.isRequired, // automatically call the `loadOptions` prop on-mount; defaults to true
	cache: _react2['default'].PropTypes.any, // object to use to cache results; set to null/false to disable caching
	children: _react2['default'].PropTypes.func.isRequired, // Child function responsible for creating the inner Select component; (props: Object): PropTypes.element
	ignoreAccents: _react2['default'].PropTypes.bool, // strip diacritics when filtering; defaults to true
	ignoreCase: _react2['default'].PropTypes.bool, // perform case-insensitive filtering; defaults to true
	loadingPlaceholder: _react2['default'].PropTypes.oneOfType([// replaces the placeholder while options are loading
	_react2['default'].PropTypes.string, _react2['default'].PropTypes.node]),
	loadOptions: _react2['default'].PropTypes.func.isRequired, // callback to load options asynchronously; (inputValue: string, callback: Function): ?Promise
	options: _react.PropTypes.array.isRequired, // array of options
	placeholder: _react2['default'].PropTypes.oneOfType([// field placeholder, displayed when there's no value (shared with Select)
	_react2['default'].PropTypes.string, _react2['default'].PropTypes.node]),
	noResultsText: _react2['default'].PropTypes.oneOfType([// field noResultsText, displayed when no options come back from the server
	_react2['default'].PropTypes.string, _react2['default'].PropTypes.node]),
	onChange: _react2['default'].PropTypes.func, // onChange handler: function (newValue) {}
	searchPromptText: _react2['default'].PropTypes.oneOfType([// label to prompt for search input
	_react2['default'].PropTypes.string, _react2['default'].PropTypes.node]),
	onInputChange: _react2['default'].PropTypes.func, // optional for keeping track of what is being typed
	value: _react2['default'].PropTypes.any };

// initial field value
var defaultCache = {};

var defaultProps = {
	autoload: true,
	cache: defaultCache,
	children: defaultChildren,
	ignoreAccents: true,
	ignoreCase: true,
	loadingPlaceholder: 'Loading...',
	options: [],
	searchPromptText: 'Type to search'
};

var Async = (function (_Component) {
	_inherits(Async, _Component);

	function Async(props, context) {
		_classCallCheck(this, Async);

		_get(Object.getPrototypeOf(Async.prototype), 'constructor', this).call(this, props, context);

		this._cache = props.cache === defaultCache ? {} : props.cache;

		this.state = {
			isLoading: false,
			options: props.options
		};

		this._onInputChange = this._onInputChange.bind(this);
	}

	_createClass(Async, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var autoload = this.props.autoload;

			if (autoload) {
				this.loadOptions('');
			}
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate(nextProps, nextState) {
			var _this = this;

			var propertiesToSync = ['options'];
			propertiesToSync.forEach(function (prop) {
				if (_this.props[prop] !== nextProps[prop]) {
					_this.setState(_defineProperty({}, prop, nextProps[prop]));
				}
			});
		}
	}, {
		key: 'clearOptions',
		value: function clearOptions() {
			this.setState({ options: [] });
		}
	}, {
		key: 'loadOptions',
		value: function loadOptions(inputValue) {
			var _this2 = this;

			var loadOptions = this.props.loadOptions;

			var cache = this._cache;

			if (cache && cache.hasOwnProperty(inputValue)) {
				this.setState({
					options: cache[inputValue]
				});

				return;
			}

			var callback = function callback(error, data) {
				if (callback === _this2._callback) {
					_this2._callback = null;

					var options = data && data.options || [];

					if (cache) {
						cache[inputValue] = options;
					}

					_this2.setState({
						isLoading: false,
						options: options
					});
				}
			};

			// Ignore all but the most recent request
			this._callback = callback;

			var promise = loadOptions(inputValue, callback);
			if (promise) {
				promise.then(function (data) {
					return callback(null, data);
				}, function (error) {
					return callback(error);
				});
			}

			if (this._callback && !this.state.isLoading) {
				this.setState({
					isLoading: true
				});
			}

			return inputValue;
		}
	}, {
		key: '_onInputChange',
		value: function _onInputChange(inputValue) {
			var _props = this.props;
			var ignoreAccents = _props.ignoreAccents;
			var ignoreCase = _props.ignoreCase;
			var onInputChange = _props.onInputChange;

			if (ignoreAccents) {
				inputValue = (0, _utilsStripDiacritics2['default'])(inputValue);
			}

			if (ignoreCase) {
				inputValue = inputValue.toLowerCase();
			}

			if (onInputChange) {
				onInputChange(inputValue);
			}

			return this.loadOptions(inputValue);
		}
	}, {
		key: 'inputValue',
		value: function inputValue() {
			if (this.select) {
				return this.select.state.inputValue;
			}
			return '';
		}
	}, {
		key: 'noResultsText',
		value: function noResultsText() {
			var _props2 = this.props;
			var loadingPlaceholder = _props2.loadingPlaceholder;
			var noResultsText = _props2.noResultsText;
			var searchPromptText = _props2.searchPromptText;
			var isLoading = this.state.isLoading;

			var inputValue = this.inputValue();

			if (isLoading) {
				return loadingPlaceholder;
			}
			if (inputValue && noResultsText) {
				return noResultsText;
			}
			return searchPromptText;
		}
	}, {
		key: 'focus',
		value: function focus() {
			this.select.focus();
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var _props3 = this.props;
			var children = _props3.children;
			var loadingPlaceholder = _props3.loadingPlaceholder;
			var placeholder = _props3.placeholder;
			var _state = this.state;
			var isLoading = _state.isLoading;
			var options = _state.options;

			var props = {
				noResultsText: this.noResultsText(),
				placeholder: isLoading ? loadingPlaceholder : placeholder,
				options: isLoading && loadingPlaceholder ? [] : options,
				ref: function ref(_ref) {
					return _this3.select = _ref;
				},
				onChange: function onChange(newValues) {
					if (_this3.props.multi && _this3.props.value && newValues.length > _this3.props.value.length) {
						_this3.clearOptions();
					}
					_this3.props.onChange(newValues);
				}
			};

			return children(_extends({}, this.props, props, {
				isLoading: isLoading,
				onInputChange: this._onInputChange
			}));
		}
	}]);

	return Async;
})(_react.Component);

exports['default'] = Async;

Async.propTypes = propTypes;
Async.defaultProps = defaultProps;

function defaultChildren(props) {
	return _react2['default'].createElement(_Select2['default'], props);
};
module.exports = exports['default'];

},{"./Select":"react-select","./utils/stripDiacritics":10,"react":undefined}],2:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

function reduce(obj) {
	var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	return Object.keys(obj).reduce(function (props, key) {
		var value = obj[key];
		if (value !== undefined) props[key] = value;
		return props;
	}, props);
}

var AsyncCreatable = _react2['default'].createClass({
	displayName: 'AsyncCreatableSelect',

	render: function render() {
		var _this = this;

		return _react2['default'].createElement(
			_Select2['default'].Async,
			this.props,
			function (asyncProps) {
				return _react2['default'].createElement(
					_Select2['default'].Creatable,
					_this.props,
					function (creatableProps) {
						return _react2['default'].createElement(_Select2['default'], _extends({}, reduce(asyncProps, reduce(creatableProps, {})), {
							onInputChange: function (input) {
								creatableProps.onInputChange(input);
								return asyncProps.onInputChange(input);
							},
							ref: function (ref) {
								creatableProps.ref(ref);
								asyncProps.ref(ref);
							}
						}));
					}
				);
			}
		);
	}
});

module.exports = AsyncCreatable;

},{"./Select":"react-select","react":undefined}],3:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _utilsDefaultFilterOptions = require('./utils/defaultFilterOptions');

var _utilsDefaultFilterOptions2 = _interopRequireDefault(_utilsDefaultFilterOptions);

var _utilsDefaultMenuRenderer = require('./utils/defaultMenuRenderer');

var _utilsDefaultMenuRenderer2 = _interopRequireDefault(_utilsDefaultMenuRenderer);

var Creatable = _react2['default'].createClass({
	displayName: 'CreatableSelect',

	propTypes: {
		// Child function responsible for creating the inner Select component
		// This component can be used to compose HOCs (eg Creatable and Async)
		// (props: Object): PropTypes.element
		children: _react2['default'].PropTypes.func,

		// See Select.propTypes.filterOptions
		filterOptions: _react2['default'].PropTypes.any,

		// Searches for any matching option within the set of options.
		// This function prevents duplicate options from being created.
		// ({ option: Object, options: Array, labelKey: string, valueKey: string }): boolean
		isOptionUnique: _react2['default'].PropTypes.func,

		// Determines if the current input text represents a valid option.
		// ({ label: string }): boolean
		isValidNewOption: _react2['default'].PropTypes.func,

		// See Select.propTypes.menuRenderer
		menuRenderer: _react2['default'].PropTypes.any,

		// Factory to create new option.
		// ({ label: string, labelKey: string, valueKey: string }): Object
		newOptionCreator: _react2['default'].PropTypes.func,

		// input change handler: function (inputValue) {}
		onInputChange: _react2['default'].PropTypes.func,

		// input keyDown handler: function (event) {}
		onInputKeyDown: _react2['default'].PropTypes.func,

		// new option click handler: function (option) {}
		onNewOptionClick: _react2['default'].PropTypes.func,

		// See Select.propTypes.options
		options: _react2['default'].PropTypes.array,

		// Creates prompt/placeholder option text.
		// (filterText: string): string
		promptTextCreator: _react2['default'].PropTypes.func,

		// Decides if a keyDown event (eg its `keyCode`) should result in the creation of a new option.
		shouldKeyDownEventCreateNewOption: _react2['default'].PropTypes.func
	},

	// Default prop methods
	statics: {
		isOptionUnique: isOptionUnique,
		isValidNewOption: isValidNewOption,
		newOptionCreator: newOptionCreator,
		promptTextCreator: promptTextCreator,
		shouldKeyDownEventCreateNewOption: shouldKeyDownEventCreateNewOption
	},

	getDefaultProps: function getDefaultProps() {
		return {
			filterOptions: _utilsDefaultFilterOptions2['default'],
			isOptionUnique: isOptionUnique,
			isValidNewOption: isValidNewOption,
			menuRenderer: _utilsDefaultMenuRenderer2['default'],
			newOptionCreator: newOptionCreator,
			promptTextCreator: promptTextCreator,
			shouldKeyDownEventCreateNewOption: shouldKeyDownEventCreateNewOption
		};
	},

	createNewOption: function createNewOption() {
		var _props = this.props;
		var isValidNewOption = _props.isValidNewOption;
		var newOptionCreator = _props.newOptionCreator;
		var onNewOptionClick = _props.onNewOptionClick;
		var _props$options = _props.options;
		var options = _props$options === undefined ? [] : _props$options;
		var shouldKeyDownEventCreateNewOption = _props.shouldKeyDownEventCreateNewOption;

		if (isValidNewOption({ label: this.inputValue })) {
			var option = newOptionCreator({ label: this.inputValue, labelKey: this.labelKey, valueKey: this.valueKey });
			var _isOptionUnique = this.isOptionUnique({ option: option });

			// Don't add the same option twice.
			if (_isOptionUnique) {
				if (onNewOptionClick) {
					onNewOptionClick(option);
				} else {
					options.unshift(option);

					this.select.selectValue(option);
				}
			}
		}
	},

	filterOptions: function filterOptions() {
		var _props2 = this.props;
		var filterOptions = _props2.filterOptions;
		var isValidNewOption = _props2.isValidNewOption;
		var options = _props2.options;
		var promptTextCreator = _props2.promptTextCreator;

		// TRICKY Check currently selected options as well.
		// Don't display a create-prompt for a value that's selected.
		// This covers async edge-cases where a newly-created Option isn't yet in the async-loaded array.
		var excludeOptions = arguments[2] || [];

		var filteredOptions = filterOptions.apply(undefined, arguments) || [];

		if (isValidNewOption({ label: this.inputValue })) {
			var _newOptionCreator = this.props.newOptionCreator;

			var option = _newOptionCreator({
				label: this.inputValue,
				labelKey: this.labelKey,
				valueKey: this.valueKey
			});

			// TRICKY Compare to all options (not just filtered options) in case option has already been selected).
			// For multi-selects, this would remove it from the filtered list.
			var _isOptionUnique2 = this.isOptionUnique({
				option: option,
				options: excludeOptions.concat(filteredOptions)
			});

			if (_isOptionUnique2) {
				var _prompt = promptTextCreator(this.inputValue);

				this._createPlaceholderOption = _newOptionCreator({
					label: _prompt,
					labelKey: this.labelKey,
					valueKey: this.valueKey
				});

				filteredOptions.unshift(this._createPlaceholderOption);
			}
		}

		return filteredOptions;
	},

	isOptionUnique: function isOptionUnique(_ref2) {
		var option = _ref2.option;
		var options = _ref2.options;
		var isOptionUnique = this.props.isOptionUnique;

		options = options || this.select.filterOptions();

		return isOptionUnique({
			labelKey: this.labelKey,
			option: option,
			options: options,
			valueKey: this.valueKey
		});
	},

	menuRenderer: function menuRenderer(params) {
		var menuRenderer = this.props.menuRenderer;

		return menuRenderer(_extends({}, params, {
			onSelect: this.onOptionSelect,
			selectValue: this.onOptionSelect
		}));
	},

	onInputChange: function onInputChange(input) {
		var onInputChange = this.props.onInputChange;

		if (onInputChange) {
			onInputChange(input);
		}

		// This value may be needed in between Select mounts (when this.select is null)
		this.inputValue = input;
	},

	onInputKeyDown: function onInputKeyDown(event) {
		var _props3 = this.props;
		var shouldKeyDownEventCreateNewOption = _props3.shouldKeyDownEventCreateNewOption;
		var onInputKeyDown = _props3.onInputKeyDown;

		var focusedOption = this.select.getFocusedOption();

		if (focusedOption && focusedOption === this._createPlaceholderOption && shouldKeyDownEventCreateNewOption({ keyCode: event.keyCode })) {
			this.createNewOption();

			// Prevent decorated Select from doing anything additional with this keyDown event
			event.preventDefault();
		} else if (onInputKeyDown) {
			onInputKeyDown(event);
		}
	},

	onOptionSelect: function onOptionSelect(option, event) {
		if (option === this._createPlaceholderOption) {
			this.createNewOption();
		} else {
			this.select.selectValue(option);
		}
	},

	render: function render() {
		var _this = this;

		var _props4 = this.props;
		var newOptionCreator = _props4.newOptionCreator;
		var shouldKeyDownEventCreateNewOption = _props4.shouldKeyDownEventCreateNewOption;

		var restProps = _objectWithoutProperties(_props4, ['newOptionCreator', 'shouldKeyDownEventCreateNewOption']);

		var children = this.props.children;

		// We can't use destructuring default values to set the children,
		// because it won't apply work if `children` is null. A falsy check is
		// more reliable in real world use-cases.
		if (!children) {
			children = defaultChildren;
		}

		var props = _extends({}, restProps, {
			allowCreate: true,
			filterOptions: this.filterOptions,
			menuRenderer: this.menuRenderer,
			onInputChange: this.onInputChange,
			onInputKeyDown: this.onInputKeyDown,
			ref: function ref(_ref) {
				_this.select = _ref;

				// These values may be needed in between Select mounts (when this.select is null)
				if (_ref) {
					_this.labelKey = _ref.props.labelKey;
					_this.valueKey = _ref.props.valueKey;
				}
			}
		});

		return children(props);
	}
});

function defaultChildren(props) {
	return _react2['default'].createElement(_Select2['default'], props);
};

function isOptionUnique(_ref3) {
	var option = _ref3.option;
	var options = _ref3.options;
	var labelKey = _ref3.labelKey;
	var valueKey = _ref3.valueKey;

	return options.filter(function (existingOption) {
		return existingOption[labelKey] === option[labelKey] || existingOption[valueKey] === option[valueKey];
	}).length === 0;
};

function isValidNewOption(_ref4) {
	var label = _ref4.label;

	return !!label;
};

function newOptionCreator(_ref5) {
	var label = _ref5.label;
	var labelKey = _ref5.labelKey;
	var valueKey = _ref5.valueKey;

	var option = {};
	option[valueKey] = label;
	option[labelKey] = label;
	option.className = 'Select-create-option-placeholder';
	return option;
};

function promptTextCreator(label) {
	return 'Create option "' + label + '"';
}

function shouldKeyDownEventCreateNewOption(_ref6) {
	var keyCode = _ref6.keyCode;

	switch (keyCode) {
		case 9: // TAB
		case 13: // ENTER
		case 188:
			// COMMA
			return true;
	}

	return false;
};

module.exports = Creatable;

},{"./Select":"react-select","./utils/defaultFilterOptions":8,"./utils/defaultMenuRenderer":9,"react":undefined}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Option = _react2['default'].createClass({
	displayName: 'Option',

	propTypes: {
		children: _react2['default'].PropTypes.node,
		className: _react2['default'].PropTypes.string, // className (based on mouse position)
		instancePrefix: _react2['default'].PropTypes.string.isRequired, // unique prefix for the ids (used for aria)
		isDisabled: _react2['default'].PropTypes.bool, // the option is disabled
		isFocused: _react2['default'].PropTypes.bool, // the option is focused
		isSelected: _react2['default'].PropTypes.bool, // the option is selected
		onFocus: _react2['default'].PropTypes.func, // method to handle mouseEnter on option element
		onSelect: _react2['default'].PropTypes.func, // method to handle click on option element
		onUnfocus: _react2['default'].PropTypes.func, // method to handle mouseLeave on option element
		option: _react2['default'].PropTypes.object.isRequired, // object that is base for that option
		optionIndex: _react2['default'].PropTypes.number },
	// index of the option, used to generate unique ids for aria
	blockEvent: function blockEvent(event) {
		event.preventDefault();
		event.stopPropagation();
		if (event.target.tagName !== 'A' || !('href' in event.target)) {
			return;
		}
		if (event.target.target) {
			window.open(event.target.href, event.target.target);
		} else {
			window.location.href = event.target.href;
		}
	},

	handleMouseDown: function handleMouseDown(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
	},

	handleMouseEnter: function handleMouseEnter(event) {
		this.onFocus(event);
	},

	handleMouseMove: function handleMouseMove(event) {
		this.onFocus(event);
	},

	handleTouchEnd: function handleTouchEnd(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		this.handleMouseDown(event);
	},

	handleTouchMove: function handleTouchMove(event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart: function handleTouchStart(event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	onFocus: function onFocus(event) {
		if (!this.props.isFocused) {
			this.props.onFocus(this.props.option, event);
		}
	},
	render: function render() {
		var _props = this.props;
		var option = _props.option;
		var instancePrefix = _props.instancePrefix;
		var optionIndex = _props.optionIndex;

		var className = (0, _classnames2['default'])(this.props.className, option.className);

		return option.disabled ? _react2['default'].createElement(
			'div',
			{ className: className,
				onMouseDown: this.blockEvent,
				onClick: this.blockEvent },
			this.props.children
		) : _react2['default'].createElement(
			'div',
			{ className: className,
				style: option.style,
				role: 'option',
				onMouseDown: this.handleMouseDown,
				onMouseEnter: this.handleMouseEnter,
				onMouseMove: this.handleMouseMove,
				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove,
				onTouchEnd: this.handleTouchEnd,
				id: instancePrefix + '-option-' + optionIndex,
				title: option.title },
			this.props.children
		);
	}
});

module.exports = Option;

},{"classnames":undefined,"react":undefined}],5:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Value = _react2['default'].createClass({

	displayName: 'Value',

	propTypes: {
		children: _react2['default'].PropTypes.node,
		disabled: _react2['default'].PropTypes.bool, // disabled prop passed to ReactSelect
		id: _react2['default'].PropTypes.string, // Unique id for the value - used for aria
		onClick: _react2['default'].PropTypes.func, // method to handle click on value label
		onRemove: _react2['default'].PropTypes.func, // method to handle removal of the value
		value: _react2['default'].PropTypes.object.isRequired },

	// the option object for this value
	handleMouseDown: function handleMouseDown(event) {
		if (event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		if (this.props.onClick) {
			event.stopPropagation();
			this.props.onClick(this.props.value, event);
			return;
		}
		if (this.props.value.href) {
			event.stopPropagation();
		}
	},

	onRemove: function onRemove(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onRemove(this.props.value);
	},

	handleTouchEndRemove: function handleTouchEndRemove(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		// Fire the mouse events
		this.onRemove(event);
	},

	handleTouchMove: function handleTouchMove(event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart: function handleTouchStart(event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	renderRemoveIcon: function renderRemoveIcon() {
		if (this.props.disabled || !this.props.onRemove) return;
		return _react2['default'].createElement(
			'span',
			{ className: 'Select-value-icon',
				'aria-hidden': 'true',
				onMouseDown: this.onRemove,
				onTouchEnd: this.handleTouchEndRemove,
				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove },
			'×'
		);
	},

	renderLabel: function renderLabel() {
		var className = 'Select-value-label';
		return this.props.onClick || this.props.value.href ? _react2['default'].createElement(
			'a',
			{ className: className, href: this.props.value.href, target: this.props.value.target, onMouseDown: this.handleMouseDown, onTouchEnd: this.handleMouseDown },
			this.props.children
		) : _react2['default'].createElement(
			'span',
			{ className: className, role: 'option', 'aria-selected': 'true', id: this.props.id },
			this.props.children
		);
	},

	render: function render() {
		return _react2['default'].createElement(
			'div',
			{ className: (0, _classnames2['default'])('Select-value', this.props.value.className),
				style: this.props.value.style,
				title: this.props.value.title
			},
			this.renderRemoveIcon(),
			this.renderLabel()
		);
	}

});

module.exports = Value;

},{"classnames":undefined,"react":undefined}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = arrowRenderer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function arrowRenderer(_ref) {
	var onMouseDown = _ref.onMouseDown;

	return _react2["default"].createElement("span", {
		className: "Select-arrow",
		onMouseDown: onMouseDown
	});
}

;
module.exports = exports["default"];

},{"react":undefined}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = clearRenderer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function clearRenderer() {
	return _react2['default'].createElement('span', {
		className: 'Select-clear',
		dangerouslySetInnerHTML: { __html: '&times;' }
	});
}

;
module.exports = exports['default'];

},{"react":undefined}],8:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stripDiacritics = require('./stripDiacritics');

var _stripDiacritics2 = _interopRequireDefault(_stripDiacritics);

function filterOptions(options, filterValue, excludeOptions, props) {
	var _this = this;

	if (props.ignoreAccents) {
		filterValue = (0, _stripDiacritics2['default'])(filterValue);
	}

	if (props.ignoreCase) {
		filterValue = filterValue.toLowerCase();
	}

	if (excludeOptions) excludeOptions = excludeOptions.map(function (i) {
		return i[props.valueKey];
	});

	return options.filter(function (option) {
		if (excludeOptions && excludeOptions.indexOf(option[props.valueKey]) > -1) return false;
		if (props.filterOption) return props.filterOption.call(_this, option, filterValue);
		if (!filterValue) return true;
		var valueTest = String(option[props.valueKey]);
		var labelTest = String(option[props.labelKey]);
		if (props.ignoreAccents) {
			if (props.matchProp !== 'label') valueTest = (0, _stripDiacritics2['default'])(valueTest);
			if (props.matchProp !== 'value') labelTest = (0, _stripDiacritics2['default'])(labelTest);
		}
		if (props.ignoreCase) {
			if (props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
			if (props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
		}
		return props.matchPos === 'start' ? props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue || props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue : props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0 || props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0;
	});
}

module.exports = filterOptions;

},{"./stripDiacritics":10}],9:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function menuRenderer(_ref) {
	var focusedOption = _ref.focusedOption;
	var instancePrefix = _ref.instancePrefix;
	var labelKey = _ref.labelKey;
	var onFocus = _ref.onFocus;
	var onSelect = _ref.onSelect;
	var optionClassName = _ref.optionClassName;
	var optionComponent = _ref.optionComponent;
	var optionRenderer = _ref.optionRenderer;
	var options = _ref.options;
	var valueArray = _ref.valueArray;
	var valueKey = _ref.valueKey;
	var onOptionRef = _ref.onOptionRef;

	var Option = optionComponent;

	return options.map(function (option, i) {
		var isSelected = valueArray && valueArray.indexOf(option) > -1;
		var isFocused = option === focusedOption;
		var optionClass = (0, _classnames2['default'])(optionClassName, {
			'Select-option': true,
			'is-selected': isSelected,
			'is-focused': isFocused,
			'is-disabled': option.disabled
		});

		return _react2['default'].createElement(
			Option,
			{
				className: optionClass,
				instancePrefix: instancePrefix,
				isDisabled: option.disabled,
				isFocused: isFocused,
				isSelected: isSelected,
				key: 'option-' + i + '-' + option[valueKey],
				onFocus: onFocus,
				onSelect: onSelect,
				option: option,
				optionIndex: i,
				ref: function (ref) {
					onOptionRef(ref, isFocused);
				}
			},
			optionRenderer(option, i)
		);
	});
}

module.exports = menuRenderer;

},{"classnames":undefined,"react":undefined}],10:[function(require,module,exports){
'use strict';

var map = [{ 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g }, { 'base': 'AA', 'letters': /[\uA732]/g }, { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g }, { 'base': 'AO', 'letters': /[\uA734]/g }, { 'base': 'AU', 'letters': /[\uA736]/g }, { 'base': 'AV', 'letters': /[\uA738\uA73A]/g }, { 'base': 'AY', 'letters': /[\uA73C]/g }, { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g }, { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g }, { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g }, { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g }, { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g }, { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g }, { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g }, { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g }, { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g }, { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g }, { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g }, { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g }, { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g }, { 'base': 'LJ', 'letters': /[\u01C7]/g }, { 'base': 'Lj', 'letters': /[\u01C8]/g }, { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g }, { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g }, { 'base': 'NJ', 'letters': /[\u01CA]/g }, { 'base': 'Nj', 'letters': /[\u01CB]/g }, { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g }, { 'base': 'OI', 'letters': /[\u01A2]/g }, { 'base': 'OO', 'letters': /[\uA74E]/g }, { 'base': 'OU', 'letters': /[\u0222]/g }, { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g }, { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g }, { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g }, { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g }, { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g }, { 'base': 'TZ', 'letters': /[\uA728]/g }, { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g }, { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g }, { 'base': 'VY', 'letters': /[\uA760]/g }, { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g }, { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g }, { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g }, { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g }, { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g }, { 'base': 'aa', 'letters': /[\uA733]/g }, { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g }, { 'base': 'ao', 'letters': /[\uA735]/g }, { 'base': 'au', 'letters': /[\uA737]/g }, { 'base': 'av', 'letters': /[\uA739\uA73B]/g }, { 'base': 'ay', 'letters': /[\uA73D]/g }, { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g }, { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g }, { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g }, { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g }, { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g }, { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g }, { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g }, { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g }, { 'base': 'hv', 'letters': /[\u0195]/g }, { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g }, { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g }, { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g }, { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g }, { 'base': 'lj', 'letters': /[\u01C9]/g }, { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g }, { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g }, { 'base': 'nj', 'letters': /[\u01CC]/g }, { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g }, { 'base': 'oi', 'letters': /[\u01A3]/g }, { 'base': 'ou', 'letters': /[\u0223]/g }, { 'base': 'oo', 'letters': /[\uA74F]/g }, { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g }, { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g }, { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g }, { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g }, { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g }, { 'base': 'tz', 'letters': /[\uA729]/g }, { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g }, { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g }, { 'base': 'vy', 'letters': /[\uA761]/g }, { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g }, { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g }, { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g }, { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }];

module.exports = function stripDiacritics(str) {
	for (var i = 0; i < map.length; i++) {
		str = str.replace(map[i].letters, map[i].base);
	}
	return str;
};

},{}],"react-select":[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/react-select
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactInputAutosize = require('react-input-autosize');

var _reactInputAutosize2 = _interopRequireDefault(_reactInputAutosize);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsDefaultArrowRenderer = require('./utils/defaultArrowRenderer');

var _utilsDefaultArrowRenderer2 = _interopRequireDefault(_utilsDefaultArrowRenderer);

var _utilsDefaultFilterOptions = require('./utils/defaultFilterOptions');

var _utilsDefaultFilterOptions2 = _interopRequireDefault(_utilsDefaultFilterOptions);

var _utilsDefaultMenuRenderer = require('./utils/defaultMenuRenderer');

var _utilsDefaultMenuRenderer2 = _interopRequireDefault(_utilsDefaultMenuRenderer);

var _utilsDefaultClearRenderer = require('./utils/defaultClearRenderer');

var _utilsDefaultClearRenderer2 = _interopRequireDefault(_utilsDefaultClearRenderer);

var _Async = require('./Async');

var _Async2 = _interopRequireDefault(_Async);

var _AsyncCreatable = require('./AsyncCreatable');

var _AsyncCreatable2 = _interopRequireDefault(_AsyncCreatable);

var _Creatable = require('./Creatable');

var _Creatable2 = _interopRequireDefault(_Creatable);

var _Option = require('./Option');

var _Option2 = _interopRequireDefault(_Option);

var _Value = require('./Value');

var _Value2 = _interopRequireDefault(_Value);

function stringifyValue(value) {
	var valueType = typeof value;
	if (valueType === 'string') {
		return value;
	} else if (valueType === 'object') {
		return JSON.stringify(value);
	} else if (valueType === 'number' || valueType === 'boolean') {
		return String(value);
	} else {
		return '';
	}
}

if (!Array.prototype.findIndex) {
	Array.prototype.findIndex = function (predicate) {
		if (this === null) {
			throw new TypeError('Array.prototype.findIndex called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return i;
			}
		}
		return -1;
	};
}

var stringOrNode = _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.node]);

var instanceId = 1;

var Select = _react2['default'].createClass({

	displayName: 'Select',

	propTypes: {
		addLabelText: _react2['default'].PropTypes.string, // placeholder displayed when you want to add a label on a multi-value input
		'aria-label': _react2['default'].PropTypes.string, // Aria label (for assistive tech)
		'aria-labelledby': _react2['default'].PropTypes.string, // HTML ID of an element that should be used as the label (for assistive tech)
		arrowRenderer: _react2['default'].PropTypes.func, // Create drop-down caret element
		autoBlur: _react2['default'].PropTypes.bool, // automatically blur the component when an option is selected
		autofocus: _react2['default'].PropTypes.bool, // autofocus the component on mount
		autosize: _react2['default'].PropTypes.bool, // whether to enable autosizing or not
		backspaceRemoves: _react2['default'].PropTypes.bool, // whether backspace removes an item if there is no text input
		backspaceToRemoveMessage: _react2['default'].PropTypes.string, // Message to use for screenreaders to press backspace to remove the current item - {label} is replaced with the item label
		className: _react2['default'].PropTypes.string, // className for the outer element
		clearAllText: stringOrNode, // title for the "clear" control when multi: true
		clearRenderer: _react2['default'].PropTypes.func, // create clearable x element
		clearValueText: stringOrNode, // title for the "clear" control
		clearable: _react2['default'].PropTypes.bool, // should it be possible to reset value
		deleteRemoves: _react2['default'].PropTypes.bool, // whether backspace removes an item if there is no text input
		delimiter: _react2['default'].PropTypes.string, // delimiter to use to join multiple values for the hidden field value
		disabled: _react2['default'].PropTypes.bool, // whether the Select is disabled or not
		escapeClearsValue: _react2['default'].PropTypes.bool, // whether escape clears the value when the menu is closed
		filterOption: _react2['default'].PropTypes.func, // method to filter a single option (option, filterString)
		filterOptions: _react2['default'].PropTypes.any, // boolean to enable default filtering or function to filter the options array ([options], filterString, [values])
		ignoreAccents: _react2['default'].PropTypes.bool, // whether to strip diacritics when filtering
		ignoreCase: _react2['default'].PropTypes.bool, // whether to perform case-insensitive filtering
		inputProps: _react2['default'].PropTypes.object, // custom attributes for the Input
		inputRenderer: _react2['default'].PropTypes.func, // returns a custom input component
		instanceId: _react2['default'].PropTypes.string, // set the components instanceId
		isLoading: _react2['default'].PropTypes.bool, // whether the Select is loading externally or not (such as options being loaded)
		joinValues: _react2['default'].PropTypes.bool, // joins multiple values into a single form field with the delimiter (legacy mode)
		labelKey: _react2['default'].PropTypes.string, // path of the label value in option objects
		matchPos: _react2['default'].PropTypes.string, // (any|start) match the start or entire string when filtering
		matchProp: _react2['default'].PropTypes.string, // (any|label|value) which option property to filter on
		menuBuffer: _react2['default'].PropTypes.number, // optional buffer (in px) between the bottom of the viewport and the bottom of the menu
		menuContainerStyle: _react2['default'].PropTypes.object, // optional style to apply to the menu container
		menuRenderer: _react2['default'].PropTypes.func, // renders a custom menu with options
		menuStyle: _react2['default'].PropTypes.object, // optional style to apply to the menu
		multi: _react2['default'].PropTypes.bool, // multi-value input
		name: _react2['default'].PropTypes.string, // generates a hidden <input /> tag with this field name for html forms
		noResultsText: stringOrNode, // placeholder displayed when there are no matching search results
		onBlur: _react2['default'].PropTypes.func, // onBlur handler: function (event) {}
		onBlurResetsInput: _react2['default'].PropTypes.bool, // whether input is cleared on blur
		onChange: _react2['default'].PropTypes.func, // onChange handler: function (newValue) {}
		onClose: _react2['default'].PropTypes.func, // fires when the menu is closed
		onCloseResetsInput: _react2['default'].PropTypes.bool, // whether input is cleared when menu is closed through the arrow
		onFocus: _react2['default'].PropTypes.func, // onFocus handler: function (event) {}
		onInputChange: _react2['default'].PropTypes.func, // onInputChange handler: function (inputValue) {}
		onInputKeyDown: _react2['default'].PropTypes.func, // input keyDown handler: function (event) {}
		onMenuScrollToBottom: _react2['default'].PropTypes.func, // fires when the menu is scrolled to the bottom; can be used to paginate options
		onOpen: _react2['default'].PropTypes.func, // fires when the menu is opened
		onValueClick: _react2['default'].PropTypes.func, // onClick handler for value labels: function (value, event) {}
		openAfterFocus: _react2['default'].PropTypes.bool, // boolean to enable opening dropdown when focused
		openOnFocus: _react2['default'].PropTypes.bool, // always open options menu on focus
		optionClassName: _react2['default'].PropTypes.string, // additional class(es) to apply to the <Option /> elements
		optionComponent: _react2['default'].PropTypes.func, // option component to render in dropdown
		optionRenderer: _react2['default'].PropTypes.func, // optionRenderer: function (option) {}
		options: _react2['default'].PropTypes.array, // array of options
		pageSize: _react2['default'].PropTypes.number, // number of entries to page when using page up/down keys
		placeholder: stringOrNode, // field placeholder, displayed when there's no value
		removeSelected: _react2['default'].PropTypes.bool, // whether the selected option is removed from the dropdown on multi selects
		required: _react2['default'].PropTypes.bool, // applies HTML5 required attribute when needed
		resetValue: _react2['default'].PropTypes.any, // value to use when you clear the control
		scrollMenuIntoView: _react2['default'].PropTypes.bool, // boolean to enable the viewport to shift so that the full menu fully visible when engaged
		searchable: _react2['default'].PropTypes.bool, // whether to enable searching feature or not
		simpleValue: _react2['default'].PropTypes.bool, // pass the value to onChange as a simple value (legacy pre 1.0 mode), defaults to false
		style: _react2['default'].PropTypes.object, // optional style to apply to the control
		tabIndex: _react2['default'].PropTypes.string, // optional tab index of the control
		tabSelectsValue: _react2['default'].PropTypes.bool, // whether to treat tabbing out while focused to be value selection
		value: _react2['default'].PropTypes.any, // initial field value
		valueComponent: _react2['default'].PropTypes.func, // value component to render
		valueKey: _react2['default'].PropTypes.string, // path of the label value in option objects
		valueRenderer: _react2['default'].PropTypes.func, // valueRenderer: function (option) {}
		wrapperStyle: _react2['default'].PropTypes.object },

	// optional style to apply to the component wrapper
	statics: { Async: _Async2['default'], AsyncCreatable: _AsyncCreatable2['default'], Creatable: _Creatable2['default'] },

	getDefaultProps: function getDefaultProps() {
		return {
			addLabelText: 'Add "{label}"?',
			arrowRenderer: _utilsDefaultArrowRenderer2['default'],
			autosize: true,
			backspaceRemoves: true,
			backspaceToRemoveMessage: 'Press backspace to remove {label}',
			clearable: true,
			clearAllText: 'Clear all',
			clearRenderer: _utilsDefaultClearRenderer2['default'],
			clearValueText: 'Clear value',
			deleteRemoves: true,
			delimiter: ',',
			disabled: false,
			escapeClearsValue: true,
			filterOptions: _utilsDefaultFilterOptions2['default'],
			ignoreAccents: true,
			ignoreCase: true,
			inputProps: {},
			isLoading: false,
			joinValues: false,
			labelKey: 'label',
			matchPos: 'any',
			matchProp: 'any',
			menuBuffer: 0,
			menuRenderer: _utilsDefaultMenuRenderer2['default'],
			multi: false,
			noResultsText: 'No results found',
			onBlurResetsInput: true,
			onCloseResetsInput: true,
			openAfterFocus: false,
			optionComponent: _Option2['default'],
			pageSize: 5,
			placeholder: 'Select...',
			removeSelected: true,
			required: false,
			scrollMenuIntoView: true,
			searchable: true,
			simpleValue: false,
			tabSelectsValue: true,
			valueComponent: _Value2['default'],
			valueKey: 'value'
		};
	},

	getInitialState: function getInitialState() {
		return {
			inputValue: '',
			isFocused: false,
			isOpen: false,
			isPseudoFocused: false,
			required: false
		};
	},

	componentWillMount: function componentWillMount() {
		this._instancePrefix = 'react-select-' + (this.props.instanceId || ++instanceId) + '-';
		var valueArray = this.getValueArray(this.props.value);

		if (this.props.required) {
			this.setState({
				required: this.handleRequired(valueArray[0], this.props.multi)
			});
		}
	},

	componentDidMount: function componentDidMount() {
		if (this.props.autofocus) {
			this.focus();
		}
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		var valueArray = this.getValueArray(nextProps.value, nextProps);

		if (nextProps.required) {
			this.setState({
				required: this.handleRequired(valueArray[0], nextProps.multi)
			});
		}
	},

	componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
		if (nextState.isOpen !== this.state.isOpen) {
			this.toggleTouchOutsideEvent(nextState.isOpen);
			var handler = nextState.isOpen ? nextProps.onOpen : nextProps.onClose;
			handler && handler();
		}
	},

	componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
		// focus to the selected option
		if (this.menu && this.focused && this.state.isOpen && !this.hasScrolledToOption) {
			var focusedOptionNode = _reactDom2['default'].findDOMNode(this.focused);
			var menuNode = _reactDom2['default'].findDOMNode(this.menu);
			menuNode.scrollTop = focusedOptionNode.offsetTop;
			this.hasScrolledToOption = true;
		} else if (!this.state.isOpen) {
			this.hasScrolledToOption = false;
		}

		if (this._scrollToFocusedOptionOnUpdate && this.focused && this.menu) {
			this._scrollToFocusedOptionOnUpdate = false;
			var focusedDOM = _reactDom2['default'].findDOMNode(this.focused);
			var menuDOM = _reactDom2['default'].findDOMNode(this.menu);
			var focusedRect = focusedDOM.getBoundingClientRect();
			var menuRect = menuDOM.getBoundingClientRect();
			if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
				menuDOM.scrollTop = focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight;
			}
		}
		if (this.props.scrollMenuIntoView && this.menuContainer) {
			var menuContainerRect = this.menuContainer.getBoundingClientRect();
			if (window.innerHeight < menuContainerRect.bottom + this.props.menuBuffer) {
				window.scrollBy(0, menuContainerRect.bottom + this.props.menuBuffer - window.innerHeight);
			}
		}
		if (prevProps.disabled !== this.props.disabled) {
			this.setState({ isFocused: false }); // eslint-disable-line react/no-did-update-set-state
			this.closeMenu();
		}
	},

	componentWillUnmount: function componentWillUnmount() {
		if (!document.removeEventListener && document.detachEvent) {
			document.detachEvent('ontouchstart', this.handleTouchOutside);
		} else {
			document.removeEventListener('touchstart', this.handleTouchOutside);
		}
	},

	toggleTouchOutsideEvent: function toggleTouchOutsideEvent(enabled) {
		if (enabled) {
			if (!document.addEventListener && document.attachEvent) {
				document.attachEvent('ontouchstart', this.handleTouchOutside);
			} else {
				document.addEventListener('touchstart', this.handleTouchOutside);
			}
		} else {
			if (!document.removeEventListener && document.detachEvent) {
				document.detachEvent('ontouchstart', this.handleTouchOutside);
			} else {
				document.removeEventListener('touchstart', this.handleTouchOutside);
			}
		}
	},

	handleTouchOutside: function handleTouchOutside(event) {
		// handle touch outside on ios to dismiss menu
		if (this.wrapper && !this.wrapper.contains(event.target)) {
			this.closeMenu();
		}
	},

	focus: function focus() {
		if (!this.input) return;
		this.input.focus();

		if (this.props.openAfterFocus) {
			this.setState({
				isOpen: true
			});
		}
	},

	blurInput: function blurInput() {
		if (!this.input) return;
		this.input.blur();
	},

	handleTouchMove: function handleTouchMove(event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart: function handleTouchStart(event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	handleTouchEnd: function handleTouchEnd(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		// Fire the mouse events
		this.handleMouseDown(event);
	},

	handleTouchEndClearValue: function handleTouchEndClearValue(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		// Clear the value
		this.clearValue(event);
	},

	handleMouseDown: function handleMouseDown(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
			return;
		}

		if (event.target.tagName === 'INPUT') {
			return;
		}

		// prevent default event handlers
		event.stopPropagation();
		event.preventDefault();

		// for the non-searchable select, toggle the menu
		if (!this.props.searchable) {
			this.focus();
			return this.setState({
				isOpen: !this.state.isOpen
			});
		}

		if (this.state.isFocused) {
			// On iOS, we can get into a state where we think the input is focused but it isn't really,
			// since iOS ignores programmatic calls to input.focus() that weren't triggered by a click event.
			// Call focus() again here to be safe.
			this.focus();

			var input = this.input;
			if (typeof input.getInput === 'function') {
				// Get the actual DOM input if the ref is an <AutosizeInput /> component
				input = input.getInput();
			}

			// clears the value so that the cursor will be at the end of input when the component re-renders
			input.value = '';

			// if the input is focused, ensure the menu is open
			this.setState({
				isOpen: true,
				isPseudoFocused: false
			});
		} else {
			// otherwise, focus the input and open the menu
			this._openAfterFocus = this.props.openOnFocus;
			this.focus();
		}
	},

	handleMouseDownOnArrow: function handleMouseDownOnArrow(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		// If the menu isn't open, let the event bubble to the main handleMouseDown
		if (!this.state.isOpen) {
			return;
		}
		// prevent default event handlers
		event.stopPropagation();
		event.preventDefault();
		// close the menu
		this.closeMenu();
	},

	handleMouseDownOnMenu: function handleMouseDownOnMenu(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();

		this._openAfterFocus = true;
		this.focus();
	},

	closeMenu: function closeMenu() {
		if (this.props.onCloseResetsInput) {
			this.setState({
				isOpen: false,
				isPseudoFocused: this.state.isFocused && !this.props.multi,
				inputValue: ''
			});
		} else {
			this.setState({
				isOpen: false,
				isPseudoFocused: this.state.isFocused && !this.props.multi,
				inputValue: this.state.inputValue
			});
		}
		this.hasScrolledToOption = false;
	},

	handleInputFocus: function handleInputFocus(event) {
		if (this.props.disabled) return;
		var isOpen = this.state.isOpen || this._openAfterFocus || this.props.openOnFocus;
		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
		this.setState({
			isFocused: true,
			isOpen: isOpen
		});
		this._openAfterFocus = false;
	},

	handleInputBlur: function handleInputBlur(event) {
		// The check for menu.contains(activeElement) is necessary to prevent IE11's scrollbar from closing the menu in certain contexts.
		if (this.menu && (this.menu === document.activeElement || this.menu.contains(document.activeElement))) {
			this.focus();
			return;
		}

		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
		var onBlurredState = {
			isFocused: false,
			isOpen: false,
			isPseudoFocused: false
		};
		if (this.props.onBlurResetsInput) {
			onBlurredState.inputValue = '';
		}
		this.setState(onBlurredState);
	},

	handleInputChange: function handleInputChange(event) {
		var newInputValue = event.target.value;

		if (this.state.inputValue !== event.target.value && this.props.onInputChange) {
			var nextState = this.props.onInputChange(newInputValue);
			// Note: != used deliberately here to catch undefined and null
			if (nextState != null && typeof nextState !== 'object') {
				newInputValue = '' + nextState;
			}
		}

		this.setState({
			isOpen: true,
			isPseudoFocused: false,
			inputValue: newInputValue
		});
	},

	handleKeyDown: function handleKeyDown(event) {
		if (this.props.disabled) return;

		if (typeof this.props.onInputKeyDown === 'function') {
			this.props.onInputKeyDown(event);
			if (event.defaultPrevented) {
				return;
			}
		}

		switch (event.keyCode) {
			case 8:
				// backspace
				if (!this.state.inputValue && this.props.backspaceRemoves) {
					event.preventDefault();
					this.popValue();
				}
				return;
			case 9:
				// tab
				if (event.shiftKey || !this.state.isOpen || !this.props.tabSelectsValue) {
					return;
				}
				this.selectFocusedOption();
				return;
			case 13:
				// enter
				if (!this.state.isOpen) return;
				event.stopPropagation();
				this.selectFocusedOption();
				break;
			case 27:
				// escape
				if (this.state.isOpen) {
					this.closeMenu();
					event.stopPropagation();
				} else if (this.props.clearable && this.props.escapeClearsValue) {
					this.clearValue(event);
					event.stopPropagation();
				}
				break;
			case 38:
				// up
				this.focusPreviousOption();
				break;
			case 40:
				// down
				this.focusNextOption();
				break;
			case 33:
				// page up
				this.focusPageUpOption();
				break;
			case 34:
				// page down
				this.focusPageDownOption();
				break;
			case 35:
				// end key
				if (event.shiftKey) {
					return;
				}
				this.focusEndOption();
				break;
			case 36:
				// home key
				if (event.shiftKey) {
					return;
				}
				this.focusStartOption();
				break;
			case 46:
				// backspace
				if (!this.state.inputValue && this.props.deleteRemoves) {
					event.preventDefault();
					this.popValue();
				}
				return;
			default:
				return;
		}
		event.preventDefault();
	},

	handleValueClick: function handleValueClick(option, event) {
		if (!this.props.onValueClick) return;
		this.props.onValueClick(option, event);
	},

	handleMenuScroll: function handleMenuScroll(event) {
		if (!this.props.onMenuScrollToBottom) return;
		var target = event.target;

		if (target.scrollHeight > target.offsetHeight && !(target.scrollHeight - target.offsetHeight - target.scrollTop)) {
			this.props.onMenuScrollToBottom();
		}
	},

	handleRequired: function handleRequired(value, multi) {
		if (!value) return true;
		return multi ? value.length === 0 : Object.keys(value).length === 0;
	},

	getOptionLabel: function getOptionLabel(op) {
		return op[this.props.labelKey];
	},

	/**
  * Turns a value into an array from the given options
  * @param	{String|Number|Array}	value		- the value of the select input
  * @param	{Object}		nextProps	- optionally specify the nextProps so the returned array uses the latest configuration
  * @returns	{Array}	the value of the select represented in an array
  */
	getValueArray: function getValueArray(value, nextProps) {
		var _this = this;

		/** support optionally passing in the `nextProps` so `componentWillReceiveProps` updates will function as expected */
		var props = typeof nextProps === 'object' ? nextProps : this.props;
		if (props.multi) {
			if (typeof value === 'string') value = value.split(props.delimiter);
			if (!Array.isArray(value)) {
				if (value === null || value === undefined) return [];
				value = [value];
			}
			return value.map(function (value) {
				return _this.expandValue(value, props);
			}).filter(function (i) {
				return i;
			});
		}
		var expandedValue = this.expandValue(value, props);
		return expandedValue ? [expandedValue] : [];
	},

	/**
  * Retrieve a value from the given options and valueKey
  * @param	{String|Number|Array}	value	- the selected value(s)
  * @param	{Object}		props	- the Select component's props (or nextProps)
  */
	expandValue: function expandValue(value, props) {
		var valueType = typeof value;
		if (valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean') return value;
		var options = props.options;
		var valueKey = props.valueKey;

		if (!options) return;
		for (var i = 0; i < options.length; i++) {
			if (options[i][valueKey] === value) return options[i];
		}
	},

	setValue: function setValue(value) {
		var _this2 = this;

		if (this.props.autoBlur) {
			this.blurInput();
		}
		if (!this.props.onChange) return;
		if (this.props.required) {
			var required = this.handleRequired(value, this.props.multi);
			this.setState({ required: required });
		}
		if (this.props.simpleValue && value) {
			value = this.props.multi ? value.map(function (i) {
				return i[_this2.props.valueKey];
			}).join(this.props.delimiter) : value[this.props.valueKey];
		}
		this.props.onChange(value);
	},

	selectValue: function selectValue(value) {
		var _this3 = this;

		//NOTE: update value in the callback to make sure the input value is empty so that there are no styling issues (Chrome had issue otherwise)
		this.hasScrolledToOption = false;
		if (this.props.multi) {
			this.setState({
				inputValue: '',
				focusedIndex: null
			}, function () {
				var valueArray = _this3.getValueArray();
				if (valueArray.find(function (i) {
					return i[_this3.props.valueKey] === value[_this3.props.valueKey];
				})) {
					_this3.removeValue(value);
				} else {
					_this3.addValue(value);
				}
			});
		} else {
			this.setState({
				isOpen: false,
				inputValue: '',
				isPseudoFocused: this.state.isFocused
			}, function () {
				_this3.setValue(value);
			});
		}
	},

	addValue: function addValue(value) {
		var valueArray = this.getValueArray(this.props.value);
		var visibleOptions = this._visibleOptions.filter(function (val) {
			return !val.disabled;
		});
		var lastValueIndex = visibleOptions.indexOf(value);
		this.setValue(valueArray.concat(value));
		if (visibleOptions.length - 1 === lastValueIndex) {
			// the last option was selected; focus the second-last one
			this.focusOption(visibleOptions[lastValueIndex - 1]);
		} else if (visibleOptions.length > lastValueIndex) {
			// focus the option below the selected one
			this.focusOption(visibleOptions[lastValueIndex + 1]);
		}
	},

	popValue: function popValue() {
		var valueArray = this.getValueArray(this.props.value);
		if (!valueArray.length) return;
		if (valueArray[valueArray.length - 1].clearableValue === false) return;
		this.setValue(valueArray.slice(0, valueArray.length - 1));
	},

	removeValue: function removeValue(value) {
		var valueArray = this.getValueArray(this.props.value);
		this.setValue(valueArray.filter(function (i) {
			return i !== value;
		}));
		this.focus();
	},

	clearValue: function clearValue(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, ignore it.
		if (event && event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
		this.setValue(this.getResetValue());
		this.setState({
			isOpen: false,
			inputValue: ''
		}, this.focus);
	},

	getResetValue: function getResetValue() {
		if (this.props.resetValue !== undefined) {
			return this.props.resetValue;
		} else if (this.props.multi) {
			return [];
		} else {
			return null;
		}
	},

	focusOption: function focusOption(option) {
		this.setState({
			focusedOption: option
		});
	},

	focusNextOption: function focusNextOption() {
		this.focusAdjacentOption('next');
	},

	focusPreviousOption: function focusPreviousOption() {
		this.focusAdjacentOption('previous');
	},

	focusPageUpOption: function focusPageUpOption() {
		this.focusAdjacentOption('page_up');
	},

	focusPageDownOption: function focusPageDownOption() {
		this.focusAdjacentOption('page_down');
	},

	focusStartOption: function focusStartOption() {
		this.focusAdjacentOption('start');
	},

	focusEndOption: function focusEndOption() {
		this.focusAdjacentOption('end');
	},

	focusAdjacentOption: function focusAdjacentOption(dir) {
		var options = this._visibleOptions.map(function (option, index) {
			return { option: option, index: index };
		}).filter(function (option) {
			return !option.option.disabled;
		});
		this._scrollToFocusedOptionOnUpdate = true;
		if (!this.state.isOpen) {
			this.setState({
				isOpen: true,
				inputValue: '',
				focusedOption: this._focusedOption || (options.length ? options[dir === 'next' ? 0 : options.length - 1].option : null)
			});
			return;
		}
		if (!options.length) return;
		var focusedIndex = -1;
		for (var i = 0; i < options.length; i++) {
			if (this._focusedOption === options[i].option) {
				focusedIndex = i;
				break;
			}
		}
		if (dir === 'next' && focusedIndex !== -1) {
			focusedIndex = (focusedIndex + 1) % options.length;
		} else if (dir === 'previous') {
			if (focusedIndex > 0) {
				focusedIndex = focusedIndex - 1;
			} else {
				focusedIndex = options.length - 1;
			}
		} else if (dir === 'start') {
			focusedIndex = 0;
		} else if (dir === 'end') {
			focusedIndex = options.length - 1;
		} else if (dir === 'page_up') {
			var potentialIndex = focusedIndex - this.props.pageSize;
			if (potentialIndex < 0) {
				focusedIndex = 0;
			} else {
				focusedIndex = potentialIndex;
			}
		} else if (dir === 'page_down') {
			var potentialIndex = focusedIndex + this.props.pageSize;
			if (potentialIndex > options.length - 1) {
				focusedIndex = options.length - 1;
			} else {
				focusedIndex = potentialIndex;
			}
		}

		if (focusedIndex === -1) {
			focusedIndex = 0;
		}

		this.setState({
			focusedIndex: options[focusedIndex].index,
			focusedOption: options[focusedIndex].option
		});
	},

	getFocusedOption: function getFocusedOption() {
		return this._focusedOption;
	},

	getInputValue: function getInputValue() {
		return this.state.inputValue;
	},

	selectFocusedOption: function selectFocusedOption() {
		if (this._focusedOption) {
			return this.selectValue(this._focusedOption);
		}
	},

	renderLoading: function renderLoading() {
		if (!this.props.isLoading) return;
		return _react2['default'].createElement(
			'span',
			{ className: 'Select-loading-zone', 'aria-hidden': 'true' },
			_react2['default'].createElement('span', { className: 'Select-loading' })
		);
	},

	renderValue: function renderValue(valueArray, isOpen) {
		var _this4 = this;

		var renderLabel = this.props.valueRenderer || this.getOptionLabel;
		var ValueComponent = this.props.valueComponent;
		if (!valueArray.length) {
			return !this.state.inputValue ? _react2['default'].createElement(
				'div',
				{ className: 'Select-placeholder' },
				this.props.placeholder
			) : null;
		}
		var onClick = this.props.onValueClick ? this.handleValueClick : null;
		if (this.props.multi) {
			return valueArray.map(function (value, i) {
				return _react2['default'].createElement(
					ValueComponent,
					{
						id: _this4._instancePrefix + '-value-' + i,
						instancePrefix: _this4._instancePrefix,
						disabled: _this4.props.disabled || value.clearableValue === false,
						key: 'value-' + i + '-' + value[_this4.props.valueKey],
						onClick: onClick,
						onRemove: _this4.removeValue,
						value: value
					},
					renderLabel(value, i),
					_react2['default'].createElement(
						'span',
						{ className: 'Select-aria-only' },
						' '
					)
				);
			});
		} else if (!this.state.inputValue) {
			if (isOpen) onClick = null;
			return _react2['default'].createElement(
				ValueComponent,
				{
					id: this._instancePrefix + '-value-item',
					disabled: this.props.disabled,
					instancePrefix: this._instancePrefix,
					onClick: onClick,
					value: valueArray[0]
				},
				renderLabel(valueArray[0])
			);
		}
	},

	renderInput: function renderInput(valueArray, focusedOptionIndex) {
		var _classNames,
		    _this5 = this;

		var className = (0, _classnames2['default'])('Select-input', this.props.inputProps.className);
		var isOpen = !!this.state.isOpen;

		var ariaOwns = (0, _classnames2['default'])((_classNames = {}, _defineProperty(_classNames, this._instancePrefix + '-list', isOpen), _defineProperty(_classNames, this._instancePrefix + '-backspace-remove-message', this.props.multi && !this.props.disabled && this.state.isFocused && !this.state.inputValue), _classNames));

		// TODO: Check how this project includes Object.assign()
		var inputProps = _extends({}, this.props.inputProps, {
			role: 'combobox',
			'aria-expanded': '' + isOpen,
			'aria-owns': ariaOwns,
			'aria-haspopup': '' + isOpen,
			'aria-activedescendant': isOpen ? this._instancePrefix + '-option-' + focusedOptionIndex : this._instancePrefix + '-value',
			'aria-labelledby': this.props['aria-labelledby'],
			'aria-label': this.props['aria-label'],
			className: className,
			tabIndex: this.props.tabIndex,
			onBlur: this.handleInputBlur,
			onChange: this.handleInputChange,
			onFocus: this.handleInputFocus,
			ref: function ref(_ref) {
				return _this5.input = _ref;
			},
			required: this.state.required,
			value: this.state.inputValue
		});

		if (this.props.inputRenderer) {
			return this.props.inputRenderer(inputProps);
		}

		if (this.props.disabled || !this.props.searchable) {
			var _props$inputProps = this.props.inputProps;
			var inputClassName = _props$inputProps.inputClassName;

			var divProps = _objectWithoutProperties(_props$inputProps, ['inputClassName']);

			return _react2['default'].createElement('div', _extends({}, divProps, {
				role: 'combobox',
				'aria-expanded': isOpen,
				'aria-owns': isOpen ? this._instancePrefix + '-list' : this._instancePrefix + '-value',
				'aria-activedescendant': isOpen ? this._instancePrefix + '-option-' + focusedOptionIndex : this._instancePrefix + '-value',
				className: className,
				tabIndex: this.props.tabIndex || 0,
				onBlur: this.handleInputBlur,
				onFocus: this.handleInputFocus,
				ref: function (ref) {
					return _this5.input = ref;
				},
				'aria-readonly': '' + !!this.props.disabled,
				style: { border: 0, width: 1, display: 'inline-block' } }));
		}

		if (this.props.autosize) {
			return _react2['default'].createElement(_reactInputAutosize2['default'], _extends({}, inputProps, { minWidth: '5' }));
		}
		return _react2['default'].createElement(
			'div',
			{ className: className },
			_react2['default'].createElement('input', inputProps)
		);
	},

	renderClear: function renderClear() {
		if (!this.props.clearable || !this.props.value || this.props.value === 0 || this.props.multi && !this.props.value.length || this.props.disabled || this.props.isLoading) return;
		var clear = this.props.clearRenderer();

		return _react2['default'].createElement(
			'span',
			{ className: 'Select-clear-zone', title: this.props.multi ? this.props.clearAllText : this.props.clearValueText,
				'aria-label': this.props.multi ? this.props.clearAllText : this.props.clearValueText,
				onMouseDown: this.clearValue,
				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove,
				onTouchEnd: this.handleTouchEndClearValue
			},
			clear
		);
	},

	renderArrow: function renderArrow() {
		var onMouseDown = this.handleMouseDownOnArrow;
		var isOpen = this.state.isOpen;
		var arrow = this.props.arrowRenderer({ onMouseDown: onMouseDown, isOpen: isOpen });

		return _react2['default'].createElement(
			'span',
			{
				className: 'Select-arrow-zone',
				onMouseDown: onMouseDown
			},
			arrow
		);
	},

	filterOptions: function filterOptions(excludeOptions) {
		var filterValue = this.state.inputValue;
		var options = this.props.options || [];
		if (this.props.filterOptions) {
			// Maintain backwards compatibility with boolean attribute
			var filterOptions = typeof this.props.filterOptions === 'function' ? this.props.filterOptions : _utilsDefaultFilterOptions2['default'];

			return filterOptions(options, filterValue, excludeOptions, {
				filterOption: this.props.filterOption,
				ignoreAccents: this.props.ignoreAccents,
				ignoreCase: this.props.ignoreCase,
				labelKey: this.props.labelKey,
				matchPos: this.props.matchPos,
				matchProp: this.props.matchProp,
				valueKey: this.props.valueKey
			});
		} else {
			return options;
		}
	},

	onOptionRef: function onOptionRef(ref, isFocused) {
		if (isFocused) {
			this.focused = ref;
		}
	},

	renderMenu: function renderMenu(options, valueArray, focusedOption) {
		if (options && options.length) {
			return this.props.menuRenderer({
				focusedOption: focusedOption,
				focusOption: this.focusOption,
				instancePrefix: this._instancePrefix,
				labelKey: this.props.labelKey,
				onFocus: this.focusOption,
				onSelect: this.selectValue,
				optionClassName: this.props.optionClassName,
				optionComponent: this.props.optionComponent,
				optionRenderer: this.props.optionRenderer || this.getOptionLabel,
				options: options,
				selectValue: this.selectValue,
				valueArray: valueArray,
				valueKey: this.props.valueKey,
				onOptionRef: this.onOptionRef
			});
		} else if (this.props.noResultsText) {
			return _react2['default'].createElement(
				'div',
				{ className: 'Select-noresults' },
				this.props.noResultsText
			);
		} else {
			return null;
		}
	},

	renderHiddenField: function renderHiddenField(valueArray) {
		var _this6 = this;

		if (!this.props.name) return;
		if (this.props.joinValues) {
			var value = valueArray.map(function (i) {
				return stringifyValue(i[_this6.props.valueKey]);
			}).join(this.props.delimiter);
			return _react2['default'].createElement('input', {
				type: 'hidden',
				ref: function (ref) {
					return _this6.value = ref;
				},
				name: this.props.name,
				value: value,
				disabled: this.props.disabled });
		}
		return valueArray.map(function (item, index) {
			return _react2['default'].createElement('input', { key: 'hidden.' + index,
				type: 'hidden',
				ref: 'value' + index,
				name: _this6.props.name,
				value: stringifyValue(item[_this6.props.valueKey]),
				disabled: _this6.props.disabled });
		});
	},

	getFocusableOptionIndex: function getFocusableOptionIndex(selectedOption) {
		var options = this._visibleOptions;
		if (!options.length) return null;

		var focusedOption = this.state.focusedOption || selectedOption;
		if (focusedOption && !focusedOption.disabled) {
			var focusedOptionIndex = options.indexOf(focusedOption);
			if (focusedOptionIndex !== -1) {
				return focusedOptionIndex;
			}
		}

		for (var i = 0; i < options.length; i++) {
			if (!options[i].disabled) return i;
		}
		return null;
	},

	renderOuter: function renderOuter(options, valueArray, focusedOption) {
		var _this7 = this;

		var menu = this.renderMenu(options, valueArray, focusedOption);
		if (!menu) {
			return null;
		}

		return _react2['default'].createElement(
			'div',
			{ ref: function (ref) {
					return _this7.menuContainer = ref;
				}, className: 'Select-menu-outer', style: this.props.menuContainerStyle },
			_react2['default'].createElement(
				'div',
				{ ref: function (ref) {
						return _this7.menu = ref;
					}, role: 'listbox', className: 'Select-menu', id: this._instancePrefix + '-list',
					style: this.props.menuStyle,
					onScroll: this.handleMenuScroll,
					onMouseDown: this.handleMouseDownOnMenu },
				menu
			)
		);
	},

	render: function render() {
		var _this8 = this;

		var valueArray = this.getValueArray(this.props.value);
		var options = this._visibleOptions = this.filterOptions(this.props.multi && this.props.removeSelected ? valueArray : null);
		var isOpen = this.state.isOpen;
		if (this.props.multi && !options.length && valueArray.length && !this.state.inputValue) isOpen = false;
		var focusedOptionIndex = this.getFocusableOptionIndex(valueArray[0]);

		var focusedOption = null;
		if (focusedOptionIndex !== null) {
			focusedOption = this._focusedOption = options[focusedOptionIndex];
		} else {
			focusedOption = this._focusedOption = null;
		}
		var className = (0, _classnames2['default'])('Select', this.props.className, {
			'Select--multi': this.props.multi,
			'Select--single': !this.props.multi,
			'is-disabled': this.props.disabled,
			'is-focused': this.state.isFocused,
			'is-loading': this.props.isLoading,
			'is-open': isOpen,
			'is-pseudo-focused': this.state.isPseudoFocused,
			'is-searchable': this.props.searchable,
			'has-value': valueArray.length
		});

		var removeMessage = null;
		if (this.props.multi && !this.props.disabled && valueArray.length && !this.state.inputValue && this.state.isFocused && this.props.backspaceRemoves) {
			removeMessage = _react2['default'].createElement(
				'span',
				{ id: this._instancePrefix + '-backspace-remove-message', className: 'Select-aria-only', 'aria-live': 'assertive' },
				this.props.backspaceToRemoveMessage.replace('{label}', valueArray[valueArray.length - 1][this.props.labelKey])
			);
		}

		return _react2['default'].createElement(
			'div',
			{ ref: function (ref) {
					return _this8.wrapper = ref;
				},
				className: className,
				style: this.props.wrapperStyle },
			this.renderHiddenField(valueArray),
			_react2['default'].createElement(
				'div',
				{ ref: function (ref) {
						return _this8.control = ref;
					},
					className: 'Select-control',
					style: this.props.style,
					onKeyDown: this.handleKeyDown,
					onMouseDown: this.handleMouseDown,
					onTouchEnd: this.handleTouchEnd,
					onTouchStart: this.handleTouchStart,
					onTouchMove: this.handleTouchMove
				},
				_react2['default'].createElement(
					'span',
					{ className: 'Select-multi-value-wrapper', id: this._instancePrefix + '-value' },
					this.renderValue(valueArray, isOpen),
					this.renderInput(valueArray, focusedOptionIndex)
				),
				removeMessage,
				this.renderLoading(),
				this.renderClear(),
				this.renderArrow()
			),
			isOpen ? this.renderOuter(options, valueArray, focusedOption) : null
		);
	}

});

exports['default'] = Select;
module.exports = exports['default'];

},{"./Async":1,"./AsyncCreatable":2,"./Creatable":3,"./Option":4,"./Value":5,"./utils/defaultArrowRenderer":6,"./utils/defaultClearRenderer":7,"./utils/defaultFilterOptions":8,"./utils/defaultMenuRenderer":9,"classnames":undefined,"react":undefined,"react-dom":undefined,"react-input-autosize":undefined}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9sb2NhbC93d3cvcmVhY3Qtc2VsZWN0L3NyYy9Bc3luYy5qcyIsIkM6L2xvY2FsL3d3dy9yZWFjdC1zZWxlY3Qvc3JjL0FzeW5jQ3JlYXRhYmxlLmpzIiwiQzovbG9jYWwvd3d3L3JlYWN0LXNlbGVjdC9zcmMvQ3JlYXRhYmxlLmpzIiwiQzovbG9jYWwvd3d3L3JlYWN0LXNlbGVjdC9zcmMvT3B0aW9uLmpzIiwiQzovbG9jYWwvd3d3L3JlYWN0LXNlbGVjdC9zcmMvVmFsdWUuanMiLCJDOi9sb2NhbC93d3cvcmVhY3Qtc2VsZWN0L3NyYy91dGlscy9kZWZhdWx0QXJyb3dSZW5kZXJlci5qcyIsIkM6L2xvY2FsL3d3dy9yZWFjdC1zZWxlY3Qvc3JjL3V0aWxzL2RlZmF1bHRDbGVhclJlbmRlcmVyLmpzIiwiQzovbG9jYWwvd3d3L3JlYWN0LXNlbGVjdC9zcmMvdXRpbHMvZGVmYXVsdEZpbHRlck9wdGlvbnMuanMiLCJDOi9sb2NhbC93d3cvcmVhY3Qtc2VsZWN0L3NyYy91dGlscy9kZWZhdWx0TWVudVJlbmRlcmVyLmpzIiwiQzovbG9jYWwvd3d3L3JlYWN0LXNlbGVjdC9zcmMvdXRpbHMvc3RyaXBEaWFjcml0aWNzLmpzIiwiQzovbG9jYWwvd3d3L3JlYWN0LXNlbGVjdC9zcmMvU2VsZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJDQTRDLE9BQU87Ozs7c0JBQ2hDLFVBQVU7Ozs7b0NBQ0QseUJBQXlCOzs7O0FBRXJELElBQU0sU0FBUyxHQUFHO0FBQ2pCLFNBQVEsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7QUFDekMsTUFBSyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxHQUFHO0FBQzFCLFNBQVEsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7QUFDekMsY0FBYSxFQUFFLG1CQUFNLFNB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QUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQztLQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQztLQUMzQztJQUNOLGFBQWE7SUFDYixJQUFJLENBQUMsYUFBYSxFQUFFO0lBQ3BCLElBQUksQ0FBQyxXQUFXLEVBQUU7SUFDbEIsSUFBSSxDQUFDLFdBQVcsRUFBRTtJQUNkO0dBQ0wsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUMsR0FBRyxJQUFJO0dBQ2hFLENBQ0w7RUFDRjs7Q0FFRCxDQUFDLENBQUM7O3FCQUVZLE1BQU0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgU2VsZWN0IGZyb20gJy4vU2VsZWN0JztcclxuaW1wb3J0IHN0cmlwRGlhY3JpdGljcyBmcm9tICcuL3V0aWxzL3N0cmlwRGlhY3JpdGljcyc7XHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcblx0YXV0b2xvYWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsICAgICAgIC8vIGF1dG9tYXRpY2FsbHkgY2FsbCB0aGUgYGxvYWRPcHRpb25zYCBwcm9wIG9uLW1vdW50OyBkZWZhdWx0cyB0byB0cnVlXHJcblx0Y2FjaGU6IFJlYWN0LlByb3BUeXBlcy5hbnksICAgICAgICAgICAgICAgICAgICAgIC8vIG9iamVjdCB0byB1c2UgdG8gY2FjaGUgcmVzdWx0czsgc2V0IHRvIG51bGwvZmFsc2UgdG8gZGlzYWJsZSBjYWNoaW5nXHJcblx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsICAgICAgIC8vIENoaWxkIGZ1bmN0aW9uIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgaW5uZXIgU2VsZWN0IGNvbXBvbmVudDsgKHByb3BzOiBPYmplY3QpOiBQcm9wVHlwZXMuZWxlbWVudFxyXG5cdGlnbm9yZUFjY2VudHM6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAvLyBzdHJpcCBkaWFjcml0aWNzIHdoZW4gZmlsdGVyaW5nOyBkZWZhdWx0cyB0byB0cnVlXHJcblx0aWdub3JlQ2FzZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgIC8vIHBlcmZvcm0gY2FzZS1pbnNlbnNpdGl2ZSBmaWx0ZXJpbmc7IGRlZmF1bHRzIHRvIHRydWVcclxuXHRsb2FkaW5nUGxhY2Vob2xkZXI6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoWyAgLy8gcmVwbGFjZXMgdGhlIHBsYWNlaG9sZGVyIHdoaWxlIG9wdGlvbnMgYXJlIGxvYWRpbmdcclxuXHRcdFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcblx0XHRSZWFjdC5Qcm9wVHlwZXMubm9kZVxyXG5cdF0pLFxyXG5cdGxvYWRPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLCAgICAvLyBjYWxsYmFjayB0byBsb2FkIG9wdGlvbnMgYXN5bmNocm9ub3VzbHk7IChpbnB1dFZhbHVlOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6ID9Qcm9taXNlXHJcblx0b3B0aW9uczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsICAgICAgICAgICAgIC8vIGFycmF5IG9mIG9wdGlvbnNcclxuXHRwbGFjZWhvbGRlcjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbICAgICAgICAgLy8gZmllbGQgcGxhY2Vob2xkZXIsIGRpc3BsYXllZCB3aGVuIHRoZXJlJ3Mgbm8gdmFsdWUgKHNoYXJlZCB3aXRoIFNlbGVjdClcclxuXHRcdFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcblx0XHRSZWFjdC5Qcm9wVHlwZXMubm9kZVxyXG5cdF0pLFxyXG5cdG5vUmVzdWx0c1RleHQ6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoWyAgICAgICAvLyBmaWVsZCBub1Jlc3VsdHNUZXh0LCBkaXNwbGF5ZWQgd2hlbiBubyBvcHRpb25zIGNvbWUgYmFjayBmcm9tIHRoZSBzZXJ2ZXJcclxuXHRcdFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcblx0XHRSZWFjdC5Qcm9wVHlwZXMubm9kZVxyXG5cdF0pLFxyXG5cdG9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgICAgICAvLyBvbkNoYW5nZSBoYW5kbGVyOiBmdW5jdGlvbiAobmV3VmFsdWUpIHt9XHJcblx0c2VhcmNoUHJvbXB0VGV4dDogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbICAgIC8vIGxhYmVsIHRvIHByb21wdCBmb3Igc2VhcmNoIGlucHV0XHJcblx0XHRSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cdFx0UmVhY3QuUHJvcFR5cGVzLm5vZGVcclxuXHRdKSxcclxuXHRvbklucHV0Q2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgLy8gb3B0aW9uYWwgZm9yIGtlZXBpbmcgdHJhY2sgb2Ygd2hhdCBpcyBiZWluZyB0eXBlZFxyXG5cdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYW55LCAgICAgICAgICAgICAgICAgICAgICAvLyBpbml0aWFsIGZpZWxkIHZhbHVlXHJcbn07XHJcblxyXG5jb25zdCBkZWZhdWx0Q2FjaGUgPSB7fTtcclxuXHJcbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcclxuXHRhdXRvbG9hZDogdHJ1ZSxcclxuXHRjYWNoZTogZGVmYXVsdENhY2hlLFxyXG5cdGNoaWxkcmVuOiBkZWZhdWx0Q2hpbGRyZW4sXHJcblx0aWdub3JlQWNjZW50czogdHJ1ZSxcclxuXHRpZ25vcmVDYXNlOiB0cnVlLFxyXG5cdGxvYWRpbmdQbGFjZWhvbGRlcjogJ0xvYWRpbmcuLi4nLFxyXG5cdG9wdGlvbnM6IFtdLFxyXG5cdHNlYXJjaFByb21wdFRleHQ6ICdUeXBlIHRvIHNlYXJjaCcsXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3luYyBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IgKHByb3BzLCBjb250ZXh0KSB7XHJcblx0XHRzdXBlcihwcm9wcywgY29udGV4dCk7XHJcblxyXG5cdFx0dGhpcy5fY2FjaGUgPSBwcm9wcy5jYWNoZSA9PT0gZGVmYXVsdENhY2hlID8ge30gOiBwcm9wcy5jYWNoZTtcclxuXHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRpc0xvYWRpbmc6IGZhbHNlLFxyXG5cdFx0XHRvcHRpb25zOiBwcm9wcy5vcHRpb25zLFxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLl9vbklucHV0Q2hhbmdlID0gdGhpcy5fb25JbnB1dENoYW5nZS5iaW5kKHRoaXMpO1xyXG5cdH1cclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQgKCkge1xyXG5cdFx0Y29uc3QgeyBhdXRvbG9hZCB9ID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHRpZiAoYXV0b2xvYWQpIHtcclxuXHRcdFx0dGhpcy5sb2FkT3B0aW9ucygnJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb21wb25lbnRXaWxsVXBkYXRlIChuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG5cdFx0Y29uc3QgcHJvcGVydGllc1RvU3luYyA9IFsnb3B0aW9ucyddO1xyXG5cdFx0cHJvcGVydGllc1RvU3luYy5mb3JFYWNoKChwcm9wKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLnByb3BzW3Byb3BdICE9PSBuZXh0UHJvcHNbcHJvcF0pIHtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRcdFtwcm9wXTogbmV4dFByb3BzW3Byb3BdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Y2xlYXJPcHRpb25zKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IG9wdGlvbnM6IFtdIH0pO1xyXG5cdH1cclxuXHJcblx0bG9hZE9wdGlvbnMgKGlucHV0VmFsdWUpIHtcclxuXHRcdGNvbnN0IHsgbG9hZE9wdGlvbnMgfSA9IHRoaXMucHJvcHM7XHJcblx0XHRjb25zdCBjYWNoZSA9IHRoaXMuX2NhY2hlO1xyXG5cclxuXHRcdGlmIChcclxuXHRcdFx0Y2FjaGUgJiZcclxuXHRcdFx0Y2FjaGUuaGFzT3duUHJvcGVydHkoaW5wdXRWYWx1ZSlcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRvcHRpb25zOiBjYWNoZVtpbnB1dFZhbHVlXVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBjYWxsYmFjayA9IChlcnJvciwgZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAoY2FsbGJhY2sgPT09IHRoaXMuX2NhbGxiYWNrKSB7XHJcblx0XHRcdFx0dGhpcy5fY2FsbGJhY2sgPSBudWxsO1xyXG5cclxuXHRcdFx0XHRjb25zdCBvcHRpb25zID0gZGF0YSAmJiBkYXRhLm9wdGlvbnMgfHwgW107XHJcblxyXG5cdFx0XHRcdGlmIChjYWNoZSkge1xyXG5cdFx0XHRcdFx0Y2FjaGVbaW5wdXRWYWx1ZV0gPSBvcHRpb25zO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdFx0XHRpc0xvYWRpbmc6IGZhbHNlLFxyXG5cdFx0XHRcdFx0b3B0aW9uc1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIElnbm9yZSBhbGwgYnV0IHRoZSBtb3N0IHJlY2VudCByZXF1ZXN0XHJcblx0XHR0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG5cclxuXHRcdGNvbnN0IHByb21pc2UgPSBsb2FkT3B0aW9ucyhpbnB1dFZhbHVlLCBjYWxsYmFjayk7XHJcblx0XHRpZiAocHJvbWlzZSkge1xyXG5cdFx0XHRwcm9taXNlLnRoZW4oXHJcblx0XHRcdFx0KGRhdGEpID0+IGNhbGxiYWNrKG51bGwsIGRhdGEpLFxyXG5cdFx0XHRcdChlcnJvcikgPT4gY2FsbGJhY2soZXJyb3IpXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLl9jYWxsYmFjayAmJlxyXG5cdFx0XHQhdGhpcy5zdGF0ZS5pc0xvYWRpbmdcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRpc0xvYWRpbmc6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGlucHV0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRfb25JbnB1dENoYW5nZSAoaW5wdXRWYWx1ZSkge1xyXG5cdFx0Y29uc3QgeyBpZ25vcmVBY2NlbnRzLCBpZ25vcmVDYXNlLCBvbklucHV0Q2hhbmdlIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdGlmIChpZ25vcmVBY2NlbnRzKSB7XHJcblx0XHRcdGlucHV0VmFsdWUgPSBzdHJpcERpYWNyaXRpY3MoaW5wdXRWYWx1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlnbm9yZUNhc2UpIHtcclxuXHRcdFx0aW5wdXRWYWx1ZSA9IGlucHV0VmFsdWUudG9Mb3dlckNhc2UoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAob25JbnB1dENoYW5nZSkge1xyXG5cdFx0XHRvbklucHV0Q2hhbmdlKGlucHV0VmFsdWUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLmxvYWRPcHRpb25zKGlucHV0VmFsdWUpO1xyXG5cdH1cclxuXHJcblx0aW5wdXRWYWx1ZSgpIHtcclxuXHRcdGlmICh0aGlzLnNlbGVjdCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5zZWxlY3Quc3RhdGUuaW5wdXRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAnJztcclxuXHR9XHJcblxyXG5cdG5vUmVzdWx0c1RleHQoKSB7XHJcblx0XHRjb25zdCB7IGxvYWRpbmdQbGFjZWhvbGRlciwgbm9SZXN1bHRzVGV4dCwgc2VhcmNoUHJvbXB0VGV4dCB9ID0gdGhpcy5wcm9wcztcclxuXHRcdGNvbnN0IHsgaXNMb2FkaW5nIH0gPSB0aGlzLnN0YXRlO1xyXG5cclxuXHRcdGNvbnN0IGlucHV0VmFsdWUgPSB0aGlzLmlucHV0VmFsdWUoKTtcclxuXHJcblx0XHRpZiAoaXNMb2FkaW5nKSB7XHJcblx0XHRcdHJldHVybiBsb2FkaW5nUGxhY2Vob2xkZXI7XHJcblx0XHR9XHJcblx0XHRpZiAoaW5wdXRWYWx1ZSAmJiBub1Jlc3VsdHNUZXh0KSB7XHJcblx0XHRcdHJldHVybiBub1Jlc3VsdHNUZXh0O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHNlYXJjaFByb21wdFRleHQ7XHJcblx0fVxyXG5cclxuXHRmb2N1cyAoKSB7XHJcblx0XHR0aGlzLnNlbGVjdC5mb2N1cygpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdGNvbnN0IHsgY2hpbGRyZW4sIGxvYWRpbmdQbGFjZWhvbGRlciwgcGxhY2Vob2xkZXIgfSA9IHRoaXMucHJvcHM7XHJcblx0XHRjb25zdCB7IGlzTG9hZGluZywgb3B0aW9ucyB9ID0gdGhpcy5zdGF0ZTtcclxuXHJcblx0XHRjb25zdCBwcm9wcyA9IHtcclxuXHRcdFx0bm9SZXN1bHRzVGV4dDogdGhpcy5ub1Jlc3VsdHNUZXh0KCksXHJcblx0XHRcdHBsYWNlaG9sZGVyOiBpc0xvYWRpbmcgPyBsb2FkaW5nUGxhY2Vob2xkZXIgOiBwbGFjZWhvbGRlcixcclxuXHRcdFx0b3B0aW9uczogKGlzTG9hZGluZyAmJiBsb2FkaW5nUGxhY2Vob2xkZXIpID8gW10gOiBvcHRpb25zLFxyXG5cdFx0XHRyZWY6IChyZWYpID0+ICh0aGlzLnNlbGVjdCA9IHJlZiksXHJcblx0XHRcdG9uQ2hhbmdlOiAobmV3VmFsdWVzKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMucHJvcHMubXVsdGkgJiYgdGhpcy5wcm9wcy52YWx1ZSAmJiAobmV3VmFsdWVzLmxlbmd0aCA+IHRoaXMucHJvcHMudmFsdWUubGVuZ3RoKSkge1xyXG5cdFx0XHRcdFx0dGhpcy5jbGVhck9wdGlvbnMoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5wcm9wcy5vbkNoYW5nZShuZXdWYWx1ZXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBjaGlsZHJlbih7XHJcblx0XHRcdC4uLnRoaXMucHJvcHMsXHJcblx0XHRcdC4uLnByb3BzLFxyXG5cdFx0XHRpc0xvYWRpbmcsXHJcblx0XHRcdG9uSW5wdXRDaGFuZ2U6IHRoaXMuX29uSW5wdXRDaGFuZ2VcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuQXN5bmMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5Bc3luYy5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0Q2hpbGRyZW4gKHByb3BzKSB7XHJcblx0cmV0dXJuIChcclxuXHRcdDxTZWxlY3Qgey4uLnByb3BzfSAvPlxyXG5cdCk7XHJcbn07XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBTZWxlY3QgZnJvbSAnLi9TZWxlY3QnO1xyXG5cclxuZnVuY3Rpb24gcmVkdWNlKG9iaiwgcHJvcHMgPSB7fSl7XHJcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iailcclxuICAucmVkdWNlKChwcm9wcywga2V5KSA9PiB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IG9ialtrZXldO1xyXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHByb3BzW2tleV0gPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcm9wcztcclxuICB9LCBwcm9wcyk7XHJcbn1cclxuXHJcbmNvbnN0IEFzeW5jQ3JlYXRhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGRpc3BsYXlOYW1lOiAnQXN5bmNDcmVhdGFibGVTZWxlY3QnLFxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PFNlbGVjdC5Bc3luYyB7Li4udGhpcy5wcm9wc30+XHJcblx0XHRcdFx0eyhhc3luY1Byb3BzKSA9PiAoXHJcblx0XHRcdFx0XHQ8U2VsZWN0LkNyZWF0YWJsZSB7Li4udGhpcy5wcm9wc30+XHJcblx0XHRcdFx0XHRcdHsoY3JlYXRhYmxlUHJvcHMpID0+IChcclxuXHRcdFx0XHRcdFx0XHQ8U2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHR7Li4ucmVkdWNlKGFzeW5jUHJvcHMsIHJlZHVjZShjcmVhdGFibGVQcm9wcywge30pKX1cclxuXHRcdFx0XHRcdFx0XHRcdG9uSW5wdXRDaGFuZ2U9eyhpbnB1dCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGFibGVQcm9wcy5vbklucHV0Q2hhbmdlKGlucHV0KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFzeW5jUHJvcHMub25JbnB1dENoYW5nZShpbnB1dCk7XHJcblx0XHRcdFx0XHRcdFx0XHR9fVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmPXsocmVmKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0YWJsZVByb3BzLnJlZihyZWYpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhc3luY1Byb3BzLnJlZihyZWYpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fX1cclxuXHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHQpfVxyXG5cdFx0XHRcdFx0PC9TZWxlY3QuQ3JlYXRhYmxlPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvU2VsZWN0LkFzeW5jPlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBc3luY0NyZWF0YWJsZTtcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFNlbGVjdCBmcm9tICcuL1NlbGVjdCc7XHJcbmltcG9ydCBkZWZhdWx0RmlsdGVyT3B0aW9ucyBmcm9tICcuL3V0aWxzL2RlZmF1bHRGaWx0ZXJPcHRpb25zJztcclxuaW1wb3J0IGRlZmF1bHRNZW51UmVuZGVyZXIgZnJvbSAnLi91dGlscy9kZWZhdWx0TWVudVJlbmRlcmVyJztcclxuXHJcbmNvbnN0IENyZWF0YWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRkaXNwbGF5TmFtZTogJ0NyZWF0YWJsZVNlbGVjdCcsXHJcblxyXG5cdHByb3BUeXBlczoge1xyXG5cdFx0Ly8gQ2hpbGQgZnVuY3Rpb24gcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBpbm5lciBTZWxlY3QgY29tcG9uZW50XHJcblx0XHQvLyBUaGlzIGNvbXBvbmVudCBjYW4gYmUgdXNlZCB0byBjb21wb3NlIEhPQ3MgKGVnIENyZWF0YWJsZSBhbmQgQXN5bmMpXHJcblx0XHQvLyAocHJvcHM6IE9iamVjdCk6IFByb3BUeXBlcy5lbGVtZW50XHJcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXHJcblxyXG5cdFx0Ly8gU2VlIFNlbGVjdC5wcm9wVHlwZXMuZmlsdGVyT3B0aW9uc1xyXG5cdFx0ZmlsdGVyT3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmFueSxcclxuXHJcblx0XHQvLyBTZWFyY2hlcyBmb3IgYW55IG1hdGNoaW5nIG9wdGlvbiB3aXRoaW4gdGhlIHNldCBvZiBvcHRpb25zLlxyXG5cdFx0Ly8gVGhpcyBmdW5jdGlvbiBwcmV2ZW50cyBkdXBsaWNhdGUgb3B0aW9ucyBmcm9tIGJlaW5nIGNyZWF0ZWQuXHJcblx0XHQvLyAoeyBvcHRpb246IE9iamVjdCwgb3B0aW9uczogQXJyYXksIGxhYmVsS2V5OiBzdHJpbmcsIHZhbHVlS2V5OiBzdHJpbmcgfSk6IGJvb2xlYW5cclxuXHRcdGlzT3B0aW9uVW5pcXVlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuXHJcblx0ICAgIC8vIERldGVybWluZXMgaWYgdGhlIGN1cnJlbnQgaW5wdXQgdGV4dCByZXByZXNlbnRzIGEgdmFsaWQgb3B0aW9uLlxyXG5cdCAgICAvLyAoeyBsYWJlbDogc3RyaW5nIH0pOiBib29sZWFuXHJcblx0ICAgIGlzVmFsaWROZXdPcHRpb246IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG5cclxuXHRcdC8vIFNlZSBTZWxlY3QucHJvcFR5cGVzLm1lbnVSZW5kZXJlclxyXG5cdFx0bWVudVJlbmRlcmVyOiBSZWFjdC5Qcm9wVHlwZXMuYW55LFxyXG5cclxuXHQgICAgLy8gRmFjdG9yeSB0byBjcmVhdGUgbmV3IG9wdGlvbi5cclxuXHQgICAgLy8gKHsgbGFiZWw6IHN0cmluZywgbGFiZWxLZXk6IHN0cmluZywgdmFsdWVLZXk6IHN0cmluZyB9KTogT2JqZWN0XHJcblx0XHRuZXdPcHRpb25DcmVhdG9yOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuXHJcblx0XHQvLyBpbnB1dCBjaGFuZ2UgaGFuZGxlcjogZnVuY3Rpb24gKGlucHV0VmFsdWUpIHt9XHJcblx0XHRvbklucHV0Q2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuXHJcblx0XHQvLyBpbnB1dCBrZXlEb3duIGhhbmRsZXI6IGZ1bmN0aW9uIChldmVudCkge31cclxuXHRcdG9uSW5wdXRLZXlEb3duOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuXHJcblx0XHQvLyBuZXcgb3B0aW9uIGNsaWNrIGhhbmRsZXI6IGZ1bmN0aW9uIChvcHRpb24pIHt9XHJcblx0XHRvbk5ld09wdGlvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuXHJcblx0XHQvLyBTZWUgU2VsZWN0LnByb3BUeXBlcy5vcHRpb25zXHJcblx0XHRvcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXHJcblxyXG5cdCAgICAvLyBDcmVhdGVzIHByb21wdC9wbGFjZWhvbGRlciBvcHRpb24gdGV4dC5cclxuXHQgICAgLy8gKGZpbHRlclRleHQ6IHN0cmluZyk6IHN0cmluZ1xyXG5cdFx0cHJvbXB0VGV4dENyZWF0b3I6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG5cclxuXHRcdC8vIERlY2lkZXMgaWYgYSBrZXlEb3duIGV2ZW50IChlZyBpdHMgYGtleUNvZGVgKSBzaG91bGQgcmVzdWx0IGluIHRoZSBjcmVhdGlvbiBvZiBhIG5ldyBvcHRpb24uXHJcblx0XHRzaG91bGRLZXlEb3duRXZlbnRDcmVhdGVOZXdPcHRpb246IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG5cdH0sXHJcblxyXG5cdC8vIERlZmF1bHQgcHJvcCBtZXRob2RzXHJcblx0c3RhdGljczoge1xyXG5cdFx0aXNPcHRpb25VbmlxdWUsXHJcblx0XHRpc1ZhbGlkTmV3T3B0aW9uLFxyXG5cdFx0bmV3T3B0aW9uQ3JlYXRvcixcclxuXHRcdHByb21wdFRleHRDcmVhdG9yLFxyXG5cdFx0c2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uXHJcblx0fSxcclxuXHJcblx0Z2V0RGVmYXVsdFByb3BzICgpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGZpbHRlck9wdGlvbnM6IGRlZmF1bHRGaWx0ZXJPcHRpb25zLFxyXG5cdFx0XHRpc09wdGlvblVuaXF1ZSxcclxuXHRcdFx0aXNWYWxpZE5ld09wdGlvbixcclxuXHRcdFx0bWVudVJlbmRlcmVyOiBkZWZhdWx0TWVudVJlbmRlcmVyLFxyXG5cdFx0XHRuZXdPcHRpb25DcmVhdG9yLFxyXG5cdFx0XHRwcm9tcHRUZXh0Q3JlYXRvcixcclxuXHRcdFx0c2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uLFxyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHRjcmVhdGVOZXdPcHRpb24gKCkge1xyXG5cdFx0Y29uc3Qge1xyXG5cdFx0XHRpc1ZhbGlkTmV3T3B0aW9uLFxyXG5cdFx0XHRuZXdPcHRpb25DcmVhdG9yLFxyXG5cdFx0XHRvbk5ld09wdGlvbkNsaWNrLFxyXG5cdFx0XHRvcHRpb25zID0gW10sXHJcblx0XHRcdHNob3VsZEtleURvd25FdmVudENyZWF0ZU5ld09wdGlvblxyXG5cdFx0fSA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0aWYgKGlzVmFsaWROZXdPcHRpb24oeyBsYWJlbDogdGhpcy5pbnB1dFZhbHVlIH0pKSB7XHJcblx0XHRcdGNvbnN0IG9wdGlvbiA9IG5ld09wdGlvbkNyZWF0b3IoeyBsYWJlbDogdGhpcy5pbnB1dFZhbHVlLCBsYWJlbEtleTogdGhpcy5sYWJlbEtleSwgdmFsdWVLZXk6IHRoaXMudmFsdWVLZXkgfSk7XHJcblx0XHRcdGNvbnN0IGlzT3B0aW9uVW5pcXVlID0gdGhpcy5pc09wdGlvblVuaXF1ZSh7IG9wdGlvbiB9KTtcclxuXHJcblx0XHRcdC8vIERvbid0IGFkZCB0aGUgc2FtZSBvcHRpb24gdHdpY2UuXHJcblx0XHRcdGlmIChpc09wdGlvblVuaXF1ZSkge1xyXG5cdFx0XHRcdGlmIChvbk5ld09wdGlvbkNsaWNrKSB7XHJcblx0XHRcdFx0XHRvbk5ld09wdGlvbkNsaWNrKG9wdGlvbik7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG9wdGlvbnMudW5zaGlmdChvcHRpb24pO1xyXG5cclxuXHRcdFx0XHRcdHRoaXMuc2VsZWN0LnNlbGVjdFZhbHVlKG9wdGlvbik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0ZmlsdGVyT3B0aW9ucyAoLi4ucGFyYW1zKSB7XHJcblx0XHRjb25zdCB7IGZpbHRlck9wdGlvbnMsIGlzVmFsaWROZXdPcHRpb24sIG9wdGlvbnMsIHByb21wdFRleHRDcmVhdG9yIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIFRSSUNLWSBDaGVjayBjdXJyZW50bHkgc2VsZWN0ZWQgb3B0aW9ucyBhcyB3ZWxsLlxyXG5cdFx0Ly8gRG9uJ3QgZGlzcGxheSBhIGNyZWF0ZS1wcm9tcHQgZm9yIGEgdmFsdWUgdGhhdCdzIHNlbGVjdGVkLlxyXG5cdFx0Ly8gVGhpcyBjb3ZlcnMgYXN5bmMgZWRnZS1jYXNlcyB3aGVyZSBhIG5ld2x5LWNyZWF0ZWQgT3B0aW9uIGlzbid0IHlldCBpbiB0aGUgYXN5bmMtbG9hZGVkIGFycmF5LlxyXG5cdFx0Y29uc3QgZXhjbHVkZU9wdGlvbnMgPSBwYXJhbXNbMl0gfHwgW107XHJcblxyXG5cdFx0Y29uc3QgZmlsdGVyZWRPcHRpb25zID0gZmlsdGVyT3B0aW9ucyguLi5wYXJhbXMpIHx8IFtdO1xyXG5cclxuXHRcdGlmIChpc1ZhbGlkTmV3T3B0aW9uKHsgbGFiZWw6IHRoaXMuaW5wdXRWYWx1ZSB9KSkge1xyXG5cdFx0XHRjb25zdCB7IG5ld09wdGlvbkNyZWF0b3IgfSA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0XHRjb25zdCBvcHRpb24gPSBuZXdPcHRpb25DcmVhdG9yKHtcclxuXHRcdFx0XHRsYWJlbDogdGhpcy5pbnB1dFZhbHVlLFxyXG5cdFx0XHRcdGxhYmVsS2V5OiB0aGlzLmxhYmVsS2V5LFxyXG5cdFx0XHRcdHZhbHVlS2V5OiB0aGlzLnZhbHVlS2V5XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gVFJJQ0tZIENvbXBhcmUgdG8gYWxsIG9wdGlvbnMgKG5vdCBqdXN0IGZpbHRlcmVkIG9wdGlvbnMpIGluIGNhc2Ugb3B0aW9uIGhhcyBhbHJlYWR5IGJlZW4gc2VsZWN0ZWQpLlxyXG5cdFx0XHQvLyBGb3IgbXVsdGktc2VsZWN0cywgdGhpcyB3b3VsZCByZW1vdmUgaXQgZnJvbSB0aGUgZmlsdGVyZWQgbGlzdC5cclxuXHRcdFx0Y29uc3QgaXNPcHRpb25VbmlxdWUgPSB0aGlzLmlzT3B0aW9uVW5pcXVlKHtcclxuXHRcdFx0XHRvcHRpb24sXHJcblx0XHRcdFx0b3B0aW9uczogZXhjbHVkZU9wdGlvbnMuY29uY2F0KGZpbHRlcmVkT3B0aW9ucylcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAoaXNPcHRpb25VbmlxdWUpIHtcclxuXHRcdFx0XHRjb25zdCBwcm9tcHQgPSBwcm9tcHRUZXh0Q3JlYXRvcih0aGlzLmlucHV0VmFsdWUpO1xyXG5cclxuXHRcdFx0XHR0aGlzLl9jcmVhdGVQbGFjZWhvbGRlck9wdGlvbiA9IG5ld09wdGlvbkNyZWF0b3Ioe1xyXG5cdFx0XHRcdFx0bGFiZWw6IHByb21wdCxcclxuXHRcdFx0XHRcdGxhYmVsS2V5OiB0aGlzLmxhYmVsS2V5LFxyXG5cdFx0XHRcdFx0dmFsdWVLZXk6IHRoaXMudmFsdWVLZXlcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zLnVuc2hpZnQodGhpcy5fY3JlYXRlUGxhY2Vob2xkZXJPcHRpb24pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZpbHRlcmVkT3B0aW9ucztcclxuXHR9LFxyXG5cclxuXHRpc09wdGlvblVuaXF1ZSAoe1xyXG5cdFx0b3B0aW9uLFxyXG5cdFx0b3B0aW9uc1xyXG5cdH0pIHtcclxuXHRcdGNvbnN0IHsgaXNPcHRpb25VbmlxdWUgfSA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwgdGhpcy5zZWxlY3QuZmlsdGVyT3B0aW9ucygpO1xyXG5cclxuXHRcdHJldHVybiBpc09wdGlvblVuaXF1ZSh7XHJcblx0XHRcdGxhYmVsS2V5OiB0aGlzLmxhYmVsS2V5LFxyXG5cdFx0XHRvcHRpb24sXHJcblx0XHRcdG9wdGlvbnMsXHJcblx0XHRcdHZhbHVlS2V5OiB0aGlzLnZhbHVlS2V5XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRtZW51UmVuZGVyZXIgKHBhcmFtcykge1xyXG5cdFx0Y29uc3QgeyBtZW51UmVuZGVyZXIgfSA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0cmV0dXJuIG1lbnVSZW5kZXJlcih7XHJcblx0XHRcdC4uLnBhcmFtcyxcclxuXHRcdFx0b25TZWxlY3Q6IHRoaXMub25PcHRpb25TZWxlY3QsXHJcblx0XHRcdHNlbGVjdFZhbHVlOiB0aGlzLm9uT3B0aW9uU2VsZWN0XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRvbklucHV0Q2hhbmdlIChpbnB1dCkge1xyXG5cdFx0Y29uc3QgeyBvbklucHV0Q2hhbmdlIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdGlmIChvbklucHV0Q2hhbmdlKSB7XHJcblx0XHRcdG9uSW5wdXRDaGFuZ2UoaW5wdXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRoaXMgdmFsdWUgbWF5IGJlIG5lZWRlZCBpbiBiZXR3ZWVuIFNlbGVjdCBtb3VudHMgKHdoZW4gdGhpcy5zZWxlY3QgaXMgbnVsbClcclxuXHRcdHRoaXMuaW5wdXRWYWx1ZSA9IGlucHV0O1xyXG5cdH0sXHJcblxyXG5cdG9uSW5wdXRLZXlEb3duIChldmVudCkge1xyXG5cdFx0Y29uc3QgeyBzaG91bGRLZXlEb3duRXZlbnRDcmVhdGVOZXdPcHRpb24sIG9uSW5wdXRLZXlEb3duIH0gPSB0aGlzLnByb3BzO1xyXG5cdFx0Y29uc3QgZm9jdXNlZE9wdGlvbiA9IHRoaXMuc2VsZWN0LmdldEZvY3VzZWRPcHRpb24oKTtcclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdGZvY3VzZWRPcHRpb24gJiZcclxuXHRcdFx0Zm9jdXNlZE9wdGlvbiA9PT0gdGhpcy5fY3JlYXRlUGxhY2Vob2xkZXJPcHRpb24gJiZcclxuXHRcdFx0c2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uKHsga2V5Q29kZTogZXZlbnQua2V5Q29kZSB9KVxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMuY3JlYXRlTmV3T3B0aW9uKCk7XHJcblxyXG5cdFx0XHQvLyBQcmV2ZW50IGRlY29yYXRlZCBTZWxlY3QgZnJvbSBkb2luZyBhbnl0aGluZyBhZGRpdGlvbmFsIHdpdGggdGhpcyBrZXlEb3duIGV2ZW50XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9IGVsc2UgaWYgKG9uSW5wdXRLZXlEb3duKSB7XHJcblx0XHRcdG9uSW5wdXRLZXlEb3duKGV2ZW50KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRvbk9wdGlvblNlbGVjdCAob3B0aW9uLCBldmVudCkge1xyXG5cdFx0aWYgKG9wdGlvbiA9PT0gdGhpcy5fY3JlYXRlUGxhY2Vob2xkZXJPcHRpb24pIHtcclxuXHRcdFx0dGhpcy5jcmVhdGVOZXdPcHRpb24oKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuc2VsZWN0LnNlbGVjdFZhbHVlKG9wdGlvbik7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdGNvbnN0IHtcclxuXHRcdFx0bmV3T3B0aW9uQ3JlYXRvcixcclxuXHRcdFx0c2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uLFxyXG5cdFx0XHQuLi5yZXN0UHJvcHNcclxuXHRcdH0gPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdGxldCB7IGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIFdlIGNhbid0IHVzZSBkZXN0cnVjdHVyaW5nIGRlZmF1bHQgdmFsdWVzIHRvIHNldCB0aGUgY2hpbGRyZW4sXHJcblx0XHQvLyBiZWNhdXNlIGl0IHdvbid0IGFwcGx5IHdvcmsgaWYgYGNoaWxkcmVuYCBpcyBudWxsLiBBIGZhbHN5IGNoZWNrIGlzXHJcblx0XHQvLyBtb3JlIHJlbGlhYmxlIGluIHJlYWwgd29ybGQgdXNlLWNhc2VzLlxyXG5cdFx0aWYgKCFjaGlsZHJlbikge1xyXG5cdFx0XHRjaGlsZHJlbiA9IGRlZmF1bHRDaGlsZHJlbjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwcm9wcyA9IHtcclxuXHRcdFx0Li4ucmVzdFByb3BzLFxyXG5cdFx0XHRhbGxvd0NyZWF0ZTogdHJ1ZSxcclxuXHRcdFx0ZmlsdGVyT3B0aW9uczogdGhpcy5maWx0ZXJPcHRpb25zLFxyXG5cdFx0XHRtZW51UmVuZGVyZXI6IHRoaXMubWVudVJlbmRlcmVyLFxyXG5cdFx0XHRvbklucHV0Q2hhbmdlOiB0aGlzLm9uSW5wdXRDaGFuZ2UsXHJcblx0XHRcdG9uSW5wdXRLZXlEb3duOiB0aGlzLm9uSW5wdXRLZXlEb3duLFxyXG5cdFx0XHRyZWY6IChyZWYpID0+IHtcclxuXHRcdFx0XHR0aGlzLnNlbGVjdCA9IHJlZjtcclxuXHJcblx0XHRcdFx0Ly8gVGhlc2UgdmFsdWVzIG1heSBiZSBuZWVkZWQgaW4gYmV0d2VlbiBTZWxlY3QgbW91bnRzICh3aGVuIHRoaXMuc2VsZWN0IGlzIG51bGwpXHJcblx0XHRcdFx0aWYgKHJlZikge1xyXG5cdFx0XHRcdFx0dGhpcy5sYWJlbEtleSA9IHJlZi5wcm9wcy5sYWJlbEtleTtcclxuXHRcdFx0XHRcdHRoaXMudmFsdWVLZXkgPSByZWYucHJvcHMudmFsdWVLZXk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBjaGlsZHJlbihwcm9wcyk7XHJcblx0fVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRDaGlsZHJlbiAocHJvcHMpIHtcclxuXHRyZXR1cm4gKFxyXG5cdFx0PFNlbGVjdCB7Li4ucHJvcHN9IC8+XHJcblx0KTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGlzT3B0aW9uVW5pcXVlICh7IG9wdGlvbiwgb3B0aW9ucywgbGFiZWxLZXksIHZhbHVlS2V5IH0pIHtcclxuXHRyZXR1cm4gb3B0aW9uc1xyXG5cdFx0LmZpbHRlcigoZXhpc3RpbmdPcHRpb24pID0+XHJcblx0XHRcdGV4aXN0aW5nT3B0aW9uW2xhYmVsS2V5XSA9PT0gb3B0aW9uW2xhYmVsS2V5XSB8fFxyXG5cdFx0XHRleGlzdGluZ09wdGlvblt2YWx1ZUtleV0gPT09IG9wdGlvblt2YWx1ZUtleV1cclxuXHRcdClcclxuXHRcdC5sZW5ndGggPT09IDA7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBpc1ZhbGlkTmV3T3B0aW9uICh7IGxhYmVsIH0pIHtcclxuXHRyZXR1cm4gISFsYWJlbDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIG5ld09wdGlvbkNyZWF0b3IgKHsgbGFiZWwsIGxhYmVsS2V5LCB2YWx1ZUtleSB9KSB7XHJcblx0Y29uc3Qgb3B0aW9uID0ge307XHJcblx0b3B0aW9uW3ZhbHVlS2V5XSA9IGxhYmVsO1xyXG4gXHRvcHRpb25bbGFiZWxLZXldID0gbGFiZWw7XHJcbiBcdG9wdGlvbi5jbGFzc05hbWUgPSAnU2VsZWN0LWNyZWF0ZS1vcHRpb24tcGxhY2Vob2xkZXInO1xyXG4gXHRyZXR1cm4gb3B0aW9uO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gcHJvbXB0VGV4dENyZWF0b3IgKGxhYmVsKSB7XHJcblx0cmV0dXJuIGBDcmVhdGUgb3B0aW9uIFwiJHtsYWJlbH1cImA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3VsZEtleURvd25FdmVudENyZWF0ZU5ld09wdGlvbiAoeyBrZXlDb2RlIH0pIHtcclxuXHRzd2l0Y2ggKGtleUNvZGUpIHtcclxuXHRcdGNhc2UgOTogICAvLyBUQUJcclxuXHRcdGNhc2UgMTM6ICAvLyBFTlRFUlxyXG5cdFx0Y2FzZSAxODg6IC8vIENPTU1BXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDcmVhdGFibGU7XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5cclxuY29uc3QgT3B0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHByb3BUeXBlczoge1xyXG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLFxyXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAvLyBjbGFzc05hbWUgKGJhc2VkIG9uIG1vdXNlIHBvc2l0aW9uKVxyXG5cdFx0aW5zdGFuY2VQcmVmaXg6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCwgIC8vIHVuaXF1ZSBwcmVmaXggZm9yIHRoZSBpZHMgKHVzZWQgZm9yIGFyaWEpXHJcblx0XHRpc0Rpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgIC8vIHRoZSBvcHRpb24gaXMgZGlzYWJsZWRcclxuXHRcdGlzRm9jdXNlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgLy8gdGhlIG9wdGlvbiBpcyBmb2N1c2VkXHJcblx0XHRpc1NlbGVjdGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgIC8vIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWRcclxuXHRcdG9uRm9jdXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAgICAgLy8gbWV0aG9kIHRvIGhhbmRsZSBtb3VzZUVudGVyIG9uIG9wdGlvbiBlbGVtZW50XHJcblx0XHRvblNlbGVjdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgIC8vIG1ldGhvZCB0byBoYW5kbGUgY2xpY2sgb24gb3B0aW9uIGVsZW1lbnRcclxuXHRcdG9uVW5mb2N1czogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgLy8gbWV0aG9kIHRvIGhhbmRsZSBtb3VzZUxlYXZlIG9uIG9wdGlvbiBlbGVtZW50XHJcblx0XHRvcHRpb246IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCwgICAgIC8vIG9iamVjdCB0aGF0IGlzIGJhc2UgZm9yIHRoYXQgb3B0aW9uXHJcblx0XHRvcHRpb25JbmRleDogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAgIC8vIGluZGV4IG9mIHRoZSBvcHRpb24sIHVzZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIGlkcyBmb3IgYXJpYVxyXG5cdH0sXHJcblx0YmxvY2tFdmVudCAoZXZlbnQpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdGlmICgoZXZlbnQudGFyZ2V0LnRhZ05hbWUgIT09ICdBJykgfHwgISgnaHJlZicgaW4gZXZlbnQudGFyZ2V0KSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAoZXZlbnQudGFyZ2V0LnRhcmdldCkge1xyXG5cdFx0XHR3aW5kb3cub3BlbihldmVudC50YXJnZXQuaHJlZiwgZXZlbnQudGFyZ2V0LnRhcmdldCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGV2ZW50LnRhcmdldC5ocmVmO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGhhbmRsZU1vdXNlRG93biAoZXZlbnQpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy5vcHRpb24sIGV2ZW50KTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVNb3VzZUVudGVyIChldmVudCkge1xyXG5cdFx0dGhpcy5vbkZvY3VzKGV2ZW50KTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVNb3VzZU1vdmUgKGV2ZW50KSB7XHJcblx0XHR0aGlzLm9uRm9jdXMoZXZlbnQpO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVRvdWNoRW5kKGV2ZW50KXtcclxuXHRcdC8vIENoZWNrIGlmIHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWQsIEluIHRoaXMgY2FzZVxyXG5cdFx0Ly8gd2UgZG9uJ3Qgd2FudCB0byBmaXJlIHRoZSBjbGljayBldmVudCAoYmVjYXVzZSB0aGUgdXNlciBvbmx5IHdhbnRzIHRvIHNjcm9sbClcclxuXHRcdGlmKHRoaXMuZHJhZ2dpbmcpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLmhhbmRsZU1vdXNlRG93bihldmVudCk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlVG91Y2hNb3ZlIChldmVudCkge1xyXG5cdFx0Ly8gU2V0IGEgZmxhZyB0aGF0IHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWRcclxuXHRcdHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVRvdWNoU3RhcnQgKGV2ZW50KSB7XHJcblx0XHQvLyBTZXQgYSBmbGFnIHRoYXQgdGhlIHZpZXcgaXMgbm90IGJlaW5nIGRyYWdnZWRcclxuXHRcdHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHRvbkZvY3VzIChldmVudCkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzRm9jdXNlZCkge1xyXG5cdFx0XHR0aGlzLnByb3BzLm9uRm9jdXModGhpcy5wcm9wcy5vcHRpb24sIGV2ZW50KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHR2YXIgeyBvcHRpb24sIGluc3RhbmNlUHJlZml4LCBvcHRpb25JbmRleCB9ID0gdGhpcy5wcm9wcztcclxuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzKHRoaXMucHJvcHMuY2xhc3NOYW1lLCBvcHRpb24uY2xhc3NOYW1lKTtcclxuXHJcblx0XHRyZXR1cm4gb3B0aW9uLmRpc2FibGVkID8gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxyXG5cdFx0XHRcdG9uTW91c2VEb3duPXt0aGlzLmJsb2NrRXZlbnR9XHJcblx0XHRcdFx0b25DbGljaz17dGhpcy5ibG9ja0V2ZW50fT5cclxuXHRcdFx0XHR7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpIDogKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxyXG5cdFx0XHRcdHN0eWxlPXtvcHRpb24uc3R5bGV9XHJcblx0XHRcdFx0cm9sZT1cIm9wdGlvblwiXHJcblx0XHRcdFx0b25Nb3VzZURvd249e3RoaXMuaGFuZGxlTW91c2VEb3dufVxyXG5cdFx0XHRcdG9uTW91c2VFbnRlcj17dGhpcy5oYW5kbGVNb3VzZUVudGVyfVxyXG5cdFx0XHRcdG9uTW91c2VNb3ZlPXt0aGlzLmhhbmRsZU1vdXNlTW92ZX1cclxuXHRcdFx0XHRvblRvdWNoU3RhcnQ9e3RoaXMuaGFuZGxlVG91Y2hTdGFydH1cclxuXHRcdFx0XHRvblRvdWNoTW92ZT17dGhpcy5oYW5kbGVUb3VjaE1vdmV9XHJcblx0XHRcdFx0b25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZH1cclxuXHRcdFx0XHRpZD17aW5zdGFuY2VQcmVmaXggKyAnLW9wdGlvbi0nICsgb3B0aW9uSW5kZXh9XHJcblx0XHRcdFx0dGl0bGU9e29wdGlvbi50aXRsZX0+XHJcblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcHRpb247XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5cclxuY29uc3QgVmFsdWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdGRpc3BsYXlOYW1lOiAnVmFsdWUnLFxyXG5cclxuXHRwcm9wVHlwZXM6IHtcclxuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZSxcclxuXHRcdGRpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgICAvLyBkaXNhYmxlZCBwcm9wIHBhc3NlZCB0byBSZWFjdFNlbGVjdFxyXG5cdFx0aWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAgICAgICAgIC8vIFVuaXF1ZSBpZCBmb3IgdGhlIHZhbHVlIC0gdXNlZCBmb3IgYXJpYVxyXG5cdFx0b25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgIC8vIG1ldGhvZCB0byBoYW5kbGUgY2xpY2sgb24gdmFsdWUgbGFiZWxcclxuXHRcdG9uUmVtb3ZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgICAvLyBtZXRob2QgdG8gaGFuZGxlIHJlbW92YWwgb2YgdGhlIHZhbHVlXHJcblx0XHR2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCAgICAgLy8gdGhlIG9wdGlvbiBvYmplY3QgZm9yIHRoaXMgdmFsdWVcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVNb3VzZURvd24gKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLnByb3BzLm9uQ2xpY2spIHtcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdHRoaXMucHJvcHMub25DbGljayh0aGlzLnByb3BzLnZhbHVlLCBldmVudCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLnByb3BzLnZhbHVlLmhyZWYpIHtcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0b25SZW1vdmUgKGV2ZW50KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHR0aGlzLnByb3BzLm9uUmVtb3ZlKHRoaXMucHJvcHMudmFsdWUpO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVRvdWNoRW5kUmVtb3ZlIChldmVudCl7XHJcblx0XHQvLyBDaGVjayBpZiB0aGUgdmlldyBpcyBiZWluZyBkcmFnZ2VkLCBJbiB0aGlzIGNhc2VcclxuXHRcdC8vIHdlIGRvbid0IHdhbnQgdG8gZmlyZSB0aGUgY2xpY2sgZXZlbnQgKGJlY2F1c2UgdGhlIHVzZXIgb25seSB3YW50cyB0byBzY3JvbGwpXHJcblx0XHRpZih0aGlzLmRyYWdnaW5nKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gRmlyZSB0aGUgbW91c2UgZXZlbnRzXHJcblx0XHR0aGlzLm9uUmVtb3ZlKGV2ZW50KTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVUb3VjaE1vdmUgKGV2ZW50KSB7XHJcblx0XHQvLyBTZXQgYSBmbGFnIHRoYXQgdGhlIHZpZXcgaXMgYmVpbmcgZHJhZ2dlZFxyXG5cdFx0dGhpcy5kcmFnZ2luZyA9IHRydWU7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlVG91Y2hTdGFydCAoZXZlbnQpIHtcclxuXHRcdC8vIFNldCBhIGZsYWcgdGhhdCB0aGUgdmlldyBpcyBub3QgYmVpbmcgZHJhZ2dlZFxyXG5cdFx0dGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlclJlbW92ZUljb24gKCkge1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgIXRoaXMucHJvcHMub25SZW1vdmUpIHJldHVybjtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIlNlbGVjdC12YWx1ZS1pY29uXCJcclxuXHRcdFx0XHRhcmlhLWhpZGRlbj1cInRydWVcIlxyXG5cdFx0XHRcdG9uTW91c2VEb3duPXt0aGlzLm9uUmVtb3ZlfVxyXG5cdFx0XHRcdG9uVG91Y2hFbmQ9e3RoaXMuaGFuZGxlVG91Y2hFbmRSZW1vdmV9XHJcblx0XHRcdFx0b25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XHJcblx0XHRcdFx0b25Ub3VjaE1vdmU9e3RoaXMuaGFuZGxlVG91Y2hNb3ZlfT5cclxuXHRcdFx0XHQmdGltZXM7XHJcblx0XHRcdDwvc3Bhbj5cclxuXHRcdCk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyTGFiZWwgKCkge1xyXG5cdFx0bGV0IGNsYXNzTmFtZSA9ICdTZWxlY3QtdmFsdWUtbGFiZWwnO1xyXG5cdFx0cmV0dXJuIHRoaXMucHJvcHMub25DbGljayB8fCB0aGlzLnByb3BzLnZhbHVlLmhyZWYgPyAoXHJcblx0XHRcdDxhIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBocmVmPXt0aGlzLnByb3BzLnZhbHVlLmhyZWZ9IHRhcmdldD17dGhpcy5wcm9wcy52YWx1ZS50YXJnZXR9IG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn0gb25Ub3VjaEVuZD17dGhpcy5oYW5kbGVNb3VzZURvd259PlxyXG5cdFx0XHRcdHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG5cdFx0XHQ8L2E+XHJcblx0XHQpIDogKFxyXG5cdFx0XHQ8c3BhbiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gcm9sZT1cIm9wdGlvblwiIGFyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCIgaWQ9e3RoaXMucHJvcHMuaWR9PlxyXG5cdFx0XHRcdHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG5cdFx0XHQ8L3NwYW4+XHJcblx0XHQpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lcygnU2VsZWN0LXZhbHVlJywgdGhpcy5wcm9wcy52YWx1ZS5jbGFzc05hbWUpfVxyXG5cdFx0XHRcdHN0eWxlPXt0aGlzLnByb3BzLnZhbHVlLnN0eWxlfVxyXG5cdFx0XHRcdHRpdGxlPXt0aGlzLnByb3BzLnZhbHVlLnRpdGxlfVxyXG5cdFx0XHRcdD5cclxuXHRcdFx0XHR7dGhpcy5yZW5kZXJSZW1vdmVJY29uKCl9XHJcblx0XHRcdFx0e3RoaXMucmVuZGVyTGFiZWwoKX1cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWYWx1ZTtcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFycm93UmVuZGVyZXIgKHsgb25Nb3VzZURvd24gfSkge1xyXG5cdHJldHVybiAoXHJcblx0XHQ8c3BhblxyXG5cdFx0XHRjbGFzc05hbWU9XCJTZWxlY3QtYXJyb3dcIlxyXG5cdFx0XHRvbk1vdXNlRG93bj17b25Nb3VzZURvd259XHJcblx0XHQvPlxyXG5cdCk7XHJcbn07XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjbGVhclJlbmRlcmVyICgpIHtcclxuXHRyZXR1cm4gKFxyXG5cdFx0PHNwYW5cclxuXHRcdFx0Y2xhc3NOYW1lPVwiU2VsZWN0LWNsZWFyXCJcclxuXHRcdFx0ZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiAnJnRpbWVzOycgfX1cclxuXHRcdC8+XHJcblx0KTtcclxufTtcclxuIiwiaW1wb3J0IHN0cmlwRGlhY3JpdGljcyBmcm9tICcuL3N0cmlwRGlhY3JpdGljcyc7XHJcblxyXG5mdW5jdGlvbiBmaWx0ZXJPcHRpb25zIChvcHRpb25zLCBmaWx0ZXJWYWx1ZSwgZXhjbHVkZU9wdGlvbnMsIHByb3BzKSB7XHJcblx0aWYgKHByb3BzLmlnbm9yZUFjY2VudHMpIHtcclxuXHRcdGZpbHRlclZhbHVlID0gc3RyaXBEaWFjcml0aWNzKGZpbHRlclZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGlmIChwcm9wcy5pZ25vcmVDYXNlKSB7XHJcblx0XHRmaWx0ZXJWYWx1ZSA9IGZpbHRlclZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcblx0fVxyXG5cclxuXHRpZiAoZXhjbHVkZU9wdGlvbnMpIGV4Y2x1ZGVPcHRpb25zID0gZXhjbHVkZU9wdGlvbnMubWFwKGkgPT4gaVtwcm9wcy52YWx1ZUtleV0pO1xyXG5cclxuXHRyZXR1cm4gb3B0aW9ucy5maWx0ZXIob3B0aW9uID0+IHtcclxuXHRcdGlmIChleGNsdWRlT3B0aW9ucyAmJiBleGNsdWRlT3B0aW9ucy5pbmRleE9mKG9wdGlvbltwcm9wcy52YWx1ZUtleV0pID4gLTEpIHJldHVybiBmYWxzZTtcclxuXHRcdGlmIChwcm9wcy5maWx0ZXJPcHRpb24pIHJldHVybiBwcm9wcy5maWx0ZXJPcHRpb24uY2FsbCh0aGlzLCBvcHRpb24sIGZpbHRlclZhbHVlKTtcclxuXHRcdGlmICghZmlsdGVyVmFsdWUpIHJldHVybiB0cnVlO1xyXG5cdFx0dmFyIHZhbHVlVGVzdCA9IFN0cmluZyhvcHRpb25bcHJvcHMudmFsdWVLZXldKTtcclxuXHRcdHZhciBsYWJlbFRlc3QgPSBTdHJpbmcob3B0aW9uW3Byb3BzLmxhYmVsS2V5XSk7XHJcblx0XHRpZiAocHJvcHMuaWdub3JlQWNjZW50cykge1xyXG5cdFx0XHRpZiAocHJvcHMubWF0Y2hQcm9wICE9PSAnbGFiZWwnKSB2YWx1ZVRlc3QgPSBzdHJpcERpYWNyaXRpY3ModmFsdWVUZXN0KTtcclxuXHRcdFx0aWYgKHByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJykgbGFiZWxUZXN0ID0gc3RyaXBEaWFjcml0aWNzKGxhYmVsVGVzdCk7XHJcblx0XHR9XHJcblx0XHRpZiAocHJvcHMuaWdub3JlQ2FzZSkge1xyXG5cdFx0XHRpZiAocHJvcHMubWF0Y2hQcm9wICE9PSAnbGFiZWwnKSB2YWx1ZVRlc3QgPSB2YWx1ZVRlc3QudG9Mb3dlckNhc2UoKTtcclxuXHRcdFx0aWYgKHByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJykgbGFiZWxUZXN0ID0gbGFiZWxUZXN0LnRvTG93ZXJDYXNlKCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcHJvcHMubWF0Y2hQb3MgPT09ICdzdGFydCcgPyAoXHJcblx0XHRcdChwcm9wcy5tYXRjaFByb3AgIT09ICdsYWJlbCcgJiYgdmFsdWVUZXN0LnN1YnN0cigwLCBmaWx0ZXJWYWx1ZS5sZW5ndGgpID09PSBmaWx0ZXJWYWx1ZSkgfHxcclxuXHRcdFx0KHByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJyAmJiBsYWJlbFRlc3Quc3Vic3RyKDAsIGZpbHRlclZhbHVlLmxlbmd0aCkgPT09IGZpbHRlclZhbHVlKVxyXG5cdFx0KSA6IChcclxuXHRcdFx0KHByb3BzLm1hdGNoUHJvcCAhPT0gJ2xhYmVsJyAmJiB2YWx1ZVRlc3QuaW5kZXhPZihmaWx0ZXJWYWx1ZSkgPj0gMCkgfHxcclxuXHRcdFx0KHByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJyAmJiBsYWJlbFRlc3QuaW5kZXhPZihmaWx0ZXJWYWx1ZSkgPj0gMClcclxuXHRcdCk7XHJcblx0fSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmlsdGVyT3B0aW9ucztcclxuIiwiaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5mdW5jdGlvbiBtZW51UmVuZGVyZXIgKHtcclxuXHRmb2N1c2VkT3B0aW9uLFxyXG5cdGluc3RhbmNlUHJlZml4LFxyXG5cdGxhYmVsS2V5LFxyXG5cdG9uRm9jdXMsXHJcblx0b25TZWxlY3QsXHJcblx0b3B0aW9uQ2xhc3NOYW1lLFxyXG5cdG9wdGlvbkNvbXBvbmVudCxcclxuXHRvcHRpb25SZW5kZXJlcixcclxuXHRvcHRpb25zLFxyXG5cdHZhbHVlQXJyYXksXHJcblx0dmFsdWVLZXksXHJcblx0b25PcHRpb25SZWZcclxufSkge1xyXG5cdGxldCBPcHRpb24gPSBvcHRpb25Db21wb25lbnQ7XHJcblxyXG5cdHJldHVybiBvcHRpb25zLm1hcCgob3B0aW9uLCBpKSA9PiB7XHJcblx0XHRsZXQgaXNTZWxlY3RlZCA9IHZhbHVlQXJyYXkgJiYgdmFsdWVBcnJheS5pbmRleE9mKG9wdGlvbikgPiAtMTtcclxuXHRcdGxldCBpc0ZvY3VzZWQgPSBvcHRpb24gPT09IGZvY3VzZWRPcHRpb247XHJcblx0XHRsZXQgb3B0aW9uQ2xhc3MgPSBjbGFzc05hbWVzKG9wdGlvbkNsYXNzTmFtZSwge1xyXG5cdFx0XHQnU2VsZWN0LW9wdGlvbic6IHRydWUsXHJcblx0XHRcdCdpcy1zZWxlY3RlZCc6IGlzU2VsZWN0ZWQsXHJcblx0XHRcdCdpcy1mb2N1c2VkJzogaXNGb2N1c2VkLFxyXG5cdFx0XHQnaXMtZGlzYWJsZWQnOiBvcHRpb24uZGlzYWJsZWQsXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8T3B0aW9uXHJcblx0XHRcdFx0Y2xhc3NOYW1lPXtvcHRpb25DbGFzc31cclxuXHRcdFx0XHRpbnN0YW5jZVByZWZpeD17aW5zdGFuY2VQcmVmaXh9XHJcblx0XHRcdFx0aXNEaXNhYmxlZD17b3B0aW9uLmRpc2FibGVkfVxyXG5cdFx0XHRcdGlzRm9jdXNlZD17aXNGb2N1c2VkfVxyXG5cdFx0XHRcdGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9XHJcblx0XHRcdFx0a2V5PXtgb3B0aW9uLSR7aX0tJHtvcHRpb25bdmFsdWVLZXldfWB9XHJcblx0XHRcdFx0b25Gb2N1cz17b25Gb2N1c31cclxuXHRcdFx0XHRvblNlbGVjdD17b25TZWxlY3R9XHJcblx0XHRcdFx0b3B0aW9uPXtvcHRpb259XHJcblx0XHRcdFx0b3B0aW9uSW5kZXg9e2l9XHJcblx0XHRcdFx0cmVmPXtyZWYgPT4geyBvbk9wdGlvblJlZihyZWYsIGlzRm9jdXNlZCk7IH19XHJcblx0XHRcdD5cclxuXHRcdFx0XHR7b3B0aW9uUmVuZGVyZXIob3B0aW9uLCBpKX1cclxuXHRcdFx0PC9PcHRpb24+XHJcblx0XHQpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1lbnVSZW5kZXJlcjtcclxuIiwidmFyIG1hcCA9IFtcclxuXHR7ICdiYXNlJzonQScsICdsZXR0ZXJzJzovW1xcdTAwNDFcXHUyNEI2XFx1RkYyMVxcdTAwQzBcXHUwMEMxXFx1MDBDMlxcdTFFQTZcXHUxRUE0XFx1MUVBQVxcdTFFQThcXHUwMEMzXFx1MDEwMFxcdTAxMDJcXHUxRUIwXFx1MUVBRVxcdTFFQjRcXHUxRUIyXFx1MDIyNlxcdTAxRTBcXHUwMEM0XFx1MDFERVxcdTFFQTJcXHUwMEM1XFx1MDFGQVxcdTAxQ0RcXHUwMjAwXFx1MDIwMlxcdTFFQTBcXHUxRUFDXFx1MUVCNlxcdTFFMDBcXHUwMTA0XFx1MDIzQVxcdTJDNkZdL2cgfSxcclxuXHR7ICdiYXNlJzonQUEnLCdsZXR0ZXJzJzovW1xcdUE3MzJdL2cgfSxcclxuXHR7ICdiYXNlJzonQUUnLCdsZXR0ZXJzJzovW1xcdTAwQzZcXHUwMUZDXFx1MDFFMl0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidBTycsJ2xldHRlcnMnOi9bXFx1QTczNF0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidBVScsJ2xldHRlcnMnOi9bXFx1QTczNl0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidBVicsJ2xldHRlcnMnOi9bXFx1QTczOFxcdUE3M0FdL2cgfSxcclxuXHR7ICdiYXNlJzonQVknLCdsZXR0ZXJzJzovW1xcdUE3M0NdL2cgfSxcclxuXHR7ICdiYXNlJzonQicsICdsZXR0ZXJzJzovW1xcdTAwNDJcXHUyNEI3XFx1RkYyMlxcdTFFMDJcXHUxRTA0XFx1MUUwNlxcdTAyNDNcXHUwMTgyXFx1MDE4MV0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidDJywgJ2xldHRlcnMnOi9bXFx1MDA0M1xcdTI0QjhcXHVGRjIzXFx1MDEwNlxcdTAxMDhcXHUwMTBBXFx1MDEwQ1xcdTAwQzdcXHUxRTA4XFx1MDE4N1xcdTAyM0JcXHVBNzNFXS9nIH0sXHJcblx0eyAnYmFzZSc6J0QnLCAnbGV0dGVycyc6L1tcXHUwMDQ0XFx1MjRCOVxcdUZGMjRcXHUxRTBBXFx1MDEwRVxcdTFFMENcXHUxRTEwXFx1MUUxMlxcdTFFMEVcXHUwMTEwXFx1MDE4QlxcdTAxOEFcXHUwMTg5XFx1QTc3OV0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidEWicsJ2xldHRlcnMnOi9bXFx1MDFGMVxcdTAxQzRdL2cgfSxcclxuXHR7ICdiYXNlJzonRHonLCdsZXR0ZXJzJzovW1xcdTAxRjJcXHUwMUM1XS9nIH0sXHJcblx0eyAnYmFzZSc6J0UnLCAnbGV0dGVycyc6L1tcXHUwMDQ1XFx1MjRCQVxcdUZGMjVcXHUwMEM4XFx1MDBDOVxcdTAwQ0FcXHUxRUMwXFx1MUVCRVxcdTFFQzRcXHUxRUMyXFx1MUVCQ1xcdTAxMTJcXHUxRTE0XFx1MUUxNlxcdTAxMTRcXHUwMTE2XFx1MDBDQlxcdTFFQkFcXHUwMTFBXFx1MDIwNFxcdTAyMDZcXHUxRUI4XFx1MUVDNlxcdTAyMjhcXHUxRTFDXFx1MDExOFxcdTFFMThcXHUxRTFBXFx1MDE5MFxcdTAxOEVdL2cgfSxcclxuXHR7ICdiYXNlJzonRicsICdsZXR0ZXJzJzovW1xcdTAwNDZcXHUyNEJCXFx1RkYyNlxcdTFFMUVcXHUwMTkxXFx1QTc3Ql0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidHJywgJ2xldHRlcnMnOi9bXFx1MDA0N1xcdTI0QkNcXHVGRjI3XFx1MDFGNFxcdTAxMUNcXHUxRTIwXFx1MDExRVxcdTAxMjBcXHUwMUU2XFx1MDEyMlxcdTAxRTRcXHUwMTkzXFx1QTdBMFxcdUE3N0RcXHVBNzdFXS9nIH0sXHJcblx0eyAnYmFzZSc6J0gnLCAnbGV0dGVycyc6L1tcXHUwMDQ4XFx1MjRCRFxcdUZGMjhcXHUwMTI0XFx1MUUyMlxcdTFFMjZcXHUwMjFFXFx1MUUyNFxcdTFFMjhcXHUxRTJBXFx1MDEyNlxcdTJDNjdcXHUyQzc1XFx1QTc4RF0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidJJywgJ2xldHRlcnMnOi9bXFx1MDA0OVxcdTI0QkVcXHVGRjI5XFx1MDBDQ1xcdTAwQ0RcXHUwMENFXFx1MDEyOFxcdTAxMkFcXHUwMTJDXFx1MDEzMFxcdTAwQ0ZcXHUxRTJFXFx1MUVDOFxcdTAxQ0ZcXHUwMjA4XFx1MDIwQVxcdTFFQ0FcXHUwMTJFXFx1MUUyQ1xcdTAxOTddL2cgfSxcclxuXHR7ICdiYXNlJzonSicsICdsZXR0ZXJzJzovW1xcdTAwNEFcXHUyNEJGXFx1RkYyQVxcdTAxMzRcXHUwMjQ4XS9nIH0sXHJcblx0eyAnYmFzZSc6J0snLCAnbGV0dGVycyc6L1tcXHUwMDRCXFx1MjRDMFxcdUZGMkJcXHUxRTMwXFx1MDFFOFxcdTFFMzJcXHUwMTM2XFx1MUUzNFxcdTAxOThcXHUyQzY5XFx1QTc0MFxcdUE3NDJcXHVBNzQ0XFx1QTdBMl0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidMJywgJ2xldHRlcnMnOi9bXFx1MDA0Q1xcdTI0QzFcXHVGRjJDXFx1MDEzRlxcdTAxMzlcXHUwMTNEXFx1MUUzNlxcdTFFMzhcXHUwMTNCXFx1MUUzQ1xcdTFFM0FcXHUwMTQxXFx1MDIzRFxcdTJDNjJcXHUyQzYwXFx1QTc0OFxcdUE3NDZcXHVBNzgwXS9nIH0sXHJcblx0eyAnYmFzZSc6J0xKJywnbGV0dGVycyc6L1tcXHUwMUM3XS9nIH0sXHJcblx0eyAnYmFzZSc6J0xqJywnbGV0dGVycyc6L1tcXHUwMUM4XS9nIH0sXHJcblx0eyAnYmFzZSc6J00nLCAnbGV0dGVycyc6L1tcXHUwMDREXFx1MjRDMlxcdUZGMkRcXHUxRTNFXFx1MUU0MFxcdTFFNDJcXHUyQzZFXFx1MDE5Q10vZyB9LFxyXG5cdHsgJ2Jhc2UnOidOJywgJ2xldHRlcnMnOi9bXFx1MDA0RVxcdTI0QzNcXHVGRjJFXFx1MDFGOFxcdTAxNDNcXHUwMEQxXFx1MUU0NFxcdTAxNDdcXHUxRTQ2XFx1MDE0NVxcdTFFNEFcXHUxRTQ4XFx1MDIyMFxcdTAxOURcXHVBNzkwXFx1QTdBNF0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidOSicsJ2xldHRlcnMnOi9bXFx1MDFDQV0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidOaicsJ2xldHRlcnMnOi9bXFx1MDFDQl0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidPJywgJ2xldHRlcnMnOi9bXFx1MDA0RlxcdTI0QzRcXHVGRjJGXFx1MDBEMlxcdTAwRDNcXHUwMEQ0XFx1MUVEMlxcdTFFRDBcXHUxRUQ2XFx1MUVENFxcdTAwRDVcXHUxRTRDXFx1MDIyQ1xcdTFFNEVcXHUwMTRDXFx1MUU1MFxcdTFFNTJcXHUwMTRFXFx1MDIyRVxcdTAyMzBcXHUwMEQ2XFx1MDIyQVxcdTFFQ0VcXHUwMTUwXFx1MDFEMVxcdTAyMENcXHUwMjBFXFx1MDFBMFxcdTFFRENcXHUxRURBXFx1MUVFMFxcdTFFREVcXHUxRUUyXFx1MUVDQ1xcdTFFRDhcXHUwMUVBXFx1MDFFQ1xcdTAwRDhcXHUwMUZFXFx1MDE4NlxcdTAxOUZcXHVBNzRBXFx1QTc0Q10vZyB9LFxyXG5cdHsgJ2Jhc2UnOidPSScsJ2xldHRlcnMnOi9bXFx1MDFBMl0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidPTycsJ2xldHRlcnMnOi9bXFx1QTc0RV0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidPVScsJ2xldHRlcnMnOi9bXFx1MDIyMl0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidQJywgJ2xldHRlcnMnOi9bXFx1MDA1MFxcdTI0QzVcXHVGRjMwXFx1MUU1NFxcdTFFNTZcXHUwMUE0XFx1MkM2M1xcdUE3NTBcXHVBNzUyXFx1QTc1NF0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidRJywgJ2xldHRlcnMnOi9bXFx1MDA1MVxcdTI0QzZcXHVGRjMxXFx1QTc1NlxcdUE3NThcXHUwMjRBXS9nIH0sXHJcblx0eyAnYmFzZSc6J1InLCAnbGV0dGVycyc6L1tcXHUwMDUyXFx1MjRDN1xcdUZGMzJcXHUwMTU0XFx1MUU1OFxcdTAxNThcXHUwMjEwXFx1MDIxMlxcdTFFNUFcXHUxRTVDXFx1MDE1NlxcdTFFNUVcXHUwMjRDXFx1MkM2NFxcdUE3NUFcXHVBN0E2XFx1QTc4Ml0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidTJywgJ2xldHRlcnMnOi9bXFx1MDA1M1xcdTI0QzhcXHVGRjMzXFx1MUU5RVxcdTAxNUFcXHUxRTY0XFx1MDE1Q1xcdTFFNjBcXHUwMTYwXFx1MUU2NlxcdTFFNjJcXHUxRTY4XFx1MDIxOFxcdTAxNUVcXHUyQzdFXFx1QTdBOFxcdUE3ODRdL2cgfSxcclxuXHR7ICdiYXNlJzonVCcsICdsZXR0ZXJzJzovW1xcdTAwNTRcXHUyNEM5XFx1RkYzNFxcdTFFNkFcXHUwMTY0XFx1MUU2Q1xcdTAyMUFcXHUwMTYyXFx1MUU3MFxcdTFFNkVcXHUwMTY2XFx1MDFBQ1xcdTAxQUVcXHUwMjNFXFx1QTc4Nl0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidUWicsJ2xldHRlcnMnOi9bXFx1QTcyOF0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidVJywgJ2xldHRlcnMnOi9bXFx1MDA1NVxcdTI0Q0FcXHVGRjM1XFx1MDBEOVxcdTAwREFcXHUwMERCXFx1MDE2OFxcdTFFNzhcXHUwMTZBXFx1MUU3QVxcdTAxNkNcXHUwMERDXFx1MDFEQlxcdTAxRDdcXHUwMUQ1XFx1MDFEOVxcdTFFRTZcXHUwMTZFXFx1MDE3MFxcdTAxRDNcXHUwMjE0XFx1MDIxNlxcdTAxQUZcXHUxRUVBXFx1MUVFOFxcdTFFRUVcXHUxRUVDXFx1MUVGMFxcdTFFRTRcXHUxRTcyXFx1MDE3MlxcdTFFNzZcXHUxRTc0XFx1MDI0NF0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidWJywgJ2xldHRlcnMnOi9bXFx1MDA1NlxcdTI0Q0JcXHVGRjM2XFx1MUU3Q1xcdTFFN0VcXHUwMUIyXFx1QTc1RVxcdTAyNDVdL2cgfSxcclxuXHR7ICdiYXNlJzonVlknLCdsZXR0ZXJzJzovW1xcdUE3NjBdL2cgfSxcclxuXHR7ICdiYXNlJzonVycsICdsZXR0ZXJzJzovW1xcdTAwNTdcXHUyNENDXFx1RkYzN1xcdTFFODBcXHUxRTgyXFx1MDE3NFxcdTFFODZcXHUxRTg0XFx1MUU4OFxcdTJDNzJdL2cgfSxcclxuXHR7ICdiYXNlJzonWCcsICdsZXR0ZXJzJzovW1xcdTAwNThcXHUyNENEXFx1RkYzOFxcdTFFOEFcXHUxRThDXS9nIH0sXHJcblx0eyAnYmFzZSc6J1knLCAnbGV0dGVycyc6L1tcXHUwMDU5XFx1MjRDRVxcdUZGMzlcXHUxRUYyXFx1MDBERFxcdTAxNzZcXHUxRUY4XFx1MDIzMlxcdTFFOEVcXHUwMTc4XFx1MUVGNlxcdTFFRjRcXHUwMUIzXFx1MDI0RVxcdTFFRkVdL2cgfSxcclxuXHR7ICdiYXNlJzonWicsICdsZXR0ZXJzJzovW1xcdTAwNUFcXHUyNENGXFx1RkYzQVxcdTAxNzlcXHUxRTkwXFx1MDE3QlxcdTAxN0RcXHUxRTkyXFx1MUU5NFxcdTAxQjVcXHUwMjI0XFx1MkM3RlxcdTJDNkJcXHVBNzYyXS9nIH0sXHJcblx0eyAnYmFzZSc6J2EnLCAnbGV0dGVycyc6L1tcXHUwMDYxXFx1MjREMFxcdUZGNDFcXHUxRTlBXFx1MDBFMFxcdTAwRTFcXHUwMEUyXFx1MUVBN1xcdTFFQTVcXHUxRUFCXFx1MUVBOVxcdTAwRTNcXHUwMTAxXFx1MDEwM1xcdTFFQjFcXHUxRUFGXFx1MUVCNVxcdTFFQjNcXHUwMjI3XFx1MDFFMVxcdTAwRTRcXHUwMURGXFx1MUVBM1xcdTAwRTVcXHUwMUZCXFx1MDFDRVxcdTAyMDFcXHUwMjAzXFx1MUVBMVxcdTFFQURcXHUxRUI3XFx1MUUwMVxcdTAxMDVcXHUyQzY1XFx1MDI1MF0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidhYScsJ2xldHRlcnMnOi9bXFx1QTczM10vZyB9LFxyXG5cdHsgJ2Jhc2UnOidhZScsJ2xldHRlcnMnOi9bXFx1MDBFNlxcdTAxRkRcXHUwMUUzXS9nIH0sXHJcblx0eyAnYmFzZSc6J2FvJywnbGV0dGVycyc6L1tcXHVBNzM1XS9nIH0sXHJcblx0eyAnYmFzZSc6J2F1JywnbGV0dGVycyc6L1tcXHVBNzM3XS9nIH0sXHJcblx0eyAnYmFzZSc6J2F2JywnbGV0dGVycyc6L1tcXHVBNzM5XFx1QTczQl0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidheScsJ2xldHRlcnMnOi9bXFx1QTczRF0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidiJywgJ2xldHRlcnMnOi9bXFx1MDA2MlxcdTI0RDFcXHVGRjQyXFx1MUUwM1xcdTFFMDVcXHUxRTA3XFx1MDE4MFxcdTAxODNcXHUwMjUzXS9nIH0sXHJcblx0eyAnYmFzZSc6J2MnLCAnbGV0dGVycyc6L1tcXHUwMDYzXFx1MjREMlxcdUZGNDNcXHUwMTA3XFx1MDEwOVxcdTAxMEJcXHUwMTBEXFx1MDBFN1xcdTFFMDlcXHUwMTg4XFx1MDIzQ1xcdUE3M0ZcXHUyMTg0XS9nIH0sXHJcblx0eyAnYmFzZSc6J2QnLCAnbGV0dGVycyc6L1tcXHUwMDY0XFx1MjREM1xcdUZGNDRcXHUxRTBCXFx1MDEwRlxcdTFFMERcXHUxRTExXFx1MUUxM1xcdTFFMEZcXHUwMTExXFx1MDE4Q1xcdTAyNTZcXHUwMjU3XFx1QTc3QV0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidkeicsJ2xldHRlcnMnOi9bXFx1MDFGM1xcdTAxQzZdL2cgfSxcclxuXHR7ICdiYXNlJzonZScsICdsZXR0ZXJzJzovW1xcdTAwNjVcXHUyNEQ0XFx1RkY0NVxcdTAwRThcXHUwMEU5XFx1MDBFQVxcdTFFQzFcXHUxRUJGXFx1MUVDNVxcdTFFQzNcXHUxRUJEXFx1MDExM1xcdTFFMTVcXHUxRTE3XFx1MDExNVxcdTAxMTdcXHUwMEVCXFx1MUVCQlxcdTAxMUJcXHUwMjA1XFx1MDIwN1xcdTFFQjlcXHUxRUM3XFx1MDIyOVxcdTFFMURcXHUwMTE5XFx1MUUxOVxcdTFFMUJcXHUwMjQ3XFx1MDI1QlxcdTAxRERdL2cgfSxcclxuXHR7ICdiYXNlJzonZicsICdsZXR0ZXJzJzovW1xcdTAwNjZcXHUyNEQ1XFx1RkY0NlxcdTFFMUZcXHUwMTkyXFx1QTc3Q10vZyB9LFxyXG5cdHsgJ2Jhc2UnOidnJywgJ2xldHRlcnMnOi9bXFx1MDA2N1xcdTI0RDZcXHVGRjQ3XFx1MDFGNVxcdTAxMURcXHUxRTIxXFx1MDExRlxcdTAxMjFcXHUwMUU3XFx1MDEyM1xcdTAxRTVcXHUwMjYwXFx1QTdBMVxcdTFENzlcXHVBNzdGXS9nIH0sXHJcblx0eyAnYmFzZSc6J2gnLCAnbGV0dGVycyc6L1tcXHUwMDY4XFx1MjREN1xcdUZGNDhcXHUwMTI1XFx1MUUyM1xcdTFFMjdcXHUwMjFGXFx1MUUyNVxcdTFFMjlcXHUxRTJCXFx1MUU5NlxcdTAxMjdcXHUyQzY4XFx1MkM3NlxcdTAyNjVdL2cgfSxcclxuXHR7ICdiYXNlJzonaHYnLCdsZXR0ZXJzJzovW1xcdTAxOTVdL2cgfSxcclxuXHR7ICdiYXNlJzonaScsICdsZXR0ZXJzJzovW1xcdTAwNjlcXHUyNEQ4XFx1RkY0OVxcdTAwRUNcXHUwMEVEXFx1MDBFRVxcdTAxMjlcXHUwMTJCXFx1MDEyRFxcdTAwRUZcXHUxRTJGXFx1MUVDOVxcdTAxRDBcXHUwMjA5XFx1MDIwQlxcdTFFQ0JcXHUwMTJGXFx1MUUyRFxcdTAyNjhcXHUwMTMxXS9nIH0sXHJcblx0eyAnYmFzZSc6J2onLCAnbGV0dGVycyc6L1tcXHUwMDZBXFx1MjREOVxcdUZGNEFcXHUwMTM1XFx1MDFGMFxcdTAyNDldL2cgfSxcclxuXHR7ICdiYXNlJzonaycsICdsZXR0ZXJzJzovW1xcdTAwNkJcXHUyNERBXFx1RkY0QlxcdTFFMzFcXHUwMUU5XFx1MUUzM1xcdTAxMzdcXHUxRTM1XFx1MDE5OVxcdTJDNkFcXHVBNzQxXFx1QTc0M1xcdUE3NDVcXHVBN0EzXS9nIH0sXHJcblx0eyAnYmFzZSc6J2wnLCAnbGV0dGVycyc6L1tcXHUwMDZDXFx1MjREQlxcdUZGNENcXHUwMTQwXFx1MDEzQVxcdTAxM0VcXHUxRTM3XFx1MUUzOVxcdTAxM0NcXHUxRTNEXFx1MUUzQlxcdTAxN0ZcXHUwMTQyXFx1MDE5QVxcdTAyNkJcXHUyQzYxXFx1QTc0OVxcdUE3ODFcXHVBNzQ3XS9nIH0sXHJcblx0eyAnYmFzZSc6J2xqJywnbGV0dGVycyc6L1tcXHUwMUM5XS9nIH0sXHJcblx0eyAnYmFzZSc6J20nLCAnbGV0dGVycyc6L1tcXHUwMDZEXFx1MjREQ1xcdUZGNERcXHUxRTNGXFx1MUU0MVxcdTFFNDNcXHUwMjcxXFx1MDI2Rl0vZyB9LFxyXG5cdHsgJ2Jhc2UnOiduJywgJ2xldHRlcnMnOi9bXFx1MDA2RVxcdTI0RERcXHVGRjRFXFx1MDFGOVxcdTAxNDRcXHUwMEYxXFx1MUU0NVxcdTAxNDhcXHUxRTQ3XFx1MDE0NlxcdTFFNEJcXHUxRTQ5XFx1MDE5RVxcdTAyNzJcXHUwMTQ5XFx1QTc5MVxcdUE3QTVdL2cgfSxcclxuXHR7ICdiYXNlJzonbmonLCdsZXR0ZXJzJzovW1xcdTAxQ0NdL2cgfSxcclxuXHR7ICdiYXNlJzonbycsICdsZXR0ZXJzJzovW1xcdTAwNkZcXHUyNERFXFx1RkY0RlxcdTAwRjJcXHUwMEYzXFx1MDBGNFxcdTFFRDNcXHUxRUQxXFx1MUVEN1xcdTFFRDVcXHUwMEY1XFx1MUU0RFxcdTAyMkRcXHUxRTRGXFx1MDE0RFxcdTFFNTFcXHUxRTUzXFx1MDE0RlxcdTAyMkZcXHUwMjMxXFx1MDBGNlxcdTAyMkJcXHUxRUNGXFx1MDE1MVxcdTAxRDJcXHUwMjBEXFx1MDIwRlxcdTAxQTFcXHUxRUREXFx1MUVEQlxcdTFFRTFcXHUxRURGXFx1MUVFM1xcdTFFQ0RcXHUxRUQ5XFx1MDFFQlxcdTAxRURcXHUwMEY4XFx1MDFGRlxcdTAyNTRcXHVBNzRCXFx1QTc0RFxcdTAyNzVdL2cgfSxcclxuXHR7ICdiYXNlJzonb2knLCdsZXR0ZXJzJzovW1xcdTAxQTNdL2cgfSxcclxuXHR7ICdiYXNlJzonb3UnLCdsZXR0ZXJzJzovW1xcdTAyMjNdL2cgfSxcclxuXHR7ICdiYXNlJzonb28nLCdsZXR0ZXJzJzovW1xcdUE3NEZdL2cgfSxcclxuXHR7ICdiYXNlJzoncCcsICdsZXR0ZXJzJzovW1xcdTAwNzBcXHUyNERGXFx1RkY1MFxcdTFFNTVcXHUxRTU3XFx1MDFBNVxcdTFEN0RcXHVBNzUxXFx1QTc1M1xcdUE3NTVdL2cgfSxcclxuXHR7ICdiYXNlJzoncScsICdsZXR0ZXJzJzovW1xcdTAwNzFcXHUyNEUwXFx1RkY1MVxcdTAyNEJcXHVBNzU3XFx1QTc1OV0vZyB9LFxyXG5cdHsgJ2Jhc2UnOidyJywgJ2xldHRlcnMnOi9bXFx1MDA3MlxcdTI0RTFcXHVGRjUyXFx1MDE1NVxcdTFFNTlcXHUwMTU5XFx1MDIxMVxcdTAyMTNcXHUxRTVCXFx1MUU1RFxcdTAxNTdcXHUxRTVGXFx1MDI0RFxcdTAyN0RcXHVBNzVCXFx1QTdBN1xcdUE3ODNdL2cgfSxcclxuXHR7ICdiYXNlJzoncycsICdsZXR0ZXJzJzovW1xcdTAwNzNcXHUyNEUyXFx1RkY1M1xcdTAwREZcXHUwMTVCXFx1MUU2NVxcdTAxNURcXHUxRTYxXFx1MDE2MVxcdTFFNjdcXHUxRTYzXFx1MUU2OVxcdTAyMTlcXHUwMTVGXFx1MDIzRlxcdUE3QTlcXHVBNzg1XFx1MUU5Ql0vZyB9LFxyXG5cdHsgJ2Jhc2UnOid0JywgJ2xldHRlcnMnOi9bXFx1MDA3NFxcdTI0RTNcXHVGRjU0XFx1MUU2QlxcdTFFOTdcXHUwMTY1XFx1MUU2RFxcdTAyMUJcXHUwMTYzXFx1MUU3MVxcdTFFNkZcXHUwMTY3XFx1MDFBRFxcdTAyODhcXHUyQzY2XFx1QTc4N10vZyB9LFxyXG5cdHsgJ2Jhc2UnOid0eicsJ2xldHRlcnMnOi9bXFx1QTcyOV0vZyB9LFxyXG5cdHsgJ2Jhc2UnOid1JywgJ2xldHRlcnMnOi9bXFx1MDA3NVxcdTI0RTRcXHVGRjU1XFx1MDBGOVxcdTAwRkFcXHUwMEZCXFx1MDE2OVxcdTFFNzlcXHUwMTZCXFx1MUU3QlxcdTAxNkRcXHUwMEZDXFx1MDFEQ1xcdTAxRDhcXHUwMUQ2XFx1MDFEQVxcdTFFRTdcXHUwMTZGXFx1MDE3MVxcdTAxRDRcXHUwMjE1XFx1MDIxN1xcdTAxQjBcXHUxRUVCXFx1MUVFOVxcdTFFRUZcXHUxRUVEXFx1MUVGMVxcdTFFRTVcXHUxRTczXFx1MDE3M1xcdTFFNzdcXHUxRTc1XFx1MDI4OV0vZyB9LFxyXG5cdHsgJ2Jhc2UnOid2JywgJ2xldHRlcnMnOi9bXFx1MDA3NlxcdTI0RTVcXHVGRjU2XFx1MUU3RFxcdTFFN0ZcXHUwMjhCXFx1QTc1RlxcdTAyOENdL2cgfSxcclxuXHR7ICdiYXNlJzondnknLCdsZXR0ZXJzJzovW1xcdUE3NjFdL2cgfSxcclxuXHR7ICdiYXNlJzondycsICdsZXR0ZXJzJzovW1xcdTAwNzdcXHUyNEU2XFx1RkY1N1xcdTFFODFcXHUxRTgzXFx1MDE3NVxcdTFFODdcXHUxRTg1XFx1MUU5OFxcdTFFODlcXHUyQzczXS9nIH0sXHJcblx0eyAnYmFzZSc6J3gnLCAnbGV0dGVycyc6L1tcXHUwMDc4XFx1MjRFN1xcdUZGNThcXHUxRThCXFx1MUU4RF0vZyB9LFxyXG5cdHsgJ2Jhc2UnOid5JywgJ2xldHRlcnMnOi9bXFx1MDA3OVxcdTI0RThcXHVGRjU5XFx1MUVGM1xcdTAwRkRcXHUwMTc3XFx1MUVGOVxcdTAyMzNcXHUxRThGXFx1MDBGRlxcdTFFRjdcXHUxRTk5XFx1MUVGNVxcdTAxQjRcXHUwMjRGXFx1MUVGRl0vZyB9LFxyXG5cdHsgJ2Jhc2UnOid6JywgJ2xldHRlcnMnOi9bXFx1MDA3QVxcdTI0RTlcXHVGRjVBXFx1MDE3QVxcdTFFOTFcXHUwMTdDXFx1MDE3RVxcdTFFOTNcXHUxRTk1XFx1MDFCNlxcdTAyMjVcXHUwMjQwXFx1MkM2Q1xcdUE3NjNdL2cgfSxcclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RyaXBEaWFjcml0aWNzIChzdHIpIHtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkrKykge1xyXG5cdFx0c3RyID0gc3RyLnJlcGxhY2UobWFwW2ldLmxldHRlcnMsIG1hcFtpXS5iYXNlKTtcclxuXHR9XHJcblx0cmV0dXJuIHN0cjtcclxufTtcclxuIiwiLyohXHJcbiAgQ29weXJpZ2h0IChjKSAyMDE2IEplZCBXYXRzb24uXHJcbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcclxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9yZWFjdC1zZWxlY3RcclxuKi9cclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xyXG5pbXBvcnQgQXV0b3NpemVJbnB1dCBmcm9tICdyZWFjdC1pbnB1dC1hdXRvc2l6ZSc7XHJcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5cclxuaW1wb3J0IGRlZmF1bHRBcnJvd1JlbmRlcmVyIGZyb20gJy4vdXRpbHMvZGVmYXVsdEFycm93UmVuZGVyZXInO1xyXG5pbXBvcnQgZGVmYXVsdEZpbHRlck9wdGlvbnMgZnJvbSAnLi91dGlscy9kZWZhdWx0RmlsdGVyT3B0aW9ucyc7XHJcbmltcG9ydCBkZWZhdWx0TWVudVJlbmRlcmVyIGZyb20gJy4vdXRpbHMvZGVmYXVsdE1lbnVSZW5kZXJlcic7XHJcbmltcG9ydCBkZWZhdWx0Q2xlYXJSZW5kZXJlciBmcm9tICcuL3V0aWxzL2RlZmF1bHRDbGVhclJlbmRlcmVyJztcclxuXHJcbmltcG9ydCBBc3luYyBmcm9tICcuL0FzeW5jJztcclxuaW1wb3J0IEFzeW5jQ3JlYXRhYmxlIGZyb20gJy4vQXN5bmNDcmVhdGFibGUnO1xyXG5pbXBvcnQgQ3JlYXRhYmxlIGZyb20gJy4vQ3JlYXRhYmxlJztcclxuaW1wb3J0IE9wdGlvbiBmcm9tICcuL09wdGlvbic7XHJcbmltcG9ydCBWYWx1ZSBmcm9tICcuL1ZhbHVlJztcclxuXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeVZhbHVlICh2YWx1ZSkge1xyXG5cdGNvbnN0IHZhbHVlVHlwZSA9IHR5cGVvZiB2YWx1ZTtcclxuXHRpZiAodmFsdWVUeXBlID09PSAnc3RyaW5nJykge1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH0gZWxzZSBpZiAodmFsdWVUeXBlID09PSAnb2JqZWN0Jykge1xyXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcclxuXHR9IGVsc2UgaWYgKHZhbHVlVHlwZSA9PT0gJ251bWJlcicgfHwgdmFsdWVUeXBlID09PSAnYm9vbGVhbicpIHtcclxuXHRcdHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gJyc7XHJcblx0fVxyXG59XHJcblxyXG5pZiAoIUFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgpIHtcclxuICBBcnJheS5wcm90b3R5cGUuZmluZEluZGV4ID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XHJcbiAgICBpZiAodGhpcyA9PT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUuZmluZEluZGV4IGNhbGxlZCBvbiBudWxsIG9yIHVuZGVmaW5lZCcpO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncHJlZGljYXRlIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgfVxyXG4gICAgdmFyIGxpc3QgPSBPYmplY3QodGhpcyk7XHJcbiAgICB2YXIgbGVuZ3RoID0gbGlzdC5sZW5ndGggPj4+IDA7XHJcbiAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1sxXTtcclxuICAgIHZhciB2YWx1ZTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhbHVlID0gbGlzdFtpXTtcclxuICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCBsaXN0KSkge1xyXG4gICAgICAgIHJldHVybiBpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfTtcclxufVxyXG5cclxuY29uc3Qgc3RyaW5nT3JOb2RlID0gUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXHJcblx0UmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuXHRSZWFjdC5Qcm9wVHlwZXMubm9kZVxyXG5dKTtcclxuXHJcbmxldCBpbnN0YW5jZUlkID0gMTtcclxuXHJcbmNvbnN0IFNlbGVjdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0ZGlzcGxheU5hbWU6ICdTZWxlY3QnLFxyXG5cclxuXHRwcm9wVHlwZXM6IHtcclxuXHRcdGFkZExhYmVsVGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgLy8gcGxhY2Vob2xkZXIgZGlzcGxheWVkIHdoZW4geW91IHdhbnQgdG8gYWRkIGEgbGFiZWwgb24gYSBtdWx0aS12YWx1ZSBpbnB1dFxyXG5cdFx0J2FyaWEtbGFiZWwnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAvLyBBcmlhIGxhYmVsIChmb3IgYXNzaXN0aXZlIHRlY2gpXHJcblx0XHQnYXJpYS1sYWJlbGxlZGJ5JzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcdC8vIEhUTUwgSUQgb2YgYW4gZWxlbWVudCB0aGF0IHNob3VsZCBiZSB1c2VkIGFzIHRoZSBsYWJlbCAoZm9yIGFzc2lzdGl2ZSB0ZWNoKVxyXG5cdFx0YXJyb3dSZW5kZXJlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXHRcdFx0XHQvLyBDcmVhdGUgZHJvcC1kb3duIGNhcmV0IGVsZW1lbnRcclxuXHRcdGF1dG9CbHVyOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgLy8gYXV0b21hdGljYWxseSBibHVyIHRoZSBjb21wb25lbnQgd2hlbiBhbiBvcHRpb24gaXMgc2VsZWN0ZWRcclxuXHRcdGF1dG9mb2N1czogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgLy8gYXV0b2ZvY3VzIHRoZSBjb21wb25lbnQgb24gbW91bnRcclxuXHRcdGF1dG9zaXplOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgLy8gd2hldGhlciB0byBlbmFibGUgYXV0b3NpemluZyBvciBub3RcclxuXHRcdGJhY2tzcGFjZVJlbW92ZXM6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgLy8gd2hldGhlciBiYWNrc3BhY2UgcmVtb3ZlcyBhbiBpdGVtIGlmIHRoZXJlIGlzIG5vIHRleHQgaW5wdXRcclxuXHRcdGJhY2tzcGFjZVRvUmVtb3ZlTWVzc2FnZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgIC8vIE1lc3NhZ2UgdG8gdXNlIGZvciBzY3JlZW5yZWFkZXJzIHRvIHByZXNzIGJhY2tzcGFjZSB0byByZW1vdmUgdGhlIGN1cnJlbnQgaXRlbSAtIHtsYWJlbH0gaXMgcmVwbGFjZWQgd2l0aCB0aGUgaXRlbSBsYWJlbFxyXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAvLyBjbGFzc05hbWUgZm9yIHRoZSBvdXRlciBlbGVtZW50XHJcblx0XHRjbGVhckFsbFRleHQ6IHN0cmluZ09yTm9kZSwgICAgICAgICAgICAgICAgIC8vIHRpdGxlIGZvciB0aGUgXCJjbGVhclwiIGNvbnRyb2wgd2hlbiBtdWx0aTogdHJ1ZVxyXG5cdFx0Y2xlYXJSZW5kZXJlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAvLyBjcmVhdGUgY2xlYXJhYmxlIHggZWxlbWVudFxyXG5cdFx0Y2xlYXJWYWx1ZVRleHQ6IHN0cmluZ09yTm9kZSwgICAgICAgICAgICAgICAvLyB0aXRsZSBmb3IgdGhlIFwiY2xlYXJcIiBjb250cm9sXHJcblx0XHRjbGVhcmFibGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgIC8vIHNob3VsZCBpdCBiZSBwb3NzaWJsZSB0byByZXNldCB2YWx1ZVxyXG5cdFx0ZGVsZXRlUmVtb3ZlczogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAvLyB3aGV0aGVyIGJhY2tzcGFjZSByZW1vdmVzIGFuIGl0ZW0gaWYgdGhlcmUgaXMgbm8gdGV4dCBpbnB1dFxyXG5cdFx0ZGVsaW1pdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAvLyBkZWxpbWl0ZXIgdG8gdXNlIHRvIGpvaW4gbXVsdGlwbGUgdmFsdWVzIGZvciB0aGUgaGlkZGVuIGZpZWxkIHZhbHVlXHJcblx0XHRkaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgIC8vIHdoZXRoZXIgdGhlIFNlbGVjdCBpcyBkaXNhYmxlZCBvciBub3RcclxuXHRcdGVzY2FwZUNsZWFyc1ZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgLy8gd2hldGhlciBlc2NhcGUgY2xlYXJzIHRoZSB2YWx1ZSB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZFxyXG5cdFx0ZmlsdGVyT3B0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAvLyBtZXRob2QgdG8gZmlsdGVyIGEgc2luZ2xlIG9wdGlvbiAob3B0aW9uLCBmaWx0ZXJTdHJpbmcpXHJcblx0XHRmaWx0ZXJPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuYW55LCAgICAgICAgIC8vIGJvb2xlYW4gdG8gZW5hYmxlIGRlZmF1bHQgZmlsdGVyaW5nIG9yIGZ1bmN0aW9uIHRvIGZpbHRlciB0aGUgb3B0aW9ucyBhcnJheSAoW29wdGlvbnNdLCBmaWx0ZXJTdHJpbmcsIFt2YWx1ZXNdKVxyXG5cdFx0aWdub3JlQWNjZW50czogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAvLyB3aGV0aGVyIHRvIHN0cmlwIGRpYWNyaXRpY3Mgd2hlbiBmaWx0ZXJpbmdcclxuXHRcdGlnbm9yZUNhc2U6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgLy8gd2hldGhlciB0byBwZXJmb3JtIGNhc2UtaW5zZW5zaXRpdmUgZmlsdGVyaW5nXHJcblx0XHRpbnB1dFByb3BzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LCAgICAgICAgIC8vIGN1c3RvbSBhdHRyaWJ1dGVzIGZvciB0aGUgSW5wdXRcclxuXHRcdGlucHV0UmVuZGVyZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgLy8gcmV0dXJucyBhIGN1c3RvbSBpbnB1dCBjb21wb25lbnRcclxuXHRcdGluc3RhbmNlSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgLy8gc2V0IHRoZSBjb21wb25lbnRzIGluc3RhbmNlSWRcclxuXHRcdGlzTG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgLy8gd2hldGhlciB0aGUgU2VsZWN0IGlzIGxvYWRpbmcgZXh0ZXJuYWxseSBvciBub3QgKHN1Y2ggYXMgb3B0aW9ucyBiZWluZyBsb2FkZWQpXHJcblx0XHRqb2luVmFsdWVzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgIC8vIGpvaW5zIG11bHRpcGxlIHZhbHVlcyBpbnRvIGEgc2luZ2xlIGZvcm0gZmllbGQgd2l0aCB0aGUgZGVsaW1pdGVyIChsZWdhY3kgbW9kZSlcclxuXHRcdGxhYmVsS2V5OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgLy8gcGF0aCBvZiB0aGUgbGFiZWwgdmFsdWUgaW4gb3B0aW9uIG9iamVjdHNcclxuXHRcdG1hdGNoUG9zOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgLy8gKGFueXxzdGFydCkgbWF0Y2ggdGhlIHN0YXJ0IG9yIGVudGlyZSBzdHJpbmcgd2hlbiBmaWx0ZXJpbmdcclxuXHRcdG1hdGNoUHJvcDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgLy8gKGFueXxsYWJlbHx2YWx1ZSkgd2hpY2ggb3B0aW9uIHByb3BlcnR5IHRvIGZpbHRlciBvblxyXG5cdFx0bWVudUJ1ZmZlcjogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBvcHRpb25hbCBidWZmZXIgKGluIHB4KSBiZXR3ZWVuIHRoZSBib3R0b20gb2YgdGhlIHZpZXdwb3J0IGFuZCB0aGUgYm90dG9tIG9mIHRoZSBtZW51XHJcblx0XHRtZW51Q29udGFpbmVyU3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsIC8vIG9wdGlvbmFsIHN0eWxlIHRvIGFwcGx5IHRvIHRoZSBtZW51IGNvbnRhaW5lclxyXG5cdFx0bWVudVJlbmRlcmVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAvLyByZW5kZXJzIGEgY3VzdG9tIG1lbnUgd2l0aCBvcHRpb25zXHJcblx0XHRtZW51U3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsICAgICAgICAgIC8vIG9wdGlvbmFsIHN0eWxlIHRvIGFwcGx5IHRvIHRoZSBtZW51XHJcblx0XHRtdWx0aTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgIC8vIG11bHRpLXZhbHVlIGlucHV0XHJcblx0XHRuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAgIC8vIGdlbmVyYXRlcyBhIGhpZGRlbiA8aW5wdXQgLz4gdGFnIHdpdGggdGhpcyBmaWVsZCBuYW1lIGZvciBodG1sIGZvcm1zXHJcblx0XHRub1Jlc3VsdHNUZXh0OiBzdHJpbmdPck5vZGUsICAgICAgICAgICAgICAgIC8vIHBsYWNlaG9sZGVyIGRpc3BsYXllZCB3aGVuIHRoZXJlIGFyZSBubyBtYXRjaGluZyBzZWFyY2ggcmVzdWx0c1xyXG5cdFx0b25CbHVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgICAvLyBvbkJsdXIgaGFuZGxlcjogZnVuY3Rpb24gKGV2ZW50KSB7fVxyXG5cdFx0b25CbHVyUmVzZXRzSW5wdXQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAvLyB3aGV0aGVyIGlucHV0IGlzIGNsZWFyZWQgb24gYmx1clxyXG5cdFx0b25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAvLyBvbkNoYW5nZSBoYW5kbGVyOiBmdW5jdGlvbiAobmV3VmFsdWUpIHt9XHJcblx0XHRvbkNsb3NlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgIC8vIGZpcmVzIHdoZW4gdGhlIG1lbnUgaXMgY2xvc2VkXHJcblx0XHRvbkNsb3NlUmVzZXRzSW5wdXQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFx0XHQvLyB3aGV0aGVyIGlucHV0IGlzIGNsZWFyZWQgd2hlbiBtZW51IGlzIGNsb3NlZCB0aHJvdWdoIHRoZSBhcnJvd1xyXG5cdFx0b25Gb2N1czogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAvLyBvbkZvY3VzIGhhbmRsZXI6IGZ1bmN0aW9uIChldmVudCkge31cclxuXHRcdG9uSW5wdXRDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgLy8gb25JbnB1dENoYW5nZSBoYW5kbGVyOiBmdW5jdGlvbiAoaW5wdXRWYWx1ZSkge31cclxuXHRcdG9uSW5wdXRLZXlEb3duOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgLy8gaW5wdXQga2V5RG93biBoYW5kbGVyOiBmdW5jdGlvbiAoZXZlbnQpIHt9XHJcblx0XHRvbk1lbnVTY3JvbGxUb0JvdHRvbTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsIC8vIGZpcmVzIHdoZW4gdGhlIG1lbnUgaXMgc2Nyb2xsZWQgdG8gdGhlIGJvdHRvbTsgY2FuIGJlIHVzZWQgdG8gcGFnaW5hdGUgb3B0aW9uc1xyXG5cdFx0b25PcGVuOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgICAvLyBmaXJlcyB3aGVuIHRoZSBtZW51IGlzIG9wZW5lZFxyXG5cdFx0b25WYWx1ZUNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAvLyBvbkNsaWNrIGhhbmRsZXIgZm9yIHZhbHVlIGxhYmVsczogZnVuY3Rpb24gKHZhbHVlLCBldmVudCkge31cclxuXHRcdG9wZW5BZnRlckZvY3VzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgLy8gYm9vbGVhbiB0byBlbmFibGUgb3BlbmluZyBkcm9wZG93biB3aGVuIGZvY3VzZWRcclxuXHRcdG9wZW5PbkZvY3VzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgLy8gYWx3YXlzIG9wZW4gb3B0aW9ucyBtZW51IG9uIGZvY3VzXHJcblx0XHRvcHRpb25DbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgIC8vIGFkZGl0aW9uYWwgY2xhc3MoZXMpIHRvIGFwcGx5IHRvIHRoZSA8T3B0aW9uIC8+IGVsZW1lbnRzXHJcblx0XHRvcHRpb25Db21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgIC8vIG9wdGlvbiBjb21wb25lbnQgdG8gcmVuZGVyIGluIGRyb3Bkb3duXHJcblx0XHRvcHRpb25SZW5kZXJlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgIC8vIG9wdGlvblJlbmRlcmVyOiBmdW5jdGlvbiAob3B0aW9uKSB7fVxyXG5cdFx0b3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LCAgICAgICAgICAgICAvLyBhcnJheSBvZiBvcHRpb25zXHJcblx0XHRwYWdlU2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAgIC8vIG51bWJlciBvZiBlbnRyaWVzIHRvIHBhZ2Ugd2hlbiB1c2luZyBwYWdlIHVwL2Rvd24ga2V5c1xyXG5cdFx0cGxhY2Vob2xkZXI6IHN0cmluZ09yTm9kZSwgICAgICAgICAgICAgICAgICAvLyBmaWVsZCBwbGFjZWhvbGRlciwgZGlzcGxheWVkIHdoZW4gdGhlcmUncyBubyB2YWx1ZVxyXG5cdFx0cmVtb3ZlU2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAvLyB3aGV0aGVyIHRoZSBzZWxlY3RlZCBvcHRpb24gaXMgcmVtb3ZlZCBmcm9tIHRoZSBkcm9wZG93biBvbiBtdWx0aSBzZWxlY3RzXHJcblx0XHRyZXF1aXJlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgIC8vIGFwcGxpZXMgSFRNTDUgcmVxdWlyZWQgYXR0cmlidXRlIHdoZW4gbmVlZGVkXHJcblx0XHRyZXNldFZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYW55LCAgICAgICAgICAgIC8vIHZhbHVlIHRvIHVzZSB3aGVuIHlvdSBjbGVhciB0aGUgY29udHJvbFxyXG5cdFx0c2Nyb2xsTWVudUludG9WaWV3OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAvLyBib29sZWFuIHRvIGVuYWJsZSB0aGUgdmlld3BvcnQgdG8gc2hpZnQgc28gdGhhdCB0aGUgZnVsbCBtZW51IGZ1bGx5IHZpc2libGUgd2hlbiBlbmdhZ2VkXHJcblx0XHRzZWFyY2hhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgIC8vIHdoZXRoZXIgdG8gZW5hYmxlIHNlYXJjaGluZyBmZWF0dXJlIG9yIG5vdFxyXG5cdFx0c2ltcGxlVmFsdWU6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAvLyBwYXNzIHRoZSB2YWx1ZSB0byBvbkNoYW5nZSBhcyBhIHNpbXBsZSB2YWx1ZSAobGVnYWN5IHByZSAxLjAgbW9kZSksIGRlZmF1bHRzIHRvIGZhbHNlXHJcblx0XHRzdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCwgICAgICAgICAgICAgIC8vIG9wdGlvbmFsIHN0eWxlIHRvIGFwcGx5IHRvIHRoZSBjb250cm9sXHJcblx0XHR0YWJJbmRleDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgIC8vIG9wdGlvbmFsIHRhYiBpbmRleCBvZiB0aGUgY29udHJvbFxyXG5cdFx0dGFiU2VsZWN0c1ZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAvLyB3aGV0aGVyIHRvIHRyZWF0IHRhYmJpbmcgb3V0IHdoaWxlIGZvY3VzZWQgdG8gYmUgdmFsdWUgc2VsZWN0aW9uXHJcblx0XHR2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLmFueSwgICAgICAgICAgICAgICAgIC8vIGluaXRpYWwgZmllbGQgdmFsdWVcclxuXHRcdHZhbHVlQ29tcG9uZW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgLy8gdmFsdWUgY29tcG9uZW50IHRvIHJlbmRlclxyXG5cdFx0dmFsdWVLZXk6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAvLyBwYXRoIG9mIHRoZSBsYWJlbCB2YWx1ZSBpbiBvcHRpb24gb2JqZWN0c1xyXG5cdFx0dmFsdWVSZW5kZXJlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAvLyB2YWx1ZVJlbmRlcmVyOiBmdW5jdGlvbiAob3B0aW9uKSB7fVxyXG5cdFx0d3JhcHBlclN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LCAgICAgICAvLyBvcHRpb25hbCBzdHlsZSB0byBhcHBseSB0byB0aGUgY29tcG9uZW50IHdyYXBwZXJcclxuXHR9LFxyXG5cclxuXHRzdGF0aWNzOiB7IEFzeW5jLCBBc3luY0NyZWF0YWJsZSwgQ3JlYXRhYmxlIH0sXHJcblxyXG5cdGdldERlZmF1bHRQcm9wcyAoKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRhZGRMYWJlbFRleHQ6ICdBZGQgXCJ7bGFiZWx9XCI/JyxcclxuXHRcdFx0YXJyb3dSZW5kZXJlcjogZGVmYXVsdEFycm93UmVuZGVyZXIsXHJcblx0XHRcdGF1dG9zaXplOiB0cnVlLFxyXG5cdFx0XHRiYWNrc3BhY2VSZW1vdmVzOiB0cnVlLFxyXG5cdFx0XHRiYWNrc3BhY2VUb1JlbW92ZU1lc3NhZ2U6ICdQcmVzcyBiYWNrc3BhY2UgdG8gcmVtb3ZlIHtsYWJlbH0nLFxyXG5cdFx0XHRjbGVhcmFibGU6IHRydWUsXHJcblx0XHRcdGNsZWFyQWxsVGV4dDogJ0NsZWFyIGFsbCcsXHJcblx0XHRcdGNsZWFyUmVuZGVyZXI6IGRlZmF1bHRDbGVhclJlbmRlcmVyLFxyXG5cdFx0XHRjbGVhclZhbHVlVGV4dDogJ0NsZWFyIHZhbHVlJyxcclxuXHRcdFx0ZGVsZXRlUmVtb3ZlczogdHJ1ZSxcclxuXHRcdFx0ZGVsaW1pdGVyOiAnLCcsXHJcblx0XHRcdGRpc2FibGVkOiBmYWxzZSxcclxuXHRcdFx0ZXNjYXBlQ2xlYXJzVmFsdWU6IHRydWUsXHJcblx0XHRcdGZpbHRlck9wdGlvbnM6IGRlZmF1bHRGaWx0ZXJPcHRpb25zLFxyXG5cdFx0XHRpZ25vcmVBY2NlbnRzOiB0cnVlLFxyXG5cdFx0XHRpZ25vcmVDYXNlOiB0cnVlLFxyXG5cdFx0XHRpbnB1dFByb3BzOiB7fSxcclxuXHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcclxuXHRcdFx0am9pblZhbHVlczogZmFsc2UsXHJcblx0XHRcdGxhYmVsS2V5OiAnbGFiZWwnLFxyXG5cdFx0XHRtYXRjaFBvczogJ2FueScsXHJcblx0XHRcdG1hdGNoUHJvcDogJ2FueScsXHJcblx0XHRcdG1lbnVCdWZmZXI6IDAsXHJcblx0XHRcdG1lbnVSZW5kZXJlcjogZGVmYXVsdE1lbnVSZW5kZXJlcixcclxuXHRcdFx0bXVsdGk6IGZhbHNlLFxyXG5cdFx0XHRub1Jlc3VsdHNUZXh0OiAnTm8gcmVzdWx0cyBmb3VuZCcsXHJcblx0XHRcdG9uQmx1clJlc2V0c0lucHV0OiB0cnVlLFxyXG5cdFx0XHRvbkNsb3NlUmVzZXRzSW5wdXQ6IHRydWUsXHJcblx0XHRcdG9wZW5BZnRlckZvY3VzOiBmYWxzZSxcclxuXHRcdFx0b3B0aW9uQ29tcG9uZW50OiBPcHRpb24sXHJcblx0XHRcdHBhZ2VTaXplOiA1LFxyXG5cdFx0XHRwbGFjZWhvbGRlcjogJ1NlbGVjdC4uLicsXHJcblx0XHRcdHJlbW92ZVNlbGVjdGVkOiB0cnVlLFxyXG5cdFx0XHRyZXF1aXJlZDogZmFsc2UsXHJcblx0XHRcdHNjcm9sbE1lbnVJbnRvVmlldzogdHJ1ZSxcclxuXHRcdFx0c2VhcmNoYWJsZTogdHJ1ZSxcclxuXHRcdFx0c2ltcGxlVmFsdWU6IGZhbHNlLFxyXG5cdFx0XHR0YWJTZWxlY3RzVmFsdWU6IHRydWUsXHJcblx0XHRcdHZhbHVlQ29tcG9uZW50OiBWYWx1ZSxcclxuXHRcdFx0dmFsdWVLZXk6ICd2YWx1ZScsXHJcblx0XHR9O1xyXG5cdH0sXHJcblxyXG5cdGdldEluaXRpYWxTdGF0ZSAoKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpbnB1dFZhbHVlOiAnJyxcclxuXHRcdFx0aXNGb2N1c2VkOiBmYWxzZSxcclxuXHRcdFx0aXNPcGVuOiBmYWxzZSxcclxuXHRcdFx0aXNQc2V1ZG9Gb2N1c2VkOiBmYWxzZSxcclxuXHRcdFx0cmVxdWlyZWQ6IGZhbHNlLFxyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnRXaWxsTW91bnQgKCkge1xyXG5cdFx0dGhpcy5faW5zdGFuY2VQcmVmaXggPSAncmVhY3Qtc2VsZWN0LScgKyAodGhpcy5wcm9wcy5pbnN0YW5jZUlkIHx8ICsraW5zdGFuY2VJZCkgKyAnLSc7XHJcblx0XHRjb25zdCB2YWx1ZUFycmF5ID0gdGhpcy5nZXRWYWx1ZUFycmF5KHRoaXMucHJvcHMudmFsdWUpO1xyXG5cclxuXHRcdGlmICh0aGlzLnByb3BzLnJlcXVpcmVkKSB7XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRcdHJlcXVpcmVkOiB0aGlzLmhhbmRsZVJlcXVpcmVkKHZhbHVlQXJyYXlbMF0sIHRoaXMucHJvcHMubXVsdGkpLFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudCAoKSB7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5hdXRvZm9jdXMpIHtcclxuXHRcdFx0dGhpcy5mb2N1cygpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgdmFsdWVBcnJheSA9IHRoaXMuZ2V0VmFsdWVBcnJheShuZXh0UHJvcHMudmFsdWUsIG5leHRQcm9wcyk7XHJcblxyXG5cdFx0aWYgKG5leHRQcm9wcy5yZXF1aXJlZCkge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRyZXF1aXJlZDogdGhpcy5oYW5kbGVSZXF1aXJlZCh2YWx1ZUFycmF5WzBdLCBuZXh0UHJvcHMubXVsdGkpLFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnRXaWxsVXBkYXRlIChuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG5cdFx0aWYgKG5leHRTdGF0ZS5pc09wZW4gIT09IHRoaXMuc3RhdGUuaXNPcGVuKSB7XHJcblx0XHRcdHRoaXMudG9nZ2xlVG91Y2hPdXRzaWRlRXZlbnQobmV4dFN0YXRlLmlzT3Blbik7XHJcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBuZXh0U3RhdGUuaXNPcGVuID8gbmV4dFByb3BzLm9uT3BlbiA6IG5leHRQcm9wcy5vbkNsb3NlO1xyXG5cdFx0XHRoYW5kbGVyICYmIGhhbmRsZXIoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnREaWRVcGRhdGUgKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XHJcblx0XHQvLyBmb2N1cyB0byB0aGUgc2VsZWN0ZWQgb3B0aW9uXHJcblx0XHRpZiAodGhpcy5tZW51ICYmIHRoaXMuZm9jdXNlZCAmJiB0aGlzLnN0YXRlLmlzT3BlbiAmJiAhdGhpcy5oYXNTY3JvbGxlZFRvT3B0aW9uKSB7XHJcblx0XHRcdGxldCBmb2N1c2VkT3B0aW9uTm9kZSA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMuZm9jdXNlZCk7XHJcblx0XHRcdGxldCBtZW51Tm9kZSA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMubWVudSk7XHJcblx0XHRcdG1lbnVOb2RlLnNjcm9sbFRvcCA9IGZvY3VzZWRPcHRpb25Ob2RlLm9mZnNldFRvcDtcclxuXHRcdFx0dGhpcy5oYXNTY3JvbGxlZFRvT3B0aW9uID0gdHJ1ZTtcclxuXHRcdH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUuaXNPcGVuKSB7XHJcblx0XHRcdHRoaXMuaGFzU2Nyb2xsZWRUb09wdGlvbiA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9zY3JvbGxUb0ZvY3VzZWRPcHRpb25PblVwZGF0ZSAmJiB0aGlzLmZvY3VzZWQgJiYgdGhpcy5tZW51KSB7XHJcblx0XHRcdHRoaXMuX3Njcm9sbFRvRm9jdXNlZE9wdGlvbk9uVXBkYXRlID0gZmFsc2U7XHJcblx0XHRcdHZhciBmb2N1c2VkRE9NID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5mb2N1c2VkKTtcclxuXHRcdFx0dmFyIG1lbnVET00gPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLm1lbnUpO1xyXG5cdFx0XHR2YXIgZm9jdXNlZFJlY3QgPSBmb2N1c2VkRE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHR2YXIgbWVudVJlY3QgPSBtZW51RE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRpZiAoZm9jdXNlZFJlY3QuYm90dG9tID4gbWVudVJlY3QuYm90dG9tIHx8IGZvY3VzZWRSZWN0LnRvcCA8IG1lbnVSZWN0LnRvcCkge1xyXG5cdFx0XHRcdG1lbnVET00uc2Nyb2xsVG9wID0gKGZvY3VzZWRET00ub2Zmc2V0VG9wICsgZm9jdXNlZERPTS5jbGllbnRIZWlnaHQgLSBtZW51RE9NLm9mZnNldEhlaWdodCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLnByb3BzLnNjcm9sbE1lbnVJbnRvVmlldyAmJiB0aGlzLm1lbnVDb250YWluZXIpIHtcclxuXHRcdFx0dmFyIG1lbnVDb250YWluZXJSZWN0ID0gdGhpcy5tZW51Q29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRpZiAod2luZG93LmlubmVySGVpZ2h0IDwgbWVudUNvbnRhaW5lclJlY3QuYm90dG9tICsgdGhpcy5wcm9wcy5tZW51QnVmZmVyKSB7XHJcblx0XHRcdFx0d2luZG93LnNjcm9sbEJ5KDAsIG1lbnVDb250YWluZXJSZWN0LmJvdHRvbSArIHRoaXMucHJvcHMubWVudUJ1ZmZlciAtIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChwcmV2UHJvcHMuZGlzYWJsZWQgIT09IHRoaXMucHJvcHMuZGlzYWJsZWQpIHtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IGlzRm9jdXNlZDogZmFsc2UgfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcmVhY3Qvbm8tZGlkLXVwZGF0ZS1zZXQtc3RhdGVcclxuXHRcdFx0dGhpcy5jbG9zZU1lbnUoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XHJcblx0XHRpZiAoIWRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgJiYgZG9jdW1lbnQuZGV0YWNoRXZlbnQpIHtcclxuXHRcdFx0ZG9jdW1lbnQuZGV0YWNoRXZlbnQoJ29udG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlVG91Y2hPdXRzaWRlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZVRvdWNoT3V0c2lkZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0dG9nZ2xlVG91Y2hPdXRzaWRlRXZlbnQgKGVuYWJsZWQpIHtcclxuXHRcdGlmIChlbmFibGVkKSB7XHJcblx0XHRcdGlmICghZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAmJiBkb2N1bWVudC5hdHRhY2hFdmVudCkge1xyXG5cdFx0XHRcdGRvY3VtZW50LmF0dGFjaEV2ZW50KCdvbnRvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZVRvdWNoT3V0c2lkZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlVG91Y2hPdXRzaWRlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCFkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyICYmIGRvY3VtZW50LmRldGFjaEV2ZW50KSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZGV0YWNoRXZlbnQoJ29udG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlVG91Y2hPdXRzaWRlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVUb3VjaE91dHNpZGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0aGFuZGxlVG91Y2hPdXRzaWRlIChldmVudCkge1xyXG5cdFx0Ly8gaGFuZGxlIHRvdWNoIG91dHNpZGUgb24gaW9zIHRvIGRpc21pc3MgbWVudVxyXG5cdFx0aWYgKHRoaXMud3JhcHBlciAmJiAhdGhpcy53cmFwcGVyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcclxuXHRcdFx0dGhpcy5jbG9zZU1lbnUoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRmb2N1cyAoKSB7XHJcblx0XHRpZiAoIXRoaXMuaW5wdXQpIHJldHVybjtcclxuXHRcdHRoaXMuaW5wdXQuZm9jdXMoKTtcclxuXHJcblx0XHRpZiAodGhpcy5wcm9wcy5vcGVuQWZ0ZXJGb2N1cykge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRpc09wZW46IHRydWUsXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGJsdXJJbnB1dCAoKSB7XHJcblx0XHRpZiAoIXRoaXMuaW5wdXQpIHJldHVybjtcclxuXHRcdHRoaXMuaW5wdXQuYmx1cigpO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVRvdWNoTW92ZSAoZXZlbnQpIHtcclxuXHRcdC8vIFNldCBhIGZsYWcgdGhhdCB0aGUgdmlldyBpcyBiZWluZyBkcmFnZ2VkXHJcblx0XHR0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcclxuXHR9LFxyXG5cclxuXHRoYW5kbGVUb3VjaFN0YXJ0IChldmVudCkge1xyXG5cdFx0Ly8gU2V0IGEgZmxhZyB0aGF0IHRoZSB2aWV3IGlzIG5vdCBiZWluZyBkcmFnZ2VkXHJcblx0XHR0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlVG91Y2hFbmQgKGV2ZW50KSB7XHJcblx0XHQvLyBDaGVjayBpZiB0aGUgdmlldyBpcyBiZWluZyBkcmFnZ2VkLCBJbiB0aGlzIGNhc2VcclxuXHRcdC8vIHdlIGRvbid0IHdhbnQgdG8gZmlyZSB0aGUgY2xpY2sgZXZlbnQgKGJlY2F1c2UgdGhlIHVzZXIgb25seSB3YW50cyB0byBzY3JvbGwpXHJcblx0XHRpZiAodGhpcy5kcmFnZ2luZykgcmV0dXJuO1xyXG5cclxuXHRcdC8vIEZpcmUgdGhlIG1vdXNlIGV2ZW50c1xyXG5cdFx0dGhpcy5oYW5kbGVNb3VzZURvd24oZXZlbnQpO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVRvdWNoRW5kQ2xlYXJWYWx1ZSAoZXZlbnQpIHtcclxuXHRcdC8vIENoZWNrIGlmIHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWQsIEluIHRoaXMgY2FzZVxyXG5cdFx0Ly8gd2UgZG9uJ3Qgd2FudCB0byBmaXJlIHRoZSBjbGljayBldmVudCAoYmVjYXVzZSB0aGUgdXNlciBvbmx5IHdhbnRzIHRvIHNjcm9sbClcclxuXHRcdGlmICh0aGlzLmRyYWdnaW5nKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gQ2xlYXIgdGhlIHZhbHVlXHJcblx0XHR0aGlzLmNsZWFyVmFsdWUoZXZlbnQpO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZU1vdXNlRG93biAoZXZlbnQpIHtcclxuXHRcdC8vIGlmIHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IGEgbW91c2Vkb3duIGFuZCBub3QgdGhlIHByaW1hcnlcclxuXHRcdC8vIGJ1dHRvbiwgb3IgaWYgdGhlIGNvbXBvbmVudCBpcyBkaXNhYmxlZCwgaWdub3JlIGl0LlxyXG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWRvd24nICYmIGV2ZW50LmJ1dHRvbiAhPT0gMCkpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChldmVudC50YXJnZXQudGFnTmFtZSA9PT0gJ0lOUFVUJykge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcHJldmVudCBkZWZhdWx0IGV2ZW50IGhhbmRsZXJzXHJcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0Ly8gZm9yIHRoZSBub24tc2VhcmNoYWJsZSBzZWxlY3QsIHRvZ2dsZSB0aGUgbWVudVxyXG5cdFx0aWYgKCF0aGlzLnByb3BzLnNlYXJjaGFibGUpIHtcclxuXHRcdFx0dGhpcy5mb2N1cygpO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdFx0aXNPcGVuOiAhdGhpcy5zdGF0ZS5pc09wZW4sXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLnN0YXRlLmlzRm9jdXNlZCkge1xyXG5cdFx0XHQvLyBPbiBpT1MsIHdlIGNhbiBnZXQgaW50byBhIHN0YXRlIHdoZXJlIHdlIHRoaW5rIHRoZSBpbnB1dCBpcyBmb2N1c2VkIGJ1dCBpdCBpc24ndCByZWFsbHksXHJcblx0XHRcdC8vIHNpbmNlIGlPUyBpZ25vcmVzIHByb2dyYW1tYXRpYyBjYWxscyB0byBpbnB1dC5mb2N1cygpIHRoYXQgd2VyZW4ndCB0cmlnZ2VyZWQgYnkgYSBjbGljayBldmVudC5cclxuXHRcdFx0Ly8gQ2FsbCBmb2N1cygpIGFnYWluIGhlcmUgdG8gYmUgc2FmZS5cclxuXHRcdFx0dGhpcy5mb2N1cygpO1xyXG5cclxuXHRcdFx0bGV0IGlucHV0ID0gdGhpcy5pbnB1dDtcclxuXHRcdFx0aWYgKHR5cGVvZiBpbnB1dC5nZXRJbnB1dCA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdC8vIEdldCB0aGUgYWN0dWFsIERPTSBpbnB1dCBpZiB0aGUgcmVmIGlzIGFuIDxBdXRvc2l6ZUlucHV0IC8+IGNvbXBvbmVudFxyXG5cdFx0XHRcdGlucHV0ID0gaW5wdXQuZ2V0SW5wdXQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gY2xlYXJzIHRoZSB2YWx1ZSBzbyB0aGF0IHRoZSBjdXJzb3Igd2lsbCBiZSBhdCB0aGUgZW5kIG9mIGlucHV0IHdoZW4gdGhlIGNvbXBvbmVudCByZS1yZW5kZXJzXHJcblx0XHRcdGlucHV0LnZhbHVlID0gJyc7XHJcblxyXG5cdFx0XHQvLyBpZiB0aGUgaW5wdXQgaXMgZm9jdXNlZCwgZW5zdXJlIHRoZSBtZW51IGlzIG9wZW5cclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdFx0aXNPcGVuOiB0cnVlLFxyXG5cdFx0XHRcdGlzUHNldWRvRm9jdXNlZDogZmFsc2UsXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gb3RoZXJ3aXNlLCBmb2N1cyB0aGUgaW5wdXQgYW5kIG9wZW4gdGhlIG1lbnVcclxuXHRcdFx0dGhpcy5fb3BlbkFmdGVyRm9jdXMgPSB0aGlzLnByb3BzLm9wZW5PbkZvY3VzO1xyXG5cdFx0XHR0aGlzLmZvY3VzKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0aGFuZGxlTW91c2VEb3duT25BcnJvdyAoZXZlbnQpIHtcclxuXHRcdC8vIGlmIHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IGEgbW91c2Vkb3duIGFuZCBub3QgdGhlIHByaW1hcnlcclxuXHRcdC8vIGJ1dHRvbiwgb3IgaWYgdGhlIGNvbXBvbmVudCBpcyBkaXNhYmxlZCwgaWdub3JlIGl0LlxyXG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWRvd24nICYmIGV2ZW50LmJ1dHRvbiAhPT0gMCkpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Ly8gSWYgdGhlIG1lbnUgaXNuJ3Qgb3BlbiwgbGV0IHRoZSBldmVudCBidWJibGUgdG8gdGhlIG1haW4gaGFuZGxlTW91c2VEb3duXHJcblx0XHRpZiAoIXRoaXMuc3RhdGUuaXNPcGVuKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdC8vIHByZXZlbnQgZGVmYXVsdCBldmVudCBoYW5kbGVyc1xyXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0Ly8gY2xvc2UgdGhlIG1lbnVcclxuXHRcdHRoaXMuY2xvc2VNZW51KCk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlTW91c2VEb3duT25NZW51IChldmVudCkge1xyXG5cdFx0Ly8gaWYgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgYSBtb3VzZWRvd24gYW5kIG5vdCB0aGUgcHJpbWFyeVxyXG5cdFx0Ly8gYnV0dG9uLCBvciBpZiB0aGUgY29tcG9uZW50IGlzIGRpc2FibGVkLCBpZ25vcmUgaXQuXHJcblx0XHRpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCB8fCAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0dGhpcy5fb3BlbkFmdGVyRm9jdXMgPSB0cnVlO1xyXG5cdFx0dGhpcy5mb2N1cygpO1xyXG5cdH0sXHJcblxyXG5cdGNsb3NlTWVudSAoKSB7XHJcblx0XHRpZih0aGlzLnByb3BzLm9uQ2xvc2VSZXNldHNJbnB1dCkge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRpc09wZW46IGZhbHNlLFxyXG5cdFx0XHRcdGlzUHNldWRvRm9jdXNlZDogdGhpcy5zdGF0ZS5pc0ZvY3VzZWQgJiYgIXRoaXMucHJvcHMubXVsdGksXHJcblx0XHRcdFx0aW5wdXRWYWx1ZTogJydcclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRpc09wZW46IGZhbHNlLFxyXG5cdFx0XHRcdGlzUHNldWRvRm9jdXNlZDogdGhpcy5zdGF0ZS5pc0ZvY3VzZWQgJiYgIXRoaXMucHJvcHMubXVsdGksXHJcblx0XHRcdFx0aW5wdXRWYWx1ZTogdGhpcy5zdGF0ZS5pbnB1dFZhbHVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5oYXNTY3JvbGxlZFRvT3B0aW9uID0gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlSW5wdXRGb2N1cyAoZXZlbnQpIHtcclxuXHRcdGlmICh0aGlzLnByb3BzLmRpc2FibGVkKSByZXR1cm47XHJcblx0XHR2YXIgaXNPcGVuID0gdGhpcy5zdGF0ZS5pc09wZW4gfHwgdGhpcy5fb3BlbkFmdGVyRm9jdXMgfHwgdGhpcy5wcm9wcy5vcGVuT25Gb2N1cztcclxuXHRcdGlmICh0aGlzLnByb3BzLm9uRm9jdXMpIHtcclxuXHRcdFx0dGhpcy5wcm9wcy5vbkZvY3VzKGV2ZW50KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRpc0ZvY3VzZWQ6IHRydWUsXHJcblx0XHRcdGlzT3BlbjogaXNPcGVuXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlSW5wdXRCbHVyIChldmVudCkge1xyXG5cdFx0Ly8gVGhlIGNoZWNrIGZvciBtZW51LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpIGlzIG5lY2Vzc2FyeSB0byBwcmV2ZW50IElFMTEncyBzY3JvbGxiYXIgZnJvbSBjbG9zaW5nIHRoZSBtZW51IGluIGNlcnRhaW4gY29udGV4dHMuXHJcblx0XHRpZiAodGhpcy5tZW51ICYmICh0aGlzLm1lbnUgPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgfHwgdGhpcy5tZW51LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSkge1xyXG5cdFx0XHR0aGlzLmZvY3VzKCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5wcm9wcy5vbkJsdXIpIHtcclxuXHRcdFx0dGhpcy5wcm9wcy5vbkJsdXIoZXZlbnQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9uQmx1cnJlZFN0YXRlID0ge1xyXG5cdFx0XHRpc0ZvY3VzZWQ6IGZhbHNlLFxyXG5cdFx0XHRpc09wZW46IGZhbHNlLFxyXG5cdFx0XHRpc1BzZXVkb0ZvY3VzZWQ6IGZhbHNlLFxyXG5cdFx0fTtcclxuXHRcdGlmICh0aGlzLnByb3BzLm9uQmx1clJlc2V0c0lucHV0KSB7XHJcblx0XHRcdG9uQmx1cnJlZFN0YXRlLmlucHV0VmFsdWUgPSAnJztcclxuXHRcdH1cclxuXHRcdHRoaXMuc2V0U3RhdGUob25CbHVycmVkU3RhdGUpO1xyXG5cdH0sXHJcblxyXG5cdGhhbmRsZUlucHV0Q2hhbmdlIChldmVudCkge1xyXG5cdFx0bGV0IG5ld0lucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdGUuaW5wdXRWYWx1ZSAhPT0gZXZlbnQudGFyZ2V0LnZhbHVlICYmIHRoaXMucHJvcHMub25JbnB1dENoYW5nZSkge1xyXG5cdFx0XHRsZXQgbmV4dFN0YXRlID0gdGhpcy5wcm9wcy5vbklucHV0Q2hhbmdlKG5ld0lucHV0VmFsdWUpO1xyXG5cdFx0XHQvLyBOb3RlOiAhPSB1c2VkIGRlbGliZXJhdGVseSBoZXJlIHRvIGNhdGNoIHVuZGVmaW5lZCBhbmQgbnVsbFxyXG5cdFx0XHRpZiAobmV4dFN0YXRlICE9IG51bGwgJiYgdHlwZW9mIG5leHRTdGF0ZSAhPT0gJ29iamVjdCcpIHtcclxuXHRcdFx0XHRuZXdJbnB1dFZhbHVlID0gJycgKyBuZXh0U3RhdGU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0aXNPcGVuOiB0cnVlLFxyXG5cdFx0XHRpc1BzZXVkb0ZvY3VzZWQ6IGZhbHNlLFxyXG5cdFx0XHRpbnB1dFZhbHVlOiBuZXdJbnB1dFZhbHVlLFxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlS2V5RG93biAoZXZlbnQpIHtcclxuXHRcdGlmICh0aGlzLnByb3BzLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uSW5wdXRLZXlEb3duID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHRoaXMucHJvcHMub25JbnB1dEtleURvd24oZXZlbnQpO1xyXG5cdFx0XHRpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xyXG5cdFx0XHRjYXNlIDg6IC8vIGJhY2tzcGFjZVxyXG5cdFx0XHRcdGlmICghdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICYmIHRoaXMucHJvcHMuYmFja3NwYWNlUmVtb3Zlcykge1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdHRoaXMucG9wVmFsdWUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0Y2FzZSA5OiAvLyB0YWJcclxuXHRcdFx0XHRpZiAoZXZlbnQuc2hpZnRLZXkgfHwgIXRoaXMuc3RhdGUuaXNPcGVuIHx8ICF0aGlzLnByb3BzLnRhYlNlbGVjdHNWYWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnNlbGVjdEZvY3VzZWRPcHRpb24oKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRjYXNlIDEzOiAvLyBlbnRlclxyXG5cdFx0XHRcdGlmICghdGhpcy5zdGF0ZS5pc09wZW4pIHJldHVybjtcclxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHR0aGlzLnNlbGVjdEZvY3VzZWRPcHRpb24oKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMjc6IC8vIGVzY2FwZVxyXG5cdFx0XHRcdGlmICh0aGlzLnN0YXRlLmlzT3Blbikge1xyXG5cdFx0XHRcdFx0dGhpcy5jbG9zZU1lbnUoKTtcclxuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5wcm9wcy5jbGVhcmFibGUgJiYgdGhpcy5wcm9wcy5lc2NhcGVDbGVhcnNWYWx1ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5jbGVhclZhbHVlKGV2ZW50KTtcclxuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMzg6IC8vIHVwXHJcblx0XHRcdFx0dGhpcy5mb2N1c1ByZXZpb3VzT3B0aW9uKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDQwOiAvLyBkb3duXHJcblx0XHRcdFx0dGhpcy5mb2N1c05leHRPcHRpb24oKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMzM6IC8vIHBhZ2UgdXBcclxuXHRcdFx0XHR0aGlzLmZvY3VzUGFnZVVwT3B0aW9uKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDM0OiAvLyBwYWdlIGRvd25cclxuXHRcdFx0XHR0aGlzLmZvY3VzUGFnZURvd25PcHRpb24oKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMzU6IC8vIGVuZCBrZXlcclxuXHRcdFx0XHRpZiAoZXZlbnQuc2hpZnRLZXkpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5mb2N1c0VuZE9wdGlvbigpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAzNjogLy8gaG9tZSBrZXlcclxuXHRcdFx0XHRpZiAoZXZlbnQuc2hpZnRLZXkpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5mb2N1c1N0YXJ0T3B0aW9uKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDQ2OiAvLyBiYWNrc3BhY2VcclxuXHRcdFx0XHRpZiAoIXRoaXMuc3RhdGUuaW5wdXRWYWx1ZSAmJiB0aGlzLnByb3BzLmRlbGV0ZVJlbW92ZXMpIHtcclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHR0aGlzLnBvcFZhbHVlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdGRlZmF1bHQ6IHJldHVybjtcclxuXHRcdH1cclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlVmFsdWVDbGljayAob3B0aW9uLCBldmVudCkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLm9uVmFsdWVDbGljaykgcmV0dXJuO1xyXG5cdFx0dGhpcy5wcm9wcy5vblZhbHVlQ2xpY2sob3B0aW9uLCBldmVudCk7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlTWVudVNjcm9sbCAoZXZlbnQpIHtcclxuXHRcdGlmICghdGhpcy5wcm9wcy5vbk1lbnVTY3JvbGxUb0JvdHRvbSkgcmV0dXJuO1xyXG5cdFx0bGV0IHsgdGFyZ2V0IH0gPSBldmVudDtcclxuXHRcdGlmICh0YXJnZXQuc2Nyb2xsSGVpZ2h0ID4gdGFyZ2V0Lm9mZnNldEhlaWdodCAmJiAhKHRhcmdldC5zY3JvbGxIZWlnaHQgLSB0YXJnZXQub2Zmc2V0SGVpZ2h0IC0gdGFyZ2V0LnNjcm9sbFRvcCkpIHtcclxuXHRcdFx0dGhpcy5wcm9wcy5vbk1lbnVTY3JvbGxUb0JvdHRvbSgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGhhbmRsZVJlcXVpcmVkICh2YWx1ZSwgbXVsdGkpIHtcclxuXHRcdGlmICghdmFsdWUpIHJldHVybiB0cnVlO1xyXG5cdFx0cmV0dXJuIChtdWx0aSA/IHZhbHVlLmxlbmd0aCA9PT0gMCA6IE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT09IDApO1xyXG5cdH0sXHJcblxyXG5cdGdldE9wdGlvbkxhYmVsIChvcCkge1xyXG5cdFx0cmV0dXJuIG9wW3RoaXMucHJvcHMubGFiZWxLZXldO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIFR1cm5zIGEgdmFsdWUgaW50byBhbiBhcnJheSBmcm9tIHRoZSBnaXZlbiBvcHRpb25zXHJcblx0ICogQHBhcmFtXHR7U3RyaW5nfE51bWJlcnxBcnJheX1cdHZhbHVlXHRcdC0gdGhlIHZhbHVlIG9mIHRoZSBzZWxlY3QgaW5wdXRcclxuXHQgKiBAcGFyYW1cdHtPYmplY3R9XHRcdG5leHRQcm9wc1x0LSBvcHRpb25hbGx5IHNwZWNpZnkgdGhlIG5leHRQcm9wcyBzbyB0aGUgcmV0dXJuZWQgYXJyYXkgdXNlcyB0aGUgbGF0ZXN0IGNvbmZpZ3VyYXRpb25cclxuXHQgKiBAcmV0dXJuc1x0e0FycmF5fVx0dGhlIHZhbHVlIG9mIHRoZSBzZWxlY3QgcmVwcmVzZW50ZWQgaW4gYW4gYXJyYXlcclxuXHQgKi9cclxuXHRnZXRWYWx1ZUFycmF5ICh2YWx1ZSwgbmV4dFByb3BzKSB7XHJcblx0XHQvKiogc3VwcG9ydCBvcHRpb25hbGx5IHBhc3NpbmcgaW4gdGhlIGBuZXh0UHJvcHNgIHNvIGBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzYCB1cGRhdGVzIHdpbGwgZnVuY3Rpb24gYXMgZXhwZWN0ZWQgKi9cclxuXHRcdGNvbnN0IHByb3BzID0gdHlwZW9mIG5leHRQcm9wcyA9PT0gJ29iamVjdCcgPyBuZXh0UHJvcHMgOiB0aGlzLnByb3BzO1xyXG5cdFx0aWYgKHByb3BzLm11bHRpKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB2YWx1ZSA9IHZhbHVlLnNwbGl0KHByb3BzLmRlbGltaXRlcik7XHJcblx0XHRcdGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuXHRcdFx0XHRpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtdO1xyXG5cdFx0XHRcdHZhbHVlID0gW3ZhbHVlXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdmFsdWUubWFwKHZhbHVlID0+IHRoaXMuZXhwYW5kVmFsdWUodmFsdWUsIHByb3BzKSkuZmlsdGVyKGkgPT4gaSk7XHJcblx0XHR9XHJcblx0XHR2YXIgZXhwYW5kZWRWYWx1ZSA9IHRoaXMuZXhwYW5kVmFsdWUodmFsdWUsIHByb3BzKTtcclxuXHRcdHJldHVybiBleHBhbmRlZFZhbHVlID8gW2V4cGFuZGVkVmFsdWVdIDogW107XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogUmV0cmlldmUgYSB2YWx1ZSBmcm9tIHRoZSBnaXZlbiBvcHRpb25zIGFuZCB2YWx1ZUtleVxyXG5cdCAqIEBwYXJhbVx0e1N0cmluZ3xOdW1iZXJ8QXJyYXl9XHR2YWx1ZVx0LSB0aGUgc2VsZWN0ZWQgdmFsdWUocylcclxuXHQgKiBAcGFyYW1cdHtPYmplY3R9XHRcdHByb3BzXHQtIHRoZSBTZWxlY3QgY29tcG9uZW50J3MgcHJvcHMgKG9yIG5leHRQcm9wcylcclxuXHQgKi9cclxuXHRleHBhbmRWYWx1ZSAodmFsdWUsIHByb3BzKSB7XHJcblx0XHRjb25zdCB2YWx1ZVR5cGUgPSB0eXBlb2YgdmFsdWU7XHJcblx0XHRpZiAodmFsdWVUeXBlICE9PSAnc3RyaW5nJyAmJiB2YWx1ZVR5cGUgIT09ICdudW1iZXInICYmIHZhbHVlVHlwZSAhPT0gJ2Jvb2xlYW4nKSByZXR1cm4gdmFsdWU7XHJcblx0XHRsZXQgeyBvcHRpb25zLCB2YWx1ZUtleSB9ID0gcHJvcHM7XHJcblx0XHRpZiAoIW9wdGlvbnMpIHJldHVybjtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAob3B0aW9uc1tpXVt2YWx1ZUtleV0gPT09IHZhbHVlKSByZXR1cm4gb3B0aW9uc1tpXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRzZXRWYWx1ZSAodmFsdWUpIHtcclxuXHRcdGlmICh0aGlzLnByb3BzLmF1dG9CbHVyKXtcclxuXHRcdFx0dGhpcy5ibHVySW5wdXQoKTtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5wcm9wcy5vbkNoYW5nZSkgcmV0dXJuO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMucmVxdWlyZWQpIHtcclxuXHRcdFx0Y29uc3QgcmVxdWlyZWQgPSB0aGlzLmhhbmRsZVJlcXVpcmVkKHZhbHVlLCB0aGlzLnByb3BzLm11bHRpKTtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHJlcXVpcmVkIH0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2ltcGxlVmFsdWUgJiYgdmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSB0aGlzLnByb3BzLm11bHRpID8gdmFsdWUubWFwKGkgPT4gaVt0aGlzLnByb3BzLnZhbHVlS2V5XSkuam9pbih0aGlzLnByb3BzLmRlbGltaXRlcikgOiB2YWx1ZVt0aGlzLnByb3BzLnZhbHVlS2V5XTtcclxuXHRcdH1cclxuXHRcdHRoaXMucHJvcHMub25DaGFuZ2UodmFsdWUpO1xyXG5cdH0sXHJcblxyXG5cdHNlbGVjdFZhbHVlICh2YWx1ZSkge1xyXG5cdFx0Ly9OT1RFOiB1cGRhdGUgdmFsdWUgaW4gdGhlIGNhbGxiYWNrIHRvIG1ha2Ugc3VyZSB0aGUgaW5wdXQgdmFsdWUgaXMgZW1wdHkgc28gdGhhdCB0aGVyZSBhcmUgbm8gc3R5bGluZyBpc3N1ZXMgKENocm9tZSBoYWQgaXNzdWUgb3RoZXJ3aXNlKVxyXG5cdFx0dGhpcy5oYXNTY3JvbGxlZFRvT3B0aW9uID0gZmFsc2U7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5tdWx0aSkge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRpbnB1dFZhbHVlOiAnJyxcclxuXHRcdFx0XHRmb2N1c2VkSW5kZXg6IG51bGxcclxuXHRcdFx0fSwgKCkgPT4ge1xyXG5cdFx0XHRcdHZhciB2YWx1ZUFycmF5ID0gdGhpcy5nZXRWYWx1ZUFycmF5KCk7XHJcblx0XHRcdFx0aWYgKHZhbHVlQXJyYXkuZmluZChpID0+IGlbdGhpcy5wcm9wcy52YWx1ZUtleV0gPT09IHZhbHVlW3RoaXMucHJvcHMudmFsdWVLZXldKSkge1xyXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmVWYWx1ZSh2YWx1ZSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuYWRkVmFsdWUodmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRpc09wZW46IGZhbHNlLFxyXG5cdFx0XHRcdGlucHV0VmFsdWU6ICcnLFxyXG5cdFx0XHRcdGlzUHNldWRvRm9jdXNlZDogdGhpcy5zdGF0ZS5pc0ZvY3VzZWQsXHJcblx0XHRcdH0sICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnNldFZhbHVlKHZhbHVlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0YWRkVmFsdWUgKHZhbHVlKSB7XHJcblx0XHR2YXIgdmFsdWVBcnJheSA9IHRoaXMuZ2V0VmFsdWVBcnJheSh0aGlzLnByb3BzLnZhbHVlKTtcclxuXHRcdGNvbnN0IHZpc2libGVPcHRpb25zID0gdGhpcy5fdmlzaWJsZU9wdGlvbnMuZmlsdGVyKHZhbCA9PiAhdmFsLmRpc2FibGVkKTtcclxuXHRcdGNvbnN0IGxhc3RWYWx1ZUluZGV4ID0gdmlzaWJsZU9wdGlvbnMuaW5kZXhPZih2YWx1ZSk7XHJcblx0XHR0aGlzLnNldFZhbHVlKHZhbHVlQXJyYXkuY29uY2F0KHZhbHVlKSk7XHJcblx0XHRpZiAodmlzaWJsZU9wdGlvbnMubGVuZ3RoIC0gMSA9PT0gbGFzdFZhbHVlSW5kZXgpIHtcclxuXHRcdFx0Ly8gdGhlIGxhc3Qgb3B0aW9uIHdhcyBzZWxlY3RlZDsgZm9jdXMgdGhlIHNlY29uZC1sYXN0IG9uZVxyXG5cdFx0XHR0aGlzLmZvY3VzT3B0aW9uKHZpc2libGVPcHRpb25zW2xhc3RWYWx1ZUluZGV4IC0gMV0pO1xyXG5cdFx0fSBlbHNlIGlmICh2aXNpYmxlT3B0aW9ucy5sZW5ndGggPiBsYXN0VmFsdWVJbmRleCkge1xyXG5cdFx0XHQvLyBmb2N1cyB0aGUgb3B0aW9uIGJlbG93IHRoZSBzZWxlY3RlZCBvbmVcclxuXHRcdFx0dGhpcy5mb2N1c09wdGlvbih2aXNpYmxlT3B0aW9uc1tsYXN0VmFsdWVJbmRleCArIDFdKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRwb3BWYWx1ZSAoKSB7XHJcblx0XHR2YXIgdmFsdWVBcnJheSA9IHRoaXMuZ2V0VmFsdWVBcnJheSh0aGlzLnByb3BzLnZhbHVlKTtcclxuXHRcdGlmICghdmFsdWVBcnJheS5sZW5ndGgpIHJldHVybjtcclxuXHRcdGlmICh2YWx1ZUFycmF5W3ZhbHVlQXJyYXkubGVuZ3RoLTFdLmNsZWFyYWJsZVZhbHVlID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cdFx0dGhpcy5zZXRWYWx1ZSh2YWx1ZUFycmF5LnNsaWNlKDAsIHZhbHVlQXJyYXkubGVuZ3RoIC0gMSkpO1xyXG5cdH0sXHJcblxyXG5cdHJlbW92ZVZhbHVlICh2YWx1ZSkge1xyXG5cdFx0dmFyIHZhbHVlQXJyYXkgPSB0aGlzLmdldFZhbHVlQXJyYXkodGhpcy5wcm9wcy52YWx1ZSk7XHJcblx0XHR0aGlzLnNldFZhbHVlKHZhbHVlQXJyYXkuZmlsdGVyKGkgPT4gaSAhPT0gdmFsdWUpKTtcclxuXHRcdHRoaXMuZm9jdXMoKTtcclxuXHR9LFxyXG5cclxuXHRjbGVhclZhbHVlIChldmVudCkge1xyXG5cdFx0Ly8gaWYgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgYSBtb3VzZWRvd24gYW5kIG5vdCB0aGUgcHJpbWFyeVxyXG5cdFx0Ly8gYnV0dG9uLCBpZ25vcmUgaXQuXHJcblx0XHRpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHRoaXMuc2V0VmFsdWUodGhpcy5nZXRSZXNldFZhbHVlKCkpO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdGlzT3BlbjogZmFsc2UsXHJcblx0XHRcdGlucHV0VmFsdWU6ICcnLFxyXG5cdFx0fSwgdGhpcy5mb2N1cyk7XHJcblx0fSxcclxuXHJcblx0Z2V0UmVzZXRWYWx1ZSAoKSB7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5yZXNldFZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJvcHMucmVzZXRWYWx1ZTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5wcm9wcy5tdWx0aSkge1xyXG5cdFx0XHRyZXR1cm4gW107XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRmb2N1c09wdGlvbiAob3B0aW9uKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0Zm9jdXNlZE9wdGlvbjogb3B0aW9uXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRmb2N1c05leHRPcHRpb24gKCkge1xyXG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCduZXh0Jyk7XHJcblx0fSxcclxuXHJcblx0Zm9jdXNQcmV2aW91c09wdGlvbiAoKSB7XHJcblx0XHR0aGlzLmZvY3VzQWRqYWNlbnRPcHRpb24oJ3ByZXZpb3VzJyk7XHJcblx0fSxcclxuXHJcblx0Zm9jdXNQYWdlVXBPcHRpb24gKCkge1xyXG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCdwYWdlX3VwJyk7XHJcblx0fSxcclxuXHJcblx0Zm9jdXNQYWdlRG93bk9wdGlvbiAoKSB7XHJcblx0XHR0aGlzLmZvY3VzQWRqYWNlbnRPcHRpb24oJ3BhZ2VfZG93bicpO1xyXG5cdH0sXHJcblxyXG5cdGZvY3VzU3RhcnRPcHRpb24gKCkge1xyXG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCdzdGFydCcpO1xyXG5cdH0sXHJcblxyXG5cdGZvY3VzRW5kT3B0aW9uICgpIHtcclxuXHRcdHRoaXMuZm9jdXNBZGphY2VudE9wdGlvbignZW5kJyk7XHJcblx0fSxcclxuXHJcblx0Zm9jdXNBZGphY2VudE9wdGlvbiAoZGlyKSB7XHJcblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMuX3Zpc2libGVPcHRpb25zXHJcblx0XHRcdC5tYXAoKG9wdGlvbiwgaW5kZXgpID0+ICh7IG9wdGlvbiwgaW5kZXggfSkpXHJcblx0XHRcdC5maWx0ZXIob3B0aW9uID0+ICFvcHRpb24ub3B0aW9uLmRpc2FibGVkKTtcclxuXHRcdHRoaXMuX3Njcm9sbFRvRm9jdXNlZE9wdGlvbk9uVXBkYXRlID0gdHJ1ZTtcclxuXHRcdGlmICghdGhpcy5zdGF0ZS5pc09wZW4pIHtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdFx0aXNPcGVuOiB0cnVlLFxyXG5cdFx0XHRcdGlucHV0VmFsdWU6ICcnLFxyXG5cdFx0XHRcdGZvY3VzZWRPcHRpb246IHRoaXMuX2ZvY3VzZWRPcHRpb24gfHwgKG9wdGlvbnMubGVuZ3RoID8gb3B0aW9uc1tkaXIgPT09ICduZXh0JyA/IDAgOiBvcHRpb25zLmxlbmd0aCAtIDFdLm9wdGlvbiA6IG51bGwpXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAoIW9wdGlvbnMubGVuZ3RoKSByZXR1cm47XHJcblx0XHR2YXIgZm9jdXNlZEluZGV4ID0gLTE7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuX2ZvY3VzZWRPcHRpb24gPT09IG9wdGlvbnNbaV0ub3B0aW9uKSB7XHJcblx0XHRcdFx0Zm9jdXNlZEluZGV4ID0gaTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKGRpciA9PT0gJ25leHQnICYmIGZvY3VzZWRJbmRleCAhPT0gLTEgKSB7XHJcblx0XHRcdGZvY3VzZWRJbmRleCA9IChmb2N1c2VkSW5kZXggKyAxKSAlIG9wdGlvbnMubGVuZ3RoO1xyXG5cdFx0fSBlbHNlIGlmIChkaXIgPT09ICdwcmV2aW91cycpIHtcclxuXHRcdFx0aWYgKGZvY3VzZWRJbmRleCA+IDApIHtcclxuXHRcdFx0XHRmb2N1c2VkSW5kZXggPSBmb2N1c2VkSW5kZXggLSAxO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvY3VzZWRJbmRleCA9IG9wdGlvbnMubGVuZ3RoIC0gMTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmIChkaXIgPT09ICdzdGFydCcpIHtcclxuXHRcdFx0Zm9jdXNlZEluZGV4ID0gMDtcclxuXHRcdH0gZWxzZSBpZiAoZGlyID09PSAnZW5kJykge1xyXG5cdFx0XHRmb2N1c2VkSW5kZXggPSBvcHRpb25zLmxlbmd0aCAtIDE7XHJcblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3BhZ2VfdXAnKSB7XHJcblx0XHRcdHZhciBwb3RlbnRpYWxJbmRleCA9IGZvY3VzZWRJbmRleCAtIHRoaXMucHJvcHMucGFnZVNpemU7XHJcblx0XHRcdGlmIChwb3RlbnRpYWxJbmRleCA8IDApIHtcclxuXHRcdFx0XHRmb2N1c2VkSW5kZXggPSAwO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvY3VzZWRJbmRleCA9IHBvdGVudGlhbEluZGV4O1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3BhZ2VfZG93bicpIHtcclxuXHRcdFx0dmFyIHBvdGVudGlhbEluZGV4ID0gZm9jdXNlZEluZGV4ICsgdGhpcy5wcm9wcy5wYWdlU2l6ZTtcclxuXHRcdFx0aWYgKHBvdGVudGlhbEluZGV4ID4gb3B0aW9ucy5sZW5ndGggLSAxKSB7XHJcblx0XHRcdFx0Zm9jdXNlZEluZGV4ID0gb3B0aW9ucy5sZW5ndGggLSAxO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvY3VzZWRJbmRleCA9IHBvdGVudGlhbEluZGV4O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGZvY3VzZWRJbmRleCA9PT0gLTEpIHtcclxuXHRcdFx0Zm9jdXNlZEluZGV4ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0Zm9jdXNlZEluZGV4OiBvcHRpb25zW2ZvY3VzZWRJbmRleF0uaW5kZXgsXHJcblx0XHRcdGZvY3VzZWRPcHRpb246IG9wdGlvbnNbZm9jdXNlZEluZGV4XS5vcHRpb25cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGdldEZvY3VzZWRPcHRpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2ZvY3VzZWRPcHRpb247XHJcblx0fSxcclxuXHJcblx0Z2V0SW5wdXRWYWx1ZSAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5zdGF0ZS5pbnB1dFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdHNlbGVjdEZvY3VzZWRPcHRpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMuX2ZvY3VzZWRPcHRpb24pIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuc2VsZWN0VmFsdWUodGhpcy5fZm9jdXNlZE9wdGlvbik7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0cmVuZGVyTG9hZGluZyAoKSB7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaXNMb2FkaW5nKSByZXR1cm47XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJTZWxlY3QtbG9hZGluZy16b25lXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcblx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWxvYWRpbmdcIiAvPlxyXG5cdFx0XHQ8L3NwYW4+XHJcblx0XHQpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlclZhbHVlICh2YWx1ZUFycmF5LCBpc09wZW4pIHtcclxuXHRcdGxldCByZW5kZXJMYWJlbCA9IHRoaXMucHJvcHMudmFsdWVSZW5kZXJlciB8fCB0aGlzLmdldE9wdGlvbkxhYmVsO1xyXG5cdFx0bGV0IFZhbHVlQ29tcG9uZW50ID0gdGhpcy5wcm9wcy52YWx1ZUNvbXBvbmVudDtcclxuXHRcdGlmICghdmFsdWVBcnJheS5sZW5ndGgpIHtcclxuXHRcdFx0cmV0dXJuICF0aGlzLnN0YXRlLmlucHV0VmFsdWUgPyA8ZGl2IGNsYXNzTmFtZT1cIlNlbGVjdC1wbGFjZWhvbGRlclwiPnt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfTwvZGl2PiA6IG51bGw7XHJcblx0XHR9XHJcblx0XHRsZXQgb25DbGljayA9IHRoaXMucHJvcHMub25WYWx1ZUNsaWNrID8gdGhpcy5oYW5kbGVWYWx1ZUNsaWNrIDogbnVsbDtcclxuXHRcdGlmICh0aGlzLnByb3BzLm11bHRpKSB7XHJcblx0XHRcdHJldHVybiB2YWx1ZUFycmF5Lm1hcCgodmFsdWUsIGkpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0PFZhbHVlQ29tcG9uZW50XHJcblx0XHRcdFx0XHRcdGlkPXt0aGlzLl9pbnN0YW5jZVByZWZpeCArICctdmFsdWUtJyArIGl9XHJcblx0XHRcdFx0XHRcdGluc3RhbmNlUHJlZml4PXt0aGlzLl9pbnN0YW5jZVByZWZpeH1cclxuXHRcdFx0XHRcdFx0ZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWQgfHwgdmFsdWUuY2xlYXJhYmxlVmFsdWUgPT09IGZhbHNlfVxyXG5cdFx0XHRcdFx0XHRrZXk9e2B2YWx1ZS0ke2l9LSR7dmFsdWVbdGhpcy5wcm9wcy52YWx1ZUtleV19YH1cclxuXHRcdFx0XHRcdFx0b25DbGljaz17b25DbGlja31cclxuXHRcdFx0XHRcdFx0b25SZW1vdmU9e3RoaXMucmVtb3ZlVmFsdWV9XHJcblx0XHRcdFx0XHRcdHZhbHVlPXt2YWx1ZX1cclxuXHRcdFx0XHRcdD5cclxuXHRcdFx0XHRcdFx0e3JlbmRlckxhYmVsKHZhbHVlLCBpKX1cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWFyaWEtb25seVwiPiZuYnNwOzwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvVmFsdWVDb21wb25lbnQ+XHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLmlucHV0VmFsdWUpIHtcclxuXHRcdFx0aWYgKGlzT3Blbikgb25DbGljayA9IG51bGw7XHJcblx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0PFZhbHVlQ29tcG9uZW50XHJcblx0XHRcdFx0XHRpZD17dGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLXZhbHVlLWl0ZW0nfVxyXG5cdFx0XHRcdFx0ZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWR9XHJcblx0XHRcdFx0XHRpbnN0YW5jZVByZWZpeD17dGhpcy5faW5zdGFuY2VQcmVmaXh9XHJcblx0XHRcdFx0XHRvbkNsaWNrPXtvbkNsaWNrfVxyXG5cdFx0XHRcdFx0dmFsdWU9e3ZhbHVlQXJyYXlbMF19XHJcblx0XHRcdFx0PlxyXG5cdFx0XHRcdFx0e3JlbmRlckxhYmVsKHZhbHVlQXJyYXlbMF0pfVxyXG5cdFx0XHRcdDwvVmFsdWVDb21wb25lbnQ+XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0cmVuZGVySW5wdXQgKHZhbHVlQXJyYXksIGZvY3VzZWRPcHRpb25JbmRleCkge1xyXG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ1NlbGVjdC1pbnB1dCcsIHRoaXMucHJvcHMuaW5wdXRQcm9wcy5jbGFzc05hbWUpO1xyXG5cdFx0Y29uc3QgaXNPcGVuID0gISF0aGlzLnN0YXRlLmlzT3BlbjtcclxuXHJcblx0XHRjb25zdCBhcmlhT3ducyA9IGNsYXNzTmFtZXMoe1xyXG5cdFx0XHRbdGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLWxpc3QnXTogaXNPcGVuLFxyXG5cdFx0XHRbdGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLWJhY2tzcGFjZS1yZW1vdmUtbWVzc2FnZSddOiB0aGlzLnByb3BzLm11bHRpXHJcblx0XHRcdFx0JiYgIXRoaXMucHJvcHMuZGlzYWJsZWRcclxuXHRcdFx0XHQmJiB0aGlzLnN0YXRlLmlzRm9jdXNlZFxyXG5cdFx0XHRcdCYmICF0aGlzLnN0YXRlLmlucHV0VmFsdWVcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFRPRE86IENoZWNrIGhvdyB0aGlzIHByb2plY3QgaW5jbHVkZXMgT2JqZWN0LmFzc2lnbigpXHJcblx0XHRjb25zdCBpbnB1dFByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5pbnB1dFByb3BzLCB7XHJcblx0XHRcdHJvbGU6ICdjb21ib2JveCcsXHJcblx0XHRcdCdhcmlhLWV4cGFuZGVkJzogJycgKyBpc09wZW4sXHJcblx0XHRcdCdhcmlhLW93bnMnOiBhcmlhT3ducyxcclxuXHRcdFx0J2FyaWEtaGFzcG9wdXAnOiAnJyArIGlzT3BlbixcclxuXHRcdFx0J2FyaWEtYWN0aXZlZGVzY2VuZGFudCc6IGlzT3BlbiA/IHRoaXMuX2luc3RhbmNlUHJlZml4ICsgJy1vcHRpb24tJyArIGZvY3VzZWRPcHRpb25JbmRleCA6IHRoaXMuX2luc3RhbmNlUHJlZml4ICsgJy12YWx1ZScsXHJcblx0XHRcdCdhcmlhLWxhYmVsbGVkYnknOiB0aGlzLnByb3BzWydhcmlhLWxhYmVsbGVkYnknXSxcclxuXHRcdFx0J2FyaWEtbGFiZWwnOiB0aGlzLnByb3BzWydhcmlhLWxhYmVsJ10sXHJcblx0XHRcdGNsYXNzTmFtZTogY2xhc3NOYW1lLFxyXG5cdFx0XHR0YWJJbmRleDogdGhpcy5wcm9wcy50YWJJbmRleCxcclxuXHRcdFx0b25CbHVyOiB0aGlzLmhhbmRsZUlucHV0Qmx1cixcclxuXHRcdFx0b25DaGFuZ2U6IHRoaXMuaGFuZGxlSW5wdXRDaGFuZ2UsXHJcblx0XHRcdG9uRm9jdXM6IHRoaXMuaGFuZGxlSW5wdXRGb2N1cyxcclxuXHRcdFx0cmVmOiByZWYgPT4gdGhpcy5pbnB1dCA9IHJlZixcclxuXHRcdFx0cmVxdWlyZWQ6IHRoaXMuc3RhdGUucmVxdWlyZWQsXHJcblx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLmlucHV0VmFsdWVcclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmICh0aGlzLnByb3BzLmlucHV0UmVuZGVyZXIpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJvcHMuaW5wdXRSZW5kZXJlcihpbnB1dFByb3BzKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCB8fCAhdGhpcy5wcm9wcy5zZWFyY2hhYmxlKSB7XHJcblx0XHRcdGNvbnN0IHsgaW5wdXRDbGFzc05hbWUsIC4uLmRpdlByb3BzIH0gPSB0aGlzLnByb3BzLmlucHV0UHJvcHM7XHJcblx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0PGRpdlxyXG5cdFx0XHRcdFx0ey4uLmRpdlByb3BzfVxyXG5cdFx0XHRcdFx0cm9sZT1cImNvbWJvYm94XCJcclxuXHRcdFx0XHRcdGFyaWEtZXhwYW5kZWQ9e2lzT3Blbn1cclxuXHRcdFx0XHRcdGFyaWEtb3ducz17aXNPcGVuID8gdGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLWxpc3QnIDogdGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLXZhbHVlJ31cclxuXHRcdFx0XHRcdGFyaWEtYWN0aXZlZGVzY2VuZGFudD17aXNPcGVuID8gdGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLW9wdGlvbi0nICsgZm9jdXNlZE9wdGlvbkluZGV4IDogdGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLXZhbHVlJ31cclxuXHRcdFx0XHRcdGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxyXG5cdFx0XHRcdFx0dGFiSW5kZXg9e3RoaXMucHJvcHMudGFiSW5kZXggfHwgMH1cclxuXHRcdFx0XHRcdG9uQmx1cj17dGhpcy5oYW5kbGVJbnB1dEJsdXJ9XHJcblx0XHRcdFx0XHRvbkZvY3VzPXt0aGlzLmhhbmRsZUlucHV0Rm9jdXN9XHJcblx0XHRcdFx0XHRyZWY9e3JlZiA9PiB0aGlzLmlucHV0ID0gcmVmfVxyXG5cdFx0XHRcdFx0YXJpYS1yZWFkb25seT17JycgKyAhIXRoaXMucHJvcHMuZGlzYWJsZWR9XHJcblx0XHRcdFx0XHRzdHlsZT17eyBib3JkZXI6IDAsIHdpZHRoOiAxLCBkaXNwbGF5OidpbmxpbmUtYmxvY2snIH19Lz5cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5wcm9wcy5hdXRvc2l6ZSkge1xyXG5cdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdDxBdXRvc2l6ZUlucHV0IHsuLi5pbnB1dFByb3BzfSBtaW5XaWR0aD1cIjVcIiAvPlxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9eyBjbGFzc05hbWUgfT5cclxuXHRcdFx0XHQ8aW5wdXQgey4uLmlucHV0UHJvcHN9IC8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXJDbGVhciAoKSB7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuY2xlYXJhYmxlIHx8ICghdGhpcy5wcm9wcy52YWx1ZSB8fCB0aGlzLnByb3BzLnZhbHVlID09PSAwKSB8fCAodGhpcy5wcm9wcy5tdWx0aSAmJiAhdGhpcy5wcm9wcy52YWx1ZS5sZW5ndGgpIHx8IHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgdGhpcy5wcm9wcy5pc0xvYWRpbmcpIHJldHVybjtcclxuXHRcdGNvbnN0IGNsZWFyID0gdGhpcy5wcm9wcy5jbGVhclJlbmRlcmVyKCk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWNsZWFyLXpvbmVcIiB0aXRsZT17dGhpcy5wcm9wcy5tdWx0aSA/IHRoaXMucHJvcHMuY2xlYXJBbGxUZXh0IDogdGhpcy5wcm9wcy5jbGVhclZhbHVlVGV4dH1cclxuXHRcdFx0XHRhcmlhLWxhYmVsPXt0aGlzLnByb3BzLm11bHRpID8gdGhpcy5wcm9wcy5jbGVhckFsbFRleHQgOiB0aGlzLnByb3BzLmNsZWFyVmFsdWVUZXh0fVxyXG5cdFx0XHRcdG9uTW91c2VEb3duPXt0aGlzLmNsZWFyVmFsdWV9XHJcblx0XHRcdFx0b25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XHJcblx0XHRcdFx0b25Ub3VjaE1vdmU9e3RoaXMuaGFuZGxlVG91Y2hNb3ZlfVxyXG5cdFx0XHRcdG9uVG91Y2hFbmQ9e3RoaXMuaGFuZGxlVG91Y2hFbmRDbGVhclZhbHVlfVxyXG5cdFx0XHQ+XHJcblx0XHRcdFx0e2NsZWFyfVxyXG5cdFx0XHQ8L3NwYW4+XHJcblx0XHQpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlckFycm93ICgpIHtcclxuXHRcdGNvbnN0IG9uTW91c2VEb3duID0gdGhpcy5oYW5kbGVNb3VzZURvd25PbkFycm93O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNPcGVuID0gdGhpcy5zdGF0ZS5pc09wZW47XHJcblx0XHRjb25zdCBhcnJvdyA9IHRoaXMucHJvcHMuYXJyb3dSZW5kZXJlcih7IG9uTW91c2VEb3duLCBpc09wZW4gfSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHNwYW5cclxuXHRcdFx0XHRjbGFzc05hbWU9XCJTZWxlY3QtYXJyb3ctem9uZVwiXHJcblx0XHRcdFx0b25Nb3VzZURvd249e29uTW91c2VEb3dufVxyXG5cdFx0XHQ+XHJcblx0XHRcdFx0e2Fycm93fVxyXG5cdFx0XHQ8L3NwYW4+XHJcblx0XHQpO1xyXG5cdH0sXHJcblxyXG5cdGZpbHRlck9wdGlvbnMgKGV4Y2x1ZGVPcHRpb25zKSB7XHJcblx0XHR2YXIgZmlsdGVyVmFsdWUgPSB0aGlzLnN0YXRlLmlucHV0VmFsdWU7XHJcblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucyB8fCBbXTtcclxuXHRcdGlmICh0aGlzLnByb3BzLmZpbHRlck9wdGlvbnMpIHtcclxuXHRcdFx0Ly8gTWFpbnRhaW4gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2l0aCBib29sZWFuIGF0dHJpYnV0ZVxyXG5cdFx0XHRjb25zdCBmaWx0ZXJPcHRpb25zID0gdHlwZW9mIHRoaXMucHJvcHMuZmlsdGVyT3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJ1xyXG5cdFx0XHRcdD8gdGhpcy5wcm9wcy5maWx0ZXJPcHRpb25zXHJcblx0XHRcdFx0OiBkZWZhdWx0RmlsdGVyT3B0aW9ucztcclxuXHJcblx0XHRcdHJldHVybiBmaWx0ZXJPcHRpb25zKFxyXG5cdFx0XHRcdG9wdGlvbnMsXHJcblx0XHRcdFx0ZmlsdGVyVmFsdWUsXHJcblx0XHRcdFx0ZXhjbHVkZU9wdGlvbnMsXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0ZmlsdGVyT3B0aW9uOiB0aGlzLnByb3BzLmZpbHRlck9wdGlvbixcclxuXHRcdFx0XHRcdGlnbm9yZUFjY2VudHM6IHRoaXMucHJvcHMuaWdub3JlQWNjZW50cyxcclxuXHRcdFx0XHRcdGlnbm9yZUNhc2U6IHRoaXMucHJvcHMuaWdub3JlQ2FzZSxcclxuXHRcdFx0XHRcdGxhYmVsS2V5OiB0aGlzLnByb3BzLmxhYmVsS2V5LFxyXG5cdFx0XHRcdFx0bWF0Y2hQb3M6IHRoaXMucHJvcHMubWF0Y2hQb3MsXHJcblx0XHRcdFx0XHRtYXRjaFByb3A6IHRoaXMucHJvcHMubWF0Y2hQcm9wLFxyXG5cdFx0XHRcdFx0dmFsdWVLZXk6IHRoaXMucHJvcHMudmFsdWVLZXksXHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIG9wdGlvbnM7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0b25PcHRpb25SZWYocmVmLCBpc0ZvY3VzZWQpIHtcclxuXHRcdGlmIChpc0ZvY3VzZWQpIHtcclxuXHRcdFx0dGhpcy5mb2N1c2VkID0gcmVmO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHJlbmRlck1lbnUgKG9wdGlvbnMsIHZhbHVlQXJyYXksIGZvY3VzZWRPcHRpb24pIHtcclxuXHRcdGlmIChvcHRpb25zICYmIG9wdGlvbnMubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnByb3BzLm1lbnVSZW5kZXJlcih7XHJcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbixcclxuXHRcdFx0XHRmb2N1c09wdGlvbjogdGhpcy5mb2N1c09wdGlvbixcclxuXHRcdFx0XHRpbnN0YW5jZVByZWZpeDogdGhpcy5faW5zdGFuY2VQcmVmaXgsXHJcblx0XHRcdFx0bGFiZWxLZXk6IHRoaXMucHJvcHMubGFiZWxLZXksXHJcblx0XHRcdFx0b25Gb2N1czogdGhpcy5mb2N1c09wdGlvbixcclxuXHRcdFx0XHRvblNlbGVjdDogdGhpcy5zZWxlY3RWYWx1ZSxcclxuXHRcdFx0XHRvcHRpb25DbGFzc05hbWU6IHRoaXMucHJvcHMub3B0aW9uQ2xhc3NOYW1lLFxyXG5cdFx0XHRcdG9wdGlvbkNvbXBvbmVudDogdGhpcy5wcm9wcy5vcHRpb25Db21wb25lbnQsXHJcblx0XHRcdFx0b3B0aW9uUmVuZGVyZXI6IHRoaXMucHJvcHMub3B0aW9uUmVuZGVyZXIgfHwgdGhpcy5nZXRPcHRpb25MYWJlbCxcclxuXHRcdFx0XHRvcHRpb25zLFxyXG5cdFx0XHRcdHNlbGVjdFZhbHVlOiB0aGlzLnNlbGVjdFZhbHVlLFxyXG5cdFx0XHRcdHZhbHVlQXJyYXksXHJcblx0XHRcdFx0dmFsdWVLZXk6IHRoaXMucHJvcHMudmFsdWVLZXksXHJcblx0XHRcdFx0b25PcHRpb25SZWY6IHRoaXMub25PcHRpb25SZWYsXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLnByb3BzLm5vUmVzdWx0c1RleHQpIHtcclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIlNlbGVjdC1ub3Jlc3VsdHNcIj5cclxuXHRcdFx0XHRcdHt0aGlzLnByb3BzLm5vUmVzdWx0c1RleHR9XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRyZW5kZXJIaWRkZW5GaWVsZCAodmFsdWVBcnJheSkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLm5hbWUpIHJldHVybjtcclxuXHRcdGlmICh0aGlzLnByb3BzLmpvaW5WYWx1ZXMpIHtcclxuXHRcdFx0bGV0IHZhbHVlID0gdmFsdWVBcnJheS5tYXAoaSA9PiBzdHJpbmdpZnlWYWx1ZShpW3RoaXMucHJvcHMudmFsdWVLZXldKSkuam9pbih0aGlzLnByb3BzLmRlbGltaXRlcik7XHJcblx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0PGlucHV0XHJcblx0XHRcdFx0XHR0eXBlPVwiaGlkZGVuXCJcclxuXHRcdFx0XHRcdHJlZj17cmVmID0+IHRoaXMudmFsdWUgPSByZWZ9XHJcblx0XHRcdFx0XHRuYW1lPXt0aGlzLnByb3BzLm5hbWV9XHJcblx0XHRcdFx0XHR2YWx1ZT17dmFsdWV9XHJcblx0XHRcdFx0XHRkaXNhYmxlZD17dGhpcy5wcm9wcy5kaXNhYmxlZH0gLz5cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB2YWx1ZUFycmF5Lm1hcCgoaXRlbSwgaW5kZXgpID0+IChcclxuXHRcdFx0PGlucHV0IGtleT17J2hpZGRlbi4nICsgaW5kZXh9XHJcblx0XHRcdFx0dHlwZT1cImhpZGRlblwiXHJcblx0XHRcdFx0cmVmPXsndmFsdWUnICsgaW5kZXh9XHJcblx0XHRcdFx0bmFtZT17dGhpcy5wcm9wcy5uYW1lfVxyXG5cdFx0XHRcdHZhbHVlPXtzdHJpbmdpZnlWYWx1ZShpdGVtW3RoaXMucHJvcHMudmFsdWVLZXldKX1cclxuXHRcdFx0XHRkaXNhYmxlZD17dGhpcy5wcm9wcy5kaXNhYmxlZH0gLz5cclxuXHRcdCkpO1xyXG5cdH0sXHJcblxyXG5cdGdldEZvY3VzYWJsZU9wdGlvbkluZGV4IChzZWxlY3RlZE9wdGlvbikge1xyXG5cdFx0dmFyIG9wdGlvbnMgPSB0aGlzLl92aXNpYmxlT3B0aW9ucztcclxuXHRcdGlmICghb3B0aW9ucy5sZW5ndGgpIHJldHVybiBudWxsO1xyXG5cclxuXHRcdGxldCBmb2N1c2VkT3B0aW9uID0gdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uIHx8IHNlbGVjdGVkT3B0aW9uO1xyXG5cdFx0aWYgKGZvY3VzZWRPcHRpb24gJiYgIWZvY3VzZWRPcHRpb24uZGlzYWJsZWQpIHtcclxuXHRcdFx0Y29uc3QgZm9jdXNlZE9wdGlvbkluZGV4ID0gb3B0aW9ucy5pbmRleE9mKGZvY3VzZWRPcHRpb24pO1xyXG5cdFx0XHRpZiAoZm9jdXNlZE9wdGlvbkluZGV4ICE9PSAtMSkge1xyXG5cdFx0XHRcdHJldHVybiBmb2N1c2VkT3B0aW9uSW5kZXg7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKCFvcHRpb25zW2ldLmRpc2FibGVkKSByZXR1cm4gaTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlck91dGVyIChvcHRpb25zLCB2YWx1ZUFycmF5LCBmb2N1c2VkT3B0aW9uKSB7XHJcblx0XHRsZXQgbWVudSA9IHRoaXMucmVuZGVyTWVudShvcHRpb25zLCB2YWx1ZUFycmF5LCBmb2N1c2VkT3B0aW9uKTtcclxuXHRcdGlmICghbWVudSkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IHJlZj17cmVmID0+IHRoaXMubWVudUNvbnRhaW5lciA9IHJlZn0gY2xhc3NOYW1lPVwiU2VsZWN0LW1lbnUtb3V0ZXJcIiBzdHlsZT17dGhpcy5wcm9wcy5tZW51Q29udGFpbmVyU3R5bGV9PlxyXG5cdFx0XHRcdDxkaXYgcmVmPXtyZWYgPT4gdGhpcy5tZW51ID0gcmVmfSByb2xlPVwibGlzdGJveFwiIGNsYXNzTmFtZT1cIlNlbGVjdC1tZW51XCIgaWQ9e3RoaXMuX2luc3RhbmNlUHJlZml4ICsgJy1saXN0J31cclxuXHRcdFx0XHRcdFx0IHN0eWxlPXt0aGlzLnByb3BzLm1lbnVTdHlsZX1cclxuXHRcdFx0XHRcdFx0IG9uU2Nyb2xsPXt0aGlzLmhhbmRsZU1lbnVTY3JvbGx9XHJcblx0XHRcdFx0XHRcdCBvbk1vdXNlRG93bj17dGhpcy5oYW5kbGVNb3VzZURvd25Pbk1lbnV9PlxyXG5cdFx0XHRcdFx0e21lbnV9XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0bGV0IHZhbHVlQXJyYXkgPSB0aGlzLmdldFZhbHVlQXJyYXkodGhpcy5wcm9wcy52YWx1ZSk7XHJcblx0XHRsZXQgb3B0aW9ucyA9IHRoaXMuX3Zpc2libGVPcHRpb25zID0gdGhpcy5maWx0ZXJPcHRpb25zKHRoaXMucHJvcHMubXVsdGkgJiYgdGhpcy5wcm9wcy5yZW1vdmVTZWxlY3RlZCA/IHZhbHVlQXJyYXkgOiBudWxsKTtcclxuXHRcdGxldCBpc09wZW4gPSB0aGlzLnN0YXRlLmlzT3BlbjtcclxuXHRcdGlmICh0aGlzLnByb3BzLm11bHRpICYmICFvcHRpb25zLmxlbmd0aCAmJiB2YWx1ZUFycmF5Lmxlbmd0aCAmJiAhdGhpcy5zdGF0ZS5pbnB1dFZhbHVlKSBpc09wZW4gPSBmYWxzZTtcclxuXHRcdGNvbnN0IGZvY3VzZWRPcHRpb25JbmRleCA9IHRoaXMuZ2V0Rm9jdXNhYmxlT3B0aW9uSW5kZXgodmFsdWVBcnJheVswXSk7XHJcblxyXG5cdFx0bGV0IGZvY3VzZWRPcHRpb24gPSBudWxsO1xyXG5cdFx0aWYgKGZvY3VzZWRPcHRpb25JbmRleCAhPT0gbnVsbCkge1xyXG5cdFx0XHRmb2N1c2VkT3B0aW9uID0gdGhpcy5fZm9jdXNlZE9wdGlvbiA9IG9wdGlvbnNbZm9jdXNlZE9wdGlvbkluZGV4XTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGZvY3VzZWRPcHRpb24gPSB0aGlzLl9mb2N1c2VkT3B0aW9uID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGxldCBjbGFzc05hbWUgPSBjbGFzc05hbWVzKCdTZWxlY3QnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSwge1xyXG5cdFx0XHQnU2VsZWN0LS1tdWx0aSc6IHRoaXMucHJvcHMubXVsdGksXHJcblx0XHRcdCdTZWxlY3QtLXNpbmdsZSc6ICF0aGlzLnByb3BzLm11bHRpLFxyXG5cdFx0XHQnaXMtZGlzYWJsZWQnOiB0aGlzLnByb3BzLmRpc2FibGVkLFxyXG5cdFx0XHQnaXMtZm9jdXNlZCc6IHRoaXMuc3RhdGUuaXNGb2N1c2VkLFxyXG5cdFx0XHQnaXMtbG9hZGluZyc6IHRoaXMucHJvcHMuaXNMb2FkaW5nLFxyXG5cdFx0XHQnaXMtb3Blbic6IGlzT3BlbixcclxuXHRcdFx0J2lzLXBzZXVkby1mb2N1c2VkJzogdGhpcy5zdGF0ZS5pc1BzZXVkb0ZvY3VzZWQsXHJcblx0XHRcdCdpcy1zZWFyY2hhYmxlJzogdGhpcy5wcm9wcy5zZWFyY2hhYmxlLFxyXG5cdFx0XHQnaGFzLXZhbHVlJzogdmFsdWVBcnJheS5sZW5ndGgsXHJcblx0XHR9KTtcclxuXHJcblx0XHRsZXQgcmVtb3ZlTWVzc2FnZSA9IG51bGw7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5tdWx0aSAmJlxyXG5cdFx0XHQhdGhpcy5wcm9wcy5kaXNhYmxlZCAmJlxyXG5cdFx0XHR2YWx1ZUFycmF5Lmxlbmd0aCAmJlxyXG5cdFx0XHQhdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICYmXHJcblx0XHRcdHRoaXMuc3RhdGUuaXNGb2N1c2VkICYmXHJcblx0XHRcdHRoaXMucHJvcHMuYmFja3NwYWNlUmVtb3Zlcykge1xyXG5cdFx0XHRyZW1vdmVNZXNzYWdlID0gKFxyXG5cdFx0XHRcdDxzcGFuIGlkPXt0aGlzLl9pbnN0YW5jZVByZWZpeCArICctYmFja3NwYWNlLXJlbW92ZS1tZXNzYWdlJ30gY2xhc3NOYW1lPVwiU2VsZWN0LWFyaWEtb25seVwiIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiPlxyXG5cdFx0XHRcdFx0e3RoaXMucHJvcHMuYmFja3NwYWNlVG9SZW1vdmVNZXNzYWdlLnJlcGxhY2UoJ3tsYWJlbH0nLCB2YWx1ZUFycmF5W3ZhbHVlQXJyYXkubGVuZ3RoIC0gMV1bdGhpcy5wcm9wcy5sYWJlbEtleV0pfVxyXG5cdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IHJlZj17cmVmID0+IHRoaXMud3JhcHBlciA9IHJlZn1cclxuXHRcdFx0XHQgY2xhc3NOYW1lPXtjbGFzc05hbWV9XHJcblx0XHRcdFx0IHN0eWxlPXt0aGlzLnByb3BzLndyYXBwZXJTdHlsZX0+XHJcblx0XHRcdFx0e3RoaXMucmVuZGVySGlkZGVuRmllbGQodmFsdWVBcnJheSl9XHJcblx0XHRcdFx0PGRpdiByZWY9e3JlZiA9PiB0aGlzLmNvbnRyb2wgPSByZWZ9XHJcblx0XHRcdFx0XHRjbGFzc05hbWU9XCJTZWxlY3QtY29udHJvbFwiXHJcblx0XHRcdFx0XHRzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX1cclxuXHRcdFx0XHRcdG9uS2V5RG93bj17dGhpcy5oYW5kbGVLZXlEb3dufVxyXG5cdFx0XHRcdFx0b25Nb3VzZURvd249e3RoaXMuaGFuZGxlTW91c2VEb3dufVxyXG5cdFx0XHRcdFx0b25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZH1cclxuXHRcdFx0XHRcdG9uVG91Y2hTdGFydD17dGhpcy5oYW5kbGVUb3VjaFN0YXJ0fVxyXG5cdFx0XHRcdFx0b25Ub3VjaE1vdmU9e3RoaXMuaGFuZGxlVG91Y2hNb3ZlfVxyXG5cdFx0XHRcdD5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIlNlbGVjdC1tdWx0aS12YWx1ZS13cmFwcGVyXCIgaWQ9e3RoaXMuX2luc3RhbmNlUHJlZml4ICsgJy12YWx1ZSd9PlxyXG5cdFx0XHRcdFx0XHR7dGhpcy5yZW5kZXJWYWx1ZSh2YWx1ZUFycmF5LCBpc09wZW4pfVxyXG5cdFx0XHRcdFx0XHR7dGhpcy5yZW5kZXJJbnB1dCh2YWx1ZUFycmF5LCBmb2N1c2VkT3B0aW9uSW5kZXgpfVxyXG5cdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdFx0e3JlbW92ZU1lc3NhZ2V9XHJcblx0XHRcdFx0XHR7dGhpcy5yZW5kZXJMb2FkaW5nKCl9XHJcblx0XHRcdFx0XHR7dGhpcy5yZW5kZXJDbGVhcigpfVxyXG5cdFx0XHRcdFx0e3RoaXMucmVuZGVyQXJyb3coKX1cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHR7aXNPcGVuID8gdGhpcy5yZW5kZXJPdXRlcihvcHRpb25zLCB2YWx1ZUFycmF5LCBmb2N1c2VkT3B0aW9uKSA6IG51bGx9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlbGVjdDtcclxuIl19
