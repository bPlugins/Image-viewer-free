/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@panzoom/panzoom/dist/panzoom.es.js":
/*!**********************************************************!*\
  !*** ./node_modules/@panzoom/panzoom/dist/panzoom.es.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Panzoom)
/* harmony export */ });
/**
* Panzoom 4.6.0 for panning and zooming elements using CSS transforms
* Copyright Timmy Willison and other contributors
* https://github.com/timmywil/panzoom/blob/main/MIT-License.txt
*/
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

if (typeof window !== 'undefined') {
  // Support: IE11 only
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  // Support: IE11 only
  // CustomEvent is an object instead of a constructor
  if (typeof window.CustomEvent !== 'function') {
    window.CustomEvent = function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt
    };
  }
}

var isIE = typeof document !== 'undefined' && !!document.documentMode;
/**
 * Lazy creation of a CSS style declaration
 */
var divStyle;
function createStyle() {
    if (divStyle) {
        return divStyle;
    }
    return (divStyle = document.createElement('div').style);
}
/**
 * Proper prefixing for cross-browser compatibility
 */
var prefixes = ['webkit', 'moz', 'ms'];
var prefixCache = {};
function getPrefixedName(name) {
    if (prefixCache[name]) {
        return prefixCache[name];
    }
    var divStyle = createStyle();
    if (name in divStyle) {
        return (prefixCache[name] = name);
    }
    var capName = name[0].toUpperCase() + name.slice(1);
    var i = prefixes.length;
    while (i--) {
        var prefixedName = "".concat(prefixes[i]).concat(capName);
        if (prefixedName in divStyle) {
            return (prefixCache[name] = prefixedName);
        }
    }
}
/**
 * Gets a style value expected to be a number
 */
function getCSSNum(name, style) {
    return parseFloat(style[getPrefixedName(name)]) || 0;
}
function getBoxStyle(elem, name, style) {
    if (style === undefined) { style = window.getComputedStyle(elem); }
    // Support: FF 68+
    // Firefox requires specificity for border
    var suffix = name === 'border' ? 'Width' : '';
    return {
        left: getCSSNum("".concat(name, "Left").concat(suffix), style),
        right: getCSSNum("".concat(name, "Right").concat(suffix), style),
        top: getCSSNum("".concat(name, "Top").concat(suffix), style),
        bottom: getCSSNum("".concat(name, "Bottom").concat(suffix), style)
    };
}
/**
 * Set a style using the properly prefixed name
 */
function setStyle(elem, name, value) {
    elem.style[getPrefixedName(name)] = value;
}
/**
 * Constructs the transition from panzoom options
 * and takes care of prefixing the transition and transform
 */
function setTransition(elem, options) {
    var transform = getPrefixedName('transform');
    setStyle(elem, 'transition', "".concat(transform, " ").concat(options.duration, "ms ").concat(options.easing));
}
/**
 * Set the transform using the proper prefix
 *
 * Override the transform setter.
 * This is exposed mostly so the user could
 * set other parts of a transform
 * aside from scale and translate.
 * Default is defined in src/css.ts.
 *
 * ```js
 * // This example always sets a rotation
 * // when setting the scale and translation
 * const panzoom = Panzoom(elem, {
 *   setTransform: (elem, { scale, x, y }) => {
 *     panzoom.setStyle('transform', `rotate(0.5turn) scale(${scale}) translate(${x}px, ${y}px)`)
 *   }
 * })
 * ```
 */
function setTransform(elem, _a, _options) {
    var x = _a.x, y = _a.y, scale = _a.scale, isSVG = _a.isSVG;
    setStyle(elem, 'transform', "scale(".concat(scale, ") translate(").concat(x, "px, ").concat(y, "px)"));
    if (isSVG && isIE) {
        var matrixValue = window.getComputedStyle(elem).getPropertyValue('transform');
        elem.setAttribute('transform', matrixValue);
    }
}
/**
 * Dimensions used in containment and focal point zooming
 */
function getDimensions(elem) {
    var parent = elem.parentNode;
    var style = window.getComputedStyle(elem);
    var parentStyle = window.getComputedStyle(parent);
    var rectElem = elem.getBoundingClientRect();
    var rectParent = parent.getBoundingClientRect();
    return {
        elem: {
            style: style,
            width: rectElem.width,
            height: rectElem.height,
            top: rectElem.top,
            bottom: rectElem.bottom,
            left: rectElem.left,
            right: rectElem.right,
            margin: getBoxStyle(elem, 'margin', style),
            border: getBoxStyle(elem, 'border', style)
        },
        parent: {
            style: parentStyle,
            width: rectParent.width,
            height: rectParent.height,
            top: rectParent.top,
            bottom: rectParent.bottom,
            left: rectParent.left,
            right: rectParent.right,
            padding: getBoxStyle(parent, 'padding', parentStyle),
            border: getBoxStyle(parent, 'border', parentStyle)
        }
    };
}

var events = {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup mouseleave'
};
if (typeof window !== 'undefined') {
    if (typeof window.PointerEvent === 'function') {
        events = {
            down: 'pointerdown',
            move: 'pointermove',
            up: 'pointerup pointerleave pointercancel'
        };
    }
    else if (typeof window.TouchEvent === 'function') {
        events = {
            down: 'touchstart',
            move: 'touchmove',
            up: 'touchend touchcancel'
        };
    }
}
function onPointer(event, elem, handler, eventOpts) {
    events[event].split(' ').forEach(function (name) {
        elem.addEventListener(name, handler, eventOpts);
    });
}
function destroyPointer(event, elem, handler) {
    events[event].split(' ').forEach(function (name) {
        elem.removeEventListener(name, handler);
    });
}

/**
 * Utilites for working with multiple pointer events
 */
