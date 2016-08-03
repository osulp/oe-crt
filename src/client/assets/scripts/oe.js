//var map;

//require(["esri/map","application/bootstrapmap", "dojo/on", "esri/layers/WebTiledLayer", "dojo/domReady!"],
//    function (Map, BootstrapMap, on, WebTiledLayer) {
//        window.setTimeout(function () {

//            // Get a reference to the ArcGIS Map class
//            var map = BootstrapMap.create("viewDiv", {
//                basemap: "national-geographic",
//                center: [-122.45, 37.77],
//                zoom: 12,
//                scrollWheelZoom: false
//            });
//            function showMap(div, responsive, fillPage) {
//                if (map) {
//                    map.destroy();
//                    BootstrapMap.destroy(map);
//                }
//                if (responsive) {
//                    map = BootstrapMap.create(div, {
//                        basemap: "national-geographic",
//                        center: [-122.45, 37.77],
//                        zoom: 12,
//                        scrollWheelZoom: false
//                    });
//                } else {
//                    map = new Map(div, {
//                        basemap: "national-geographic",
//                        center: [-122.45, 37.77],
//                        zoom: 12,
//                        smartNavigation: false
//                    });
//                    on(map, "load", function () {
//                        map.disableScrollWheelZoom();
//                    });
//                }
//            }

//            //showMap("viewDiv", true);
//        }, 1000);

    //    });

    //window.setTimeout(function () {
    //    map = new Map("viewDiv", {
    //        center: [-122, 45],
    //        zoom: 7,
    //        basemap: "streets"
    //    });
    //    var tiledLayer = new WebTiledLayer("http://{subDomain}.tiles.mapbox.com/v4/censusreporter.map-j9q076fv/{level}/{col}/{row}.png?access_token=pk.eyJ1IjoibWFyY2dyIiwiYSI6ImNpamNhcGNkdzAwMTd0Z2trejBvd3l2NGEifQ.mzlA0ioTAIu0cF4ZdlvvEw", {
    //        "copyright": "MapBox and Census Reporter",
    //        "id": "MapBox and Census Reporter",
    //        "subDomains": ["a", "b", "c", "d"]
    //    });
    //    map.addLayer(tiledLayer);

    //}, 1000);
//});







/////-----AGS 4.03 BETA ----
//var map = null;
//require([
//  "esri/layers/WebTiledLayer",
//  "esri/Map",
//  "esri/views/MapView",
//  "dojo/domReady!"
//], function (WebTiledLayer, Map, MapView) {
//    //set timeout to actually wait for all returns.  I think it is a conflict with the Systemjs module loader of ng2 and dojo/domReady doing the same thing.  -mgr
//    window.setTimeout(function () {
//        map = new Map({
//            basemap: "",
//            autoResize: true
//        });
//        var view = new MapView({
//            container: "viewDiv",
//            map: map,
//            zoom: 7,
//            center: [-122, 45]
//        });

//        var tiledLayer = new WebTiledLayer({
//            urlTemplate: "http://{subDomain}.tiles.mapbox.com/v4/censusreporter.map-j9q076fv/{level}/{col}/{row}.png?access_token=pk.eyJ1IjoibWFyY2dyIiwiYSI6ImNpamNhcGNkdzAwMTd0Z2trejBvd3l2NGEifQ.mzlA0ioTAIu0cF4ZdlvvEw",
//            subDomains: ["a", "b", "c", "d"],
//            copyright: "MapBox and Census Reporter"
//        });

//        map.add(tiledLayer);
//    }, 1000);

//});


//////*********
/// Utility helper functions
//////*********

if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
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
                return value;
            }
        }
        return undefined;
    };
}


/*! Version: 0.52.0
Copyright (c) 2016 Dominik Moritz */

