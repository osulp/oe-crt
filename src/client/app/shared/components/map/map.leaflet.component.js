var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var MapLeafletComponent = (function () {
    function MapLeafletComponent() {
        this.currentCoords = [44, -121.5];
        this.currentZoom = 5.5;
        this.detailViewOffset = -300;
    }
    MapLeafletComponent.prototype.loadMap = function () {
        this.map = L.map('map', {
            zoomControl: false
        });
        var initialCoords = [44, -121.5];
        var initialZoom = this.viewType === 'detail' ? 6 : 5.5;
        this.map.setView(initialCoords, initialZoom);
        if (this.viewType === 'detail') {
            var mapScope_1 = this;
            console.log('leaflet', $('#find-compare-combine').width(), $(window).width());
            this.map.on('resize', function () {
                var mapCoords = mapScope_1.map.getCenter();
                mapScope_1.map.panToOffset(mapScope_1.currentCoords, [mapScope_1.detailViewOffset, 0]);
            });
        }
        var mapScope = this;
        this.map.createPane('labels');
        this.map.getPane('labels').style.zIndex = 650;
        this.map.getPane('labels').style.pointerEvents = 'none';
        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(this.map);
        var baseMapLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            pane: 'labels',
            minZoom: 1,
            maxZoom: 8
        });
        baseMapLabels.addTo(this.map);
        this.crt_layers = L.esri.dynamicMapLayer({
            url: 'http://lib-arcgis4.library.oregonstate.edu/arcgis/rest/services/people_communities/oe_crt/MapServer',
            opacity: 0.7,
            layers: [1, 2, 3],
            useCors: true
        }).addTo(this.map);
        baseMapLabels.bringToFront();
        var identifiedGeoJsonStyle = {
            'color': '#244068',
            'opacity': 0.2
        };
        this.identifiedLayer = L.geoJson(null, {
            style: identifiedGeoJsonStyle
        }).addTo(this.map);
        L.Control.zoomHome = L.Control.extend({
            options: {
                position: 'topright',
                zoomInText: '+',
                zoomInTitle: 'Zoom in',
                zoomOutText: '-',
                zoomOutTitle: 'Zoom out',
                zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
                zoomHomeTitle: 'Zoom home'
            },
            onAdd: function (map) {
                var controlName = 'gin-control-zoom', container = L.DomUtil.create('div', controlName + ' leaflet-bar'), options = this.options;
                this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle, controlName + '-in', container, this._zoomIn);
                this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle, controlName + '-home', container, this._zoomHomeWrapper);
                this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle, controlName + '-out', container, this._zoomOut);
                this._updateDisabled();
                map.on('zoomend zoomlevelschange', this._updateDisabled, this);
                return container;
            },
            onRemove: function (map) {
                map.off('zoomend zoomlevelschange', this._updateDisabled, this);
            },
            _zoomIn: function (e) {
                this._map.zoomIn(e.shiftKey ? 3 : 1);
            },
            _zoomOut: function (e) {
                this._map.zoomOut(e.shiftKey ? 3 : 1);
            },
            _zoomHomeWrapper: function (e) {
                this._zoomHome(e);
                var zoomScope = this;
                if (mapScope.viewType === 'detail') {
                    window.setTimeout(function () {
                        zoomScope._zoomHome(e);
                    }, 500);
                }
            },
            _zoomHome: function (e) {
                if (mapScope.viewType === 'detail') {
                    this._map.setZoom(6);
                    this._map.panToOffset([44, -121.5], [mapScope.detailViewOffset, 0]);
                }
                else {
                    this._map.setView([44, -121.5], 5.5);
                }
            },
            _createButton: function (html, title, className, container, fn) {
                var link = L.DomUtil.create('a', className, container);
                link.innerHTML = html;
                link.href = '#';
                link.title = title;
                L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                    .on(link, 'click', L.DomEvent.stop)
                    .on(link, 'click', fn, this)
                    .on(link, 'click', this._refocusOnMap, this);
                return link;
            },
            _updateDisabled: function () {
                var map = this._map, className = 'leaflet-disabled';
                L.DomUtil.removeClass(this._zoomInButton, className);
                L.DomUtil.removeClass(this._zoomOutButton, className);
                if (map._zoom === map.getMinZoom()) {
                    L.DomUtil.addClass(this._zoomOutButton, className);
                }
                if (map._zoom === map.getMaxZoom()) {
                    L.DomUtil.addClass(this._zoomInButton, className);
                }
            }
        });
        var zoomHome = new L.Control.zoomHome();
        zoomHome.addTo(this.map);
        var locate = L.control.locate({
            position: 'topright',
            icon: 'fa fa-location-arrow',
            setView: 'once',
        }).addTo(this.map);
        function onLocationFound(e) {
            window.setTimeout(locate.stop(), 5050);
            if (mapScope.viewType === 'detail') {
                mapScope.map.panToOffset(e.latlng, [mapScope.detailViewOffset, 100]);
            }
        }
        this.map.on('locationfound', onLocationFound);
        var countyBtn = this.createLayerBtn('Counties', 3);
        var tractBtn = this.createLayerBtn('Tracts', 2);
        var cityBtn = this.createLayerBtn('Cities', 1);
        L.easyBar([countyBtn, tractBtn, cityBtn]).addTo(this.map);
        if (this.viewType === 'detail') {
            var leftPadding = $('.crt-logo').css('padding-left');
            $('.leaflet-left').css('left', leftPadding);
            var rightPadding = (530 + parseInt(leftPadding.replace('px', ''))) + 'px';
            $('.leaflet-right').css('right', rightPadding);
        }
        this.crt_layers.bindPopup(function (error, featureCollection, resp) {
            if (error || featureCollection.features.length === 0) {
                mapScope.identifiedLayer.clearLayers();
                return false;
            }
            else {
                mapScope.identifiedLayer.clearLayers();
                var returnText = '';
                if (featureCollection.features.length > 0) {
                    mapScope.identifiedLayer.addData(featureCollection.features);
                    if (mapScope.viewType === 'detail') {
                        var mapCoords = mapScope.identifiedLayer.getBounds().getCenter();
                        mapScope.map.fitBounds(mapScope.identifiedLayer.getBounds(), {
                            paddingTopLeft: new L.Point(mapScope.detailViewOffset - 100, 100)
                        });
                    }
                    else {
                        mapScope.map.fitBounds(mapScope.identifiedLayer.getBounds());
                    }
                    var counties = featureCollection.features.filter(function (feature) { return feature.layerId === 3; });
                    var tracts = featureCollection.features.filter(function (feature) { return feature.layerId === 2; });
                    var cities = featureCollection.features.filter(function (feature) { return feature.layerId === 1; });
                    if (counties.length > 0) {
                        returnText += '<div class="ptHeading">County</div>';
                        counties.forEach(function (feature) {
                            returnText += '<div class="ptPlaceWrapper">';
                            returnText += '<div class="ptPlace">' + feature.properties.NAMELSAD10 + '</div>';
                            returnText += '</div>';
                        });
                    }
                    if (tracts.length > 0) {
                        returnText += '<div class="ptHeading">Census Tract</div>';
                        tracts.forEach(function (feature) {
                            returnText += '<div class="ptPlaceWrapper">';
                            returnText += '<div class="ptPlace">' + feature.properties.NAMELSAD10 + '</div>';
                            returnText += '<div class="ptContainsPartOf">';
                            returnText += feature.properties.CONTAINS_A !== '' ? '<span><b>Contains:</b> ' + feature.properties.CONTAINS_A + '</span>' : '';
                            returnText += feature.properties.PART_OF !== ' ' ? '<span><b>Part of:</b> ' + feature.properties.PART_OF + '</span>' : '';
                            returnText += '</div>';
                            returnText += '</div>';
                        });
                    }
                    if (cities.length > 0) {
                        returnText += '<div class="ptHeading">City</div>';
                        cities.forEach(function (feature) {
                            returnText += '<div class="ptPlaceWrapper">';
                            returnText += '<div class="ptPlace">' + feature.properties.name + '</div>';
                            returnText += '</div>';
                        });
                    }
                }
                return returnText;
            }
        }, {
            maxWidth: 200,
            minWidth: 100,
            maxHeight: 200,
            className: 'identLayersPopup',
        });
    };
    MapLeafletComponent.prototype.createLayerBtn = function (layerName, layerId) {
        var mapScope = this;
        var btn = L.easyButton({
            states: [{
                    stateName: 'layer-active',
                    icon: '<span>' + layerName + '</span>',
                    title: 'Turn ' + layerName + ' layer off',
                    onClick: function (btn, map) {
                        var currLayers = mapScope.crt_layers.getLayers();
                        currLayers.indexOf(layerId) === -1 ? currLayers.push(layerId) : currLayers.splice(currLayers.indexOf(layerId), 1);
                        mapScope.crt_layers.setLayers(currLayers);
                        btn.state('layer-inactive');
                    }
                },
                {
                    stateName: 'layer-inactive',
                    icon: '<span>' + layerName + '</span>',
                    title: 'Turn ' + layerName + ' layer on',
                    onClick: function (btn, map) {
                        var currLayers = mapScope.crt_layers.getLayers();
                        currLayers.indexOf(layerId) === -1 ? currLayers.push(layerId) : currLayers.splice(currLayers.indexOf(layerId), 1);
                        mapScope.crt_layers.setLayers(currLayers);
                        btn.state('layer-active');
                    }
                }
            ]
        });
        return btn;
    };
    MapLeafletComponent.prototype.ngOnInit = function () {
        console.log('mapload', this.viewType);
        try {
            console.log('mapload check offset', $('.crt-logo').css('padding-left'));
            this.loadMap();
        }
        catch (ex) {
            console.log(ex);
            this.loadMap();
        }
    };
    MapLeafletComponent.prototype.refreshMap = function () {
        window.dispatchEvent(new Event('resize'));
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MapLeafletComponent.prototype, "viewType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MapLeafletComponent.prototype, "isVisible", void 0);
    MapLeafletComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'leaflet-map',
            templateUrl: 'map.leaflet.component.html',
            styleUrls: ['map.leaflet.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], MapLeafletComponent);
    return MapLeafletComponent;
})();
exports.MapLeafletComponent = MapLeafletComponent;
//# sourceMappingURL=map.leaflet.component.js.map