function findEventIndex(pointers, event) {
    var i = pointers.length;
    while (i--) {
        if (pointers[i].pointerId === event.pointerId) {
            return i;
        }
    }
    return -1;
}
function addPointer(pointers, event) {
    var i;
    // Add touches if applicable
    if (event.touches) {
        i = 0;
        for (var _i = 0, _a = event.touches; _i < _a.length; _i++) {
            var touch = _a[_i];
            touch.pointerId = i++;
            addPointer(pointers, touch);
        }
        return;
    }
    i = findEventIndex(pointers, event);
    // Update if already present
    if (i > -1) {
        pointers.splice(i, 1);
    }
    pointers.push(event);
}
function removePointer(pointers, event) {
    // Add touches if applicable
    if (event.touches) {
        // Remove all touches
        while (pointers.length) {
            pointers.pop();
        }
        return;
    }
    var i = findEventIndex(pointers, event);
    if (i > -1) {
        pointers.splice(i, 1);
    }
}
/**
 * Calculates a center point between
 * the given pointer events, for panning
 * with multiple pointers.
 */
function getMiddle(pointers) {
    // Copy to avoid changing by reference
    pointers = pointers.slice(0);
    var event1 = pointers.pop();
    var event2;
    while ((event2 = pointers.pop())) {
        event1 = {
            clientX: (event2.clientX - event1.clientX) / 2 + event1.clientX,
            clientY: (event2.clientY - event1.clientY) / 2 + event1.clientY
        };
    }
    return event1;
}
/**
 * Calculates the distance between two points
 * for pinch zooming.
 * Limits to the first 2
 */
function getDistance(pointers) {
    if (pointers.length < 2) {
        return 0;
    }
    var event1 = pointers[0];
    var event2 = pointers[1];
    return Math.sqrt(Math.pow(Math.abs(event2.clientX - event1.clientX), 2) +
        Math.pow(Math.abs(event2.clientY - event1.clientY), 2));
}

/**
 * Determine if an element is attached to the DOM
 * Panzoom requires this so events work properly
 */
function isAttached(node) {
    var currentNode = node;
    while (currentNode && currentNode.parentNode) {
        if (currentNode.parentNode === document)
            return true;
        currentNode =
            currentNode.parentNode instanceof ShadowRoot
                ? currentNode.parentNode.host
                : currentNode.parentNode;
    }
    return false;
}

function getClass(elem) {
    return (elem.getAttribute('class') || '').trim();
}
function hasClass(elem, className) {
    return elem.nodeType === 1 && " ".concat(getClass(elem), " ").indexOf(" ".concat(className, " ")) > -1;
}
function isExcluded(elem, options) {
    for (var cur = elem; cur != null; cur = cur.parentNode) {
        if (hasClass(cur, options.excludeClass) || options.exclude.indexOf(cur) > -1) {
            return true;
        }
    }
    return false;
}

/**
 * Determine if an element is SVG by checking the namespace
 * Exception: the <svg> element itself should be treated like HTML
 */
var rsvg = /^http:[\w\.\/]+svg$/;
function isSVGElement(elem) {
    return rsvg.test(elem.namespaceURI) && elem.nodeName.toLowerCase() !== 'svg';
}

function shallowClone(obj) {
    var clone = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = obj[key];
        }
    }
    return clone;
}

