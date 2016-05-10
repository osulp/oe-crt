/*
  Copyright 2016 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
var esriSystem;
(function (esriSystem) {
    // return just the last part of a module name
    function moduleName(name, overrides) {
        if (overrides && overrides[name]) {
            return overrides[name];
        }
        else {
            return name.match(/[^\/]+$/).shift();
        }
    }
    // takes an array of modules and registers them as a module
    // with system.js using the given module name
    function _register(mods, names, options) {
        var opts = options || {};
        System.register(opts.outModuleName || 'esri', [], function (exp) {
            return {
                setters: [],
                execute: function () {
                    mods.map(function (mod, idx) {
                        exp(moduleName(names[idx], opts.moduleNameOverrides), mod);
                    });
                }
            };
        });
    }
    // load esri modules and expose via a System.js module
    function register(moduleNames, callback, options) {
        // TODO: config should be optional, parse from arguments
        // call Dojo's require to load esri modules
        require(moduleNames, function () {
            var modules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                modules[_i - 0] = arguments[_i];
            }
            // register a System.js module to wrap the required modules
            _register(modules, moduleNames, options);
            // call callback (if any)
            if (callback) {
                callback();
            }
        });
    }
    esriSystem.register = register;
    ;
})(esriSystem || (esriSystem = {}));
//# sourceMappingURL=esriSystem.js.map