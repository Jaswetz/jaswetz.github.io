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
})({"eCFUd":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "30ab8998850f3e7e";
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

},{}],"7PxOR":[function(require,module,exports,__globalThis) {
/**
 * ImageLightbox Web Component
 *
 * A accessible lightbox modal for viewing case study images in full size.
 * Supports keyboard navigation, touch gestures, and maintains WCAG 2.1 Level AA compliance.
 *
 * Features:
 * - Click on images to open in lightbox
 * - Keyboard navigation (ESC to close, arrow keys for navigation)
 * - Touch/swipe gestures on mobile
 * - Focus management for accessibility
 * - Image captions support
 * - Responsive design
 *
 * @extends HTMLElement
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class ImageLightbox extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: "open"
        });
        // State management
        this.isOpen = false;
        this.currentImageIndex = 0;
        this.images = [];
        this.originalFocusElement = null;
        // Touch handling for mobile gestures
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.minSwipeDistance = 50;
        // Bind methods to preserve context
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleImageClick = this.handleImageClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }
    connectedCallback() {
        this.render();
        this.initializeImageListeners();
        this.addLightboxHint();
        // Add resize listener for responsive behavior
        window.addEventListener("resize", this.handleResize);
    }
    disconnectedCallback() {
        // Clean up event listeners
        window.removeEventListener("resize", this.handleResize);
        this.removeImageListeners();
        // Remove global listeners if lightbox is open
        if (this.isOpen) document.removeEventListener("keydown", this.handleKeydown);
    }
    render() {
        this.shadowRoot.innerHTML = /*html*/ `
      <style>
        /* language=CSS */

        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--lightbox-bg);
          z-index: var(--lightbox-z-index);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: var(--lightbox-transition);
          padding: var(--space-m);
          box-sizing: border-box;
        }

        .lightbox--open {
          opacity: 1;
          visibility: visible;
        }

        .lightbox__container {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          transform: scale(0.8);
          transition: var(--lightbox-transition);
        }

        .lightbox--open .lightbox__container {
          transform: scale(1);
        }

        .lightbox__image {
          max-width: 100%;
          max-height: calc(90vh - 4rem); /* Reserve space for caption */
          object-fit: contain;
          border-radius: var(--border-radius-sm);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .lightbox__caption {
            font-size: var(--size-step--1);
            color: var(--color-surface);
            margin-top: var(--space-xs);
            margin-left: var(--space-xs);
            font-style: italic;
            line-height: var(--leading);
            text-align: center;
        }

        .lightbox__caption:empty {
          display: none;
        }

        .lightbox__instructions {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          clip-path: inset(50%);
          white-space: nowrap;
        }

        /* Navigation buttons */
        .lightbox__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: var(--touch-target-min);
          height: var(--touch-target-min);
          background: var(--button-bg);
          border: none;
          border-radius: 50%;
          color: var(--button-color);
          cursor: var(--button-cursor);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          transition: var(--button-transition);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .lightbox__nav:hover {
          background: var(--button-bg-hover);
          transform: translateY(-50%) scale(1.1);
        }

        .lightbox__nav:focus {
          outline: var(--focus-outline);
          outline-offset: var(--focus-outline-offset);
        }

        .lightbox__nav:disabled {
          opacity: var(--disabled-opacity);
          cursor: var(--disabled-cursor);
        }

        .lightbox__nav:disabled:hover {
          transform: translateY(-50%) scale(1);
          background: var(--button-bg);
        }

        .lightbox__nav--prev {
          left: var(--space-m);
        }

        .lightbox__nav--next {
          right: var(--space-m);
        }

        .lightbox__nav--single {
          display: none;
        }

        /* Close button */
        .lightbox__close {
          position: absolute;
          top: var(--space-m);
          right: var(--space-m);
          width: var(--touch-target-min);
          height: var(--touch-target-min);
          background: var(--button-bg);
          border: none;
          border-radius: 50%;
          color: var(--button-color);
          cursor: var(--button-cursor);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          transition: var(--button-transition);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .lightbox__close:hover {
          background: var(--button-bg-hover);
          transform: scale(1.1);
        }

        .lightbox__close:focus {
          outline: var(--focus-outline);
          outline-offset: var(--focus-outline-offset);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .lightbox {
            padding: var(--space-s);
          }

          .lightbox__container {
            max-width: 95vw;
            max-height: 95vh;
          }

          .lightbox__image {
            max-height: calc(95vh - 3rem);
          }

          .lightbox__nav {
            width: var(--touch-target-small);
            height: var(--touch-target-small);
            font-size: 1.2rem;
          }

          .lightbox__close {
            width: var(--touch-target-small);
            height: var(--touch-target-small);
            font-size: 1.2rem;
          }

          .lightbox__nav--prev {
            left: var(--space-s);
          }

          .lightbox__nav--next {
            right: var(--space-s);
          }

          .lightbox__close {
            top: var(--space-s);
            right: var(--space-s);
          }
        }

        /* Loading state */
        .lightbox__image--loading {
          opacity: 0.5;
        }

        /* Prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .lightbox,
          .lightbox__container,
          .lightbox__nav,
          .lightbox__close {
            transition: none;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .lightbox__nav,
          .lightbox__close {
            background: rgba(255, 255, 255, 0.95);
            color: #000000;
            border: 2px solid #000000;
          }

          .lightbox__caption {
            background: rgba(0, 0, 0, 0.95);
            color: #ffffff;
            padding: var(--space-xs);
            border-radius: var(--border-radius-sm);
          }

          .lightbox {
            background: rgba(0, 0, 0, 0.95);
          }
        }

        /* Ensure minimum contrast ratios */
        .lightbox__nav,
        .lightbox__close {
          background: rgba(0, 0, 0, 0.8);
          color: #ffffff;
        }

        .lightbox__nav:hover,
        .lightbox__close:hover {
          background: rgba(0, 0, 0, 0.9);
        }

        .lightbox__nav:focus,
        .lightbox__close:focus {
          background: rgba(0, 0, 0, 0.9);
          outline: 3px solid #ffffff;
          outline-offset: 2px;
        }
      </style>

      <div class="lightbox" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="lightbox-caption" aria-describedby="lightbox-instructions">
        <div class="lightbox__container">
          <button class="lightbox__close" type="button" aria-label="Close lightbox (Escape key)">
            \u{2715}
          </button>
          
          <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image (Left arrow key)">
            \u{2039}
          </button>
          
          <img class="lightbox__image" alt="Lightbox image placeholder" role="img" />
          
          <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image (Right arrow key)">
            \u{203A}
          </button>
          
          <p class="lightbox__caption" id="lightbox-caption"></p>
          <div class="lightbox__instructions" id="lightbox-instructions" aria-live="polite" aria-atomic="true">
            Use arrow keys to navigate between images, or Escape to close.
          </div>
        </div>
      </div>
    `;
        // Get DOM references
        this.lightboxEl = this.shadowRoot.querySelector(".lightbox");
        this.containerEl = this.shadowRoot.querySelector(".lightbox__container");
        this.imageEl = /** @type {HTMLImageElement} */ this.shadowRoot.querySelector(".lightbox__image");
        this.captionEl = this.shadowRoot.querySelector(".lightbox__caption");
        this.instructionsEl = this.shadowRoot.querySelector(".lightbox__instructions");
        this.closeBtn = /** @type {HTMLButtonElement} */ this.shadowRoot.querySelector(".lightbox__close");
        this.prevBtn = /** @type {HTMLButtonElement} */ this.shadowRoot.querySelector(".lightbox__nav--prev");
        this.nextBtn = /** @type {HTMLButtonElement} */ this.shadowRoot.querySelector(".lightbox__nav--next");
        // Add event listeners
        this.lightboxEl.addEventListener("click", this.handleBackdropClick);
        this.closeBtn.addEventListener("click", ()=>this.close());
        this.prevBtn.addEventListener("click", ()=>this.showPrevious());
        this.nextBtn.addEventListener("click", ()=>this.showNext());
        // Touch events for mobile gestures
        this.containerEl.addEventListener("touchstart", this.handleTouchStart, {
            passive: false
        });
        this.containerEl.addEventListener("touchend", this.handleTouchEnd, {
            passive: false
        });
    }
    /**
   * Add a visually hidden hint element for screen readers
   */ addLightboxHint() {
        // Check if hint element already exists
        if (document.getElementById("lightbox-hint")) return;
        const hint = document.createElement("div");
        hint.id = "lightbox-hint";
        hint.style.position = "absolute";
        hint.style.left = "-10000px";
        hint.style.width = "1px";
        hint.style.height = "1px";
        hint.style.overflow = "hidden";
        hint.style.clip = "rect(0, 0, 0, 0)";
        hint.style.clipPath = "inset(50%)";
        hint.style.whiteSpace = "nowrap";
        hint.textContent = "Click or press Enter to view in lightbox";
        document.body.appendChild(hint);
    }
    /**
   * Initialize click listeners on all images within the page
   */ initializeImageListeners() {
        // Find all images in figures that should be lightboxed
        const figures = document.querySelectorAll("figure img.project__img, figure img.project-summary__image");
        figures.forEach((_img, index)=>{
            const img = /** @type {HTMLImageElement} */ _img;
            // Store image data
            const figure = img.closest("figure");
            const caption = figure ? figure.querySelector("figcaption") : null;
            this.images.push({
                src: img.src,
                alt: img.alt,
                caption: caption ? caption.textContent.trim() : "",
                originalElement: img
            });
            // Add click listener
            img.addEventListener("click", (e)=>this.handleImageClick(e, index));
            // Add visual indicator that image is clickable
            img.style.cursor = "pointer";
            img.setAttribute("role", "button");
            img.setAttribute("tabindex", "0");
            img.setAttribute("aria-label", `View larger image: ${img.alt || "Unlabeled image"}`);
            img.setAttribute("aria-describedby", "lightbox-hint");
            // Add keyboard support for image activation
            img.addEventListener("keydown", (e)=>{
                const keyEvent = /** @type {KeyboardEvent} */ e;
                if (keyEvent.key === "Enter" || keyEvent.key === " " || keyEvent.key === "Space") {
                    e.preventDefault();
                    this.handleImageClick(e, index);
                }
            });
        });
    }
    /**
   * Remove all image click listeners
   */ removeImageListeners() {
        this.images.forEach((imageData)=>{
            if (imageData.originalElement) {
                imageData.originalElement.removeEventListener("click", this.handleImageClick);
                imageData.originalElement.removeEventListener("keydown", this.handleImageClick);
                imageData.originalElement.style.cursor = "";
                imageData.originalElement.removeAttribute("role");
                imageData.originalElement.removeAttribute("tabindex");
                imageData.originalElement.removeAttribute("aria-label");
            }
        });
    }
    /**
   * Handle image click events
   */ handleImageClick(event, index) {
        event.preventDefault();
        this.open(index);
    }
    /**
   * Handle backdrop clicks to close lightbox
   */ handleBackdropClick(event) {
        if (event.target === this.lightboxEl) this.close();
    }
    /**
   * Handle keyboard navigation
   */ handleKeydown(event) {
        if (!this.isOpen) return;
        switch(event.key){
            case "Escape":
                event.preventDefault();
                this.close();
                break;
            case "ArrowLeft":
                event.preventDefault();
                this.showPrevious();
                break;
            case "ArrowRight":
                event.preventDefault();
                this.showNext();
                break;
            case "Tab":
                // Trap focus within the lightbox
                this.trapFocus(event);
                break;
            case "Home":
                event.preventDefault();
                if (this.images.length > 0) {
                    this.loadImage(0);
                    this.currentImageIndex = 0;
                    this.updateNavigation();
                    this.announceToScreenReader(`First image. Image 1 of ${this.images.length}.`);
                }
                break;
            case "End":
                event.preventDefault();
                if (this.images.length > 0) {
                    const lastIndex = this.images.length - 1;
                    this.loadImage(lastIndex);
                    this.currentImageIndex = lastIndex;
                    this.updateNavigation();
                    this.announceToScreenReader(`Last image. Image ${this.images.length} of ${this.images.length}.`);
                }
                break;
        }
    }
    /**
   * Trap focus within the lightbox for accessibility
   */ trapFocus(event) {
        const focusableElements = this.shadowRoot.querySelectorAll("button:not([disabled]), [tabindex]:not([tabindex=\"-1\"])");
        const firstFocusable = /** @type {HTMLElement} */ focusableElements[0];
        const lastFocusable = /** @type {HTMLElement} */ focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
        }
    }
    /**
   * Handle touch start for mobile gestures
   */ handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
    }
    /**
   * Handle touch end for mobile gestures
   */ handleTouchEnd(event) {
        if (!this.touchStartX || !this.touchStartY) return;
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const deltaX = this.touchStartX - touchEndX;
        const deltaY = this.touchStartY - touchEndY;
        // Check if it's a horizontal swipe (not vertical scroll)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
            if (deltaX > 0) // Swiped left - show next image
            this.showNext();
            else // Swiped right - show previous image
            this.showPrevious();
        }
        // Reset touch coordinates
        this.touchStartX = 0;
        this.touchStartY = 0;
    }
    /**
   * Handle window resize events
   */ handleResize() {
    // Could add logic here to adjust lightbox layout on resize if needed
    }
    /**
   * Open the lightbox with a specific image
   */ open(imageIndex = 0) {
        if (this.images.length === 0) return;
        this.currentImageIndex = Math.max(0, Math.min(imageIndex, this.images.length - 1));
        this.isOpen = true;
        // Store current focus element for restoration
        this.originalFocusElement = document.activeElement;
        // Prevent body scroll
        document.body.style.overflow = "hidden";
        // Show lightbox
        this.lightboxEl.classList.add("lightbox--open");
        this.lightboxEl.setAttribute("aria-hidden", "false");
        // Load and display the image
        this.loadImage(this.currentImageIndex);
        // Update navigation buttons
        this.updateNavigation();
        // Add keyboard listener
        document.addEventListener("keydown", this.handleKeydown);
        // Focus management - focus the close button
        setTimeout(()=>{
            /** @type {HTMLButtonElement} */ this.closeBtn.focus();
        }, 100);
        // Announce to screen readers with more detailed information
        const totalImages = this.images.length;
        const currentNum = this.currentImageIndex + 1;
        const currentImage = this.images[this.currentImageIndex];
        let announcement = `Lightbox opened. Viewing image ${currentNum} of ${totalImages}`;
        if (currentImage.caption) announcement += `. Image caption: ${currentImage.caption}`;
        if (totalImages > 1) announcement += ". Use arrow keys to navigate between images.";
        announcement += " Press Escape to close.";
        this.announceToScreenReader(announcement);
    }
    /**
   * Close the lightbox
   */ close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        // Restore body scroll
        document.body.style.overflow = "";
        // Hide lightbox
        this.lightboxEl.classList.remove("lightbox--open");
        this.lightboxEl.setAttribute("aria-hidden", "true");
        // Remove keyboard listener
        document.removeEventListener("keydown", this.handleKeydown);
        // Restore focus
        if (this.originalFocusElement) {
            /** @type {HTMLElement} */ this.originalFocusElement.focus();
            this.originalFocusElement = null;
        }
        // Announce to screen readers
        this.announceToScreenReader("Lightbox closed.");
    }
    /**
   * Show the previous image
   */ showPrevious() {
        if (this.images.length <= 1) return;
        const newIndex = this.currentImageIndex > 0 ? this.currentImageIndex - 1 : this.images.length - 1;
        this.loadImage(newIndex);
        this.currentImageIndex = newIndex;
        this.updateNavigation();
        // More descriptive announcement for screen readers
        const currentImage = this.images[this.currentImageIndex];
        let announcement = `Previous image. Now viewing image ${this.currentImageIndex + 1} of ${this.images.length}`;
        if (currentImage.caption) announcement += `. ${currentImage.caption}`;
        this.announceToScreenReader(announcement);
    }
    /**
   * Show the next image
   */ showNext() {
        if (this.images.length <= 1) return;
        const newIndex = this.currentImageIndex < this.images.length - 1 ? this.currentImageIndex + 1 : 0;
        this.loadImage(newIndex);
        this.currentImageIndex = newIndex;
        this.updateNavigation();
        // More descriptive announcement for screen readers
        const currentImage = this.images[this.currentImageIndex];
        let announcement = `Next image. Now viewing image ${this.currentImageIndex + 1} of ${this.images.length}`;
        if (currentImage.caption) announcement += `. ${currentImage.caption}`;
        this.announceToScreenReader(announcement);
    }
    /**
   * Load an image by index
   */ loadImage(index) {
        if (!this.images[index]) return;
        const imageData = this.images[index];
        // Add loading state
        this.imageEl.classList.add("lightbox__image--loading");
        // Create a new image to preload and check if it loads successfully
        const tempImage = new Image();
        tempImage.onload = ()=>{
            // Only set the src after we know the image loads
            this.imageEl.src = imageData.src;
            this.imageEl.alt = imageData.alt || `Image ${index + 1} of ${this.images.length}`;
            this.imageEl.classList.remove("lightbox__image--loading");
            // Update ARIA label for better context
            this.imageEl.setAttribute("aria-label", imageData.alt ? `${imageData.alt}. Image ${index + 1} of ${this.images.length}` : `Image ${index + 1} of ${this.images.length}`);
        };
        tempImage.onerror = ()=>{
            console.warn(`Failed to load image: ${imageData.src}`);
            // Still set the src and remove loading state to show broken image
            this.imageEl.src = imageData.src;
            this.imageEl.alt = imageData.alt;
            this.imageEl.classList.remove("lightbox__image--loading");
            // Update ARIA label for error state
            this.imageEl.setAttribute("aria-label", `Failed to load image ${index + 1} of ${this.images.length}${imageData.alt ? `: ${imageData.alt}` : ""}`);
            // Announce error to screen readers
            this.announceToScreenReader(`Error loading image ${index + 1}. ${imageData.alt || "No description available"}.`);
        };
        // Start loading the image
        tempImage.src = imageData.src;
        // Update caption
        this.captionEl.textContent = imageData.caption;
    }
    /**
   * Update navigation button states
   */ updateNavigation() {
        const hasMultipleImages = this.images.length > 1;
        // Show/hide navigation buttons based on image count
        if (hasMultipleImages) {
            this.prevBtn.classList.remove("lightbox__nav--single");
            this.nextBtn.classList.remove("lightbox__nav--single");
        } else {
            this.prevBtn.classList.add("lightbox__nav--single");
            this.nextBtn.classList.add("lightbox__nav--single");
        }
        // Update button states (for future implementation of linear navigation)
        this.prevBtn.disabled = false; // Enable cycling
        this.nextBtn.disabled = false; // Enable cycling
    }
    /**
   * Announce messages to screen readers
   * @param {string} message - The message to announce
   * @param {string} priority - The aria-live priority ('polite' or 'assertive')
   */ announceToScreenReader(message, priority = "polite") {
        // Create a temporary element for screen reader announcements
        const announcement = document.createElement("div");
        announcement.setAttribute("aria-live", priority);
        announcement.setAttribute("aria-atomic", "true");
        announcement.style.position = "absolute";
        announcement.style.left = "-10000px";
        announcement.style.width = "1px";
        announcement.style.height = "1px";
        announcement.style.overflow = "hidden";
        announcement.style.clip = "rect(0, 0, 0, 0)";
        announcement.style.clipPath = "inset(50%)";
        announcement.style.whiteSpace = "nowrap";
        document.body.appendChild(announcement);
        // Add the message after a brief delay to ensure it's announced
        setTimeout(()=>{
            announcement.textContent = message;
        }, 10);
        // Remove the announcement element after a short delay
        setTimeout(()=>{
            if (announcement.parentNode) document.body.removeChild(announcement);
        }, 1500);
    }
}
// Register the custom element
customElements.define("image-lightbox", ImageLightbox);
exports.default = ImageLightbox;

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

},{}]},["eCFUd"], null, "parcelRequire9b4d", {})

//# sourceMappingURL=ImageLightbox.850f3e7e.js.map