var defaultOptions = {
    animate: false,
    canvas: false,
    cursor: 'move',
    disablePan: false,
    disableZoom: false,
    disableXAxis: false,
    disableYAxis: false,
    duration: 200,
    easing: 'ease-in-out',
    exclude: [],
    excludeClass: 'panzoom-exclude',
    handleStartEvent: function (e) {
        e.preventDefault();
        e.stopPropagation();
    },
    maxScale: 4,
    minScale: 0.125,
    overflow: 'hidden',
    panOnlyWhenZoomed: false,
    pinchAndPan: false,
    relative: false,
    setTransform: setTransform,
    startX: 0,
    startY: 0,
    startScale: 1,
    step: 0.3,
    touchAction: 'none'
};
function Panzoom(elem, options) {
    if (!elem) {
        throw new Error('Panzoom requires an element as an argument');
    }
    if (elem.nodeType !== 1) {
        throw new Error('Panzoom requires an element with a nodeType of 1');
    }
    if (!isAttached(elem)) {
        throw new Error('Panzoom should be called on elements that have been attached to the DOM');
    }
    options = __assign(__assign({}, defaultOptions), options);
    var isSVG = isSVGElement(elem);
    var parent = elem.parentNode;
    // Set parent styles
    parent.style.overflow = options.overflow;
    parent.style.userSelect = 'none';
    // This is important for mobile to
    // prevent scrolling while panning
    parent.style.touchAction = options.touchAction;
    (options.canvas ? parent : elem).style.cursor = options.cursor;
    // Set element styles
    elem.style.userSelect = 'none';
    elem.style.touchAction = options.touchAction;
    // The default for HTML is '50% 50%'
    // The default for SVG is '0 0'
    // SVG can't be changed in IE
    setStyle(elem, 'transformOrigin', typeof options.origin === 'string' ? options.origin : isSVG ? '0 0' : '50% 50%');
    function resetStyle() {
        parent.style.overflow = '';
        parent.style.userSelect = '';
        parent.style.touchAction = '';
        parent.style.cursor = '';
        elem.style.cursor = '';
        elem.style.userSelect = '';
        elem.style.touchAction = '';
        setStyle(elem, 'transformOrigin', '');
    }
    function setOptions(opts) {
        if (opts === undefined) { opts = {}; }
        for (var key in opts) {
            if (opts.hasOwnProperty(key)) {
                options[key] = opts[key];
            }
        }
        // Handle option side-effects
        if (opts.hasOwnProperty('cursor') || opts.hasOwnProperty('canvas')) {
            parent.style.cursor = elem.style.cursor = '';
            (options.canvas ? parent : elem).style.cursor = options.cursor;
        }
        if (opts.hasOwnProperty('overflow')) {
            parent.style.overflow = opts.overflow;
        }
        if (opts.hasOwnProperty('touchAction')) {
            parent.style.touchAction = opts.touchAction;
            elem.style.touchAction = opts.touchAction;
        }
    }
    var x = 0;
    var y = 0;
    var scale = 1;
    var isPanning = false;
    zoom(options.startScale, { animate: false, force: true });
    // Wait for scale to update
    // for accurate dimensions
    // to constrain initial values
    setTimeout(function () {
        pan(options.startX, options.startY, { animate: false, force: true });
    });
    function trigger(eventName, detail, opts) {
        if (opts.silent) {
            return;
        }
        var event = new CustomEvent(eventName, { detail: detail });
        elem.dispatchEvent(event);
    }
    function setTransformWithEvent(eventName, opts, originalEvent) {
        var value = { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: originalEvent };
        requestAnimationFrame(function () {
            if (typeof opts.animate === 'boolean') {
                if (opts.animate) {
                    setTransition(elem, opts);
                }
                else {
                    setStyle(elem, 'transition', 'none');
                }
            }
            opts.setTransform(elem, value, opts);
            trigger(eventName, value, opts);
            trigger('panzoomchange', value, opts);
        });
        return value;
    }
    function constrainXY(toX, toY, toScale, panOptions) {
        var opts = __assign(__assign({}, options), panOptions);
        var result = { x: x, y: y, opts: opts };
        if (!opts.force && (opts.disablePan || (opts.panOnlyWhenZoomed && scale === opts.startScale))) {
            return result;
        }
        toX = parseFloat(toX);
        toY = parseFloat(toY);
        if (!opts.disableXAxis) {
            result.x = (opts.relative ? x : 0) + toX;
        }
        if (!opts.disableYAxis) {
            result.y = (opts.relative ? y : 0) + toY;
        }
        if (opts.contain) {
            var dims = getDimensions(elem);
            var realWidth = dims.elem.width / scale;
            var realHeight = dims.elem.height / scale;
            var scaledWidth = realWidth * toScale;
            var scaledHeight = realHeight * toScale;
            var diffHorizontal = (scaledWidth - realWidth) / 2;
            var diffVertical = (scaledHeight - realHeight) / 2;
            if (opts.contain === 'inside') {
                var minX = (-dims.elem.margin.left - dims.parent.padding.left + diffHorizontal) / toScale;
                var maxX = (dims.parent.width -
                    scaledWidth -
                    dims.parent.padding.left -
                    dims.elem.margin.left -
                    dims.parent.border.left -
                    dims.parent.border.right +
                    diffHorizontal) /
                    toScale;
                result.x = Math.max(Math.min(result.x, maxX), minX);
                var minY = (-dims.elem.margin.top - dims.parent.padding.top + diffVertical) / toScale;
                var maxY = (dims.parent.height -
                    scaledHeight -
                    dims.parent.padding.top -
                    dims.elem.margin.top -
                    dims.parent.border.top -
                    dims.parent.border.bottom +
                    diffVertical) /
                    toScale;
                result.y = Math.max(Math.min(result.y, maxY), minY);
            }
            else if (opts.contain === 'outside') {
                var minX = (-(scaledWidth - dims.parent.width) -
                    dims.parent.padding.left -
                    dims.parent.border.left -
                    dims.parent.border.right +
                    diffHorizontal) /
                    toScale;
                var maxX = (diffHorizontal - dims.parent.padding.left) / toScale;
                result.x = Math.max(Math.min(result.x, maxX), minX);
                var minY = (-(scaledHeight - dims.parent.height) -
                    dims.parent.padding.top -
                    dims.parent.border.top -
                    dims.parent.border.bottom +
                    diffVertical) /
                    toScale;
                var maxY = (diffVertical - dims.parent.padding.top) / toScale;
                result.y = Math.max(Math.min(result.y, maxY), minY);
            }
        }
        if (opts.roundPixels) {
            result.x = Math.round(result.x);
            result.y = Math.round(result.y);
        }
        return result;
    }
    function constrainScale(toScale, zoomOptions) {
        var opts = __assign(__assign({}, options), zoomOptions);
        var result = { scale: scale, opts: opts };
        if (!opts.force && opts.disableZoom) {
            return result;
        }
        var minScale = options.minScale;
        var maxScale = options.maxScale;
        if (opts.contain) {
            var dims = getDimensions(elem);
            var elemWidth = dims.elem.width / scale;
            var elemHeight = dims.elem.height / scale;
            if (elemWidth > 1 && elemHeight > 1) {
                var parentWidth = dims.parent.width - dims.parent.border.left - dims.parent.border.right;
                var parentHeight = dims.parent.height - dims.parent.border.top - dims.parent.border.bottom;
                var elemScaledWidth = parentWidth / elemWidth;
                var elemScaledHeight = parentHeight / elemHeight;
                if (options.contain === 'inside') {
                    maxScale = Math.min(maxScale, elemScaledWidth, elemScaledHeight);
                }
                else if (options.contain === 'outside') {
                    minScale = Math.max(minScale, elemScaledWidth, elemScaledHeight);
                }
            }
        }
        result.scale = Math.min(Math.max(toScale, minScale), maxScale);
        return result;
    }
    function pan(toX, toY, panOptions, originalEvent) {
        var result = constrainXY(toX, toY, scale, panOptions);
        // Only try to set if the result is somehow different
        if (x !== result.x || y !== result.y) {
            x = result.x;
            y = result.y;
            return setTransformWithEvent('panzoompan', result.opts, originalEvent);
        }
        return { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: originalEvent };
    }
    function zoom(toScale, zoomOptions, originalEvent) {
        var result = constrainScale(toScale, zoomOptions);
        var opts = result.opts;
        if (!opts.force && opts.disableZoom) {
            return;
        }
        toScale = result.scale;
        var toX = x;
        var toY = y;
        if (opts.focal) {
            // The difference between the point after the scale and the point before the scale
            // plus the current translation after the scale
            // neutralized to no scale (as the transform scale will apply to the translation)
            var focal = opts.focal;
            toX = (focal.x / toScale - focal.x / scale + x * toScale) / toScale;
            toY = (focal.y / toScale - focal.y / scale + y * toScale) / toScale;
        }
        var panResult = constrainXY(toX, toY, toScale, { relative: false, force: true });
        x = panResult.x;
        y = panResult.y;
        scale = toScale;
        return setTransformWithEvent('panzoomzoom', opts, originalEvent);
    }
    function zoomInOut(isIn, zoomOptions) {
        var opts = __assign(__assign(__assign({}, options), { animate: true }), zoomOptions);
        return zoom(scale * Math.exp((isIn ? 1 : -1) * opts.step), opts);
    }
    function zoomIn(zoomOptions) {
        return zoomInOut(true, zoomOptions);
    }
    function zoomOut(zoomOptions) {
        return zoomInOut(false, zoomOptions);
    }
    function zoomToPoint(toScale, point, zoomOptions, originalEvent) {
        var dims = getDimensions(elem);
        // Instead of thinking of operating on the panzoom element,
        // think of operating on the area inside the panzoom
        // element's parent
        // Subtract padding and border
        var effectiveArea = {
            width: dims.parent.width -
                dims.parent.padding.left -
                dims.parent.padding.right -
                dims.parent.border.left -
                dims.parent.border.right,
            height: dims.parent.height -
                dims.parent.padding.top -
                dims.parent.padding.bottom -
                dims.parent.border.top -
                dims.parent.border.bottom
        };
        // Adjust the clientX/clientY to ignore the area
        // outside the effective area
        var clientX = point.clientX -
            dims.parent.left -
            dims.parent.padding.left -
            dims.parent.border.left -
            dims.elem.margin.left;
        var clientY = point.clientY -
            dims.parent.top -
            dims.parent.padding.top -
            dims.parent.border.top -
            dims.elem.margin.top;
        // Adjust the clientX/clientY for HTML elements,
        // because they have a transform-origin of 50% 50%
        if (!isSVG) {
            clientX -= dims.elem.width / scale / 2;
            clientY -= dims.elem.height / scale / 2;
        }
        // Convert the mouse point from it's position over the
        // effective area before the scale to the position
        // over the effective area after the scale.
        var focal = {
            x: (clientX / effectiveArea.width) * (effectiveArea.width * toScale),
            y: (clientY / effectiveArea.height) * (effectiveArea.height * toScale)
        };
        return zoom(toScale, __assign(__assign({}, zoomOptions), { animate: false, focal: focal }), originalEvent);
    }
    function zoomWithWheel(event, zoomOptions) {
        // Need to prevent the default here
        // or it conflicts with regular page scroll
        event.preventDefault();
        var opts = __assign(__assign(__assign({}, options), zoomOptions), { animate: false });
        // Normalize to deltaX in case shift modifier is used on Mac
        var delta = event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY;
        var wheel = delta < 0 ? 1 : -1;
        var toScale = constrainScale(scale * Math.exp((wheel * opts.step) / 3), opts).scale;
        return zoomToPoint(toScale, event, opts, event);
    }
    function reset(resetOptions) {
        var opts = __assign(__assign(__assign({}, options), { animate: true, force: true }), resetOptions);
        scale = constrainScale(opts.startScale, opts).scale;
        var panResult = constrainXY(opts.startX, opts.startY, scale, opts);
        x = panResult.x;
        y = panResult.y;
        return setTransformWithEvent('panzoomreset', opts);
    }
    var origX;
    var origY;
    var startClientX;
    var startClientY;
    var startScale;
    var startDistance;
    var pointers = [];
    function handleDown(event) {
        // Don't handle this event if the target is excluded
        if (isExcluded(event.target, options)) {
            return;
        }
        addPointer(pointers, event);
        isPanning = true;
        options.handleStartEvent(event);
        origX = x;
        origY = y;
        trigger('panzoomstart', { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: event }, options);
        // This works whether there are multiple
        // pointers or not
        var point = getMiddle(pointers);
        startClientX = point.clientX;
        startClientY = point.clientY;
        startScale = scale;
        startDistance = getDistance(pointers);
    }
    function handleMove(event) {
        if (!isPanning ||
            origX === undefined ||
            origY === undefined ||
            startClientX === undefined ||
            startClientY === undefined) {
            return;
        }
        addPointer(pointers, event);
        var current = getMiddle(pointers);
        var hasMultiple = pointers.length > 1;
        var toScale = scale;
        if (hasMultiple) {
            // A startDistance of 0 means
            // that there weren't 2 pointers
            // handled on start
            if (startDistance === 0) {
                startDistance = getDistance(pointers);
            }
            // Use the distance between the first 2 pointers
            // to determine the current scale
            var diff = getDistance(pointers) - startDistance;
            toScale = constrainScale((diff * options.step) / 80 + startScale).scale;
            zoomToPoint(toScale, current, { animate: false }, event);
        }
        // Pan during pinch if pinchAndPan is true.
        // Note: some calculations may be off because the zoom
        // above has not yet rendered. However, the behavior
        // was removed before the new scale was used in the following
        // pan calculation.
        // See https://github.com/timmywil/panzoom/issues/512
        // and https://github.com/timmywil/panzoom/issues/606
        if (!hasMultiple || options.pinchAndPan) {
            pan(origX + (current.clientX - startClientX) / toScale, origY + (current.clientY - startClientY) / toScale, {
                animate: false
            }, event);
        }
    }
    function handleUp(event) {
        // Don't call panzoomend when panning with 2 touches
        // until both touches end
        if (pointers.length === 1) {
            trigger('panzoomend', { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: event }, options);
        }
        // Note: don't remove all pointers
        // Can restart without having to reinitiate all of them
        // Remove the pointer regardless of the isPanning state
        removePointer(pointers, event);
        if (!isPanning) {
            return;
        }
        isPanning = false;
        origX = origY = startClientX = startClientY = undefined;
    }
    var bound = false;
    function bind() {
        if (bound) {
            return;
        }
        bound = true;
        onPointer('down', options.canvas ? parent : elem, handleDown);
        onPointer('move', document, handleMove, { passive: true });
        onPointer('up', document, handleUp, { passive: true });
    }
    function destroy() {
        bound = false;
        destroyPointer('down', options.canvas ? parent : elem, handleDown);
        destroyPointer('move', document, handleMove);
        destroyPointer('up', document, handleUp);
    }
    if (!options.noBind) {
        bind();
    }
    return {
        bind: bind,
        destroy: destroy,
        eventNames: events,
        getPan: function () { return ({ x: x, y: y }); },
        getScale: function () { return scale; },
        getOptions: function () { return shallowClone(options); },
        handleDown: handleDown,
        handleMove: handleMove,
        handleUp: handleUp,
        pan: pan,
        reset: reset,
        resetStyle: resetStyle,
        setOptions: setOptions,
        setStyle: function (name, value) { return setStyle(elem, name, value); },
        zoom: zoom,
        zoomIn: zoomIn,
        zoomOut: zoomOut,
        zoomToPoint: zoomToPoint,
        zoomWithWheel: zoomWithWheel
    };
}
Panzoom.defaultOptions = defaultOptions;




