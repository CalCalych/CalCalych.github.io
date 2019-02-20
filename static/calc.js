// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"2tzG":[function(require,module,exports) {
var global = arguments[3];
;(function() {
"use strict"
function Vnode(tag, key, attrs0, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
	return node
}
Vnode.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode.normalize(children[i])
	}
	return children
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}
function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, attrs, children) {
	var hasAttrs = false, childList, text
	var className = attrs.className || attrs.class
	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}
		for(var key in attrs) {
			if (hasOwn.call(attrs, key)) {
				newAttrs[key] = attrs[key]
			}
		}
		attrs = newAttrs
	}
	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key)) {
			attrs[key] = state.attrs[key]
		}
	}
	if (className !== undefined) {
		if (attrs.class !== undefined) {
			attrs.class = undefined
			attrs.className = className
		}
		if (state.attrs.className != null) {
			attrs.className = state.attrs.className + " " + className
		}
	}
	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			hasAttrs = true
			break
		}
	}
	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		text = children[0].children
	} else {
		childList = children
	}
	return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
}
function hyperscript(selector) {
	// Because sloppy mode sucks
	var attrs = arguments[1], start = 2, children
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}
	if (typeof selector === "string") {
		var cached = selectorCache[selector] || compileSelector(selector)
	}
	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = 1
	}
	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}
	var normalized = Vnode.normalizeChildren(children)
	if (typeof selector === "string") {
		return execSelector(cached, attrs, normalized)
	} else {
		return Vnode(selector, attrs.key, attrs, normalized)
	}
}
hyperscript.trust = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function(attrs1, children) {
	return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
}
var m = hyperscript
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}
	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
	var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
	var PromisePolyfill = global.Promise
} else {
}
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""
	var args = []
	for (var key0 in object) {
		destructure(key0, object[key0])
	}
	return args.join("&")
	function destructure(key0, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}
var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
var _8 = function($window, Promise) {
	var callbackCount = 0
	var oncompletion
	function setCompletionCallback(callback) {oncompletion = callback}
	function finalizer() {
		var count = 0
		function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
		return function finalize(promise0) {
			var then0 = promise0.then
			promise0.then = function() {
				count++
				var next = then0.apply(promise0, arguments)
				next.then(complete, function(e) {
					complete()
					if (count === 0) throw e
				})
				return finalize(next)
			}
			return promise0
		}
	}
	function normalize(args, extra) {
		if (typeof args === "string") {
			var url = args
			args = extra || {}
			if (args.url == null) args.url = url
		}
		return args
	}
	function request(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			if (args.method == null) args.method = "GET"
			args.method = args.method.toUpperCase()
			var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
			if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
			if (typeof args.deserialize !== "function") args.deserialize = deserialize
			if (typeof args.extract !== "function") args.extract = extract
			args.url = interpolate(args.url, args.data)
			if (useBody) args.data = args.serialize(args.data)
			else args.url = assemble(args.url, args.data)
			var xhr = new $window.XMLHttpRequest(),
				aborted = false,
				_abort = xhr.abort
			xhr.abort = function abort() {
				aborted = true
				_abort.call(xhr)
			}
			xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
			if (args.serialize === JSON.stringify && useBody && !(args.headers && args.headers.hasOwnProperty("Content-Type"))) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (args.deserialize === deserialize && !(args.headers && args.headers.hasOwnProperty("Accept"))) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
				xhr.setRequestHeader(key, args.headers[key])
			}
			if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
			xhr.onreadystatechange = function() {
				// Don't throw errors on xhr.abort().
				if(aborted) return
				if (xhr.readyState === 4) {
					try {
						var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
							resolve(cast(args.type, response))
						}
						else {
							var error = new Error(xhr.responseText)
							for (var key in response) error[key] = response[key]
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}
			if (useBody && (args.data != null)) xhr.send(args.data)
			else xhr.send()
		})
		return args.background === true ? promise0 : finalize(promise0)
	}
	function jsonp(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				script.parentNode.removeChild(script)
				resolve(cast(args.type, data))
				delete $window[callbackName]
			}
			script.onerror = function() {
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
				delete $window[callbackName]
			}
			if (args.data == null) args.data = {}
			args.url = interpolate(args.url, args.data)
			args.data[args.callbackKey || "callback"] = callbackName
			script.src = assemble(args.url, args.data)
			$window.document.documentElement.appendChild(script)
		})
		return args.background === true? promise0 : finalize(promise0)
	}
	function interpolate(url, data) {
		if (data == null) return url
		var tokens = url.match(/:[^\/]+/gi) || []
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1)
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key])
			}
		}
		return url
	}
	function assemble(url, data) {
		var querystring = buildQueryString(data)
		if (querystring !== "") {
			var prefix = url.indexOf("?") < 0 ? "?" : "&"
			url += prefix + querystring
		}
		return url
	}
	function deserialize(data) {
		try {return data !== "" ? JSON.parse(data) : null}
		catch (e) {throw new Error(data)}
	}
	function extract(xhr) {return xhr.responseText}
	function cast(type0, data) {
		if (typeof type0 === "function") {
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type0(data[i])
				}
			}
			else return new type0(data)
		}
		return data
	}
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
}
var requestService = _8(window, PromisePolyfill)
var coreRenderer = function($window) {
	var $doc = $window.document
	var $emptyFragment = $doc.createDocumentFragment()
	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}
	var onevent
	function setEventCallback(callback) {return onevent = callback}
	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": return createText(parent, vnode, nextSibling)
				case "<": return createHTML(parent, vnode, nextSibling)
				case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
				default: return createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else return createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
		return vnode.dom
	}
	function createHTML(parent, vnode, nextSibling) {
		var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
		var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
		var temp = $doc.createElement(parent1)
		temp.innerHTML = vnode.children
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs2 = vnode.attrs
		var is = attrs2 && attrs2.is
		ns = getNameSpace(vnode) || ns
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element
		if (attrs2 != null) {
			setAttrs(vnode, attrs2, ns)
		}
		insertNode(parent, element, nextSibling)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				setLateAttrs(vnode)
			}
		}
		return element
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		vnode._state = vnode.state
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		initLifecycle(vnode._state, vnode, hooks)
		vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
			insertNode(parent, element, nextSibling)
			return element
		}
		else {
			vnode.domSize = 0
			return $emptyFragment
		}
	}
	//update
	function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
		else {
			if (old.length === vnodes.length) {
				var isUnkeyed = false
				for (var i = 0; i < vnodes.length; i++) {
					if (vnodes[i] != null && old[i] != null) {
						isUnkeyed = vnodes[i].key == null && old[i].key == null
						break
					}
				}
				if (isUnkeyed) {
					for (var i = 0; i < old.length; i++) {
						if (old[i] === vnodes[i]) continue
						else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
						else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
						else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
					}
					return
				}
			}
			recycling = recycling || isRecyclable(old, vnodes)
			if (recycling) {
				var pool = old.pool
				old = old.concat(old.pool)
			}
			var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldStart], v = vnodes[start]
				if (o === v && !recycling) oldStart++, start++
				else if (o == null) oldStart++
				else if (v == null) start++
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
					oldStart++, start++
					updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
				}
				else {
					var o = old[oldEnd]
					if (o === v && !recycling) oldEnd--, start++
					else if (o == null) oldEnd--
					else if (v == null) start++
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
						if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
						oldEnd--, start++
					}
					else break
				}
			}
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldEnd], v = vnodes[end]
				if (o === v && !recycling) oldEnd--, end--
				else if (o == null) oldEnd--
				else if (v == null) end--
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
					updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
					if (o.dom != null) nextSibling = o.dom
					oldEnd--, end--
				}
				else {
					if (!map) map = getKeyMap(old, oldEnd)
					if (v != null) {
						var oldIndex = map[v.key]
						if (oldIndex != null) {
							var movable = old[oldIndex]
							var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
							updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
							insertNode(parent, toFragment(movable), nextSibling)
							old[oldIndex].skip = true
							if (movable.dom != null) nextSibling = movable.dom
						}
						else {
							var dom = createNode(parent, v, hooks, ns, nextSibling)
							nextSibling = dom
						}
					}
					end--
				}
				if (end < start) break
			}
			createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
			removeNodes(old, oldStart, oldEnd + 1, vnodes)
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode._state = old._state
			vnode.events = old.events
			if (!recycling && shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					if (recycling) {
						vnode.state = {}
						initLifecycle(vnode.attrs, vnode, hooks)
					}
					else updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, nextSibling); break
					case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, recycling, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
		}
		else {
			removeNode(old, null)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, nextSibling) {
		if (old.children !== vnode.children) {
			toFragment(old)
			createHTML(parent, vnode, nextSibling)
		}
		else vnode.dom = old.dom, vnode.domSize = old.domSize
	}
	function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, recycling, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns
		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle0 multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else if (old.text != null && vnode.text != null && vnode.text !== "") {
			if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
		}
		else {
			if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
			if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		if (recycling) {
			initComponent(vnode, hooks)
		} else {
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
			updateLifecycle(vnode._state, vnode, hooks)
		}
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(old.instance, null)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function isRecyclable(old, vnodes) {
		if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
			var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
			var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
			var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
			if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
				return true
			}
		}
		return false
	}
	function getKeyMap(vnodes, end) {
		var map = {}, i = 0
		for (var i = 0; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				var key2 = vnode.key
				if (key2 != null) map[key2] = i
			}
		}
		return map
	}
	function toFragment(vnode) {
		var count0 = vnode.domSize
		if (count0 != null || vnode.dom == null) {
			var fragment = $doc.createDocumentFragment()
			if (count0 > 0) {
				var dom = vnode.dom
				while (--count0) fragment.appendChild(dom.nextSibling)
				fragment.insertBefore(dom, fragment.firstChild)
			}
			return fragment
		}
		else return vnode.dom
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}
	function insertNode(parent, dom, nextSibling) {
		if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}
	function setContentEditable(vnode) {
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
	}
	//remove
	function removeNodes(vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				if (vnode.skip) vnode.skip = false
				else removeNode(vnode, context)
			}
		}
	}
	function removeNode(vnode, context) {
		var expected = 1, called = 0
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
			var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		continuation()
		function continuation() {
			if (++called === expected) {
				onremove(vnode)
				if (vnode.dom) {
					var count0 = vnode.domSize || 1
					if (count0 > 1) {
						var dom = vnode.dom
						while (--count0) {
							removeNodeFromDOM(dom.nextSibling)
						}
					}
					removeNodeFromDOM(vnode.dom)
					if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
						if (!context.pool) context.pool = [vnode]
						else context.pool.push(vnode)
					}
				}
			}
		}
	}
	function removeNodeFromDOM(node) {
		var parent = node.parentNode
		if (parent != null) parent.removeChild(node)
	}
	function onremove(vnode) {
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
		if (typeof vnode.tag !== "string") {
			if (typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
			if (vnode.instance != null) onremove(vnode.instance)
		} else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode, attrs2, ns) {
		for (var key2 in attrs2) {
			setAttr(vnode, key2, null, attrs2[key2], ns)
		}
	}
	function setAttr(vnode, key2, old, value, ns) {
		var element = vnode.dom
		if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
		var nsLastIndex = key2.indexOf(":")
		if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
		}
		else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
		else if (key2 === "style") updateStyle(element, old, value)
		else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
			if (key2 === "value") {
				var normalized0 = "" + value // eslint-disable-line no-implicit-coercion
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select") {
					if (value === null) {
						if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
					} else {
						if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
					}
				}
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
			}
			// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
			if (vnode.tag === "input" && key2 === "type") {
				element.setAttribute(key2, value)
				return
			}
			element[key2] = value
		}
		else {
			if (typeof value === "boolean") {
				if (value) element.setAttribute(key2, "")
				else element.removeAttribute(key2)
			}
			else element.setAttribute(key2 === "className" ? "class" : key2, value)
		}
	}
	function setLateAttrs(vnode) {
		var attrs2 = vnode.attrs
		if (vnode.tag === "select" && attrs2 != null) {
			if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
			if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
		}
	}
	function updateAttrs(vnode, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
			}
		}
		if (old != null) {
			for (var key2 in old) {
				if (attrs2 == null || !(key2 in attrs2)) {
					if (key2 === "className") key2 = "class"
					if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
					else if (key2 !== "key") vnode.dom.removeAttribute(key2)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function isCustomElement(vnode){
		return vnode.attrs.is || vnode.tag.indexOf("-") > -1
	}
	function hasIntegrationMethods(source) {
		return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
	}
	//style
	function updateStyle(element, old, style) {
		if (old === style) element.style.cssText = "", old = null
		if (style == null) element.style.cssText = ""
		else if (typeof style === "string") element.style.cssText = style
		else {
			if (typeof old === "string") element.style.cssText = ""
			for (var key2 in style) {
				element.style[key2] = style[key2]
			}
			if (old != null && typeof old !== "string") {
				for (var key2 in old) {
					if (!(key2 in style)) element.style[key2] = ""
				}
			}
		}
	}
	//event
	function updateEvent(vnode, key2, value) {
		var element = vnode.dom
		var callback = typeof onevent !== "function" ? value : function(e) {
			var result = value.call(element, e)
			onevent.call(element, e)
			return result
		}
		if (key2 in element) element[key2] = typeof value === "function" ? callback : null
		else {
			var eventName = key2.slice(2)
			if (vnode.events === undefined) vnode.events = {}
			if (vnode.events[key2] === callback) return
			if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
			if (typeof value === "function") {
				vnode.events[key2] = callback
				element.addEventListener(eventName, vnode.events[key2], false)
			}
		}
	}
	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
		if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		var forceVnodeUpdate, forceComponentUpdate
		if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
			return true
		}
		return false
	}
	function render(dom, vnodes) {
		if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = $doc.activeElement
		var namespace = dom.namespaceURI
		// First time0 rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""
		if (!Array.isArray(vnodes)) vnodes = [vnodes]
		updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		dom.vnodes = vnodes
		// document.activeElement can return null in IE https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
		if (active != null && $doc.activeElement !== active) active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
	return {render: render, setEventCallback: setEventCallback}
}
function throttle(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16
	var last = 0, pending = null
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
	return function() {
		var now = Date.now()
		if (last === 0 || now - last >= time) {
			last = now
			callback()
		}
		else if (pending === null) {
			pending = timeout(function() {
				pending = null
				callback()
				last = Date.now()
			}, time - (now - last))
		}
	}
}
var _11 = function($window) {
	var renderService = coreRenderer($window)
	renderService.setEventCallback(function(e) {
		if (e.redraw === false) e.redraw = undefined
		else redraw()
	})
	var callbacks = []
	function subscribe(key1, callback) {
		unsubscribe(key1)
		callbacks.push(key1, throttle(callback))
	}
	function unsubscribe(key1) {
		var index = callbacks.indexOf(key1)
		if (index > -1) callbacks.splice(index, 2)
	}
	function redraw() {
		for (var i = 1; i < callbacks.length; i += 2) {
			callbacks[i]()
		}
	}
	return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
}
var redrawService = _11(window)
requestService.setCompletionCallback(redrawService.redraw)
var _16 = function(redrawService0) {
	return function(root, component) {
		if (component === null) {
			redrawService0.render(root, [])
			redrawService0.unsubscribe(root)
			return
		}
		
		if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
		
		var run0 = function() {
			redrawService0.render(root, Vnode(component))
		}
		redrawService0.subscribe(root, run0)
		redrawService0.redraw()
	}
}
m.mount = _16(redrawService)
var Promise = PromisePolyfill
var parseQueryString = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)
	var entries = string.split("&"), data0 = {}, counters = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key5 = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
		if (value === "true") value = true
		else if (value === "false") value = false
		var levels = key5.split(/\]\[?|\[/)
		var cursor = data0
		if (key5.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			var isValue = j === levels.length - 1
			if (level === "") {
				var key5 = levels.slice(0, j).join()
				if (counters[key5] == null) counters[key5] = 0
				level = counters[key5]++
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {}
			}
			cursor = cursor[level]
		}
	}
	return data0
}
var coreRouter = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function"
	var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
	function normalize1(fragment0) {
		var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
		if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
		return data
	}
	var asyncId
	function debounceAsync(callback0) {
		return function() {
			if (asyncId != null) return
			asyncId = callAsync0(function() {
				asyncId = null
				callback0()
			})
		}
	}
	function parsePath(path, queryData, hashData) {
		var queryIndex = path.indexOf("?")
		var hashIndex = path.indexOf("#")
		var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
		if (queryIndex > -1) {
			var queryEnd = hashIndex > -1 ? hashIndex : path.length
			var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
			for (var key4 in queryParams) queryData[key4] = queryParams[key4]
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1))
			for (var key4 in hashParams) hashData[key4] = hashParams[key4]
		}
		return path.slice(0, pathEnd)
	}
	var router = {prefix: "#!"}
	router.getPath = function() {
		var type2 = router.prefix.charAt(0)
		switch (type2) {
			case "#": return normalize1("hash").slice(router.prefix.length)
			case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
			default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
		}
	}
	router.setPath = function(path, data, options) {
		var queryData = {}, hashData = {}
		path = parsePath(path, queryData, hashData)
		if (data != null) {
			for (var key4 in data) queryData[key4] = data[key4]
			path = path.replace(/:([^\/]+)/g, function(match2, token) {
				delete queryData[token]
				return data[token]
			})
		}
		var query = buildQueryString(queryData)
		if (query) path += "?" + query
		var hash = buildQueryString(hashData)
		if (hash) path += "#" + hash
		if (supportsPushState) {
			var state = options ? options.state : null
			var title = options ? options.title : null
			$window.onpopstate()
			if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
			else $window.history.pushState(state, title, router.prefix + path)
		}
		else $window.location.href = router.prefix + path
	}
	router.defineRoutes = function(routes, resolve, reject) {
		function resolveRoute() {
			var path = router.getPath()
			var params = {}
			var pathname = parsePath(path, params, params)
			var state = $window.history.state
			if (state != null) {
				for (var k in state) params[k] = state[k]
			}
			for (var route0 in routes) {
				var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route0.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						}
						resolve(routes[route0], params, path, route0)
					})
					return
				}
			}
			reject(path, params)
		}
		if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
		else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
		resolveRoute()
	}
	return router
}
var _20 = function($window, redrawService0) {
	var routeService = coreRouter($window)
	var identity = function(v) {return v}
	var render1, component, attrs3, currentPath, lastUpdate
	var route = function(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		var run1 = function() {
			if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
		}
		var bail = function(path) {
			if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
			else throw new Error("Could not resolve default route " + defaultRoute)
		}
		routeService.defineRoutes(routes, function(payload, params, path) {
			var update = lastUpdate = function(routeResolver, comp) {
				if (update !== lastUpdate) return
				component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
				attrs3 = params, currentPath = path, lastUpdate = null
				render1 = (routeResolver.render || identity).bind(routeResolver)
				run1()
			}
			if (payload.view || typeof payload === "function") update({}, payload)
			else {
				if (payload.onmatch) {
					Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
						update(payload, resolved)
					}, bail)
				}
				else update(payload, "div")
			}
		}, bail)
		redrawService0.subscribe(root, run1)
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		routeService.setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = function(prefix0) {routeService.prefix = prefix0}
	route.link = function(vnode1) {
		vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
		vnode1.dom.onclick = function(e) {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
			e.preventDefault()
			e.redraw = false
			var href = this.getAttribute("href")
			if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
			route.set(href, undefined, undefined)
		}
	}
	route.param = function(key3) {
		if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
		return attrs3
	}
	return route
}
m.route = _20(window, redrawService)
m.withAttr = function(attrName, callback1, context) {
	return function(e) {
		callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
	}
}
var _28 = coreRenderer(window)
m.render = _28.render
m.redraw = redrawService.redraw
m.request = requestService.request
m.jsonp = requestService.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.version = "1.1.6"
m.vnode = Vnode
if (typeof module !== "undefined") module["exports"] = m
else window.m = m
}());
},{}],"7FPw":[function(require,module,exports) {
/* eslint-disable */
;(function() {
"use strict"
/* eslint-enable */

var guid = 0, HALT = {}
function createStream() {
	function stream() {
		if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0])
		return stream._state.value
	}
	initStream(stream)

	if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0])

	return stream
}
function initStream(stream) {
	stream.constructor = createStream
	stream._state = {id: guid++, value: undefined, state: 0, derive: undefined, recover: undefined, deps: {}, parents: [], endStream: undefined, unregister: undefined}
	stream.map = stream["fantasy-land/map"] = map, stream["fantasy-land/ap"] = ap, stream["fantasy-land/of"] = createStream
	stream.valueOf = valueOf, stream.toJSON = toJSON, stream.toString = valueOf

	Object.defineProperties(stream, {
		end: {get: function() {
			if (!stream._state.endStream) {
				var endStream = createStream()
				endStream.map(function(value) {
					if (value === true) {
						unregisterStream(stream)
						endStream._state.unregister = function(){unregisterStream(endStream)}
					}
					return value
				})
				stream._state.endStream = endStream
			}
			return stream._state.endStream
		}}
	})
}
function updateStream(stream, value) {
	updateState(stream, value)
	for (var id in stream._state.deps) updateDependency(stream._state.deps[id], false)
	if (stream._state.unregister != null) stream._state.unregister()
	finalize(stream)
}
function updateState(stream, value) {
	stream._state.value = value
	stream._state.changed = true
	if (stream._state.state !== 2) stream._state.state = 1
}
function updateDependency(stream, mustSync) {
	var state = stream._state, parents = state.parents
	if (parents.length > 0 && parents.every(active) && (mustSync || parents.some(changed))) {
		var value = stream._state.derive()
		if (value === HALT) return false
		updateState(stream, value)
	}
}
function finalize(stream) {
	stream._state.changed = false
	for (var id in stream._state.deps) stream._state.deps[id]._state.changed = false
}

