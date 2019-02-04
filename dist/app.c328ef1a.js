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
})({"api.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = exports.getHeadlines = exports.getUrl = void 0;
var APIKEY = "a84e9f34fa924b8cb6a38f90a1ef9d3b";
var newsAPIDomain = "//newsapi.org/v2";

var getUrl = function getUrl(search) {
  return "".concat(newsAPIDomain, "/everything?q=").concat(search, "&apiKey=").concat(APIKEY);
};

exports.getUrl = getUrl;

var getHeadlines = function getHeadlines() {
  return fetch("".concat(newsAPIDomain, "/top-headlines?country=us&apiKey=").concat(APIKEY));
};

exports.getHeadlines = getHeadlines;

var getData = function getData(param) {
  return fetch(getUrl(param));
};

exports.getData = getData;
},{}],"fp.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partialOnce = void 0;

var partialOnce = function partialOnce(fn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return function () {
    return fn.apply(void 0, args);
  };
};

exports.partialOnce = partialOnce;
},{}],"app.js":[function(require,module,exports) {
"use strict";

var _api = require("./api");

var _fp = require("./fp.js");

//  cached variables
var getElmById = function getElmById(el) {
  return document.getElementById(el);
};

var submit = getElmById("submit-button");
var politicsButton = getElmById("politics-button");
var mainDiv = getElmById("main-div");
var sportsDiv = getElmById("sports-button");
var entertainmentDiv = getElmById("entertainment-button");
var technologyDiv = getElmById("technology-button");
var moviesDiv = getElmById("movies-button");
var inputValue = getElmById("search-for");
var section = getElmById("section"); //  cached variables

var handleSubmit = function handleSubmit(e) {
  var searchValue = inputValue.value;
  e.preventDefault();

  if (!inputValue.value) {
    mainDiv.innerHTML = "<h1>NOTHING TYPED.PLEASE ENTER SOMETHING</h1>";
    return;
  }

  mainDiv.innerHTML = "";
  section.innerHTML = "RESULTS for \"".concat(inputValue.value.toUpperCase(), "\"");
  getServerData(searchValue, mainDiv);
  inputValue.value = "";
};

var loadPolitics = function loadPolitics() {
  mainDiv.innerHTML = "";
  section.innerHTML = "<i class=\"fas fa-marker\" class=\"icons\"></i> POLITICS";
  getServerData("politics", mainDiv);
};

var loadSports = function loadSports() {
  mainDiv.innerHTML = "";
  document.body.className = "";
  section.innerHTML = "<i class=\"fas fa-football-ball\" class=\"icons\"></i> SPORTS";
  getServerData("sports", mainDiv);
};

var loadEntertainment = function loadEntertainment() {
  mainDiv.innerHTML = "";
  section.innerHTML = "<i class=\"fas fa-play\" class=\"icons\"></i> ENTERTAINMENT";
  getServerData("entertainment", mainDiv);
};

var loadTechnology = function loadTechnology() {
  mainDiv.innerHTML = "";
  section.innerHTML = "<i class=\"fas fa-mobile\" class=\"icons\"></i> TECHNOLOGY";
  getServerData("technology", mainDiv);
};

var loadMovies = function loadMovies() {
  mainDiv.innerHTML = "";
  section.innerHTML = "<i class=\"fas fa-film\" class=\"icons\"></i> MOVIES";
  getServerData("movies", mainDiv);
};

var parseAndAppendTo = function parseAndAppendTo(appendTo) {
  return function (data) {
    data.articles.map(function (el) {
      var output = "<div id=\"news-html\">\n    <a target=\"_blank\" href=\"".concat(el.url, "\"><img src=\"").concat(el.urlToImage, "\" alt=\"Link to Content\"></a>\n    <h3 id=\"title\">").concat(el.title, "</h3>\n    <h5>Description: ").concat(el.description || "read full story", "</h5>\n    <p>Author: ").concat(el.author || "author not available", "</p> \n      </div>\n      <hr>");
      appendTo.innerHTML += output;
    });
  };
};

var getJson = function getJson(data) {
  return data.json();
};

var headlinesData = function headlinesData(appendTo) {
  (0, _api.getHeadlines)().then(getJson).then(parseAndAppendTo(appendTo));
};

var getServerData = function getServerData(inputValue, appendTo) {
  (0, _api.getData)(inputValue).then(getJson).then(parseAndAppendTo(appendTo));
};

var appEventHandlers = [{
  eventOn: window,
  eventFn: (0, _fp.partialOnce)(headlinesData, mainDiv),
  eventType: "load"
}, {
  eventOn: submit,
  eventFn: handleSubmit,
  eventType: "click"
}, {
  eventOn: politicsButton,
  eventFn: loadPolitics,
  eventType: "click"
}, {
  eventOn: sportsDiv,
  eventFn: loadSports,
  eventType: "click"
}, {
  eventOn: entertainmentDiv,
  eventFn: loadEntertainment,
  eventType: "click"
}, {
  eventOn: technologyDiv,
  eventFn: loadTechnology,
  eventType: "click"
}, {
  eventOn: moviesDiv,
  eventFn: loadMovies,
  eventType: "click"
}, {
  eventOn: inputValue,
  eventFn: function eventFn(e) {
    e.keyCode === 13 ? handleSubmit(e) : "";
  },
  eventType: "keyup"
}];
appEventHandlers.forEach(function (el) {
  el.eventOn.addEventListener(el.eventType, el.eventFn);
});
},{"./api":"api.js","./fp.js":"fp.js"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50877" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.map