/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) // removed by dead control flow
{} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./src/Components/Theme/ImageMagnify.js":
/*!**********************************************!*\
  !*** ./src/Components/Theme/ImageMagnify.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

/* eslint-disable react/no-unknown-property */

const $ = jQuery;
const ImageMagnify = ({
  attributes
}) => {
  const {
    viewerType,
    magnify,
    cId,
    img
  } = attributes;
  const [magnifyEle, setMagnifyEle] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // আগের instance destroy করো
    if (magnifyEle) {
      magnifyEle.destroy();
      setMagnifyEle(null); // state clear করো
    }

    // সবসময় নতুন করে init করো (else if → if)
    // তাহলে settings change হলে destroy + reinit দুটোই হবে
    if (viewerType === "magnify") {
      const doc = document.querySelector('iframe[name="editor-canvas"]')?.contentWindow?.document || document;
      const imgEle = doc.querySelector(`.magnify-${cId} img`) || document.querySelector(`.magnify-${cId} img`);
      if (imgEle) {
        const magnifyInstance = $(imgEle).magnify();
        setMagnifyEle(magnifyInstance);
      }
    }
  }, [viewerType, magnify, img?.url]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `magnify-${cId}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: img?.url,
    alt: img?.title,
    "data-magnify-src": img?.url,
    "data-magnify-speed": magnify?.speed,
    "data-magnify-timeout": magnify?.timeOut //ata just  frontend aer tablete aer mobile kaj kore
    // touchBottomOffset='0'
    ,
    finalWidth: "500",
    finalHeight: "500",
    magnifiedWidth: "1000",
    limitBounds: false,
    mobileCloseEvent: "touchstart"
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImageMagnify);

/***/ }),

/***/ "./src/Components/Theme/ImagePano.js":
/*!*******************************************!*\
  !*** ./src/Components/Theme/ImagePano.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/functions */ "./src/utils/functions.js");



const ImagePano = ({
  attributes,
  clientId
}) => {
  const {
    viewerType,
    magnify,
    img,
    autoRotate,
    rotateSpeed,
    hideControl,
    width,
    height
  } = attributes;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (viewerType === 'pano') {
      (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.pano)(clientId, img, autoRotate, rotateSpeed, hideControl);
    }
  }, [viewerType, magnify, autoRotate, img, rotateSpeed, hideControl, width, height]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bpivbPanorama"
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImagePano);

/***/ }),

/***/ "./src/Components/Theme/ZoomImage.js":
/*!*******************************************!*\
  !*** ./src/Components/Theme/ZoomImage.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/functions */ "./src/utils/functions.js");



const ZoomImage = ({
  attributes
}) => {
  const {
    zoom,
    cId,
    img,
    viewerType
  } = attributes;
  const {
    disablePan = false,
    disableZoom = false,
    disableXAxis = false,
    disableYAxis = false,
    startScale = 1,
    step = 0.3
  } = zoom || {};
  const panZoomRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const wrapperRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const outerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  // null = not yet detected, true = editor iframe, false = frontend
  const [isEditor, setIsEditor] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  // Refs for editor native zoom/pan (avoids re-renders during interaction)
  const scaleRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(startScale || 1);
  const posRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    x: 0,
    y: 0
  });
  const dragging = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const dragStart = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    x: 0,
    y: 0
  });

  // ── 1. Detect editor vs frontend (apiVersion 2 & 3 compatible) ─────────────
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const elem = wrapperRef.current;
    if (!elem) return;

    // apiVersion 2: block render হয় admin DOM-এ, ownerDocument === window.document
    // apiVersion 3: block render হয় iframe-এর ভেতরে, ownerDocument !== window.document
    const isWpEditor = elem.ownerDocument !== window.document ||
    // apiVersion 3 iframe
    !!window?.wp?.blockEditor; // apiVersion 2 fallback

    setIsEditor(isWpEditor);
  }, []);

  // ── 2. Frontend: Panzoom (works fine outside iframe) ─────────────────────
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isEditor !== false || viewerType !== "zoom") return;
    let rafId1, rafId2;
    const elem = wrapperRef.current;
    if (!elem) return;
    const win = elem.ownerDocument?.defaultView || window;
    rafId1 = win.requestAnimationFrame(() => {
      rafId2 = win.requestAnimationFrame(() => {
        const el = wrapperRef.current;
        if (el && el.parentElement) {
          (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.zoomInt)(zoom, el, pan => {
            panZoomRef.current = pan;
          });
        }
      });
    });
    return () => {
      cancelAnimationFrame(rafId1);
      cancelAnimationFrame(rafId2);
      if (panZoomRef.current) {
        try {
          if (panZoomRef.current.parent) {
            panZoomRef.current.parent.removeEventListener("wheel", panZoomRef.current.zoomWithWheel);
          }
          panZoomRef.current.destroy();
        } catch (e) {
          /* destroy may fail if already gone */
        }
        panZoomRef.current = null;
        if (wrapperRef.current) {
          wrapperRef.current.style.transform = "";
          wrapperRef.current.style.transformOrigin = "";
          wrapperRef.current.style.cursor = "";
          wrapperRef.current.style.transition = "";
        }
      }
    };
  }, [isEditor, viewerType, disablePan, disableZoom, disableXAxis, disableYAxis, startScale, step]);

  // ── 3. Editor: wheel zoom listener ───────────────────────────────────────
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isEditor !== true || viewerType !== "zoom") return;
    const outer = outerRef.current;
    if (!outer) return;
    const handleWheel = e => {
      if (disableZoom) return;
      e.preventDefault();
      const dir = e.deltaY < 0 ? 1 : -1;
      scaleRef.current = Math.min(Math.max(scaleRef.current + dir * (step || 0.3), 0.125), 12);
      applyTransform();
    };
    outer.addEventListener("wheel", handleWheel, {
      passive: false
    });
    return () => outer.removeEventListener("wheel", handleWheel);
  }, [isEditor, viewerType, disableZoom, step]);

  // ── 4. Reset when startScale changes ─────────────────────────────────────
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isEditor !== true) return;
    scaleRef.current = startScale || 1;
    posRef.current = {
      x: 0,
      y: 0
    };
    applyTransform();
  }, [isEditor, startScale]);

  // ── 5. Editor: Global drag listeners on ownerDocument ────────────────────
  // এই approach-এ cursor image-এর বাইরে গেলেও drag কাজ করে
  // কারণ mousemove/mouseup listener টা document-এ থাকে, element-এ নয়
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isEditor !== true || viewerType !== "zoom") return;
    const outer = outerRef.current;
    if (!outer) return;

    // ownerDocument ব্যবহার করছি — apiVersion 3 (iframe doc) ও apiVersion 2 (admin doc) উভয়েই কাজ করবে
    const doc = outer.ownerDocument || document;
    const handleMouseMove = e => {
      if (!dragging.current || disablePan) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY
      };
      if (!disableXAxis) posRef.current.x += dx;
      if (!disableYAxis) posRef.current.y += dy;
      applyTransform();
    };
    const handleMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      applyTransform();
    };

    // document-এ attach করলে cursor element-এর বাইরে গেলেও drag চলতে থাকে
    doc.addEventListener("mousemove", handleMouseMove);
    doc.addEventListener("mouseup", handleMouseUp);
    return () => {
      doc.removeEventListener("mousemove", handleMouseMove);
      doc.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isEditor, viewerType, disablePan, disableXAxis, disableYAxis]);

  // Applies CSS transform directly to DOM (no React re-render needed)
  const applyTransform = () => {
    const elem = wrapperRef.current;
    if (!elem) return;
    const {
      x,
      y
    } = posRef.current;
    const sc = scaleRef.current;
    elem.style.transform = `scale(${sc}) translate(${x / sc}px, ${y / sc}px)`;
    elem.style.transformOrigin = "50% 50%";
    if (!disableZoom || !disablePan) {
      elem.style.cursor = dragging.current ? "grabbing" : sc > 1 && !disablePan ? "grab" : !disableZoom ? "zoom-in" : "default";
    }
  };

  // ── 6. mousedown — শুধু drag শুরু করার জন্য (element-এ থাকলেই চলবে) ──────
  const handleMouseDown = e => {
    if (!isEditor || disablePan) return;
    dragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY
    };
    e.preventDefault();
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bpivb-zoom-wapper",
    ref: outerRef,
    style: {
      overflow: "hidden",
      width: "100%",
      position: "relative"
    },
    onMouseDown: isEditor ? handleMouseDown : undefined
    // onMouseMove ও onMouseUp এখন document-এ — JSX থেকে সরানো হয়েছে
    // cursor image-এর বাইরে গেলেও drag চলতে থাকবে
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    id: `panzoom-${cId}`,
    ref: wrapperRef,
    style: isEditor ? {
      userSelect: "none",
      width: "100%",
      height: "100%"
    } : {
      width: "100%",
      height: "100%"
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: img?.url,
    alt: img?.title || "Zoomable image"
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ZoomImage);

/***/ }),

/***/ "./src/Frontend/ImageMapFront.js":
/*!***************************************!*\
  !*** ./src/Frontend/ImageMapFront.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const ImageMapFront = ({
  attributes
}) => {
  const {
    maps,
    img,
    cId
  } = attributes;
  const getShapeStyle = shape => {
    switch (shape) {
      case "circle":
        return {
          clipPath: "circle(50% at 50% 50%)"
        };
      case "rect":
        return {
          borderRadius: "0"
        };
      case "hexagon":
        return {
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
        };
      case "octagon":
        return {
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
        };
      default:
        return {};
    }
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bpivbImageMap",
    style: {
      position: "relative"
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: img?.url,
    useMap: `#image-map-${cId}`
  }), maps.map((map, index) => {
    const {
      width,
      height,
      top,
      left,
      mapColor,
      mapBorder,
      shape,
      mapShow
    } = map;
    // Only render if mapShow is false
    if (!mapShow) return null;
    // Only render if mapShow is true
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: "overlay-" + index,
      style: {
        position: "absolute",
        top,
        left,
        width: width + "px",
        height: height + "px",
        background: mapColor,
        border: `${mapBorder?.width} ${mapBorder?.style} ${mapBorder?.color}`,
        pointerEvents: "none",
        // lets clicks go to area
        zIndex: 20,
        ...getShapeStyle(shape)
      }
    });
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("map", {
    name: `image-map-${cId}`
  }, maps.map((map, index) => {
    const {
      width,
      height,
      top,
      left,
      link,
      title,
      target
    } = map;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("area", {
      key: "area-" + index,
      shape: "rect",
      coords: `${left},${top},${left + width},${top + height}`,
      href: link,
      alt: title,
      title: title,
      target: target,
      style: {
        outline: 'none'
      }
    });
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImageMapFront);

/***/ }),