!function (a, b) { "function" == typeof define && define.amd ? define(["leaflet"], a) : "object" == typeof exports && ("undefined" != typeof b && b.L ? module.exports = a(L) : module.exports = a(require("leaflet"))), "undefined" != typeof b && b.L && (b.L.Control.Locate = a(L)) }(function (a) { var b = a.Control.extend({ options: { position: "topleft", layer: void 0, setView: "untilPan", keepCurrentZoomLevel: !1, clickBehavior: { inView: "stop", outOfView: "setView" }, drawCircle: !0, drawMarker: !0, markerClass: a.CircleMarker, circleStyle: { color: "#136AEC", fillColor: "#136AEC", fillOpacity: .15, weight: 2, opacity: .5 }, markerStyle: { color: "#136AEC", fillColor: "#2A93EE", fillOpacity: .7, weight: 2, opacity: .9, radius: 5 }, followCircleStyle: {}, followMarkerStyle: {}, icon: "fa fa-map-marker", iconLoading: "fa fa-spinner fa-spin", iconElementTag: "span", circlePadding: [0, 0], metric: !0, onLocationError: function (a, b) { alert(a.message) }, onLocationOutsideMapBounds: function (a) { a.stop(), alert(a.options.strings.outsideMapBoundsMsg) }, showPopup: !0, strings: { title: "Show me where I am", metersUnit: "meters", feetUnit: "feet", popup: "You are within {distance} {unit} from this point", outsideMapBoundsMsg: "You seem located outside the boundaries of the map" }, locateOptions: { maxZoom: 1 / 0, watch: !0, setView: !1 } }, initialize: function (b) { for (var c in b) "object" == typeof this.options[c] ? a.extend(this.options[c], b[c]) : this.options[c] = b[c]; this.options.followMarkerStyle = a.extend({}, this.options.markerStyle, this.options.followMarkerStyle), this.options.followCircleStyle = a.extend({}, this.options.circleStyle, this.options.followCircleStyle) }, onAdd: function (b) { var c = a.DomUtil.create("div", "leaflet-control-locate leaflet-bar leaflet-control"); return this._layer = this.options.layer || new a.LayerGroup, this._layer.addTo(b), this._event = void 0, this._link = a.DomUtil.create("a", "leaflet-bar-part leaflet-bar-part-single", c), this._link.href = "#", this._link.title = this.options.strings.title, this._icon = a.DomUtil.create(this.options.iconElementTag, this.options.icon, this._link), a.DomEvent.on(this._link, "click", a.DomEvent.stopPropagation).on(this._link, "click", a.DomEvent.preventDefault).on(this._link, "click", this._onClick, this).on(this._link, "dblclick", a.DomEvent.stopPropagation), this._resetVariables(), this._map.on("unload", this._unload, this), c }, _onClick: function () { if (this._justClicked = !0, this._userPanned = !1, this._active && !this._event) this.stop(); else if (this._active && void 0 !== this._event) { var a = this._map.getBounds().contains(this._event.latlng) ? this.options.clickBehavior.inView : this.options.clickBehavior.outOfView; switch (a) { case "setView": this.setView(); break; case "stop": this.stop() } } else this.start(); this._updateContainerStyle() }, start: function () { this._activate(), this._event && (this._drawMarker(this._map), this.options.setView && this.setView()), this._updateContainerStyle() }, stop: function () { this._deactivate(), this._cleanClasses(), this._resetVariables(), this._removeMarker() }, _activate: function () { this._active || (this._map.locate(this.options.locateOptions), this._active = !0, this._map.on("locationfound", this._onLocationFound, this), this._map.on("locationerror", this._onLocationError, this), this._map.on("dragstart", this._onDrag, this)) }, _deactivate: function () { this._map.stopLocate(), this._active = !1, this._map.off("locationfound", this._onLocationFound, this), this._map.off("locationerror", this._onLocationError, this), this._map.off("dragstart", this._onDrag, this) }, setView: function () { this._isOutsideMapBounds() ? this.options.onLocationOutsideMapBounds(this) : this.options.keepCurrentZoomLevel ? this._map.panTo([this._event.latitude, this._event.longitude]) : this._map.fitBounds(this._event.bounds, { padding: this.options.circlePadding, maxZoom: this.options.locateOptions.maxZoom }), this._drawMarker() }, _drawMarker: function () { void 0 === this._event.accuracy && (this._event.accuracy = 0); var b = this._event.accuracy, c = this._event.latlng; if (this.options.drawCircle) { var d = this._isFollowing() ? this.options.followCircleStyle : this.options.circleStyle; this._circle ? this._circle.setLatLng(c).setRadius(b).setStyle(d) : this._circle = a.circle(c, b, d).addTo(this._layer) } var e, f; if (this.options.metric ? (e = b.toFixed(0), f = this.options.strings.metersUnit) : (e = (3.2808399 * b).toFixed(0), f = this.options.strings.feetUnit), this.options.drawMarker) { var g = this._isFollowing() ? this.options.followMarkerStyle : this.options.markerStyle; this._marker ? this._marker.setLatLng(c).setStyle(g) : this._marker = new this.options.markerClass(c, g).addTo(this._layer) } var h = this.options.strings.popup; this.options.showPopup && h && this._marker && this._marker.bindPopup(a.Util.template(h, { distance: e, unit: f }))._popup.setLatLng(c) }, _removeMarker: function () { this._layer.clearLayers(), this._marker = void 0, this._circle = void 0 }, _unload: function () { this.stop(), this._map.off("unload", this._unload, this) }, _onLocationError: function (a) { 3 == a.code && this.options.locateOptions.watch || (this.stop(), this.options.onLocationError(a, this)) }, _onLocationFound: function (a) { if ((!this._event || this._event.latlng.lat !== a.latlng.lat || this._event.latlng.lng !== a.latlng.lng || this._event.accuracy !== a.accuracy) && this._active) { switch (this._event = a, this._drawMarker(), this._updateContainerStyle(), this.options.setView) { case "once": this._justClicked && this.setView(); break; case "untilPan": this._userPanned || this.setView(); break; case "always": this.setView(); break; case !1: } this._justClicked = !1 } }, _onDrag: function () { this._event && (this._userPanned = !0, this._updateContainerStyle(), this._drawMarker()) }, _isFollowing: function () { return this._active ? "always" === this.options.setView ? !0 : "untilPan" === this.options.setView ? !this._userPanned : void 0 : !1 }, _isOutsideMapBounds: function () { return void 0 === this._event ? !1 : this._map.options.maxBounds && !this._map.options.maxBounds.contains(this._event.latlng) }, _updateContainerStyle: function () { this._container && (this._active && !this._event ? this._setClasses("requesting") : this._isFollowing() ? this._setClasses("following") : this._active ? this._setClasses("active") : this._cleanClasses()) }, _setClasses: function (b) { "requesting" == b ? (a.DomUtil.removeClasses(this._container, "active following"), a.DomUtil.addClasses(this._container, "requesting"), a.DomUtil.removeClasses(this._icon, this.options.icon), a.DomUtil.addClasses(this._icon, this.options.iconLoading)) : "active" == b ? (a.DomUtil.removeClasses(this._container, "requesting following"), a.DomUtil.addClasses(this._container, "active"), a.DomUtil.removeClasses(this._icon, this.options.iconLoading), a.DomUtil.addClasses(this._icon, this.options.icon)) : "following" == b && (a.DomUtil.removeClasses(this._container, "requesting"), a.DomUtil.addClasses(this._container, "active following"), a.DomUtil.removeClasses(this._icon, this.options.iconLoading), a.DomUtil.addClasses(this._icon, this.options.icon)) }, _cleanClasses: function () { a.DomUtil.removeClass(this._container, "requesting"), a.DomUtil.removeClass(this._container, "active"), a.DomUtil.removeClass(this._container, "following"), a.DomUtil.removeClasses(this._icon, this.options.iconLoading), a.DomUtil.addClasses(this._icon, this.options.icon) }, _resetVariables: function () { this._active = !1, this._justClicked = !1, this._userPanned = !1 } }); return a.control.locate = function (b) { return new a.Control.Locate(b) }, function () { var b = function (b, c, d) { d = d.split(" "), d.forEach(function (d) { a.DomUtil[b].call(this, c, d) }) }; a.DomUtil.addClasses = function (a, c) { b("addClass", a, c) }, a.DomUtil.removeClasses = function (a, c) { b("removeClass", a, c) } }(), b }, window);

