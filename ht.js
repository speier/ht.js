/*
** ht.js - Hogan templates plugin for RequireJS (based on James Burke's text plugin).
** See http://github.com/speier/ht.js/ for more info.
*/

(function () {
    var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = [];

    define(['hogan'], function (Hogan) {
        var ht, get, fs;

        if (typeof window !== "undefined" && window.navigator && window.document) {
            get = function (url, callback) {
                var xhr = ht.createXhr();
                xhr.open('GET', url, true);
                xhr.onreadystatechange = function (evt) {
                    // Do not explicitly handle errors, those should be visible via console output in the browser.
                    if (xhr.readyState === 4) {
                        var template = Hogan.compile(xhr.responseText);
                        callback(template);
                    }
                };
                xhr.send(null);
            };
        } else if (typeof process !== "undefined" && process.versions && !!process.versions.node) {
            // Using special require.nodeRequire, something added by r.js.
            var fs = require.nodeRequire('fs');
            var hogan = require.nodeRequire('hogan.js');
            get = function (url, callback) {
                var template = fs.readFileSync(url, 'utf8');
                // We use utf-8, so remove BOM (Byte Mark Order)
                if (template.charCodeAt(0) == 65279) {
                    template = template.substring(1);
                }
                var compiled = hogan.compile(template, { asString: true });
                callback(compiled);
            };
        }

        ht = {
            version: '1.0.0',

            createXhr: function () {
                // Would love to dump the ActiveX crap in here. Need IE 6 to die first.
                var xhr, i, progId;
                if (typeof XMLHttpRequest !== "undefined") {
                    return new XMLHttpRequest();
                } else {
                    for (i = 0; i < 3; i++) {
                        progId = progIds[i];
                        try {
                            xhr = new ActiveXObject(progId);
                        } catch (e) { }

                        if (xhr) {
                            progIds = [progId];  // so faster next time
                            break;
                        }
                    }
                }

                if (!xhr) {
                    throw new Error("createXhr(): XMLHttpRequest not available");
                }

                return xhr;
            },

            get: get,

            xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

            /**
            * Is an URL on another domain. Only works for browser use, returns
            * false in non-browser environments. Only used to know if an
            * optimized .js version of a text resource should be loaded
            * instead.
            * @param {String} url
            * @returns Boolean
            */
            useXhr: function (url, protocol, hostname, port) {
                var match = ht.xdRegExp.exec(url),
                    uProtocol, uHostName, uPort;
                if (!match) {
                    return true;
                }
                uProtocol = match[2];
                uHostName = match[3];

                uHostName = uHostName.split(':');
                uPort = uHostName[1];
                uHostName = uHostName[0];

                return (!uProtocol || uProtocol === protocol) &&
                       (!uHostName || uHostName === hostname) &&
                       ((!uPort && !uHostName) || uPort === port);
            },

            finishLoad: function (name, content, onLoad, config) {
                if (config.isBuild) {
                    buildMap[name] = content;
                }
                onLoad(content);
            },

            load: function (name, req, onLoad, config) {
                // Do not bother with the work if a build and text will not be inlined.
                if (config.isBuild && !config.inlineText) {
                    onLoad();
                    return;
                }

                var url = req.toUrl(name);
                var useXhr = (config && config.ht && config.ht.useXhr) || ht.useXhr;

                // Load the template. Use XHR if possible and in a browser.
                if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                    ht.get(url, function (content) {
                        ht.finishLoad(name, content, onLoad, config);
                    });
                } else {
                    // Need to fetch the resource across domains.
                    // Assume the resource has been optimized into a JS module.
                    // Fetch by the module name.
                    req([name], function (content) {
                        ht.finishLoad(name, content, onLoad, config);
                    });
                }
            },

            write: function (pluginName, moduleName, write, config) {
                if (moduleName in buildMap) {
                    var content = buildMap[moduleName];
                    write.asModule(pluginName + "!" + moduleName,
                                   "define(['hogan'], function (Hogan) {" +
                                       "return new Hogan.Template(" + content + ");" +
                                   "});\n");
                }
            }
        };

        return ht;
    });
} ());