/***/ "./src/Frontend/Viewer.js":
/*!********************************!*\
  !*** ./src/Frontend/Viewer.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Components_Theme_ZoomImage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Components/Theme/ZoomImage */ "./src/Components/Theme/ZoomImage.js");
/* harmony import */ var _Components_Theme_ImageMagnify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Components/Theme/ImageMagnify */ "./src/Components/Theme/ImageMagnify.js");
/* harmony import */ var _Components_Theme_ImagePano__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Components/Theme/ImagePano */ "./src/Components/Theme/ImagePano.js");
/* harmony import */ var _ImageMapFront__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ImageMapFront */ "./src/Frontend/ImageMapFront.js");





const themeMap = {
  zoom: _Components_Theme_ZoomImage__WEBPACK_IMPORTED_MODULE_1__["default"],
  magnify: _Components_Theme_ImageMagnify__WEBPACK_IMPORTED_MODULE_2__["default"],
  pano: _Components_Theme_ImagePano__WEBPACK_IMPORTED_MODULE_3__["default"],
  map: _ImageMapFront__WEBPACK_IMPORTED_MODULE_4__["default"]
};
const Viewer = ({
  attributes,
  clientId,
  imageMapEle
}) => {
  const {
    viewerType
  } = attributes;
  const SelectedComponent = themeMap[viewerType];
  if (SelectedComponent) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SelectedComponent, {
      attributes: attributes,
      clientId: clientId,
      imageMapEle: imageMapEle
    });
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "No viewer found for type: ", viewerType);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Viewer);