(function () {

    // This is for grouping buttons into a bar
    // takes an array of `L.easyButton`s and
    // then the usual `.addTo(map)`
    L.Control.EasyBar = L.Control.extend({

        options: {
            position: 'topleft',  // part of leaflet's defaults
            id: null,       // an id to tag the Bar with
            leafletClasses: true,        // use leaflet classes?
            text: 'Button Text'
        },


        initialize: function (buttons, options) {

            if (options) {
                L.Util.setOptions(this, options);
            }

            this._buildContainer();
            this._buttons = [];

            for (var i = 0; i < buttons.length; i++) {
                buttons[i]._bar = this;
                buttons[i]._container = buttons[i].button;
                this._buttons.push(buttons[i]);
                this.container.appendChild(buttons[i].button);
            }

        },


        _buildContainer: function () {
            this._container = this.container = L.DomUtil.create('div', '');
            this.options.leafletClasses && L.DomUtil.addClass(this.container, 'leaflet-bar easy-button-container leaflet-control');
            this.options.id && (this.container.id = this.options.id);
        },


        enable: function () {
            L.DomUtil.addClass(this.container, 'enabled');
            L.DomUtil.removeClass(this.container, 'disabled');
            this.container.setAttribute('aria-hidden', 'false');
            return this;
        },


        disable: function () {
            L.DomUtil.addClass(this.container, 'disabled');
            L.DomUtil.removeClass(this.container, 'enabled');
            this.container.setAttribute('aria-hidden', 'true');
            return this;
        },


        onAdd: function () {
            return this.container;
        },

        addTo: function (map) {
            this._map = map;

            for (var i = 0; i < this._buttons.length; i++) {
                this._buttons[i]._map = map;
            }

            var container = this._container = this.onAdd(map),
                pos = this.getPosition(),
                corner = map._controlCorners[pos];

            L.DomUtil.addClass(container, 'leaflet-control');

            if (pos.indexOf('bottom') !== -1) {
                corner.insertBefore(container, corner.firstChild);
            } else {
                corner.appendChild(container);
            }

            return this;
        }

    });

    L.easyBar = function () {
        var args = [L.Control.EasyBar];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        return new (Function.prototype.bind.apply(L.Control.EasyBar, args));
    };

    // L.EasyButton is the actual buttons
    // can be called without being grouped into a bar
    L.Control.EasyButton = L.Control.extend({

        options: {
            position: 'topleft',       // part of leaflet's defaults

            id: null,            // an id to tag the button with

            type: 'replace',       // [(replace|animate)]
            // replace swaps out elements
            // animate changes classes with all elements inserted

            states: [],              // state names look like this
            // {
            //   stateName: 'untracked',
            //   onClick: function(){ handle_nav_manually(); };
            //   title: 'click to make inactive',
            //   icon: 'fa-circle',    // wrapped with <a>
            // }

            leafletClasses: true      // use leaflet styles for the button
        },



        initialize: function (icon, onClick, title, id) {

            // clear the states manually
            this.options.states = [];

            // add id to options
            if (id != null) {
                this.options.id = id;
            }

            // storage between state functions
            this.storage = {};

            // is the last item an object?
            if (typeof arguments[arguments.length - 1] === 'object') {

                // if so, it should be the options
                L.Util.setOptions(this, arguments[arguments.length - 1]);
            }

            // if there aren't any states in options
            // use the early params
            if (this.options.states.length === 0 &&
                typeof icon === 'string' &&
                typeof onClick === 'function') {

                // turn the options object into a state
                this.options.states.push({
                    icon: icon,
                    onClick: onClick,
                    title: typeof title === 'string' ? title : ''
                });
            }

            // curate and move user's states into
            // the _states for internal use
            this._states = [];

            for (var i = 0; i < this.options.states.length; i++) {
                this._states.push(new State(this.options.states[i], this));
            }

            this._buildButton();

            this._activateState(this._states[0]);

        },

        _buildButton: function () {

            this.button = L.DomUtil.create('button', '');

            if (this.options.id) {
                this.button.id = this.options.id;
            }

            if (this.options.leafletClasses) {
                L.DomUtil.addClass(this.button, 'easy-button-button leaflet-bar-part leaflet-interactive');
            }

            // don't let double clicks and mousedown get to the map
            L.DomEvent.addListener(this.button, 'dblclick', L.DomEvent.stop);
            L.DomEvent.addListener(this.button, 'mousedown', L.DomEvent.stop);

            // take care of normal clicks
            L.DomEvent.addListener(this.button, 'click', function (e) {
                L.DomEvent.stop(e);
                this._currentState.onClick(this, this._map ? this._map : null);
                this._map.getContainer().focus();
            }, this);

            // prep the contents of the control
            if (this.options.type == 'replace') {
                this.button.appendChild(this._currentState.icon);
            } else {
                for (var i = 0; i < this._states.length; i++) {
                    this.button.appendChild(this._states[i].icon);
                }
            }
        },


        _currentState: {
            // placeholder content
            stateName: 'unnamed',
            icon: (function () { return document.createElement('span'); })()
        },



        _states: null, // populated on init



        state: function (newState) {

            // activate by name
            if (typeof newState == 'string') {

                this._activateStateNamed(newState);

                // activate by index
            } else if (typeof newState == 'number') {

                this._activateState(this._states[newState]);
            }

            return this;
        },


        _activateStateNamed: function (stateName) {
            for (var i = 0; i < this._states.length; i++) {
                if (this._states[i].stateName == stateName) {
                    this._activateState(this._states[i]);
                }
            }
        },

        _activateState: function (newState) {

            if (newState === this._currentState) {

                // don't touch the dom if it'll just be the same after
                return;

            } else {

                // swap out elements... if you're into that kind of thing
                if (this.options.type == 'replace') {
                    this.button.appendChild(newState.icon);
                    this.button.removeChild(this._currentState.icon);
                }

                if (newState.title) {
                    this.button.title = newState.title;
                } else {
                    this.button.removeAttribute('title');
                }

                // update classes for animations
                for (var i = 0; i < this._states.length; i++) {
                    L.DomUtil.removeClass(this._states[i].icon, this._currentState.stateName + '-active');
                    L.DomUtil.addClass(this._states[i].icon, newState.stateName + '-active');
                }

                // update classes for animations
                L.DomUtil.removeClass(this.button, this._currentState.stateName + '-active');
                L.DomUtil.addClass(this.button, newState.stateName + '-active');

                // update the record
                this._currentState = newState;

            }
        },



        enable: function () {
            L.DomUtil.addClass(this.button, 'enabled');
            L.DomUtil.removeClass(this.button, 'disabled');
            this.button.setAttribute('aria-hidden', 'false');
            return this;
        },



        disable: function () {
            L.DomUtil.addClass(this.button, 'disabled');
            L.DomUtil.removeClass(this.button, 'enabled');
            this.button.setAttribute('aria-hidden', 'true');
            return this;
        },


        removeFrom: function (map) {

            this._container.parentNode.removeChild(this._container);
            this._map = null;

            return this;
        },

        onAdd: function () {
            var containerObj = L.easyBar([this], {
                position: this.options.position,
                leafletClasses: this.options.leafletClasses
            });
            this._container = containerObj.container;
            return this._container;
        }


    });

    L.easyButton = function (/* args will pass automatically */) {
        var args = Array.prototype.concat.apply([L.Control.EasyButton], arguments);
        return new (Function.prototype.bind.apply(L.Control.EasyButton, args));
    };

    /*************************
     *
     * util functions
     *
     *************************/

    // constructor for states so only curated
    // states end up getting called
    function State(template, easyButton) {

        this.title = template.title;
        this.stateName = template.stateName ? template.stateName : 'unnamed-state';

        // build the wrapper
        this.icon = L.DomUtil.create('span', '');

        L.DomUtil.addClass(this.icon, 'button-state state-' + this.stateName.replace(/(^\s*|\s*$)/g, ''));
        this.icon.innerHTML = buildIcon(template.icon);
        this.onClick = L.Util.bind(template.onClick ? template.onClick : function () { }, easyButton);
    }

    function buildIcon(ambiguousIconString) {

        var tmpIcon;

        // does this look like html? (i.e. not a class)
        if (ambiguousIconString.match(/[&;=<>"']/)) {

            // if so, the user should have put in html
            // so move forward as such
            tmpIcon = ambiguousIconString;

            // then it wasn't html, so
            // it's a class list, figure out what kind
        } else {
            ambiguousIconString = ambiguousIconString.replace(/(^\s*|\s*$)/g, '');
            tmpIcon = L.DomUtil.create('span', '');

            if (ambiguousIconString.indexOf('fa-') === 0) {
                L.DomUtil.addClass(tmpIcon, 'fa ' + ambiguousIconString)
            } else if (ambiguousIconString.indexOf('glyphicon-') === 0) {
                L.DomUtil.addClass(tmpIcon, 'glyphicon ' + ambiguousIconString)
            } else {
                L.DomUtil.addClass(tmpIcon, /*rollwithit*/ ambiguousIconString)
            }

            // make this a string so that it's easy to set innerHTML below
            tmpIcon = tmpIcon.outerHTML;
        }

        return tmpIcon;
    }

})();

(function(previousMethods){
    if (typeof previousMethods === 'undefined') {
        // Defining previously that object allows you to use that plugin even if you have overridden L.map
        previousMethods = {
            getCenter: L.Map.prototype.getCenter,
            setView: L.Map.prototype.setView,
            setZoomAround: L.Map.prototype.setZoomAround,
            getBoundsZoom: L.Map.prototype.getBoundsZoom,
            scaleUpdate: L.Control.Scale.prototype._update,
            PopupAdjustPan: L.Popup.prototype._adjustPan
        };
    }


    L.Map.include({
        getBounds: function() {
            if (this._viewport) {
                return this.getViewportLatLngBounds()
            } else {
                var bounds = this.getPixelBounds(),
                sw = this.unproject(bounds.getBottomLeft()),
                ne = this.unproject(bounds.getTopRight());

                return new L.LatLngBounds(sw, ne);
            }
        },

        getViewport: function() {
            return this._viewport;
        },

        getViewportBounds: function() {
            var vp = this._viewport,
                topleft = L.point(vp.offsetLeft, vp.offsetTop),
                vpsize = L.point(vp.clientWidth, vp.clientHeight);

            if (vpsize.x === 0 || vpsize.y === 0) {
                //Our own viewport has no good size - so we fallback to the container size:
                vp = this.getContainer();
                if(vp){
                    topleft = L.point(0, 0);
                    vpsize = L.point(vp.clientWidth, vp.clientHeight);
                }

            }

            return L.bounds(topleft, topleft.add(vpsize));
        },

        getViewportLatLngBounds: function() {
            var bounds = this.getViewportBounds();
            return L.latLngBounds(this.containerPointToLatLng(bounds.min), this.containerPointToLatLng(bounds.max));
        },

        getOffset: function() {
            var mCenter = this.getSize().divideBy(2),
                vCenter = this.getViewportBounds().getCenter();

            return mCenter.subtract(vCenter);
        },

        getCenter: function () {
            var center = previousMethods.getCenter.call(this);

            if (this.getViewport()) {
                var zoom = this.getZoom(),
                    point = this.project(center, zoom);
                point = point.subtract(this.getOffset());

                center = this.unproject(point, zoom);
            }

            return center;
        },

        setView: function (center, zoom, options) {
            center = L.latLng(center);
            zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);

            if (this.getViewport()) {
                var point = this.project(center, this._limitZoom(zoom));
                point = point.add(this.getOffset());
                center = this.unproject(point, this._limitZoom(zoom));
            }

            return previousMethods.setView.call(this, center, zoom, options);
        },

        setZoomAround: function (latlng, zoom, options) {
            var vp = this.getViewport();

            if (vp) {
                var scale = this.getZoomScale(zoom),
                    viewHalf = this.getViewportBounds().getCenter(),
                    containerPoint = latlng instanceof L.Point ? latlng : this.latLngToContainerPoint(latlng),

                    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
                    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

                return this.setView(newCenter, zoom, {zoom: options});
            } else {
                return previousMethods.setZoomAround.call(this, latlng, zoom, options);
            }
        },

        getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
            bounds = L.latLngBounds(bounds);

            var zoom = this.getMinZoom() - (inside ? 1 : 0),
                maxZoom = this.getMaxZoom(),
                vp = this.getViewport(),
                size = (vp) ? L.point(vp.clientWidth, vp.clientHeight) : this.getSize(),

                nw = bounds.getNorthWest(),
                se = bounds.getSouthEast(),

                zoomNotFound = true,
                boundsSize;

            padding = L.point(padding || [0, 0]);

            do {
                zoom++;
                boundsSize = this.project(se, zoom).subtract(this.project(nw, zoom)).add(padding);
                zoomNotFound = !inside ? size.contains(boundsSize) : boundsSize.x < size.x || boundsSize.y < size.y;

            } while (zoomNotFound && zoom <= maxZoom);

            if (zoomNotFound && inside) {
                return null;
            }

            return inside ? zoom : zoom - 1;
        }
    });

    L.Control.Scale.include({
        _update: function () {
            if (!this._map._viewport) {
                previousMethods.scaleUpdate.call(this);
            } else {
                var bounds = this._map.getBounds(),
                    centerLat = bounds.getCenter().lat,
                    halfWorldMeters = 6378137 * Math.PI * Math.cos(centerLat * Math.PI / 180),
                    dist = halfWorldMeters * (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 180,
                    options = this.options,
                    maxMeters = 0;

                var size = new L.Point(
                    this._map._viewport.clientWidth,
                    this._map._viewport.clientHeight);

                if (size.x > 0) {
                    maxMeters = dist * (options.maxWidth / size.x);
                }

                this._updateScales(options, maxMeters);
            }
        }
    });

    L.Map.include({
        setActiveArea: function (css) {
            if( !this._viewport ){
                //Make viewport if not already made
                var container = this.getContainer();
                this._viewport = L.DomUtil.create('div', '');
                container.insertBefore(this._viewport, container.firstChild);
            }

            if (typeof css === 'string') {
                this._viewport.className = css;
            } else {
                L.extend(this._viewport.style, css);
            }
            return this;
        }
    });

    L.Popup.include({
        _adjustPan: function () {
            if (!this._map._viewport) {
                previousMethods.PopupAdjustPan.call(this);
            } else {
                if (!this.options.autoPan) { return; }

                var map = this._map,
                    vp = map._viewport,
                    containerHeight = this._container.offsetHeight,
                    containerWidth = this._containerWidth,
                    vpTopleft = L.point(vp.offsetLeft, vp.offsetTop),

                    layerPos = new L.Point(
                        this._containerLeft - vpTopleft.x,
                        - containerHeight - this._containerBottom - vpTopleft.y);

                if (this._animated) {
                    layerPos._add(L.DomUtil.getPosition(this._container));
                }

                var containerPos = map.layerPointToContainerPoint(layerPos),
                    padding = L.point(this.options.autoPanPadding),
                    paddingTL = L.point(this.options.autoPanPaddingTopLeft || padding),
                    paddingBR = L.point(this.options.autoPanPaddingBottomRight || padding),
                    size = L.point(vp.clientWidth, vp.clientHeight),
                    dx = 0,
                    dy = 0;

                if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
                    dx = containerPos.x + containerWidth - size.x + paddingBR.x;
                }
                if (containerPos.x - dx - paddingTL.x < 0) { // left
                    dx = containerPos.x - paddingTL.x;
                }
                if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
                    dy = containerPos.y + containerHeight - size.y + paddingBR.y;
                }
                if (containerPos.y - dy - paddingTL.y < 0) { // top
                    dy = containerPos.y - paddingTL.y;
                }

                if (dx || dy) {
                    map
                        .fire('autopanstart')
                        .panBy([dx, dy]);
                }
            }
        }
    });
})(window.leafletActiveAreaPreviousMethods);

L.Map.prototype.panToOffset = function (latlng, offset, options) {
    var x = this.latLngToContainerPoint(latlng).x - offset[0]
    var y = this.latLngToContainerPoint(latlng).y - offset[1]
    var point = this.containerPointToLatLng([x, y])
    return this.setView(point, this._zoom, { pan: options })
}