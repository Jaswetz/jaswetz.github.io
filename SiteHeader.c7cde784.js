// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
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

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"2EAff":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "d46192c5c7cde784";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"ivc2T":[function(require,module,exports,__globalThis) {
/**
 * Custom element for the site-wide header, including navigation.
 * It encapsulates its own structure, styles, and basic behavior.
 * @extends HTMLElement
 */ // Issue #8: Enhance SiteHeader Component - Props, Events, and Accessibility
// See: https://github.com/Jaswetz/jaswetz.github.io/issues/8
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class SiteHeader extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.isMenuOpen = false;
        this.lastScrollY = 0;
        this.updateActiveSection = null; // Store reference for cleanup
    }
    /**
   * Called when the element is added to the document's DOM.
   * Renders the header structure and styles into the Shadow DOM.
   */ connectedCallback() {
        // Check if we're on the home page to determine navigation behavior
        const currentPath = window.location.pathname;
        const isHomePage = currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html') || currentPath === '' || currentPath.includes('index.html');
        this.shadowRoot.innerHTML = /*html*/ `  
    <style>
      :host {
      display: block;
      position: fixed;
      top: var(--space-s);
      left: 50%; 
      transform: translateX(-50%);
      width: var(--section-width);
      z-index: 1000;
      transition: top 0.5s ease, width 0.5s ease, max-width 0.5s ease, box-shadow 0.5s ease;
      max-width: var(--max-width);
      outline: none;
      }

      :host:focus {
      outline: none; /* Explicitly prevent focus outline on host */
      }

      :host(.scrolled) {
      top: 0;
      left: 0;
      transform: none;
      width: 100%;
      border-radius: 0;
      max-width: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      }

      .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: var(--border-width) solid var(--color-border);
      padding: var(--space-s) var(--space-m);
      border-radius: var(--border-radius);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: padding 0.5s ease, border-radius 0.5s ease, background-color 0.5s ease, box-shadow 0.5s ease;
      outline: none;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      background-color: rgba(255, 255, 255, 0.3);
      }

      .header-content:focus {
      outline: none; /* Explicitly prevent focus outline on header content */
      }

      :host(.scrolled) .header-content {
      border-radius: 0;
      padding: var(--space-xs) var(--space-m);
      box-shadow: none; /* ADDED to remove inner shadow when host has shadow */
      background-color: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border-right: none;
        border-left: none;
        border-top: none;
      }

      .logo a {
      font-weight: var(--font-weight-medium);
      font-family: var(--font-family-heading);
      text-decoration: none;
      color: var(--color-text);
      font-size: var(--text-size-heading-4);
      z-index: 2;
      transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: var(--space-2xs, 0.5em);
      padding: var(--space-2xs) var(--space-xs);
      border-radius: var(--border-radius);
      position: relative;
      overflow: hidden;
      }



      .logo-text {
      margin-left: var(--space-2xs, 0.25em);
      display: inline-block;
      }



      :host(.scrolled) .logo a {
      font-size: var(--font-size-lg);
      }

      .menu-toggle {
      display: none;
      background: none;
      border: none;
      padding: var(--space-2xs);
      cursor: pointer;
      z-index: 1001;
      position: relative;
      color: var(--color-text);
      border-radius: var(--border-radius);
      transition: var(--transition-interactive);
      overflow: hidden;
      }

      .menu-toggle::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-gradient-primary);
      opacity: 0;
      transition: var(--transition-quick);
      pointer-events: none;
      z-index: -1;
      }

      .menu-toggle:hover {
      transform: var(--hover-transform) scale(var(--hover-scale));
      box-shadow: var(--hover-shadow);
      }

      .menu-toggle:focus {
      outline: var(--focus-outline);
      outline-offset: var(--focus-outline-offset);
      transform: var(--hover-transform) scale(var(--hover-scale));
      box-shadow: var(--focus-shadow-enhanced);
      }

      .menu-toggle:active {
      transform: translateY(0) scale(0.98);
      box-shadow: var(--active-shadow);
      }

      .menu-toggle:hover::before {
      opacity: 1;
      }

      .menu-toggle:focus::before {
      opacity: 1;
      }

      .menu-toggle:active::before {
      opacity: 1;
      background: var(--overlay-gradient-enhanced);
      }

      .plus-icon {
      display: block;
      width: 24px;
      height: 24px;
      position: relative;
      }
      .plus-icon span {
      position: absolute;
      background: var(--color-text);
      border-radius: 1px;
      transition: transform .5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .plus-icon .vertical {
      left: 50%;
      top: 4px;
      width: 2px;
      height: 16px;
      transform: translateX(-50%);
      }
      .plus-icon .horizontal {
      top: 50%;
      left: 4px;
      width: 16px;
      height: 2px;
      transform: translateY(-50%);
      }
      .menu-toggle.active .plus-icon .vertical {
      transform: translateX(-50%) rotate(90deg);
      }
      .menu-toggle.active .plus-icon .horizontal {
      transform: translateY(-50%) rotate(90deg);
      }

      nav {
      display: flex;
      align-items: center;
      }

      nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--space-m);
      }

      nav li a {
      text-decoration: none;
      color: var(--color-text);
      padding: var(--space-2xs) var(--space-xs);
      font-size: var(--text-size-heading-5);
      border-radius: var(--border-radius);
      transition: var(--transition-interactive);
      font-family: var(--font-family-heading);
      font-weight: var(--font-weight-medium);
      position: relative;
      overflow: hidden;
      }

      nav li a.active {
      color: var(--color-primary-alt);
      background-color: rgba(37, 105, 237, 0.1);
      }

      nav li a:hover,
      nav li a:focus,
      .logo a:hover,
      .logo a:focus  {
      color: var(--color-primary-alt);
      transform: var(--hover-transform) scale(var(--hover-scale));
      box-shadow: var(--hover-shadow);
      text-decoration: none;
      }

      nav li a:active {
      color: var(--color-primary-alt);
      transform: translateY(0) scale(0.98);
      box-shadow: var(--active-shadow);
      text-decoration: none;
      }

      nav li a:hover::before,
      nav li a:focus::before {
      opacity: 1;
      }

      nav li a:active::before {
      opacity: 1;
      background: var(--overlay-gradient-enhanced);
      }

      .logo a:active {
      color: var(--color-primary-alt);
      transform: translateY(0) scale(0.98);
      box-shadow: var(--active-shadow);
      text-decoration: none;
      }

      .logo a:hover::before,
      .logo a:focus::before {
      opacity: 1;
      }

      .logo a:active::before {
      opacity: 1;
      background: linear-gradient(135deg, rgba(37, 105, 237, 0.1), rgba(23, 70, 160, 0.15));
      }

      .logo a:hover .logo-svg,
      .logo a:focus .logo-svg {
      transform: scale(var(--hover-scale-large));
      }

      .logo a:active .logo-svg {
      transform: scale(var(--hover-scale));
      }
      .logo-svg {
      height: var(--space-m-l);
      width: auto;
      min-width: 1em;
      min-height: 1em;
      display: inline-block;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* External link icon */
      .external-icon {
      width: 16px;
      height: 16px;
      margin-left: var(--space-2xs);
      vertical-align: middle;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      a:hover .external-icon,
      a:focus .external-icon {
      transform: scale(1.1);
      }

      /* Added button styles */
      .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      text-decoration: none;
      text-align: center;
      border: 2px solid var(--color-primary);
      border-radius: var(--border-radius);
      background-color: var(--color-primary);
      color: white;
      cursor: pointer;
      transition: var(--transition-interactive);
      position: relative;
      overflow: hidden;
      gap: var(--space-xs);
      }

      .button::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-gradient-light);
      opacity: 0;
      transition: var(--transition-quick);
      pointer-events: none;
      z-index: 1;
      }

      /* Hover state */
      .button:hover {
      background-color: var(--color-primary-alt);
      border-color: var(--color-primary-alt);
      color: white;
      transform: var(--hover-transform);
      box-shadow: var(--hover-shadow);
      text-decoration: none;
      }

      .button:hover::before {
      opacity: 1;
      }

      /* Focus state */
      .button:focus {
      outline: var(--focus-outline);
      outline-offset: var(--focus-outline-offset);
      background-color: var(--color-primary-alt);
      border-color: var(--color-primary-alt);
      color: white;
      transform: var(--hover-transform);
      box-shadow: var(--focus-shadow-enhanced);
      text-decoration: none;
      }

      .button:focus::before {
      opacity: 1;
      }

      /* Active/pressed state */
      .button:active {
      background-color: var(--color-primary-alt);
      border-color: var(--color-primary-alt);
      color: white;
      transform: var(--active-transform);
      box-shadow: var(--active-shadow);
      text-decoration: none;
      }

      .button:active::before {
      opacity: 1;
      background: var(--overlay-gradient-enhanced);
      }

      /* Secondary button styles */
      .button--secondary {
      background-color: transparent;
      color: var(--color-primary);
      border-color: var(--color-primary);
      }

      .button--secondary::before {
      background: var(--overlay-gradient-primary);
      }

      .button--secondary:hover {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
      transform: var(--hover-transform);
      }
      /* End of added button styles */


      @media (max-width: 47.9375rem) {
    

      .menu-toggle {
      display: flex;
      align-items: center;
      }

      nav {
      position: absolute;
      right: 0;
      border-radius: var(--border-radius);
      top: calc(100% + var(--space-2xs));
      max-width: 300px;
      width: var(--space-4xl);
      background-color: var(--color-surface);
      padding: var(--space-xs);
      opacity: 0;
      visibility: hidden;
      transition: opacity .3s ease, transform .3s ease, visibility .3s ease;
      z-index: 1000;
      display: block;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      width: calc(var(--space-2xl-3xl) * 3.0);
      }

      nav.active {
      opacity: 1;
      visibility: visible;
      }

      nav ul {
      flex-direction: column;
      gap: var(--space-2xs);
      align-items: stretch;
      }

      nav li a {
      font-size: var(--font-size-base);
      padding: var(--space-2xs) var(--space-xs);
      display: block;
      text-align: center;
      }

      nav li a.button {
      width: 87%;
      justify-content: center;
      }
      }
    </style>
    <div class="header-content">
      <div class="logo">
      <a href="/index.html">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="logo-svg" viewBox="0 0 39 39">
        <defs>
        <clipPath id="clipPath2973389018">
        <path d="M0 0L39 0L39 39L0 39L0 0Z" fill-rule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
        </clipPath>
        </defs>
        <g clip-path="url(#clipPath2973389018)">
        <path d="M9 0L18 17L0 17L9 0Z" fill-rule="nonzero" transform="matrix(1 0 0 1 10.5 10)" fill="#2569ed"/>
        <path d="M16 -0.5Q19.3566 -0.5 22.4227 0.796857Q25.3838 2.04931 27.6673 4.33274Q29.9507 6.61615 31.2031 9.5773Q32.5 12.6434 32.5 16Q32.5 19.3566 31.2031 22.4227Q29.9507 25.3838 27.6673 27.6673Q25.3839 29.9507 22.4227 31.2031Q19.3566 32.5 16 32.5Q12.6434 32.5 9.5773 31.2031Q6.61615 29.9507 4.33274 27.6673Q2.04931 25.3838 0.796855 22.4227Q-0.500002 19.3566 -0.500002 16Q-0.5 12.6434 0.796857 9.5773Q2.04931 6.61617 4.33274 4.33274Q6.61617 2.04931 9.5773 0.796855Q12.6434 -0.500002 16 -0.500002L16 -0.5ZM16 0.499998Q12.8462 0.499998 9.96685 1.71786Q7.18536 2.89433 5.03984 5.03984Q2.89433 7.18535 1.71786 9.96685Q0.5 12.8462 0.499998 16Q0.499998 19.1538 1.71786 22.0331Q2.89433 24.8147 5.03984 26.9602Q7.18534 29.1057 9.96685 30.2821Q12.8462 31.5 16 31.5Q19.1538 31.5 22.0331 30.2821Q24.8147 29.1057 26.9602 26.9602Q29.1057 24.8147 30.2821 22.0331Q31.5 19.1538 31.5 16Q31.5 12.8462 30.2821 9.96685Q29.1057 7.18534 26.9602 5.03984Q24.8146 2.89434 22.0331 1.71786Q19.1538 0.5 16 0.5L16 0.499998Z" fill-rule="nonzero" transform="matrix(1 0 0 1 3.5 3.5)" fill="#2569ed"/>
        <path d="M-0.5 -0.5L38.5 -0.5L38.5 38.5L-0.5 38.5L-0.5 -0.5ZM0.5 0.5L0.5 37.5L37.5 37.5L37.5 0.5L0.5 0.5Z" fill-rule="nonzero" transform="matrix(1 0 0 1 0.5 0.5)" fill="#2569ed"/>
        </g>
      </svg>
      <span class="logo-text">Jason Swetzoff</span>
      </a>
      </div>
      <button class="menu-toggle" aria-label="Toggle menu">
      <span class="plus-icon">
        <span class="vertical"></span>
        <span class="horizontal"></span>
      </span>
      </button>
      <nav>
      <ul>
   
        <li><a href="${isHomePage ? '#' : '/index.html#'}featured-projects" data-scroll="true">Work</a></li>
        <li><a href="${isHomePage ? '#' : '/index.html#'}about" data-scroll="true">About</a></li>
        <li><a href="${isHomePage ? '#' : '/index.html#'}quotes" data-scroll="true">Testimonials</a></li>
        <li><a href="https://www.linkedin.com/in/swetzoff/" class="button" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in new tab)">Say Hello!<svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 17 10-10"></path><path d="M7 7h10v10"></path></svg></a></li>

      </ul>
      </nav>
    </div>
    `;
        // Add event listeners
        const menuToggle = this.shadowRoot.querySelector('.menu-toggle');
        const nav = this.shadowRoot.querySelector('nav');
        menuToggle.addEventListener('click', (e)=>{
            e.preventDefault(); // Prevent any default behavior
            e.stopPropagation(); // Stop event bubbling
            this.isMenuOpen = !this.isMenuOpen;
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            // Keep focus on the button after click
            if (menuToggle instanceof HTMLElement) menuToggle.focus();
        });
        // Add smooth scrolling for section navigation (only on home page)
        if (isHomePage) {
            const scrollLinks = this.shadowRoot.querySelectorAll('a[data-scroll="true"]');
            scrollLinks.forEach((link)=>{
                link.addEventListener('click', (e)=>{
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Close mobile menu if open
                        this.isMenuOpen = false;
                        menuToggle.classList.remove('active');
                        nav.classList.remove('active');
                        // Smooth scroll to target using native behavior
                        const targetId = link.getAttribute('href');
                        if (targetId.startsWith('#')) window.location.hash = targetId;
                    }
                });
            });
            // Add scroll detection for active section highlighting
            const sections = [
                'hero',
                'featured-projects',
                'about',
                'quotes',
                'footer'
            ];
            this.updateActiveSection = ()=>{
                const headerHeight = this.offsetHeight || 80;
                const scrollPosition = window.scrollY + headerHeight + 100; // Increased offset for better detection
                let activeSection = 'hero'; // Default to hero
                // Check sections in order they appear on page
                for (const sectionId of sections){
                    const sectionElement = document.querySelector(`#${sectionId}`);
                    if (sectionElement instanceof HTMLElement && scrollPosition >= sectionElement.offsetTop) activeSection = sectionId;
                }
                // Update active states
                scrollLinks.forEach((link)=>{
                    const href = link.getAttribute('href');
                    const targetSection = href.replace(/^.*#/, ''); // Extract section name from href
                    if (targetSection === activeSection) link.classList.add('active');
                    else link.classList.remove('active');
                });
            };
            // Set initial active section
            this.updateActiveSection();
            // Listen for scroll events
            window.addEventListener('scroll', this.updateActiveSection, {
                passive: true
            });
        }
        // Handle scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    handleScroll() {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 10) // Changed from 50 to 10 for earlier animation
        this.classList.add('scrolled');
        else this.classList.remove('scrolled');
        this.lastScrollY = currentScrollY;
    }
    disconnectedCallback() {
        // Clean up event listeners
        if (this.updateActiveSection) window.removeEventListener('scroll', this.updateActiveSection);
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
}
exports.default = SiteHeader;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["2EAff"], null, "parcelRequire9b4d", {})

//# sourceMappingURL=SiteHeader.c7cde784.js.map