/***/ }),

/***/ "./src/Style.js":
/*!**********************!*\
  !*** ./src/Style.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const Style = ({
  attributes,
  id
}) => {
  const {
    width,
    height,
    magnify,
    zoom
  } = attributes;
  const mainEl = `#${id}`;
  const magnifyp = `${mainEl} .magnify`;
  const magnifyLens = `${magnifyp} .magnify-lens`;
  const bpivbImageViewer = `${mainEl} .bpivbImageViewer`;

  //magnify Function
  const shadows = magnify?.shadow || [];
  const boxShadowValue = shadows?.map(data => {
    const {
      hOffset = '0px',
      vOffset = '0px',
      blur = '0px',
      spreed = '7px',
      color = 'rgba(255, 255, 255, 0.85)',
      isInset = false
    } = data;
    let shadowStr = `${hOffset} ${vOffset} ${blur} ${spreed} ${color}`;
    if (isInset) {
      shadowStr += `, inset 0 0 40px 2px rgba(0,0,0,0.25)`;
    }
    return shadowStr;
  }).join(', ');

  //zoom Class
  const bpivbZoomWapper = `${bpivbImageViewer} .bpivb-zoom-wapper`;

  //map className
  // const bpivbImageMap = `${bpivbImageViewer} .bpivbImageMap`;
  // const resizableDraggable = `${bpivbImageMap} .resizable-draggable`;

  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", {
    dangerouslySetInnerHTML: {
      __html: `
		${mainEl} {
			text-align:center;
		}
   ${bpivbZoomWapper}{
	    border: ${zoom?.border?.width} ${zoom?.border?.style} ${zoom?.border?.color};
	  }

		${mainEl} .bpivbPanorama{
			height:${height};
			width:${width};
		}
		${magnifyLens}{
		   width: ${magnify?.height}px;
       height:${magnify?.height}px;
       box-shadow:${boxShadowValue};
		}
	`
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Style);

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/utils/functions.js":
/*!********************************!*\
  !*** ./src/utils/functions.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getEditorDoc: () => (/* binding */ getEditorDoc),