function combine(fn, streams) {
	if (!streams.every(valid)) throw new Error("Ensure that each item passed to stream.combine/stream.merge is a stream")
	return initDependency(createStream(), streams, function() {
		return fn.apply(this, streams.concat([streams.filter(changed)]))
	})
}

function initDependency(dep, streams, derive) {
	var state = dep._state
	state.derive = derive
	state.parents = streams.filter(notEnded)

	registerDependency(dep, state.parents)
	updateDependency(dep, true)

	return dep
}
function registerDependency(stream, parents) {
	for (var i = 0; i < parents.length; i++) {
		parents[i]._state.deps[stream._state.id] = stream
		registerDependency(stream, parents[i]._state.parents)
	}
}
function unregisterStream(stream) {
	for (var i = 0; i < stream._state.parents.length; i++) {
		var parent = stream._state.parents[i]
		delete parent._state.deps[stream._state.id]
	}
	for (var id in stream._state.deps) {
		var dependent = stream._state.deps[id]
		var index = dependent._state.parents.indexOf(stream)
		if (index > -1) dependent._state.parents.splice(index, 1)
	}
	stream._state.state = 2 //ended
	stream._state.deps = {}
}

function map(fn) {return combine(function(stream) {return fn(stream())}, [this])}
function ap(stream) {return combine(function(s1, s2) {return s1()(s2())}, [stream, this])}
function valueOf() {return this._state.value}
function toJSON() {return this._state.value != null && typeof this._state.value.toJSON === "function" ? this._state.value.toJSON() : this._state.value}

function valid(stream) {return stream._state }
function active(stream) {return stream._state.state === 1}
function changed(stream) {return stream._state.changed}
function notEnded(stream) {return stream._state.state !== 2}

function merge(streams) {
	return combine(function() {
		return streams.map(function(s) {return s()})
	}, streams)
}

function scan(reducer, seed, stream) {
	var newStream = combine(function (s) {
		return seed = reducer(seed, s._state.value)
	}, [stream])

	if (newStream._state.state === 0) newStream(seed)

	return newStream
}

function scanMerge(tuples, seed) {
	var streams = tuples.map(function(tuple) {
		var stream = tuple[0]
		if (stream._state.state === 0) stream(undefined)
		return stream
	})

	var newStream = combine(function() {
		var changed = arguments[arguments.length - 1]

		streams.forEach(function(stream, idx) {
			if (changed.indexOf(stream) > -1) {
				seed = tuples[idx][1](seed, stream._state.value)
			}
		})

		return seed
	}, streams)

	return newStream
}

createStream["fantasy-land/of"] = createStream
createStream.merge = merge
createStream.combine = combine
createStream.scan = scan
createStream.scanMerge = scanMerge
createStream.HALT = HALT

if (typeof module !== "undefined") module["exports"] = createStream
else if (typeof window.m === "function" && !("stream" in window.m)) window.m.stream = createStream
else window.m = {stream : createStream}

}());

},{}],"D3FL":[function(require,module,exports) {
"use strict"

module.exports = require("./stream/stream")

},{"./stream/stream":"7FPw"}],"FaWJ":[function(require,module,exports) {
module.exports = {
  products: [{
    "name": "\u0410\u0431\u0440\u0438\u043A\u043E\u0441\u043E\u0432\u044B\u0439 \u0441\u043E\u043A",
    "prot": 0.9,
    "fat": 0.2,
    "carb": 9.2,
    "kcal": 39.0,
    "gi": 55.0
  }, {
    "name": "\u0410\u0431\u0440\u0438\u043A\u043E\u0441\u044B",
    "prot": 0.7,
    "fat": 0.0,
    "carb": 10.1,
    "kcal": 44.0,
    "gi": 30.0
  }, {
    "name": "\u0410\u0432\u043E\u043A\u0430\u0434\u043E",
    "prot": 2.0,
    "fat": 15.0,
    "carb": 9.0,
    "kcal": 160.0,
    "gi": 10.0
  }, {
    "name": "\u0410\u0433\u0430\u0432\u0430 (\u0441\u0438\u0440\u043E\u043F)",
    "prot": 0.0,
    "fat": 0.5,
    "carb": 76.0,
    "kcal": 310.0,
    "gi": 15.0
  }, {
    "name": "\u0410\u0439\u0432\u0430",
    "prot": 0.6,
    "fat": 0.0,
    "carb": 8.7,
    "kcal": 37.0,
    "gi": 35.0
  }, {
    "name": "\u0410\u043B\u044B\u0447\u0430",
    "prot": 0.3,
    "fat": 0.0,
    "carb": 7.6,
    "kcal": 35.0,
    "gi": 35.0
  }, {
    "name": "\u0410\u043D\u0430\u043D\u0430\u0441",
    "prot": 0.3,
    "fat": 0.0,
    "carb": 11.9,
    "kcal": 49.0,
    "gi": 70.0
  }, {
    "name": "\u0410\u043D\u0430\u043D\u0430\u0441\u043E\u0432\u044B\u0439 \u0441\u043E\u043A",
    "prot": 0.2,
    "fat": 0.2,
    "carb": 11.4,
    "kcal": 48.0,
    "gi": 55.0
  }, {
    "name": "\u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D",
    "prot": 0.8,
    "fat": 0.0,
    "carb": 8.6,
    "kcal": 38.0,
    "gi": 50.0
  }, {
    "name": "\u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D\u043E\u0432\u044B\u0439 \u0441\u043E\u043A",
    "prot": 0.9,
    "fat": 0.1,
    "carb": 8.4,
    "kcal": 36.0,
    "gi": 65.0
  }, {
    "name": "\u0410\u0440\u0430\u0445\u0438\u0441",
    "prot": 26.2,
    "fat": 49.0,
    "carb": 16.0,
    "kcal": 567.0,
    "gi": 15.0
  }, {
    "name": "\u0410\u0440\u0430\u0445\u0438\u0441\u043E\u0432\u0430\u044F \u043F\u0430\u0441\u0442\u0430 \u0431\u0441",
    "prot": 25.0,
    "fat": 50.0,
    "carb": 20.0,
    "kcal": 588.0,
    "gi": 20.0
  }, {
    "name": "\u0410\u0440\u0431\u0443\u0437",
    "prot": 0.6,
    "fat": 0.2,
    "carb": 8.0,
    "kcal": 30.0,
    "gi": 75.0
  }, {
    "name": "\u0410\u0440\u0442\u0438\u0448\u043E\u043A",
    "prot": 1.2,
    "fat": 0.1,
    "carb": 6.0,
    "kcal": 28.0,
    "gi": 20.0
  }, {
    "name": "\u0411\u0430\u0437\u0438\u043B\u0438\u043A",
    "prot": 3.2,
    "fat": 0.6,
    "carb": 2.7,
    "kcal": 22.0,
    "gi": 5.0
  }, {
    "name": "\u0411\u0430\u043A\u043B\u0430\u0436\u0430\u043D\u044B",
    "prot": 1.0,
    "fat": 0.2,
    "carb": 6.0,
    "kcal": 25.0,
    "gi": 20.0
  }, {
    "name": "\u0411\u0430\u043D\u0430\u043D\u044B",
    "prot": 1.7,
    "fat": 0.0,
    "carb": 22.1,
    "kcal": 87.0,
    "gi": 60.0
  }, {
    "carb": 0.0,
    "prot": 16.2,
    "name": "\u0411\u0430\u0440\u0430\u043D\u0438\u043D\u0430",
    "fat": 15.3,
    "kcal": 201.0
  }, {
    "name": "\u0411\u0430\u0440\u0430\u043D\u043A\u0438",
    "prot": 16.4,
    "fat": 1.1,
    "carb": 69.7,
    "kcal": 342.0,
    "gi": 95.0
  }, {
    "carb": 0.0,
    "prot": 13.6,
    "name": "\u0411\u0430\u0440\u0430\u043D\u044C\u0435 \u0421\u0435\u0440\u0434\u0446\u0435",
    "fat": 2.7,
    "kcal": 85.0
  }, {
    "carb": 0.0,
    "prot": 13.4,
    "name": "\u0411\u0430\u0440\u0430\u043D\u044C\u0438 \u041F\u043E\u0447\u043A\u0438",
    "fat": 2.6,
    "kcal": 78.0
  }, {
    "carb": 0.0,
    "prot": 18.9,
    "name": "\u0411\u0430\u0440\u0430\u043D\u044C\u044F \u041F\u0435\u0447\u0435\u043D\u044C",
    "fat": 2.8,
    "kcal": 102.0
  }, {
    "name": "\u0411\u0430\u0442\u043E\u043D \u043D\u0430\u0440\u0435\u0437\u043D\u043E\u0439",
    "prot": 9.4,
    "fat": 2.7,
    "carb": 50.7,
    "kcal": 261.0,
    "gi": 100.0
  }, {
    "name": "\u0411\u0435\u043B\u044B\u0435 \u0441\u0432\u0435\u0436\u0438\u0435",
    "prot": 3.3,
    "fat": 1.5,
    "carb": 2.4,
    "kcal": 32.0,
    "gi": 15.0
  }, {
    "name": "\u0411\u0435\u043B\u044B\u0435 \u0441\u0443\u0448\u0435\u043D\u044B\u0435",
    "prot": 23.8,
    "fat": 6.8,
    "carb": 30.2,
    "kcal": 277.0,
    "gi": 15.0
  }, {
    "name": "\u0411\u043E\u0431\u044B",
    "prot": 6.1,
    "fat": 0.1,
    "carb": 8.1,
    "kcal": 59.0,
    "gi": 25.0
  }, {
    "carb": 1.0,
    "prot": 0.0,
    "name": "\u0411\u0440\u0435\u043D\u0434\u0438",
    "fat": 0.0,
    "kcal": 225.0
  }, {
    "name": "\u0411\u0440\u043E\u043A\u043A\u043E\u043B\u0438",
    "prot": 3.0,
    "fat": 0.4,
    "carb": 5.2,
    "kcal": 28.0,
    "gi": 15.0
  }, {
    "name": "\u0411\u0440\u0443\u0441\u043D\u0438\u043A\u0430",
    "prot": 0.6,
    "fat": 0.0,
    "carb": 8.8,
    "kcal": 42.0,
    "gi": 30.0
  }, {
    "name": "\u0411\u0440\u044E\u043A\u0432\u0430",
    "prot": 1.2,
    "fat": 0.1,
    "carb": 8.4,
    "kcal": 38.0,
    "gi": 40.0
  }, {
    "name": "\u0411\u0443\u0431\u043B\u0438\u043A\u0438",
    "prot": 16.4,
    "fat": 1.1,
    "carb": 69.7,
    "kcal": 342.0,
    "gi": 95.0
  }, {
    "name": "\u0411\u0443\u043B\u043E\u0447\u043A\u0430",
    "prot": 7.4,
    "fat": 1.8,
    "carb": 43.7,
    "kcal": 218.0,
    "gi": 95.0
  }, {
    "carb": 5.1,
    "prot": 12.7,
    "name": "\u0411\u044B\u0447\u043A\u0438",
    "fat": 8.2,
    "kcal": 147.0
  }, {
    "name": "\u0412\u0430\u0440\u0435\u043D\u044C\u0435",
    "prot": 0.4,
    "fat": 0.2,
    "carb": 74.5,
    "kcal": 286.0,
    "gi": 65.0
  }, {
    "name": "\u0412\u0430\u0444\u043B\u0438",
    "prot": 8.2,
    "fat": 19.8,
    "carb": 53.1,
    "kcal": 425.0,
    "gi": 75.0
  }, {
    "carb": 15.9,
    "prot": 0.0,
    "name": "\u0412\u0435\u0440\u043C\u0443\u0442",
    "fat": 0.0,
    "kcal": 155.0
  }, {
    "name": "\u0412\u0435\u0448\u0435\u043D\u043A\u0438 \u0441\u0432\u0435\u0436\u0438\u0435",
    "prot": 2.5,
    "fat": 0.5,
    "carb": 6.2,
    "kcal": 34.0,
    "gi": 15.0
  }, {
    "carb": 20.0,
    "prot": 0.5,
    "name": "\u0412\u0438\u043D\u043E \u0434\u0435\u0441\u0435\u0440\u0442\u043D\u043E\u0435",
    "fat": 0.0,
    "kcal": 175.0
  }, {
    "carb": 5.0,
    "prot": 0.2,
    "name": "\u0412\u0438\u043D\u043E \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435",
    "fat": 0.0,
    "kcal": 88.0
  }, {
    "carb": 2.5,
    "prot": 0.3,
    "name": "\u0412\u0438\u043D\u043E \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435",
    "fat": 0.0,
    "kcal": 78.0
  }, {
    "carb": 0.2,
    "prot": 0.2,
    "name": "\u0412\u0438\u043D\u043E \u0441\u0442\u043E\u043B\u043E\u0432\u043E\u0435",
    "fat": 0.0,
    "kcal": 67.0
  }, {
    "carb": 0.0,
    "prot": 0.0,
    "name": "\u0412\u0438\u043D\u043E \u0441\u0443\u0445\u043E\u0435",
    "fat": 0.0,
    "kcal": 66.0
  }, {
    "name": "\u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434",
    "prot": 0.5,
    "fat": 0.0,
    "carb": 17.8,
    "kcal": 73.0,
    "gi": 55.0
  }, {
    "name": "\u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434\u043D\u044B\u0439 \u0441\u043E\u043A",
    "prot": 0.3,
    "fat": 0.0,
    "carb": 14.5,
    "kcal": 56.0,
    "gi": 55.0
  }, {
    "carb": 0.0,
    "prot": 0.0,
    "name": "\u0412\u0438\u0441\u043A\u0438",
    "fat": 0.0,
    "kcal": 222.0
  }, {
    "name": "\u0412\u0438\u0448\u043D\u0435\u0432\u044B\u0439 \u0441\u043E\u043A",
    "prot": 0.5,
    "fat": 0.0,
    "carb": 10.6,
    "kcal": 49.0,
    "gi": 55.0
  }, {
    "name": "\u0412\u0438\u0448\u043D\u044F",
    "prot": 0.9,
    "fat": 0.0,
    "carb": 11.1,
    "kcal": 46.0,
    "gi": 25.0
  }, {
    "carb": 0.1,
    "prot": 0.0,
    "name": "\u0412\u043E\u0434\u043A\u0430",
    "fat": 0.0,
    "kcal": 234.0
  }, {
    "name": "\u0413\u0435\u043C\u0430\u0442\u043E\u0433\u0435\u043D",
    "prot": 6.2,
    "fat": 2.8,
    "carb": 75.5,
    "kcal": 352.0,
    "gi": 90.0
  }, {
    "carb": 0.0,
    "prot": 18.7,
    "name": "\u0413\u043E\u0432\u044F\u0434\u0438\u043D\u0430",
    "fat": 12.6,
    "kcal": 191.0
  }, {
    "carb": 0.0,
    "prot": 13.4,
    "name": "\u0413\u043E\u0432\u044F\u0436\u0438\u0439 \u042F\u0437\u044B\u043A",
    "fat": 12.1,
    "kcal": 160.0
  }, {
    "carb": 0.0,
    "prot": 12.1,
    "name": "\u0413\u043E\u0432\u044F\u0436\u044C\u0435 \u0412\u044B\u043C\u044F",
    "fat": 13.8,
    "kcal": 176.0
  }, {
    "carb": 0.0,
    "prot": 15.2,
    "name": "\u0413\u043E\u0432\u044F\u0436\u044C\u0435 \u0421\u0435\u0440\u0434\u0446\u0435",
    "fat": 3.1,
    "kcal": 89.0
  }, {
    "carb": 0.0,
    "prot": 9.3,
    "name": "\u0413\u043E\u0432\u044F\u0436\u044C\u0438 \u041C\u043E\u0437\u0433\u0438",
    "fat": 9.6,
    "kcal": 126.0
  }, {
    "carb": 0.0,
    "prot": 12.4,
    "name": "\u0413\u043E\u0432\u044F\u0436\u044C\u0438 \u041F\u043E\u0447\u043A\u0438",
    "fat": 1.9,
    "kcal": 67.0
  }, {
    "carb": 0.0,
    "prot": 17.6,
    "name": "\u0413\u043E\u0432\u044F\u0436\u044C\u044F \u041F\u0435\u0447\u0435\u043D\u044C",
    "fat": 3.2,
    "kcal": 100.0
  }, {
    "name": "\u0413\u043E\u043B\u0443\u0431\u0438\u043A\u0430",
    "prot": 1.1,
    "fat": 0.0,
    "carb": 7.4,
    "kcal": 35.0,
    "gi": 30.0
  }, {
    "carb": 0.0,
    "prot": 21.2,
    "name": "\u0413\u043E\u0440\u0431\u0443\u0448\u0430",
    "fat": 7.1,
    "kcal": 151.0
  }, {
    "name": "\u0413\u043E\u0440\u043E\u0445 \u0441\u0443\u0445\u043E\u0439",
    "prot": 20.5,
    "fat": 2.0,
    "carb": 53.3,
    "kcal": 298.0,
    "gi": 25.0
  }, {
    "name": "\u0413\u043E\u0440\u043E\u0448\u0435\u043A \u0437\u0435\u043B\u0435\u043D\u044B\u0439",
    "prot": 5.4,
    "fat": 0.2,
    "carb": 13.6,
    "kcal": 75.0,
    "gi": 35.0
  }, {
    "name": "\u0413\u043E\u0440\u043E\u0448\u0435\u043A \u043A\u043E\u043D\u0441\u0435\u0440\u0432",
    "prot": 3.6,
    "fat": 0.1,
    "carb": 9.8,
    "kcal": 55.0,
    "gi": 45.0
  }, {
    "name": "\u0413\u043E\u0440\u0447\u0438\u0446\u0430",
    "prot": 5.7,
    "fat": 6.4,
    "carb": 22.0,
    "kcal": 162.0,
    "gi": 55.0
  }, {
    "name": "\u0413\u0440\u0430\u043D\u0430\u0442",
    "prot": 0.9,
    "fat": 0.0,
    "carb": 11.9,
    "kcal": 53.0,
    "gi": 35.0
  }, {
    "name": "\u0413\u0440\u0430\u043D\u0430\u0442\u043E\u0432\u044B\u0439 \u0441\u043E\u043A",
    "prot": 0.2,
    "fat": 0.0,
    "carb": 14.0,
    "kcal": 58.0,
    "gi": 35.0
  }, {
    "name": "\u0413\u0440\u0435\u0439\u043F\u0444\u0440\u0443\u0442",
    "prot": 0.8,
    "fat": 0.0,
    "carb": 7.5,
    "kcal": 37.0,
    "gi": 45.0
  }, {
    "name": "\u0413\u0440\u0435\u0446\u043A\u0438\u0439 \u043E\u0440\u0435\u0445",
    "prot": 15.0,
    "fat": 65.0,
    "carb": 14.0,
    "kcal": 654.0,
    "gi": 15.0
  }, {
    "name": "\u0413\u0440\u0435\u0447\u043A\u0430",
    "prot": 12.6,
    "fat": 3.3,
    "carb": 62.1,
    "kcal": 313.0,
    "gi": 50.0
  }, {
    "name": "\u0413\u0440\u0435\u0447\u043A\u0430 \u0437\u0435\u043B\u0435\u043D\u0430\u044F",
    "prot": 12.6,
    "fat": 3.3,
    "carb": 62.1,
    "kcal": 313.0,
    "gi": 50.0
  }, {
    "name": "\u0413\u0440\u0435\u0447\u043D\u0435\u0432\u0430\u044F \u043A\u0430\u0448\u0430",
    "prot": 4.5,
    "fat": 1.6,
    "carb": 27.4,
    "kcal": 137.0,
    "gi": 50.0
  }, {
    "name": "\u0413\u0440\u0443\u0448\u0430",
    "prot": 0.5,
    "fat": 0.0,
    "carb": 10.6,
    "kcal": 41.0,
    "gi": 30.0
  }, {
    "carb": 0.0,
    "prot": 16.4,
    "name": "\u0413\u0443\u0441\u0438",
    "fat": 33.1,
    "kcal": 359.0
  }, {
    "carb": 0.0,
    "prot": 0.0,
    "name": "\u0414\u0436\u0438\u043D",
    "fat": 0.0,
    "kcal": 223.0
  }, {
    "name": "\u0414\u0440\u0430\u0436\u0435 \u0444\u0440\u0443\u043A\u0442\u043E\u0432\u043E\u0435",
    "prot": 3.7,
    "fat": 10.3,
    "carb": 73.4,
    "kcal": 388.0,
    "gi": 100.0
  }, {
    "name": "\u0414\u044B\u043D\u044F",
    "prot": 0.8,
    "fat": 0.3,
    "carb": 7.3,
    "kcal": 34.0,
    "gi": 75.0
  }, {
    "name": "\u0415\u0436\u0435\u0432\u0438\u043A\u0430",
    "prot": 1.9,
    "fat": 0.0,
    "carb": 5.1,
    "kcal": 31.0,
    "gi": 20.0
  }, {
    "carb": 0.0,
    "prot": 0.0,
    "name": "\u0416\u0438\u0440 \u043A\u0443\u0440\u0438\u043D\u044B\u0439",
    "fat": 99.7,
    "kcal": 896.0
  }, {
    "carb": 0.0,
    "prot": 0.0,
    "name": "\u0416\u0438\u0440 \u0441\u0432\u0438\u043D\u043E\u0439 \u0442\u043E\u043F\u043B\u0435\u043D\u044B\u0439",
    "fat": 99.5,
    "kcal": 882.0
  }, {
    "carb": 0.0,
    "prot": 0.0,
    "name": "\u0417\u0435\u043B\u0435\u043D\u044B\u0439 \u0447\u0430\u0439",
    "fat": 0.0,
    "kcal": 0.0
  }, {
    "name": "\u0417\u0435\u043C\u043B\u044F\u043D\u0438\u043A\u0430",
    "prot": 1.9,
    "fat": 0.0,
    "carb": 7.1,
    "kcal": 40.0,
    "gi": 25.0
  }, {
    "name": "\u0417\u0435\u0444\u0438\u0440",
    "prot": 0.7,
    "fat": 0.0,
    "carb": 77.3,
    "kcal": 295.0,
    "gi": 100.0
  }, {
    "name": "\u0418\u0437\u044E\u043C \u043A\u0438\u0448\u043C\u0438\u0448",
    "prot": 2.5,
    "fat": 0.0,
    "carb": 71.4,
    "kcal": 285.0,
    "gi": 65.0
  }, {
    "name": "\u0418\u0437\u044E\u043C \u0441 \u043A\u043E\u0441\u0442\u043E\u0447\u043A\u043E\u0439",
    "prot": 1.7,
    "fat": 0.0,
    "carb": 70.7,
    "kcal": 273.0,
    "gi": 65.0
  }, {
    "carb": 0.0,
    "prot": 31.6,
    "name": "\u0418\u043A\u0440\u0430 \u043A\u0435\u0442\u044B",
    "fat": 13.7,
    "kcal": 250.0
  }, {
    "carb": 0.0,
    "prot": 24.6,
    "name": "\u0418\u043A\u0440\u0430 \u043B\u0435\u0449\u0435\u0432\u0430\u044F",
    "fat": 4.9,
    "kcal": 144.0
  }, {
    "carb": 0.0,
    "prot": 28.3,
    "name": "\u0418\u043A\u0440\u0430 \u043C\u0438\u043D\u0442\u0430\u044F",
    "fat": 1.8,
    "kcal": 127.0
  }, {
    "carb": 0.0,
    "prot": 36.3,
    "name": "\u0418\u043A\u0440\u0430 \u043E\u0441\u0435\u0442\u0440\u043E\u0432\u0430\u044F",
    "fat": 10.1,
    "kcal": 235.0
  }, {
    "name": "\u0418\u043C\u0431\u0438\u0440\u044C",
    "prot": 1.8,
    "fat": 0.8,
    "carb": 18.0,
    "kcal": 80.0,
    "gi": 15.0
  }, {
    "carb": 0.6,
    "prot": 21.1,
    "name": "\u0418\u043D\u0434\u0435\u0439\u043A\u0430",
    "fat": 12.3,
    "kcal": 192.0
  }, {
    "name": "\u0418\u043D\u0436\u0438\u0440",
    "prot": 0.9,
    "fat": 0.0,
    "carb": 13.7,
    "kcal": 57.0,
    "gi": 50.0
  }, {
    "name": "\u0418\u0440\u0438\u0441",
    "prot": 3.1,
    "fat": 7.7,
    "carb": 81.2,
    "kcal": 384.0,
    "gi": 100.0
  }, {
    "name": "\u0419\u043E\u0433\u0443\u0440\u0442 1.5%",
    "prot": 4.3,
    "fat": 1.5,
    "carb": 8.4,
    "kcal": 65.0,
    "gi": 35.0
  }, {
    "name": "\u0419\u043E\u0433\u0443\u0440\u0442 3.2%",
    "prot": 5.0,
    "fat": 3.2,
    "carb": 8.9,
    "kcal": 87.0,
    "gi": 35.0
  }, {
    "name": "\u041A\u0430\u0431\u0430\u0447\u043A\u0438",
    "prot": 1.2,
    "fat": 0.3,
    "carb": 3.1,
    "kcal": 17.0,
    "gi": 15.0
  }, {
    "carb": 33.1,
    "prot": 24.0,
    "name": "\u041A\u0430\u043A\u0430\u043E \u043D\u0430 \u043C\u043E\u043B\u043E\u043A\u0435",
    "fat": 17.0,
    "kcal": 377.0
  }, {
    "carb": 0.0,
    "prot": 18.2,
    "name": "\u041A\u0430\u043B\u044C\u043C\u0430\u0440",
    "fat": 0.2,
    "kcal": 77.0
  }, {
    "carb": 0.0,
    "prot": 16.0,
    "name": "\u041A\u0430\u043C\u0431\u0430\u043B\u0430",
    "fat": 2.5,
    "kcal": 86.0
  }, {
    "name": "\u041A\u0430\u043F\u0443\u0441\u0442\u0430 \u0431\u0435\u043B\u043E\u043A\u043E\u0447\u0430\u043D\u043D\u0430\u044F",
    "prot": 1.3,
    "fat": 0.1,
    "carb": 6.0,
    "kcal": 25.0,
    "gi": 15.0
  }, {
    "name": "\u041A\u0430\u043F\u0443\u0441\u0442\u0430 \u0431\u0440\u044E\u0441\u0441\u0435\u043B\u044C\u0441\u043A\u0430\u044F",
    "prot": 3.4,
    "fat": 0.3,
    "carb": 9.0,
    "kcal": 43.0,
    "gi": 15.0
  }, {
    "name": "\u041A\u0430\u043F\u0443\u0441\u0442\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u043A\u043E\u0447\u0430\u043D\u043D\u0430\u044F",
    "prot": 1.4,
    "fat": 0.2,
    "carb": 7.0,
    "kcal": 31.0,
    "gi": 15.0
  }, {
    "name": "\u041A\u0430\u043F\u0443\u0441\u0442\u0430 \u0446\u0432\u0435\u0442\u043D\u0430\u044F",
    "prot": 1.9,
    "fat": 0.3,
    "carb": 5.0,
    "kcal": 25.0,
    "gi": 15.0
  }, {
    "name": "\u041A\u0430\u0440\u0430\u043C\u0435\u043B\u044C",
    "prot": 0.0,
    "fat": 0.2,
    "carb": 77.3,
    "kcal": 291.0,
    "gi": 100.0
  }, {
    "carb": 0.0,
    "prot": 17.5,
    "name": "\u041A\u0430\u0440\u0430\u0441\u044C",
    "fat": 1.6,
    "kcal": 84.0
  }, {
    "carb": 0.0,
    "prot": 16.0,
    "name": "\u041A\u0430\u0440\u043F",
    "fat": 3.5,
    "kcal": 95.0
  }, {
    "name": "\u041A\u0430\u0440\u0442\u043E\u0444\u0435\u043B\u044C \u0432\u0430\u0440\u0435\u043D\u044B\u0439",
    "prot": 2.0,
    "fat": 0.3,
    "carb": 16.5,
    "kcal": 80.0,
    "gi": 65.0
  }, {
    "name": "\u041A\u0430\u0440\u0442\u043E\u0444\u0435\u043B\u044C \u0436\u0430\u0440\u0435\u043D\u044B\u0439",
    "prot": 2.6,
    "fat": 9.7,
    "carb": 23.5,
    "kcal": 198.0,
    "gi": 95.0
  }, {
    "name": "\u041A\u0430\u0440\u0442\u043E\u0444\u0435\u043B\u044C \u043C\u043E\u043B\u043E\u0434\u043E\u0439",
    "prot": 2.2,
    "fat": 0.3,
    "carb": 12.5,
    "kcal": 57.0,
    "gi": 95.0
  }, {
    "carb": 5.0,
    "prot": 0.2,
    "name": "\u041A\u0432\u0430\u0441 \u0445\u043B\u0435\u0431\u043D\u044B\u0439",
    "fat": 0.0,
    "kcal": 26.0
  }, {
    "name": "\u041A\u0435\u0434\u0440\u043E\u0432\u044B\u0439 \u043E\u0440\u0435\u0445",
    "prot": 14.0,
    "fat": 68.0,
    "carb": 13.0,
    "kcal": 673.0,
    "gi": 15.0
  }, {
    "carb": 0.0,
    "prot": 22.1,
    "name": "\u041A\u0435\u0442\u0430",
    "fat": 5.8,
    "kcal": 138.0
  }, {
    "name": "\u041A\u0435\u0442\u0447\u0443\u043F",
    "prot": 1.3,
    "fat": 0.2,
    "carb": 26.0,
    "kcal": 112.0,
    "gi": 55.0
  }, {
    "name": "\u041A\u0435\u0444\u0438\u0440 0%",
    "prot": 2.8,
    "fat": 0.0,
    "carb": 3.8,
    "kcal": 29.0,
    "gi": 30.0
  }, {
    "name": "\u041A\u0435\u0444\u0438\u0440 1%",
    "prot": 2.8,
    "fat": 1.0,
    "carb": 4.0,
    "kcal": 37.0,
    "gi": 30.0
  }, {
    "name": "\u041A\u0435\u0444\u0438\u0440 2.5%",
    "prot": 3.0,
    "fat": 2.5,
    "carb": 4.0,
    "kcal": 51.0,
    "gi": 30.0
  }, {
    "name": "\u041A\u0435\u0444\u0438\u0440 3.2%",
    "prot": 3.2,
    "fat": 3.2,
    "carb": 4.1,
    "kcal": 57.0,
    "gi": 30.0
  }, {
    "name": "\u041A\u0435\u0448\u044C\u044E",
    "prot": 25.8,
    "fat": 54.3,
    "carb": 13.3,
    "kcal": 647.0,
    "gi": 15.0
  }, {
    "name": "\u041A\u0438\u0432\u0438",
    "prot": 1.0,
    "fat": 0.7,
    "carb": 9.7,
    "kcal": 46.0,
    "gi": 50.0
  }, {
    "name": "\u041A\u0438\u0437\u0438\u043B",
    "prot": 1.1,
    "fat": 0.0,
    "carb": 9.4,
    "kcal": 42.0,
    "gi": 35.0
  }, {
    "carb": 0.0,
    "prot": 14.3,
    "name": "\u041A\u0438\u043B\u044C\u043A\u0430",
    "fat": 9.2,
    "kcal": 142.0
  }, {
    "name": "\u041A\u043B\u0443\u0431\u043D\u0438\u043A\u0430",
    "prot": 0.6,
    "fat": 0.4,
    "carb": 7.0,
    "kcal": 30.0,
    "gi": 25.0
  }, {
    "name": "\u041A\u043B\u044E\u043A\u0432\u0430",
    "prot": 0.7,
    "fat": 0.0,
    "carb": 4.9,
    "kcal": 27.0,
    "gi": 50.0
  }, {
    "name": "\u041A\u043E\u043A\u043E\u0441",
    "prot": 3.3,
    "fat": 33.0,
    "carb": 15.0,
    "kcal": 354.0,
    "gi": 45.0
  }, {
    "name": "\u041A\u043E\u043B\u0430",
    "prot": 0.0,
    "fat": 0.0,
    "carb": 10.0,
    "kcal": 40.0,
    "gi": 100.0
  }, {
    "carb": 0.0,
    "prot": 13.4,
    "name": "\u041A\u043E\u043B\u0431\u0430\u0441\u0430 \u0414\u043E\u043A\u0442\u043E\u0440\u0441\u043A\u0430\u044F",
    "fat": 22.9,
    "kcal": 257.0
  }, {
    "carb": 0.0,
    "prot": 12.5,
    "name": "\u041A\u043E\u043B\u0431\u0430\u0441\u0430 \u041B\u044E\u0431\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0430\u044F",
    "fat": 28.3,
    "kcal": 311.0
  }, {
    "carb": 0.0,
    "prot": 11.1,
    "name": "\u041A\u043E\u043B\u0431\u0430\u0441\u0430 \u041C\u043E\u043B\u043E\u0447\u043D\u0430\u044F",
    "fat": 22.5,
    "kcal": 243.0
  }, {
    "carb": 0.0,
    "prot": 16.1,
    "name": "\u041A\u043E\u043B\u0431\u0430\u0441\u0430 \u0421\u0435\u0440\u0432\u0435\u043B\u0430\u0442",
    "fat": 40.2,
    "kcal": 423.0
  }, {
    "carb": 0.0,
    "prot": 27.1,
    "name": "\u041A\u043E\u043B\u0431\u0430\u0441\u043A\u0438 \u043E\u0445\u043E\u0442\u043D\u0438\u0447\u044C\u0438",
    "fat": 24.6,
    "kcal": 325.0
  }, {
    "carb": 0.0,
    "prot": 20.3,
    "name": "\u041A\u043E\u043D\u0438\u043D\u0430",
    "fat": 7.1,
    "kcal": 149.0
  }, {
    "name": "\u041A\u043E\u043D\u0444\u0435\u0442\u044B \u0448\u043E\u043A\u043E\u043B\u0430\u0434\u043D\u044B\u0435",
    "prot": 3.9,
    "fat": 39.7,
    "carb": 54.6,
    "kcal": 576.0,
    "gi": 90.0
  }, {
    "carb": 0.1,
    "prot": 0.0,
    "name": "\u041A\u043E\u043D\u044C\u044F\u043A",
    "fat": 0.0,
    "kcal": 240.0
  }, {
    "carb": 0.0,
    "prot": 15.3,
    "name": "\u041A\u043E\u0440\u044E\u0448\u043A\u0430",
    "fat": 3.3,
    "kcal": 93.0
  }, {
    "carb": 11.0,
    "prot": 0.8,
    "name": "\u041A\u043E\u0444\u0435 \u0441 \u043C\u043E\u043B\u043E\u043A\u043E\u043C",
    "fat": 1.0,
    "kcal": 56.0
  }, {
    "carb": 0.0,
    "prot": 16.0,
    "name": "\u041A\u0440\u0430\u0431\u043E\u0432\u043E\u0435 \u043C\u044F\u0441\u043E",
    "fat": 0.9,
    "kcal": 67.0
  }, {
    "carb": 0.0,
    "prot": 17.9,
    "name": "\u041A\u0440\u0430\u0431\u043E\u0432\u044B\u0435 \u043F\u0430\u043B\u043E\u0447\u043A\u0438",
    "fat": 2.1,
    "kcal": 73.0
  }, {
    "carb": 0.0,
    "prot": 18.5,
    "name": "\u041A\u0440\u0430\u0441\u043D\u043E\u043F\u0435\u0440\u043A\u0430",
    "fat": 3.1,
    "kcal": 106.0
  }, {
    "carb": 0.0,
    "prot": 18.0,
    "name": "\u041A\u0440\u0435\u0432\u0435\u0442\u043A\u0430",
    "fat": 0.9,
    "kcal": 85.0
  }, {
    "carb": 14.5,
    "prot": 10.6,
    "name": "\u041A\u0440\u043E\u0432\u044F\u043D\u043A\u0430",
    "fat": 17.8,
    "kcal": 261.0
  }, {
    "carb": 0.0,
    "prot": 20.6,
    "name": "\u041A\u0440\u043E\u043B\u0438\u043A",
    "fat": 12.8,
    "kcal": 197.0
  }, {
    "name": "\u041A\u0440\u044B\u0436\u043E\u0432\u043D\u0438\u043A",
    "prot": 0.7,
    "fat": 0.2,
    "carb": 12.0,
    "kcal": 43.0,
    "gi": 25.0
  }, {
    "name": "\u041A\u0443\u043A\u0443\u0440\u0443\u0437\u043D\u044B\u0435 \u0445\u043B\u043E\u043F\u044C\u044F",
    "prot": 6.5,
    "fat": 2.9,
    "carb": 83.8,
    "kcal": 372.0,
    "gi": 85.0
  }, {
    "name": "\u041A\u0443\u043A\u0443\u0440\u0443\u0437\u044B \u0437\u0451\u0440\u043D\u0430",
    "prot": 4.1,
    "fat": 2.3,
    "carb": 22.5,
    "kcal": 123.0,
    "gi": 55.0
  }, {
    "name": "\u041A\u0443\u043D\u0436\u0443\u0442",
    "prot": 19.4,
    "fat": 48.7,
    "carb": 12.2,
    "kcal": 565.0,
    "gi": 35.0
  }, {
    "name": "\u041A\u0443\u0440\u0430\u0433\u0430",
    "prot": 5.7,
    "fat": 0.0,
    "carb": 65.3,
    "kcal": 270.0,
    "gi": 40.0
  }, {
    "carb": 0.0,
    "prot": 21.3,
    "name": "\u041A\u0443\u0440\u0438\u0446\u0430 \u0431\u0435\u0434\u0440\u043E",
    "fat": 11.0,
    "kcal": 185.0
  }, {
    "carb": 0.0,
    "prot": 25.2,
    "name": "\u041A\u0443\u0440\u0438\u0446\u0430 \u0432\u0430\u0440\u0435\u043D\u0430\u044F",
    "fat": 7.4,
    "kcal": 170.0
  }, {
    "carb": 0.0,
    "prot": 27.0,
    "name": "\u041A\u0443\u0440\u0438\u0446\u0430 \u0433\u043E\u043B\u0435\u043D\u044C",
    "fat": 5.6,
    "kcal": 158.0
  }, {
    "carb": 0.0,
    "prot": 23.1,
    "name": "\u041A\u0443\u0440\u0438\u0446\u0430 \u0444\u0438\u043B\u0435",
    "fat": 1.2,
    "kcal": 110.0
  }, {
    "carb": 0.8,
    "prot": 20.4,
    "name": "\u041A\u0443\u0440\u044B",
    "fat": 8.6,
    "kcal": 161.0
  }, {
    "name": "\u041A\u0443\u0441\u043A\u0443\u0441",
    "prot": 12.8,
    "fat": 0.6,
    "carb": 72.4,
    "kcal": 376.0,
    "gi": 70.0
  }, {
    "name": "\u041B\u0430\u0432\u0430\u0448 \u0430\u0440\u043C\u044F\u043D\u0441\u043A\u0438\u0439",
    "prot": 7.7,
    "fat": 1.1,
    "carb": 47.8,
    "kcal": 239.0,
    "gi": 90.0
  }, {
    "carb": 0.0,
    "prot": 15.6,
    "name": "\u041B\u0435\u0434\u044F\u043D\u0430\u044F",
    "fat": 1.3,
    "kcal": 76.0
  }, {
    "carb": 0.0,
    "prot": 17.2,
    "name": "\u041B\u0435\u0449",
    "fat": 4.2,
    "kcal": 109.0
  }, {
    "carb": 53.0,
    "prot": 0.0,
    "name": "\u041B\u0438\u043A\u0435\u0440",
    "fat": 0.0,
    "kcal": 344.0
  }, {
    "name": "\u041B\u0438\u043C\u043E\u043D",
    "prot": 0.9,
    "fat": 0.0,
    "carb": 3.3,
    "kcal": 30.0,
    "gi": 40.0
  }, {
    "name": "\u041B\u0438\u043C\u043E\u043D\u0430\u0434",
    "prot": 0.0,
    "fat": 0.0,
    "carb": 6.1,
    "kcal": 24.0,
    "gi": 100.0
  }, {
    "name": "\u041B\u0438\u043C\u043E\u043D\u043D\u044B\u0439 \u0441\u043E\u043A",
    "prot": 1.0,
    "fat": 0.1,
    "carb": 3.2,
    "kcal": 18.0,
    "gi": 20.0
  }, {
    "name": "\u041B\u0438\u0441\u0438\u0447\u043A\u0438 \u0441\u0432\u0435\u0436\u0438\u0435",
    "prot": 1.5,
    "fat": 1.0,
    "carb": 2.4,
    "kcal": 22.0,
    "gi": 15.0
  }, {
    "name": "\u041B\u0438\u0441\u0438\u0447\u043A\u0438 \u0441\u0443\u0448\u0435\u043D\u044B\u0435",
    "prot": 22.0,
    "fat": 7.2,
    "carb": 25.4,
    "kcal": 268.0,
    "gi": 15.0
  }, {
    "name": "\u041B\u0438\u0447\u0438",
    "prot": 0.8,
    "fat": 0.4,
    "carb": 17.0,
    "kcal": 66.0,
    "gi": 50.0
  }, {
    "carb": 0.0,
    "prot": 19.2,
    "name": "\u041B\u043E\u0441\u043E\u0441\u044C",
    "fat": 13.8,
    "kcal": 200.0
  }, {
    "name": "\u041B\u0443\u043A \u0437\u0435\u043B\u0435\u043D\u044B\u0439 (\u043F\u0435\u0440\u043E)",
    "prot": 1.1,
    "fat": 0.1,
    "carb": 9.0,
    "kcal": 40.0,
    "gi": 15.0
  }, {
    "name": "\u041B\u0443\u043A \u043F\u043E\u0440\u0435\u0439",
    "prot": 1.5,
    "fat": 0.3,
    "carb": 14.0,
    "kcal": 61.0,
    "gi": 15.0
  }, {
    "name": "\u041B\u0443\u043A \u0440\u0435\u043F\u0447\u0430\u0442\u044B\u0439",
    "prot": 1.6,
    "fat": 0.0,
    "carb": 9.3,
    "kcal": 41.0,
    "gi": 15.0
  }, {
    "name": "\u041B\u0451\u043D",
    "prot": 18.3,
    "fat": 42.2,
    "carb": 28.9,
    "kcal": 534.0,
    "gi": 35.0
  }, {
    "name": "\u041C\u0430\u0439\u043E\u043D\u0435\u0437 67%",
    "prot": 3.3,
    "fat": 67.0,
    "carb": 2.4,
    "kcal": 624.0,
    "gi": 60.0
  }, {
    "name": "\u041C\u0430\u043A",
    "prot": 17.5,
    "fat": 47.5,
    "carb": 2.0,
    "kcal": 505.0,
    "gi": 35.0
  }, {
    "name": "\u041C\u0430\u043A\u0430\u0440\u043E\u043D\u044B \u043C\u044F\u0433\u043A",
    "prot": 10.4,
    "fat": 1.1,
    "carb": 69.7,
    "kcal": 337.0,
    "gi": 70.0
  }, {
    "name": "\u041C\u0430\u043A\u0430\u0440\u043E\u043D\u044B \u0441\u0432\u0430\u0440\u0435\u043D\u043D\u044B\u0435",
    "prot": 3.4,
    "fat": 0.4,
    "carb": 23.1,
    "kcal": 111.0,
    "gi": 40.0
  }, {
    "name": "\u041C\u0430\u043A\u0430\u0440\u043E\u043D\u044B \u0442\u0432\u0435\u0440\u0434",
    "prot": 10.4,
    "fat": 1.1,
    "carb": 69.7,
    "kcal": 337.0,
    "gi": 40.0
  }, {
    "carb": 0.0,
    "prot": 20.2,
    "name": "\u041C\u0430\u043A\u0440\u0435\u043B\u044C",
    "fat": 3.6,
    "kcal": 111.0
  }, {
    "name": "\u041C\u0430\u043B\u0438\u043D\u0430",
    "prot": 0.7,
    "fat": 0.0,
    "carb": 9.2,
    "kcal": 43.0,
    "gi": 25.0
  }, {
    "name": "\u041C\u0430\u043D\u0433\u043E",
    "prot": 0.6,
    "fat": 0.4,
    "carb": 11.8,
    "kcal": 69.0,
    "gi": 50.0
  }, {
    "name": "\u041C\u0430\u043D\u0434\u0430\u0440\u0438\u043D",
    "prot": 0.9,
    "fat": 0.0,
    "carb": 8.8,
    "kcal": 39.0,
    "gi": 30.0
  }, {
    "name": "\u041C\u0430\u043D\u043A\u0430",
    "prot": 10.3,
    "fat": 1.0,
    "carb": 67.4,
    "kcal": 328.0,
    "gi": 70.0
  }, {
    "name": "\u041C\u0430\u043D\u043D\u0430\u044F \u043A\u0430\u0448\u0430",
    "prot": 2.5,
    "fat": 0.3,
    "carb": 16.4,
    "kcal": 77.0,
    "gi": 70.0
  }, {
    "name": "\u041C\u0430\u0440\u0430\u043A\u0443\u0439\u044F",
    "prot": 2.2,
    "fat": 0.7,
    "carb": 23.0,
    "kcal": 97.0,
    "gi": 30.0
  }, {
    "carb": 0.0,
    "prot": 0.5,
    "name": "\u041C\u0430\u0440\u0433\u0430\u0440\u0438\u043D \u0441\u043B\u0438\u0432\u043E\u0447\u043D\u044B\u0439",
    "fat": 82.3,
    "kcal": 746.0
  }, {
    "carb": 0.9,
    "prot": 0.5,
    "name": "\u041C\u0430\u0440\u0433\u0430\u0440\u0438\u043D \u0441\u0442\u043E\u043B\u043E\u0432\u044B\u0439",
    "fat": 82.0,
    "kcal": 744.0
  }, {
    "name": "\u041C\u0430\u0440\u043C\u0435\u043B\u0430\u0434",
    "prot": 0.0,
    "fat": 0.2,
    "carb": 77.1,
    "kcal": 289.0,
    "gi": 65.0
  }, {
    "carb": 0.0,
    "prot": 0.0,
    "name": "\u041C\u0430\u0441\u043B\u043E \u043B\u044C\u043D\u044F\u043D\u043E\u0435",
    "fat": 99.8,
    "kcal": 898.0
  }, {
    "carb": 0.0,
    "prot": 0.0,
    "name": "\u041C\u0430\u0441\u043B\u043E \u043E\u043B\u0438\u0432\u043A\u043E\u0432\u043E\u0435",
    "fat": 99.8,
    "kcal": 898.0
  }, {
    "carb": 0.0,
    "prot": 0.0,
    "name": "\u041C\u0430\u0441\u043B\u043E \u043F\u043E\u0434\u0441\u043E\u043B\u043D\u0435\u0447\u043D\u043E\u0435",
    "fat": 99.9,
    "kcal": 899.0
  }, {
    "carb": 1.0,
    "prot": 0.5,
    "name": "\u041C\u0430\u0441\u043B\u043E \u0441\u043B\u0438\u0432\u043E\u0447\u043D\u043E\u0435 82.5%",
    "fat": 82.5,
    "kcal": 747.0
  }, {
    "carb": 0.5,
    "prot": 0.4,
    "name": "\u041C\u0430\u0441\u043B\u043E \u0442\u043E\u043F\u043B\u0435\u043D\u043E\u0435",
    "fat": 98.1,
    "kcal": 885.0
  }, {
    "name": "\u041C\u0430\u0441\u043B\u044F\u0442\u0430 \u0441\u0432\u0435\u0436\u0438\u0435",
    "prot": 2.5,
    "fat": 0.7,
    "carb": 1.5,
    "kcal": 12.0,
    "gi": 15.0
  }, {
    "name": "\u041C\u0435\u0434",
    "prot": 0.6,
    "fat": 0.0,
    "carb": 80.5,
    "kcal": 312.0,
    "gi": 90.0
  }, {
    "carb": 0.0,
    "prot": 9.7,
    "name": "\u041C\u0438\u0434\u0438\u0438 \u043E\u0442\u0432\u0430\u0440\u043D\u044B\u0435",
    "fat": 1.6,
    "kcal": 53.0
  }, {
    "name": "\u041C\u0438\u043D\u0434\u0430\u043B\u044C",
    "prot": 18.3,
    "fat": 57.9,
    "carb": 13.4,
    "kcal": 643.0,
    "gi": 15.0
  }, {
    "carb": 0.0,
    "prot": 15.7,
    "name": "\u041C\u0438\u043D\u0442\u0430\u0439",
    "fat": 0.6,
    "kcal": 67.0
  }, {
    "carb": 0.0,
    "prot": 13.1,
    "name": "\u041C\u043E\u0439\u0432\u0430",
    "fat": 11.7,
    "kcal": 159.0
  }, {
    "name": "\u041C\u043E\u043B\u043E\u043A\u043E 0%",
    "prot": 2.8,
    "fat": 0.0,
    "carb": 4.6,
    "kcal": 34.0,
    "gi": 30.0
  }, {
    "name": "\u041C\u043E\u043B\u043E\u043A\u043E 1%",
    "prot": 2.8,
    "fat": 1.0,
    "carb": 4.6,
    "kcal": 43.0,
    "gi": 30.0
  }, {
    "name": "\u041C\u043E\u043B\u043E\u043A\u043E 2.5%",
    "prot": 2.8,
    "fat": 2.5,
    "carb": 4.6,
    "kcal": 53.0,
    "gi": 30.0
  }, {
    "name": "\u041C\u043E\u043B\u043E\u043A\u043E 3.2%",
    "prot": 2.8,
    "fat": 3.2,
    "carb": 4.6,
    "kcal": 58.0,
    "gi": 30.0
  }, {
    "name": "\u041C\u043E\u043B\u043E\u043A\u043E \u043A\u043E\u0437\u044C\u0435 \u0441\u044B\u0440\u043E\u0435",
    "prot": 3.1,
    "fat": 4.2,
    "carb": 4.7,
    "kcal": 71.0,
    "gi": 30.0
  }, {
    "name": "\u041C\u043E\u043B\u043E\u043A\u043E \u043A\u043E\u0440\u043E\u0432\u044C\u0435 \u0441\u044B\u0440\u043E\u0435",
    "prot": 3.2,
    "fat": 3.6,
    "carb": 4.7,
    "kcal": 63.0,
    "gi": 30.0
  }, {
    "name": "\u041C\u043E\u043B\u043E\u043A\u043E \u043E\u0431\u0435\u0437\u0436\u0438\u0440\u0435\u043D\u043D\u043E\u0435",
    "prot": 2.1,
    "fat": 0.1,
    "carb": 4.5,
    "kcal": 30.0,
    "gi": 30.0
  }, {
    "name": "\u041C\u043E\u043B\u043E\u043A\u043E \u0441\u0433\u0443\u0449\u0435\u043D\u043D\u043E\u0435",
    "prot": 7.3,
    "fat": 7.7,
    "carb": 9.7,
    "kcal": 139.0,
    "gi": 100.0
  }, {
    "name": "\u041C\u043E\u043B\u043E\u043A\u043E \u0441\u0443\u0445\u043E\u0435 \u0446\u0435\u043B\u044C\u043D\u043E\u0435",
    "prot": 25.2,
    "fat": 25.0,
    "carb": 39.6,
    "kcal": 477.0,
    "gi": 30.0
  }, {
    "name": "\u041C\u043E\u0440\u043A\u043E\u0432\u043D\u044B\u0439 \u0441\u043E\u043A",
    "prot": 1.0,
    "fat": 0.1,
    "carb": 6.5,
    "kcal": 31.0,
    "gi": 40.0
  }, {
    "name": "\u041C\u043E\u0440\u043A\u043E\u0432\u044C",
    "prot": 1.3,
    "fat": 0.1,
    "carb": 6.3,
    "kcal": 29.0,
    "gi": 20.0
  }, {
    "name": "\u041C\u043E\u0440\u043E\u0436\u0435\u043D\u043E\u0435 \u043F\u043B\u043E\u043C\u0431\u0438\u0440",
    "prot": 3.6,
    "fat": 15.1,
    "carb": 20.5,
    "kcal": 223.0,
    "gi": 60.0
  }, {
    "name": "\u041C\u043E\u0440\u043E\u0436\u0435\u043D\u043E\u0435 \u0441\u043B\u0438\u0432\u043E\u0447\u043D\u043E\u0435",
    "prot": 3.6,
    "fat": 10.0,
    "carb": 19.5,
    "kcal": 182.0,
    "gi": 60.0
  }, {
    "name": "\u041C\u043E\u0440\u043E\u0436\u0435\u043D\u043E\u0435 \u044D\u0441\u043A\u0438\u043C\u043E",
    "prot": 3.6,
    "fat": 20.0,
    "carb": 19.5,
    "kcal": 278.0,
    "gi": 60.0
  }, {
    "name": "\u041C\u043E\u0440\u043E\u0448\u043A\u0430",
    "prot": 0.9,
    "fat": 0.0,
    "carb": 6.9,
    "kcal": 33.0,
    "gi": 35.0
  }, {
    "name": "\u041C\u0443\u043A\u0430 \u043F\u0448\u0435\u043D. I \u0441\u043E\u0440\u0442\u0430",
    "prot": 10.6,
    "fat": 1.4,
    "carb": 73.6,
    "kcal": 329.0,
    "gi": 65.0
  }, {
    "name": "\u041C\u0443\u043A\u0430 \u043F\u0448\u0435\u043D. II \u0441\u043E\u0440\u0442\u0430",
    "prot": 11.6,
    "fat": 1.9,
    "carb": 70.7,
    "kcal": 328.0,
    "gi": 65.0
  }, {
    "name": "\u041C\u0443\u043A\u0430 \u043F\u0448\u0435\u043D. \u0432\u0441",
    "prot": 10.4,
    "fat": 0.8,
    "carb": 74.5,
    "kcal": 324.0,
    "gi": 65.0
  }, {
    "name": "\u041C\u0443\u043A\u0430 \u0440\u0436\u0430\u043D\u0430\u044F",
    "prot": 6.8,
    "fat": 1.2,
    "carb": 76.8,
    "kcal": 321.0,
    "gi": 65.0
  }, {
    "name": "\u041C\u0443\u043A\u0430 \u0441\u043E\u0435\u0432\u0430\u044F",
    "prot": 48.9,
    "fat": 1.0,
    "carb": 21.7,
    "kcal": 291.0,
    "gi": 25.0
  }, {
    "carb": 0.0,
    "prot": 16.71,
    "name": "\u041D\u0430\u0432\u0430\u0433\u0430",
    "fat": 1.3,
    "kcal": 78.0
  }, {
    "carb": 0.0,
    "prot": 18.6,
    "name": "\u041D\u0430\u043B\u0438\u043C",
    "fat": 0.8,
    "kcal": 85.0
  }, {
    "name": "\u041D\u0443\u0442",
    "prot": 19.0,
    "fat": 6.0,
    "carb": 61.0,
    "kcal": 364.0,
    "gi": 35.0
  }, {
    "name": "\u041E\u0431\u043B\u0435\u043F\u0438\u0445\u0430",
    "prot": 0.8,
    "fat": 0.0,
    "carb": 5.6,
    "kcal": 31.0,
    "gi": 35.0
  }, {
    "name": "\u041E\u0432\u0441\u044F\u043D\u0430\u044F \u043A\u0430\u0448\u0430",
    "prot": 3.2,
    "fat": 1.8,
    "carb": 15.4,
    "kcal": 93.0,
    "gi": 60.0
  }, {
    "name": "\u041E\u0432\u0441\u044F\u043D\u044B\u0435 \u0445\u043B\u043E\u043F\u044C\u044F",
    "prot": 11.9,
    "fat": 7.5,
    "carb": 69.1,
    "kcal": 358.0,
    "gi": 40.0
  }, {
    "name": "\u041E\u0433\u0443\u0440\u0446\u044B \u0433\u0440\u0443\u043D\u0442\u043E\u0432\u044B\u0435",
    "prot": 0.7,
    "fat": 0.0,
    "carb": 3.1,
    "kcal": 15.0,
    "gi": 15.0
  }, {
    "name": "\u041E\u0433\u0443\u0440\u0446\u044B \u043F\u0430\u0440\u043D\u0438\u043A\u043E\u0432\u044B\u0435",
    "prot": 0.7,
    "fat": 0.0,
    "carb": 1.6,
    "kcal": 9.0,
    "gi": 15.0
  }, {
    "carb": 0.0,
    "prot": 17.4,
    "name": "\u041E\u043A\u0443\u043D\u044C \u043C\u043E\u0440\u0441\u043A\u043E\u0439",
    "fat": 5.5,
    "kcal": 123.0
  }, {
    "carb": 0.0,
    "prot": 18.3,
    "name": "\u041E\u043A\u0443\u043D\u044C \u0440\u0435\u0447\u043D\u043E\u0439",
    "fat": 0.7,
    "kcal": 80.0
  }, {
    "name": "\u041E\u043B\u0438\u0432\u043A\u0438",
    "prot": 0.6,
    "fat": 10.2,
    "carb": 6.7,
    "kcal": 111.0,
    "gi": 15.0
  }, {
    "carb": 1.7,
    "prot": 9.7,
    "name": "\u041E\u043C\u043B\u0435\u0442",
    "fat": 15.5,
    "kcal": 181.0
  }, {
    "name": "\u041E\u043F\u044F\u0442\u0430 \u0441\u0432\u0435\u0436\u0438\u0435",
    "prot": 2.4,
    "fat": 1.0,
    "carb": 2.5,
    "kcal": 25.0,
    "gi": 15.0
  }, {
    "carb": 0.0,
    "prot": 16.5,
    "name": "\u041E\u0441\u0435\u0442\u0440",
    "fat": 10.5,
    "kcal": 161.0
  }, {
    "carb": 0.0,
    "prot": 18.5,
    "name": "\u041E\u0441\u044C\u043C\u0438\u043D\u043E\u0433",
    "fat": 0.0,
    "kcal": 74.0
  }, {
    "name": "\u041E\u0442\u0440\u0443\u0431\u0438",
    "prot": 17.0,
    "fat": 7.0,
    "carb": 66.0,
    "kcal": 246.0,
    "gi": 15.0
  }, {
    "carb": 0.0,
    "prot": 18.5,
    "name": "\u041F\u0430\u043B\u0442\u0443\u0441",
    "fat": 3.2,
    "kcal": 106.0
  }, {
    "name": "\u041F\u0430\u043C\u0435\u043B\u043E",
    "prot": 0.6,
    "fat": 0.1,
    "carb": 6.1,
    "kcal": 29.0,
    "gi": 45.0
  }, {
    "name": "\u041F\u0430\u0441\u0442\u0438\u043B\u0430",
    "prot": 0.6,
    "fat": 0.0,
    "carb": 80.1,
    "kcal": 301.0,
    "gi": 100.0
  }, {
    "name": "\u041F\u0435\u0440\u0435\u0446 \u0437\u0435\u043B\u0435\u043D\u044B\u0439 \u0441\u043B\u0430\u0434\u043A\u0438\u0439",
    "prot": 1.2,
    "fat": 0.0,
    "carb": 4.8,
    "kcal": 24.0,
    "gi": 15.0
  }, {
    "name": "\u041F\u0435\u0440\u0435\u0446 \u043A\u0440\u0430\u0441\u043D\u044B\u0439 \u0441\u043B\u0430\u0434\u043A\u0438\u0439",
    "prot": 1.2,
    "fat": 0.0,
    "carb": 5.5,
    "kcal": 26.0,
    "gi": 15.0
  }, {
    "name": "\u041F\u0435\u0440\u0435\u0446 \u0447\u0438\u043B\u0438",
    "prot": 1.9,
    "fat": 0.4,
    "carb": 9.0,
    "kcal": 40.0,
    "gi": 15.0
  }, {
    "name": "\u041F\u0435\u0440\u043B\u043E\u0432\u0430\u044F \u043A\u0430\u0448\u0430",
    "prot": 3.2,
    "fat": 0.5,
    "carb": 22.7,
    "kcal": 102.0,
    "gi": 30.0
  }, {
    "name": "\u041F\u0435\u0440\u043B\u043E\u0432\u0430\u044F \u043A\u0440\u0443\u043F\u0430",
    "prot": 9.3,
    "fat": 1.1,
    "carb": 73.7,
    "kcal": 320.0,
    "gi": 30.0
  }, {
    "name": "\u041F\u0435\u0440\u0441\u0438\u043A\u0438",
    "prot": 0.9,
    "fat": 0.0,
    "carb": 10.1,
    "kcal": 42.0,
    "gi": 35.0
  }, {
    "name": "\u041F\u0435\u0440\u0441\u0438\u043A\u043E\u0432\u044B\u0439 \u0441\u043E\u043A",
    "prot": 0.8,
    "fat": 0.1,
    "carb": 9.1,
    "kcal": 37.0,
    "gi": 55.0
  }, {
    "name": "\u041F\u0435\u0441\u0442\u043E",
    "prot": 5.0,
    "fat": 45.0,
    "carb": 6.0,
    "kcal": 454.0,
    "gi": 15.0
  }, {
    "name": "\u041F\u0435\u0442\u0440\u0443\u0448\u043A\u0430 (\u0437\u0435\u043B\u0435\u043D\u044C)",
    "prot": 3.8,
    "fat": 0.0,
    "carb": 8.0,
    "kcal": 45.0,
    "gi": 5.0
  }, {
    "name": "\u041F\u0435\u0442\u0440\u0443\u0448\u043A\u0430 (\u043A\u043E\u0440\u0435\u043D\u044C)",
    "prot": 1.6,
    "fat": 0.0,
    "carb": 11.2,
    "kcal": 48.0,
    "gi": 5.0
  }, {
    "name": "\u041F\u0435\u0447\u0435\u043D\u044C\u0435 \u043E\u0432\u0441\u044F\u043D\u043E\u0435",
    "prot": 6.5,
    "fat": 14.1,
    "carb": 71.4,
    "kcal": 430.0,
    "gi": 90.0
  }, {
    "name": "\u041F\u0435\u0447\u0435\u043D\u044C\u0435 \u0441\u0434\u043E\u0431\u043D\u043E\u0435",
    "prot": 10.5,
    "fat": 5.2,
    "carb": 76.0,
    "kcal": 447.0,
    "gi": 95.0
  }, {
    "carb": 3.5,
    "prot": 0.6,
    "name": "\u041F\u0438\u0432\u043E 3.0%",
    "fat": 0.0,
    "kcal": 37.0
  }, {
    "carb": 4.5,
    "prot": 0.8,
    "name": "\u041F\u0438\u0432\u043E 4.5%",
    "fat": 0.0,
    "kcal": 45.0
  }, {
    "carb": 4.1,
    "prot": 0.0,
    "name": "\u041F\u0438\u0432\u043E \u0431\u0435\u0437\u0430\u043B\u043A\u043E\u0433\u043E\u043B\u044C\u043D\u043E\u0435",
    "fat": 0.0,
    "kcal": 22.0
  }, {
    "carb": 4.0,
    "prot": 0.2,
    "name": "\u041F\u0438\u0432\u043E \u0442\u0435\u043C\u043D\u043E\u0435",
    "fat": 0.0,
    "kcal": 39.0
  }, {
    "name": "\u041F\u0438\u0440\u043E\u0436\u043D\u043E\u0435 \u0431\u0438\u0441\u043A\u0432\u0438\u0442\u043D\u043E\u0435",
    "prot": 4.9,
    "fat": 9.1,
    "carb": 84.1,
    "kcal": 338.0,
    "gi": 95.0
  }, {
    "name": "\u041F\u0438\u0440\u043E\u0436\u043D\u043E\u0435 \u0441\u043B\u043E\u0435\u043D\u043E\u0435",
    "prot": 5.7,
    "fat": 38.3,
    "carb": 46.8,
    "kcal": 543.0,
    "gi": 95.0
  }, {
    "carb": 0.0,
    "prot": 18.5,
    "name": "\u041F\u043B\u043E\u0442\u0432\u0430",
    "fat": 0.4,
    "kcal": 108.0
  }, {
    "name": "\u041F\u043E\u0434\u0431\u0435\u0440\u0435\u0437\u043E\u0432\u0438\u043A\u0438 \u0441\u0432\u0435\u0436\u0438\u0435",
    "prot": 2.1,
    "fat": 1.2,
    "carb": 3.4,
    "kcal": 30.0,
    "gi": 15.0
  }, {
    "name": "\u041F\u043E\u0434\u0431\u0435\u0440\u0435\u0437\u043E\u0432\u0438\u043A\u0438 \u0441\u0443\u0448\u0435\u043D\u044B\u0435",
    "prot": 23.3,
    "fat": 9.5,
    "carb": 14.4,
    "kcal": 231.0,
    "gi": 15.0
  }, {
    "name": "\u041F\u043E\u0434\u043E\u0441\u0438\u043D\u043E\u0432\u0438\u043A\u0438 \u0441\u0432\u0435\u0436\u0438\u0435",
    "prot": 3.3,
    "fat": 0.4,
    "carb": 3.5,
    "kcal": 31.0,
    "gi": 15.0
  }, {
    "name": "\u041F\u043E\u0434\u043E\u0441\u0438\u043D\u043E\u0432\u0438\u043A\u0438 \u0441\u0443\u0448\u0435\u043D\u044B\u0435",
    "prot": 35.2,
    "fat": 5.4,
    "carb": 33.0,
    "kcal": 325.0,
    "gi": 15.0
  }, {
    "carb": 13.8,
    "prot": 0.0,
    "name": "\u041F\u043E\u0440\u0442\u0432\u0435\u0439\u043D",
    "fat": 0.0,
    "kcal": 167.0
  }, {
    "name": "\u041F\u0440\u043E\u0441\u0442\u043E\u043A\u0432\u0430\u0448\u0430 3.2%",
    "prot": 2.9,
    "fat": 3.2,
    "carb": 4.0,
    "kcal": 57.0,
    "gi": 35.0
  }, {
    "name": "\u041F\u0440\u044F\u043D\u0438\u043A\u0438",
    "prot": 4.4,
    "fat": 2.9,
    "carb": 77.1,
    "kcal": 333.0,
    "gi": 95.0
  }, {
    "name": "\u041F\u0448\u0435\u043D\u043D\u0430\u044F \u043A\u0430\u0448\u0430",
    "prot": 3.0,
    "fat": 0.8,
    "carb": 17.2,
    "kcal": 92.0,
    "gi": 70.0
  }, {
    "name": "\u041F\u0448\u0435\u043D\u043E",
    "prot": 11.5,
    "fat": 3.3,
    "carb": 69.3,
    "kcal": 348.0,
    "gi": 70.0
  }, {
    "carb": 1.1,
    "prot": 20.3,
    "name": "\u0420\u0430\u043A\u0438 \u0432\u0430\u0440\u0435\u043D\u044B\u0435",
    "fat": 1.2,
    "kcal": 96.0
  }, {
    "name": "\u0420\u0435\u0432\u0435\u043D\u044C",
    "prot": 0.9,
    "fat": 0.2,
    "carb": 4.5,
    "kcal": 21.0,
    "gi": 15.0
  }, {
    "name": "\u0420\u0435\u0434\u0438\u0441",
    "prot": 1.5,
    "fat": 0.0,
    "carb": 4.2,
    "kcal": 22.0,
    "gi": 15.0
  }, {
    "name": "\u0420\u0435\u0434\u044C\u043A\u0430",
    "prot": 1.7,
    "fat": 0.0,
    "carb": 7.1,
    "kcal": 33.0,
    "gi": 30.0
  }, {
    "name": "\u0420\u0435\u043F\u0430",
    "prot": 1.6,
    "fat": 0.0,
    "carb": 5.8,
    "kcal": 27.0,
    "gi": 30.0
  }, {
    "name": "\u0420\u0438\u0441 \u0431\u0430\u0441\u043C\u0430\u0442\u0438",
    "prot": 7.4,
    "fat": 1.8,
    "carb": 72.9,
    "kcal": 322.0,
    "gi": 50.0
  }, {
    "name": "\u0420\u0438\u0441 \u0431\u0435\u043B\u044B\u0439",
    "prot": 7.4,
    "fat": 1.8,
    "carb": 72.9,
    "kcal": 344.0,
    "gi": 70.0
  }, {
    "name": "\u0420\u0438\u0441 \u0431\u0443\u0440\u044B\u0439",
    "prot": 7.4,
    "fat": 1.8,
    "carb": 72.9,
    "kcal": 337.0,
    "gi": 45.0
  }, {
    "name": "\u0420\u0438\u0441 \u0431\u0443\u0440\u044B\u0439 \u0432\u0430\u0440\u0435\u043D\u044B\u0439",
    "prot": 2.6,
    "fat": 0.9,
    "carb": 22.8,
    "kcal": 110.0,
    "gi": 45.0
  }, {
    "name": "\u0420\u0438\u0441\u043E\u0432\u0430\u044F \u043A\u0430\u0448\u0430",
    "prot": 1.5,
    "fat": 0.2,
    "carb": 17.3,
    "kcal": 79.0,
    "gi": 75.0
  }, {
    "carb": 0.0,
    "prot": 0.0,
    "name": "\u0420\u043E\u043C",
    "fat": 0.0,
    "kcal": 217.0
  }, {
    "name": "\u0420\u0443\u043A\u043A\u043E\u043B\u0430",
    "prot": 2.6,
    "fat": 0.7,
    "carb": 2.1,
    "kcal": 25.0,
    "gi": 15.0
  }, {
    "name": "\u0420\u044B\u0436\u0438\u043A\u0438 \u0441\u0432\u0435\u0436\u0438\u0435",
    "prot": 1.9,
    "fat": 0.7,
    "carb": 2.3,
    "kcal": 16.0,
    "gi": 15.0
  }, {
    "name": "\u0420\u044F\u0431\u0438\u043D\u0430",
    "prot": 1.6,
    "fat": 0.0,
    "carb": 12.2,
    "kcal": 57.0,
    "gi": 35.0
  }, {
    "name": "\u0420\u044F\u0436\u0435\u043D\u043A\u0430 2.5%",
    "prot": 2.9,
    "fat": 2.5,
    "carb": 4.1,
    "kcal": 53.0,
    "gi": 35.0
  }, {
    "name": "\u0420\u044F\u0436\u0435\u043D\u043A\u0430 4.0%",
    "prot": 2.9,
    "fat": 4.0,
    "carb": 4.1,
    "kcal": 68.0,
    "gi": 35.0
  }, {
    "carb": 0.0,
    "prot": 18.1,
    "name": "\u0421\u0430\u0437\u0430\u043D",
    "fat": 5.2,
    "kcal": 119.0
  }, {
    "carb": 0.0,
    "prot": 18.3,
    "name": "\u0421\u0430\u0439\u0440\u0430",
    "fat": 20.5,
    "kcal": 257.0
  }, {
    "carb": 0.0,
    "prot": 17.1,
    "name": "\u0421\u0430\u043B\u0430\u043A\u0430",
    "fat": 5.8,
    "kcal": 124.0
  }, {
    "name": "\u0421\u0430\u043B\u0430\u0442",
    "prot": 1.2,
    "fat": 0.3,
    "carb": 1.3,
    "kcal": 12.0,
    "gi": 15.0
  }, {
    "carb": 1.1,
    "prot": 21.3,
    "name": "\u0421\u0430\u043B\u044F\u043C\u0438",
    "fat": 53.6,
    "kcal": 576.0
  }, {
    "carb": 1.6,
    "prot": 11.1,
    "name": "\u0421\u0430\u0440\u0434\u0435\u043B\u044C\u043A\u0438 \u0413\u043E\u0432\u044F\u0436\u044C\u0438",
    "fat": 18.2,
    "kcal": 215.0
  }, {
    "carb": 1.7,
    "prot": 10.1,
    "name": "\u0421\u0430\u0440\u0434\u0435\u043B\u044C\u043A\u0438 \u0421\u0432\u0438\u043D\u044B\u0435",
    "fat": 31.8,
    "kcal": 330.0
  }, {
    "name": "\u0421\u0430\u0445\u0430\u0440",
    "prot": 0.2,
    "fat": 0.0,
    "carb": 99.6,
    "kcal": 377.0,
    "gi": 70.0
  }, {
    "name": "\u0421\u0432\u0435\u043A\u043B\u0430",
    "prot": 1.7,
    "fat": 0.0,
    "carb": 10.5,
    "kcal": 46.0,
    "gi": 30.0
  }, {
    "carb": 0.0,
    "prot": 18.6,
    "name": "\u0421\u0432\u0438\u043D\u0430\u044F \u043F\u0435\u0447\u0435\u043D\u044C",
    "fat": 3.5,
    "kcal": 105.0
  }, {
    "carb": 0.0,
    "prot": 11.6,
    "name": "\u0421\u0432\u0438\u043D\u0438\u043D\u0430 \u0436\u0438\u0440\u043D\u0430\u044F",
    "fat": 49.1,
    "kcal": 484.0
  }, {
    "carb": 0.0,
    "prot": 16.3,
    "name": "\u0421\u0432\u0438\u043D\u0438\u043D\u0430 \u043D\u0435\u0436\u0438\u0440\u043D\u0430\u044F",
    "fat": 27.9,
    "kcal": 318.0
  }, {
    "carb": 0.0,
    "prot": 15.2,
    "name": "\u0421\u0432\u0438\u043D\u043E\u0435 \u0441\u0435\u0440\u0434\u0446\u0435",
    "fat": 3.1,
    "kcal": 87.0
  }, {
    "carb": 0.0,
    "prot": 14.4,
    "name": "\u0421\u0432\u0438\u043D\u043E\u0439 \u044F\u0437\u044B\u043A",
    "fat": 16.5,
    "kcal": 203.0
  }, {
    "carb": 0.0,
    "prot": 13.2,
    "name": "\u0421\u0432\u0438\u043D\u044B\u0435 \u043F\u043E\u0447\u043A\u0438",
    "fat": 3.2,
    "kcal": 84.0
  }, {
    "name": "\u0421\u0435\u043B\u044C\u0434\u0435\u0440\u0435\u0439",
    "prot": 0.9,
    "fat": 0.1,
    "carb": 2.1,
    "kcal": 12.0,
    "gi": 15.0
  }, {
    "carb": 0.0,
    "prot": 17.3,
    "name": "\u0421\u0435\u043B\u044C\u0434\u044C",
    "fat": 19.9,
    "kcal": 248.0
  }, {
    "carb": 0.0,
    "prot": 20.9,
    "name": "\u0421\u0435\u043C\u0433\u0430",
    "fat": 15.3,
    "kcal": 222.0
  }, {
    "name": "\u0421\u0435\u043C\u0435\u0447\u043A\u0438 \u043F\u043E\u0434\u0441\u043E\u043B\u043D\u0435\u0447\u043D\u0438\u043A\u0430",
    "prot": 20.9,
    "fat": 52.5,
    "carb": 5.4,
    "kcal": 582.0,
    "gi": 35.0
  }, {
    "carb": 0.0,
    "prot": 19.0,
    "name": "\u0421\u0438\u0433",
    "fat": 7.3,
    "kcal": 141.0
  }, {
    "carb": 0.0,
    "prot": 18.0,
    "name": "\u0421\u043A\u0443\u043C\u0431\u0440\u0438\u044F",
    "fat": 9.5,
    "kcal": 158.0
  }, {
    "name": "\u0421\u043B\u0438\u0432\u0430",
    "prot": 0.8,
    "fat": 0.0,
    "carb": 9.7,
    "kcal": 41.0,
    "gi": 35.0
  }, {
    "name": "\u0421\u043B\u0438\u0432\u043A\u0438 10%",
    "prot": 2.8,
    "fat": 10.0,
    "carb": 4.1,
    "kcal": 121.0,
    "gi": 35.0
  }, {
    "name": "\u0421\u043B\u0438\u0432\u043A\u0438 20%",
    "prot": 2.8,
    "fat": 20.0,
    "carb": 3.9,
    "kcal": 209.0,
    "gi": 35.0
  }, {
    "name": "\u0421\u043C\u0435\u0442\u0430\u043D\u0430 10%",
    "prot": 3.0,
    "fat": 10.0,
    "carb": 2.9,
    "kcal": 118.0,
    "gi": 35.0
  }, {
    "name": "\u0421\u043C\u0435\u0442\u0430\u043D\u0430 15%",
    "prot": 3.0,
    "fat": 15.0,
    "carb": 2.9,
    "kcal": 163.0,
    "gi": 35.0
  }, {
    "name": "\u0421\u043C\u0435\u0442\u0430\u043D\u0430 20%",
    "prot": 3.0,
    "fat": 20.0,
    "carb": 2.9,
    "kcal": 208.0,
    "gi": 35.0
  }, {
    "name": "\u0421\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u0430 \u0431\u0435\u043B\u0430\u044F",
    "prot": 0.4,
    "fat": 0.0,
    "carb": 8.5,
    "kcal": 37.0,
    "gi": 25.0
  }, {
    "name": "\u0421\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u0430 \u043A\u0440\u0430\u0441\u043D\u0430\u044F",
    "prot": 0.6,
    "fat": 0.0,
    "carb": 8.7,
    "kcal": 39.0,
    "gi": 25.0
  }, {
    "name": "\u0421\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u0430 \u0447\u0435\u0440\u043D\u0430\u044F",
    "prot": 1.0,
    "fat": 0.0,
    "carb": 8.0,
    "kcal": 38.0,
    "gi": 15.0
  }, {
    "carb": 0.0,
    "prot": 16.7,
    "name": "\u0421\u043E\u043C",
    "fat": 8.4,
    "kcal": 141.0
  }, {
    "carb": 0.9,
    "prot": 10.3,
    "name": "\u0421\u043E\u0441\u0438\u0441\u043A\u0438 \u0413\u043E\u0432\u044F\u0436\u044C\u0438",
    "fat": 20.3,
    "kcal": 229.0
  }, {
    "carb": 3.3,
    "prot": 10.6,
    "name": "\u0421\u043E\u0441\u0438\u0441\u043A\u0438 \u041A\u0443\u0440\u0438\u043D\u044B\u0435",
    "fat": 22.1,
    "kcal": 242.0
  }, {
    "carb": 0.4,
    "prot": 9.8,
    "name": "\u0421\u043E\u0441\u0438\u0441\u043A\u0438 \u041B\u044E\u0431\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435",
    "fat": 30.1,
    "kcal": 318.0
  }, {
    "carb": 1.1,
    "prot": 11.3,
    "name": "\u0421\u043E\u0441\u0438\u0441\u043A\u0438 \u041C\u043E\u043B\u043E\u0447\u043D\u044B\u0435",
    "fat": 23.9,
    "kcal": 260.0
  }, {
    "carb": 4.5,
    "prot": 9.2,
    "name": "\u0421\u043E\u0441\u0438\u0441\u043A\u0438 \u0421\u0432\u0438\u043D\u044B\u0435",
    "fat": 23.2,
    "kcal": 284.0
  }, {
    "name": "\u0421\u043E\u0443\u0441 \u0441\u043E\u0435\u0432\u044B\u0439",
    "prot": 10.3,
    "fat": 0.0,
    "carb": 8.1,
    "kcal": 73.0,
    "gi": 20.0
  }, {
    "name": "\u0421\u043E\u044F \u0431\u043E\u0431\u044B",
    "prot": 36.0,
    "fat": 20.0,
    "carb": 30.0,
    "kcal": 446.0,
    "gi": 15.0
  }, {
    "name": "\u0421\u043F\u0430\u0433\u0435\u0442\u0442\u0438",
    "prot": 10.4,
    "fat": 1.1,
    "carb": 71.5,
    "kcal": 344.0,
    "gi": 55.0
  }, {
    "name": "\u0421\u043F\u0430\u0440\u0436\u0430",
    "prot": 2.2,
    "fat": 0.1,
    "carb": 3.9,
    "kcal": 20.0,
    "gi": 15.0
  }, {
    "carb": 0.0,
    "prot": 18.0,
    "name": "\u0421\u0442\u0430\u0432\u0440\u0438\u0434\u0430",
    "fat": 5.3,
    "kcal": 119.0
  }, {
    "carb": 0.0,
    "prot": 17.3,
    "name": "\u0421\u0442\u0435\u0440\u043B\u044F\u0434\u044C",
    "fat": 6.3,
    "kcal": 126.0
  }, {
    "carb": 0.0,
    "prot": 19.0,
    "name": "\u0421\u0443\u0434\u0430\u043A",
    "fat": 0.7,
    "kcal": 81.0
  }, {
    "name": "\u0421\u0443\u0445\u0430\u0440\u0438 \u043F\u0448\u0435\u043D\u0438\u0447\u043D\u044B\u0435",
    "prot": 11.6,
    "fat": 1.8,
    "carb": 72.1,
    "kcal": 327.0,
    "gi": 70.0
  }, {
    "name": "\u0421\u0443\u0448\u043A\u0438",
    "prot": 11.1,
    "fat": 1.0,
    "carb": 73.2,
    "kcal": 335.0,
    "gi": 70.0
  }, {
    "name": "\u0421\u044B\u0440 \u0433\u043E\u043B\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0439",
    "prot": 26.4,
    "fat": 26.5,
    "carb": 0.0,
    "kcal": 352.0,
    "gi": 35.0
  }, {
    "name": "\u0421\u044B\u0440 \u043F\u043E\u0448\u0435\u0445\u043E\u043D\u0441\u043A\u0438\u0439",
    "prot": 26.4,
    "fat": 26.3,
    "carb": 0.0,
    "kcal": 348.0,
    "gi": 35.0
  }, {
    "name": "\u0421\u044B\u0440 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0438\u0439",
    "prot": 24.1,
    "fat": 29.8,
    "carb": 0.4,
    "kcal": 366.0,
    "gi": 35.0
  }, {
    "name": "\u0421\u044B\u0440 \u0441\u0443\u043B\u0443\u0433\u0443\u043D\u0438",
    "prot": 20.0,
    "fat": 24.2,
    "carb": 0.0,
    "kcal": 293.0,
    "gi": 35.0
  }, {
    "name": "\u0421\u044B\u0440\u043E\u0435\u0436\u043A\u0438 \u0441\u0432\u0435\u0436\u0438\u0435",
    "prot": 1.6,
    "fat": 0.8,
    "carb": 1.7,
    "kcal": 15.0,
    "gi": 15.0
  }, {
    "name": "\u0422\u0432\u043E\u0440\u043E\u0433 \u0436\u0438\u0440\u043D\u044B\u0439",
    "prot": 14.0,
    "fat": 18.0,
    "carb": 1.9,
    "kcal": 236.0,
    "gi": 30.0
  }, {
    "name": "\u0422\u0432\u043E\u0440\u043E\u0433 \u043D\u0435\u0436\u0438\u0440\u043D\u044B\u0439",
    "prot": 18.2,
    "fat": 0.6,
    "carb": 1.8,
    "kcal": 89.0,
    "gi": 30.0
  }, {
    "name": "\u0422\u0432\u043E\u0440\u043E\u0433 \u043F\u043E\u043B\u0443\u0436\u0438\u0440\u043D\u044B\u0439",
    "prot": 16.5,
    "fat": 9.0,
    "carb": 1.9,
    "kcal": 156.0,
    "gi": 30.0
  }, {
    "carb": 0.0,
    "prot": 19.9,
    "name": "\u0422\u0435\u043B\u044F\u0442\u0438\u043D\u0430",
    "fat": 1.1,
    "kcal": 91.0
  }, {
    "name": "\u0422\u043E\u043C\u0430\u0442\u043D\u0430\u044F \u043F\u0430\u0441\u0442\u0430",
    "prot": 2.5,
    "fat": 0.3,
    "carb": 16.7,
    "kcal": 80.0,
    "gi": 45.0
  }, {
    "name": "\u0422\u043E\u043C\u0430\u0442\u043D\u044B\u0439 \u0441\u043E\u043A",
    "prot": 0.8,
    "fat": 0.1,
    "carb": 4.2,
    "kcal": 17.0,
    "gi": 30.0
  }, {
    "name": "\u0422\u043E\u043C\u0430\u0442\u044B (\u0433\u0440\u0443\u043D\u0442\u043E\u0432\u044B\u0435)",
    "prot": 0.7,
    "fat": 0.0,
    "carb": 4.1,
    "kcal": 19.0,
    "gi": 30.0
  }, {
    "name": "\u0422\u043E\u043C\u0430\u0442\u044B (\u043F\u0430\u0440\u043D\u0438\u043A\u043E\u0432\u044B\u0435)",
    "prot": 0.7,
    "fat": 0.0,
    "carb": 2.6,
    "kcal": 12.0,
    "gi": 30.0
  }, {
    "name": "\u0422\u043E\u0444\u0443",
    "prot": 8.0,
    "fat": 1.9,
    "carb": 4.8,
    "kcal": 76.0,
    "gi": 15.0
  }, {
    "carb": 0.0,
    "prot": 17.7,
    "name": "\u0422\u0440\u0435\u0441\u043A\u0430",
    "fat": 0.5,
    "kcal": 76.0
  }, {
    "carb": 0.0,
    "prot": 21.7,
    "name": "\u0422\u0443\u043D\u0435\u0446",
    "fat": 1.3,
    "kcal": 95.0
  }, {
    "name": "\u0422\u044B\u043A\u0432\u0430",
    "prot": 1.0,
    "fat": 0.1,
    "carb": 7.0,
    "kcal": 26.0,
    "gi": 75.0
  }, {
    "name": "\u0422\u044B\u043A\u0432\u0435\u043D\u043D\u044B\u0435 \u0441\u0435\u043C\u0435\u0447\u043A\u0438",
    "prot": 19.0,
    "fat": 19.0,
    "carb": 54.0,
    "kcal": 446.0,
    "gi": 25.0
  }, {
    "carb": 0.0,
    "prot": 13.3,
    "name": "\u0423\u0433\u043E\u043B\u044C\u043D\u0430\u044F \u0440\u044B\u0431\u0430",
    "fat": 11.4,
    "kcal": 153.0
  }, {
    "carb": 0.0,
    "prot": 14.2,
    "name": "\u0423\u0433\u043E\u0440\u044C \u043C\u043E\u0440\u0441\u043A\u043E\u0439",
    "fat": 30.7,
    "kcal": 331.0
  }, {
    "name": "\u0423\u0440\u044E\u043A",
    "prot": 5.3,
    "fat": 0.0,
    "carb": 67.9,
    "kcal": 279.0,
    "gi": 65.0
  }, {
    "carb": 6.2,
    "prot": 14.4,
    "name": "\u0423\u0441\u0442\u0440\u0438\u0446\u044B",
    "fat": 0.3,
    "kcal": 91.0
  }, {
    "carb": 0.0,
    "prot": 16.4,
    "name": "\u0423\u0442\u043A\u0438",
    "fat": 61.3,
    "kcal": 348.0
  }, {
    "name": "\u0424\u0430\u0441\u043E\u043B\u044C",
    "prot": 4.4,
    "fat": 0.0,
    "carb": 4.4,
    "kcal": 36.0,
    "gi": 25.0
  }, {
    "name": "\u0424\u0438\u043D\u0438\u043A\u0438",
    "prot": 2.5,
    "fat": 0.4,
    "carb": 69.6,
    "kcal": 277.0,
    "gi": 65.0
  }, {
    "name": "\u0424\u0438\u0441\u0442\u0430\u0448\u043A\u0438",
    "prot": 20.0,
    "fat": 50.5,
    "carb": 7.3,
    "kcal": 555.0,
    "gi": 15.0
  }, {
    "carb": 0.0,
    "prot": 19.6,
    "name": "\u0424\u043E\u0440\u0435\u043B\u044C",
    "fat": 2.1,
    "kcal": 99.0
  }, {
    "name": "\u0424\u0443\u043D\u0434\u0443\u043A",
    "prot": 15.0,
    "fat": 61.0,
    "carb": 17.0,
    "kcal": 628.0,
    "gi": 15.0
  }, {
    "name": "\u0425\u0430\u043B\u0432\u0430 \u043F\u043E\u0434\u0441\u043E\u043B\u043D\u0435\u0447\u043D\u0430\u044F",
    "prot": 11.4,
    "fat": 29.3,
    "carb": 54.6,
    "kcal": 519.0,
    "gi": 100.0
  }, {
    "carb": 0.0,
    "prot": 16.4,
    "name": "\u0425\u0435\u043A",
    "fat": 2.3,
    "kcal": 84.0
  }, {
    "name": "\u0425\u043B\u0435\u0431 \u043F\u0448\u0435\u043D\u0438\u0447\u043D\u044B\u0439",
    "prot": 7.4,
    "fat": 2.2,
    "carb": 53.0,
    "kcal": 246.0,
    "gi": 100.0
  }, {
    "name": "\u0425\u043B\u0435\u0431 \u0440\u0436\u0430\u043D\u043E\u0439",
    "prot": 4.7,
    "fat": 0.6,
    "carb": 49.5,
    "kcal": 210.0,
    "gi": 65.0
  }, {
    "name": "\u0425\u0440\u0435\u043D",
    "prot": 2.6,
    "fat": 0.0,
    "carb": 16.1,
    "kcal": 70.0,
    "gi": 30.0
  }, {
    "name": "\u0425\u0443\u0440\u043C\u0430",
    "prot": 0.7,
    "fat": 0.0,
    "carb": 15.7,
    "kcal": 61.0,
    "gi": 50.0
  }, {
    "name": "\u0426\u0438\u043A\u043E\u0440\u0438\u0439",
    "prot": 1.7,
    "fat": 0.2,
    "carb": 4.1,
    "kcal": 21.0,
    "gi": 15.0
  }, {
    "carb": 0.5,
    "prot": 18.5,
    "name": "\u0426\u044B\u043F\u043B\u044F\u0442\u0430",
    "fat": 7.9,
    "kcal": 159.0
  }, {
    "name": "\u0427\u0435\u0440\u0435\u0448\u043D\u044F",
    "prot": 1.3,
    "fat": 0.0,
    "carb": 12.5,
    "kcal": 54.0,
    "gi": 40.0
  }, {
    "name": "\u0427\u0435\u0440\u043D\u0438\u043A\u0430",
    "prot": 1.2,
    "fat": 0.0,
    "carb": 8.8,
    "kcal": 41.0,
    "gi": 30.0
  }, {
    "name": "\u0427\u0435\u0440\u043D\u043E\u0441\u043B\u0438\u0432",
    "prot": 2.7,
    "fat": 0.0,
    "carb": 65.3,
    "kcal": 262.0,
    "gi": 40.0
  }, {
    "carb": 0.0,
    "prot": 0.0,
    "name": "\u0427\u0435\u0440\u043D\u044B\u0439 \u0447\u0430\u0439 \u0431\u0435\u0437 \u0441\u0430\u0445\u0430\u0440\u0430",
    "fat": 0.0,
    "kcal": 0.0
  }, {
    "name": "\u0427\u0435\u0441\u043D\u043E\u043A",
    "prot": 6.6,
    "fat": 0.0,
    "carb": 21.1,
    "kcal": 103.0,
    "gi": 30.0
  }, {
    "name": "\u0427\u0435\u0447\u0435\u0432\u0438\u0446\u0430",
    "prot": 9.0,
    "fat": 0.4,
    "carb": 20.0,
    "kcal": 116.0,
    "gi": 25.0
  }, {
    "carb": 5.2,
    "prot": 0.3,
    "name": "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435",
    "fat": 0.0,
    "kcal": 88.0
  }, {
    "name": "\u0428\u0430\u043C\u043F\u0438\u043D\u044C\u043E\u043D\u044B \u0441\u0432\u0435\u0436\u0438\u0435",
    "prot": 4.3,
    "fat": 0.9,
    "carb": 1.4,
    "kcal": 29.0,
    "gi": 15.0
  }, {
    "name": "\u0428\u0435\u043B\u043A\u043E\u0432\u0438\u0446\u0430",
    "prot": 0.6,
    "fat": 0.0,
    "carb": 12.5,
    "kcal": 50.0,
    "gi": 35.0
  }, {
    "name": "\u0428\u0438\u043F\u043E\u0432\u043D\u0438\u043A \u0441\u0432\u0435\u0436\u0438\u0439",
    "prot": 1.5,
    "fat": 0.0,
    "carb": 24.2,
    "kcal": 106.0,
    "gi": 35.0
  }, {
    "name": "\u0428\u0438\u043F\u043E\u0432\u043D\u0438\u043A \u0441\u0443\u0448\u0435\u043D\u044B\u0439",
    "prot": 4.5,
    "fat": 0.0,
    "carb": 60.1,
    "kcal": 259.0,
    "gi": 35.0
  }, {
    "name": "\u0428\u043E\u043A\u043E\u043B\u0430\u0434 \u0433\u043E\u0440\u044C\u043A\u0438\u0439",
    "prot": 5.2,
    "fat": 35.6,
    "carb": 52.4,
    "kcal": 546.0,
    "gi": 30.0
  }, {
    "name": "\u0428\u043E\u043A\u043E\u043B\u0430\u0434 \u043C\u043E\u043B\u043E\u0447\u043D\u044B\u0439",
    "prot": 6.7,
    "fat": 35.6,
    "carb": 52.4,
    "kcal": 552.0,
    "gi": 70.0
  }, {
    "name": "\u0428\u043F\u0438\u043D\u0430\u0442",
    "prot": 2.5,
    "fat": 0.0,
    "carb": 2.6,
    "kcal": 22.0,
    "gi": 15.0
  }, {
    "name": "\u0429\u0430\u0432\u0435\u043B\u044C",
    "prot": 1.6,
    "fat": 0.0,
    "carb": 5.5,
    "kcal": 29.0,
    "gi": 15.0
  }, {
    "carb": 0.0,
    "prot": 18.2,
    "name": "\u0429\u0443\u043A\u0430",
    "fat": 0.8,
    "kcal": 83.0
  }, {
    "name": "\u042D\u043D\u0435\u0440\u0433\u0435\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043D\u0430\u043F\u0438\u0442\u043E\u043A",
    "prot": 0.0,
    "fat": 0.0,
    "carb": 11.4,
    "kcal": 47.0,
    "gi": 100.0
  }, {
    "name": "\u042F\u0431\u043B\u043E\u043A\u0438",
    "prot": 0.5,
    "fat": 0.0,
    "carb": 11.4,
    "kcal": 48.0,
    "gi": 35.0
  }, {
    "name": "\u042F\u0431\u043B\u043E\u043A\u0438 \u0441\u0443\u0448\u0435\u043D\u043D\u044B\u0435",
    "prot": 3.1,
    "fat": 0.0,
    "carb": 68.3,
    "kcal": 275.0,
    "gi": 30.0
  }, {
    "name": "\u042F\u0431\u043B\u043E\u0447\u043D\u044B\u0439 \u0441\u043E\u043A",
    "prot": 0.5,
    "fat": 0.4,
    "carb": 9.7,
    "kcal": 42.0,
    "gi": 45.0
  }, {
    "carb": 0.0,
    "prot": 10.3,
    "name": "\u042F\u0437\u044B\u043A \u043C\u043E\u0440\u0441\u043A\u043E\u0439",
    "fat": 5.3,
    "kcal": 89.0
  }, {
    "carb": 5.1,
    "prot": 45.3,
    "name": "\u042F\u0438\u0447\u043D\u044B\u0439 \u043F\u043E\u0440\u043E\u0448\u043E\u043A",
    "fat": 37.3,
    "kcal": 545.0
  }, {
    "carb": 0.6,
    "prot": 12.7,
    "name": "\u042F\u0439\u0446\u043E \u043A\u0443\u0440\u0438\u043D\u043E\u0435",
    "fat": 11.1,
    "kcal": 153.0
  }, {
    "carb": 0.8,
    "prot": 11.9,
    "name": "\u042F\u0439\u0446\u043E \u043F\u0435\u0440\u0435\u043F\u0435\u043B\u0438\u043D\u043E\u0435",
    "fat": 13.3,
    "kcal": 170.0
  }, {
    "carb": 0.8,
    "prot": 12.4,
    "name": "\u042F\u0439\u0446\u043E \u0441\u0442\u0440\u0430\u0443\u0441\u0438\u043D\u043E\u0435",
    "fat": 11.5,
    "kcal": 118.0
  }, {
    "carb": 0.2,
    "prot": 13.5,
    "name": "\u042F\u0439\u0446\u043E \u0443\u0442\u0438\u043D\u043E\u0435",
    "fat": 14.1,
    "kcal": 176.0
  }, {
    "name": "\u042F\u0447\u043D\u0435\u0432\u0430\u044F \u043A\u0430\u0448\u0430",
    "prot": 1.4,
    "fat": 0.3,
    "carb": 18.7,
    "kcal": 84.0,
    "gi": 70.0
  }, {
    "name": "\u042F\u0447\u043D\u0435\u0432\u044B\u0435 \u0445\u043B\u043E\u043F\u044C\u044F",
    "prot": 9.1,
    "fat": 3.2,
    "carb": 79.7,
    "kcal": 345.0,
    "gi": 70.0
  }]
};
},{}],"ggiw":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _stream = _interopRequireDefault(require("mithril/stream"));