/* harmony export */   pano: () => (/* binding */ pano),
/* harmony export */   updateStyle: () => (/* binding */ updateStyle),
/* harmony export */   zoomInt: () => (/* binding */ zoomInt)
/* harmony export */ });
/* harmony import */ var _panzoom_panzoom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @panzoom/panzoom */ "./node_modules/@panzoom/panzoom/dist/panzoom.es.js");

//helper functions
const getEditorDoc = () => {
  return document.querySelector('iframe[name="editor-canvas"]')?.contentDocument || document.querySelector("iframe.editor-canvas__iframe")?.contentDocument || document;
};
const zoomInt = (zoom, elem, setPanZoom) => {
  const {
    disablePan,
    disableZoom,
    disableXAxis,
    disableYAxis,
    duration,
    startScale,
    step
  } = zoom;
  if (!elem || !elem.parentElement) return;
  try {
    const pan = (0,_panzoom_panzoom__WEBPACK_IMPORTED_MODULE_0__["default"])(elem, {
      animate: false,
      canvas: false,
      // cursor: "move" ছিল — এখন dynamic করা হচ্ছে (নিচে event-এ)
      cursor: disableZoom ? "default" : "zoom-in",
      // Disable panning and zooming
      disablePan,
      disableZoom,
      // Pan only on the X or Y axes
      disableXAxis,
      disableYAxis,
      // Animation duration (ms)
      duration,
      // ok

      // CSS easing used for scale transition
      easing: "ease-in-out",
      // An array of elements to exclude
      exclude: [],
      // Or add the CSS class to element that should be excluded
      excludeClass: "panzoom-exclude",
      maxScale: 12,
      minScale: 0.125,
      // CSS overflow property
      overflow: "hidden",
      panOnlyWhenZoomed: false,
      pinchAndPan: true,
      relative: false,
      startX: 0,
      startY: 0,
      startScale,
      // ok
      step,
      // ok
      contain: null,
      touchAction: "none"
    });

    // ── Dynamic cursor: zoom-in → grab → grabbing ────────────────────────
    // Panzoom events ব্যবহার করে editor-এর মতো cursor দেখানো হচ্ছে
    const updateCursor = (scale, isPanning) => {
      if (disableZoom && disablePan) return;
      if (isPanning) {
        elem.style.cursor = "grabbing";
      } else if (scale > 1 && !disablePan) {
        elem.style.cursor = "grab";
      } else if (!disableZoom) {
        elem.style.cursor = "zoom-in";
      } else {
        elem.style.cursor = "default";
      }
    };

    // drag শুরু হলে → grabbing
    elem.addEventListener("panzoomstart", () => {
      updateCursor(pan.getScale(), true);
    });

    // drag শেষ বা zoom হলে → grab বা zoom-in
    elem.addEventListener("panzoomend", () => {
      updateCursor(pan.getScale(), false);
    });
    elem.addEventListener("panzoomchange", () => {
      if (!pan.isPanning?.()) {
        updateCursor(pan.getScale(), false);
      }
    });
    setPanZoom(pan);
    const parent = elem.parentElement;
    pan.parent = parent;
    parent.addEventListener("wheel", pan.zoomWithWheel, {
      passive: false
    });
  } catch (err) {
    console.warn("[ZoomImage] Panzoom init failed:", err.message);
  }
};
const pano = (clientId, img, autoRotate, rotateSpeed, hideControl) => {
  const doc = getEditorDoc();
  const panoContainer = doc.querySelector(`#${clientId} .bpivbPanorama`) || document.querySelector(`#${clientId} .bpivbPanorama`);
  if (!panoContainer) return;
  panoContainer.innerHTML = "";
  if (!img?.url || !window.BPIVB_REST) return;
  const apiUrl = `${window.BPIVB_REST.root}bpivb/v1/image-proxy?url=${encodeURIComponent(img.url)}`;
  fetch(apiUrl, {
    method: "GET",
    headers: {
      "X-WP-Nonce": window.BPIVB_REST.nonce
    },
    credentials: "same-origin"
  }).then(res => {
    if (!res.ok) {
      throw new Error("Image proxy request failed");
    }
    return res.blob();
  }).then(blob => {
    const imageSource = URL.createObjectURL(blob);

    /*DO NOT TOUCH – as requested */
    const panorama = new PANOLENS.ImagePanorama(imageSource);
    const viewer = new PANOLENS.Viewer({
      container: panoContainer,
      autoRotate,
      autoRotateSpeed: rotateSpeed,
      controlBar: hideControl
    });
    viewer.add(panorama);
    const isEditor = !!document.querySelector('iframe[name="editor-canvas"]') || !!document.querySelector('iframe.editor-canvas__iframe') || !!window?.wp?.blockEditor;
    if (isEditor) {
      const iframeDoc = panoContainer.ownerDocument;
      if (iframeDoc && iframeDoc !== document) {
        const eventsToForward = ["mousemove", "mouseup", "pointermove", "pointerup"];
        eventsToForward.forEach(eventName => {
          iframeDoc.addEventListener(eventName, e => {
            const clonedEvent = new e.constructor(e.type, e);
            document.dispatchEvent(clonedEvent);
          }, {
            passive: true
          });
        });
      }
    }
  }).catch(err => {
    console.error("Panorama load failed:", err);
  });
};
const updateStyle = (newStyle, attributes, setAttributes, allStyles) => {
  const newData = allStyles[newStyle] || {};
  if (newStyle === "zoom") {
    setAttributes({
      viewerType: newStyle,
      [newStyle]: {
        ...attributes[newStyle],
        ...newData
      }
    });
  } else if (newStyle === "magnify") {
    setAttributes({
      viewerType: newStyle,
      [newStyle]: {
        ...attributes[newStyle],
        ...newData
      }
    });
  } else if (newStyle === "map") {
    setAttributes({
      viewerType: newStyle,
      maps: allStyles?.maps
    });
  } else if (newStyle === "pano") {
    setAttributes({
      viewerType: newStyle,
      width: allStyles?.width || "100%",
      height: allStyles?.height || "320px",
      autoRotate: allStyles?.autoRotate || true,
      rotateSpeed: allStyles?.rotateSpeed || 2,
      hideControl: allStyles?.hideControl || true,
      autoPlay: allStyles?.autoPlay || true
    });
  }
};

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/Frontend/view.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../style.scss */ "./src/style.scss");
/* harmony import */ var _Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Style */ "./src/Style.js");
/* harmony import */ var _Viewer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Viewer */ "./src/Frontend/Viewer.js");
/* harmony import */ var _ImageMapFront__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ImageMapFront */ "./src/Frontend/ImageMapFront.js");







// Block Directory
document.addEventListener("DOMContentLoaded", () => {
  const allBlockDirectory = document.querySelectorAll(".wp-block-bpivb-image-viewer-directory");
  allBlockDirectory.forEach(directory => {
    const attributes = JSON.parse(directory.dataset.attributes);
    (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(directory).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Style__WEBPACK_IMPORTED_MODULE_3__["default"], {
      attributes: attributes,
      id: directory.id
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "bpivbImageViewer"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Render, {
      attributes: attributes,
      clientId: directory.id
    }))));
    directory?.removeAttribute("data-attributes");
  });
});
const Render = ({
  attributes,
  clientId
}) => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Viewer__WEBPACK_IMPORTED_MODULE_4__["default"], {
    attributes: attributes,
    clientId: clientId,
    MapComponent: _ImageMapFront__WEBPACK_IMPORTED_MODULE_5__["default"]
  });
};
})();

/******/ })()
;
//# sourceMappingURL=view.js.map