var _products = require("./products");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findProduct(name) {
  return _products.products.find(function (p) {
    return p.name === name;
  });
}

function loadProductProps(name, amount) {
  var product = findProduct(name);
  if (!product) return;
  product = Object.assign({}, product);
  product.amount = (0, _stream.default)(amount || 100);
  product.key = Math.ceil(1e9 * Math.random());
  return product;
}

var selectedProducts = [];

function loadSelectedProducts() {
  var savedProducts = JSON.parse(localStorage.getItem('selectedProducts') || "[]");

  for (var i = 0; i < savedProducts.length; i += 1) {
    var p = savedProducts[i];
    var product = loadProductProps(p.name, p.amount);
    if (!product) continue;
    selectedProducts.push(product);
  }
}

function removeSelectedProduct(key) {
  var ind = selectedProducts.findIndex(function (p) {
    return p.key === key;
  });

  if (ind >= 0) {
    selectedProducts.splice(ind, 1);
    saveSelectedProducts();
  }
}

function saveSelectedProducts() {
  var savedProducts = [];
  selectedProducts.map(function (p) {
    savedProducts.push({
      name: p.name,
      amount: p.amount()
    });
  });
  localStorage.setItem('selectedProducts', JSON.stringify(savedProducts));
}

var currentProduct = (0, _stream.default)(null);
var ProductSelector = {
  view: function view(vnode) {
    return [(0, _mithril.default)('input#productInput[type=text][list=product-list][placeholder="Выберите продукт..."]', {
      onchange: _mithril.default.withAttr('value', currentProduct),
      value: currentProduct()
    }), (0, _mithril.default)('button#addProductBtn', {
      title: 'Добавить продукт',
      disabled: !findProduct(currentProduct()),
      onclick: function onclick() {
        if (!currentProduct()) return;
        var product = loadProductProps(currentProduct());
        if (!product) return;
        currentProduct(null);
        selectedProducts.push(product);
        saveSelectedProducts();
      }
    }, '+'), (0, _mithril.default)('datalist#product-list', _products.products.map(function (p) {
      return (0, _mithril.default)('option', p.name);
    }))];
  }
};
var ProductTable = {
  view: function view(vnode) {
    var rows = [(0, _mithril.default)('tr', {
      key: 0
    }, [(0, _mithril.default)('th'), (0, _mithril.default)('th'), (0, _mithril.default)('th', 'Вес'), (0, _mithril.default)('th', 'Ккал'), (0, _mithril.default)('th', 'Бел'), (0, _mithril.default)('th', 'Жир'), (0, _mithril.default)('th', 'Угл'), (0, _mithril.default)('th', 'ГИ')])];
    var summary = {
      kcal: 0,
      prot: 0,
      fat: 0,
      carb: 0,
      weight: 0
    };
    selectedProducts.map(function (p) {
      var k = p.amount() / 100;
      rows.push((0, _mithril.default)('tr', {
        key: p.key
      }, [(0, _mithril.default)('td', (0, _mithril.default)('button', {
        title: 'Убрать ' + p.name,
        onclick: function onclick() {
          removeSelectedProduct(p.key);
        }
      }, 'x')), (0, _mithril.default)('td.name', p.name), (0, _mithril.default)('td', (0, _mithril.default)('input.amountInput[type=number]', {
        min: 0,
        oninput: function oninput() {
          p.amount(this.value);
          saveSelectedProducts();
        },
        value: p.amount()
      })), (0, _mithril.default)('td.num', (k * p.kcal).toFixed(1)), (0, _mithril.default)('td.num', (k * p.prot).toFixed(1)), (0, _mithril.default)('td.num', (k * p.fat).toFixed(1)), (0, _mithril.default)('td.num', (k * p.carb).toFixed(1)), (0, _mithril.default)('td.gi', p.gi || '-')]));
      summary.weight += k;
      summary.kcal += k * p.kcal;
      summary.prot += k * p.prot;
      summary.fat += k * p.fat;
      summary.carb += k * p.carb;
    });
    rows.push((0, _mithril.default)('tr', {
      key: -2
    }, [(0, _mithril.default)('th'), (0, _mithril.default)('th.name', 'Всего:'), (0, _mithril.default)('th', (100 * summary.weight).toFixed()), (0, _mithril.default)('th.num', summary.kcal.toFixed(1)), (0, _mithril.default)('th.num', summary.prot.toFixed(1)), (0, _mithril.default)('th.num', summary.fat.toFixed(1)), (0, _mithril.default)('th.num', summary.carb.toFixed(1)), (0, _mithril.default)('th')]));
    summary.weight && rows.push((0, _mithril.default)('tr', {
      key: -1
    }, [(0, _mithril.default)('th'), (0, _mithril.default)('th.name', 'В 100гр:'), (0, _mithril.default)('th'), (0, _mithril.default)('th.num', (summary.kcal / summary.weight).toFixed(1)), (0, _mithril.default)('th.num', (summary.prot / summary.weight).toFixed(1)), (0, _mithril.default)('th.num', (summary.fat / summary.weight).toFixed(1)), (0, _mithril.default)('th.num', (summary.carb / summary.weight).toFixed(1)), (0, _mithril.default)('th')]));
    return (0, _mithril.default)('table#productTable', rows);
  }
};
loadSelectedProducts();

_mithril.default.mount(document.body, {
  view: function view() {
    return [(0, _mithril.default)(ProductSelector), (0, _mithril.default)(ProductTable)];
  }
});
},{"mithril":"2tzG","mithril/stream":"D3FL","./products":"FaWJ"}]},{},["ggiw"], null)
//# sourceMappingURL=/calc.map