import { Component, Input, Output, OnInit, EventEmitter, OnChanges } from '@angular/core';
import {Router} from '@angular/router';

declare var L: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'leaflet-map',
    templateUrl: 'map.leaflet.component.html',
    styleUrls: ['map.leaflet.component.css']
})
export class MapLeafletComponent implements OnInit, OnChanges {
    @Input() viewType: string;
    @Input() isVisible: boolean;
    @Input() selectedPlaces: any;
    @Input() refresh: boolean;
    @Output() onPlaceSelected = new EventEmitter();
    map: any;
    crt_layers: any;
    identifiedLayer: any;
    selectedLayer: any;
    currentCoords: any[] = [44, -121.5];
    currentZoom: number = 5.5;
    detailViewOffset: number = -300;
    crt_layers_url: string = 'https://lib-gis2.library.oregonstate.edu/arcgis/rest/services/demographics/oe_crt/MapServer';
    crt_layer_cities_id: number = 1;
    crt_layer_tracts_id: number = 2;
    crt_layer_counties_id: number = 3;
    processedCity: boolean = false;
    processedCounty: boolean = false;
    processedTract: boolean = false;
    tempPlaces: any[] = [];
    oregon: any = {
        Name: 'Oregon',
        ResID: '41',
        Type: 'Oregon',
        TypeCategory: 'State',
        Desc: 'Oregon'
    };
    california: any = {
        Name: 'California',
        ResID: '06',
        Type: 'California',
        TypeCategory: 'State',
        Desc: 'California'
    };
    labels: any = {};
    countyBtn: any;
    tractBtn: any;
    cityBtn: any;
    isMobile: boolean = $(window).width() < 767;

    constructor(private _router: Router) { }

    loadMap() {
        console.log('start loadmap', this.selectedPlaces);
        if (!this.map) {
            this.map = L.map('map', {
                zoomControl: false
            });
            this.setInitialMapView();
            let mapScope = this;
            this.map.on('popupopen', function (evt: any) {
                console.log('popup', evt);
                mapScope.handlePopupPlaceClick(mapScope);
            });

            this.map.createPane('labels');
            this.map.getPane('labels').style.zIndex = 650;
            this.map.getPane('labels').style.pointerEvents = 'none';


            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
            }).addTo(this.map);

            let baseMapLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> &copy; <a href="https://cartodb.com/attributions">CartoDB</a>',
                pane: 'labels',
                minZoom: 1,
                maxZoom: this.viewType === 'indicatorDetail' && !this.isMobile ? 7 : 8
            });
            baseMapLabels.addTo(this.map);

            //check if a census tract is included in selected layers and turn on
            let ctTypes = ['Tracts', 'Unincorporated Place'];

            let hasCT = this.selectedPlaces ? this.selectedPlaces.filter((place: any) => ctTypes.indexOf(place.TypeCategory) !== -1) : [];

            this.crt_layers = L.esri.dynamicMapLayer({
                url: this.crt_layers_url,
                opacity: 0.7,
                layers: hasCT.length > 0 ? [this.crt_layer_cities_id, this.crt_layer_tracts_id, this.crt_layer_counties_id] : [this.crt_layer_cities_id, this.crt_layer_counties_id],
                useCors: true
            }).addTo(this.map);

            baseMapLabels.bringToFront();

            let identifiedGeoJsonStyle = {
                'color': '#C34500',
                'opacity': 0.2
            };

            let selectedLayerStyle = {
                'color': '#244068',
                'opacity': 0.2
            };

            this.identifiedLayer = L.geoJson(null, {
                style: identifiedGeoJsonStyle
            }).addTo(this.map);

            this.selectedLayer = L.geoJson(null, {
                style: selectedLayerStyle,
                //onEachFeature: function (feature: any, layer: any) {
                //    ;
                //    //var id = feature.id;
                //    //works, but not sure if needed
                //    //var label = L.marker(layer.getBounds().getCenter(), {
                //    //    icon: L.divIcon({
                //    //        className: 'label',
                //    //        html: feature.properties.namelsad10 ? feature.properties.namelsad10 : feature.properties.name,
                //    //        iconSize: [100, 40]
                //    //    })
                //    //}).addTo(mapScope.map);
                //    //mapScope.labels[id] = label;
                //}
            }).addTo(this.map);

            this.map.on('popupclose', function (e: any) {
                mapScope.identifiedLayer.clearLayers();
            });

            // custom zoom bar control that includes a Zoom Home function
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

                onAdd: function (map: any) {
                    var controlName = 'gin-control-zoom',
                        container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
                        options = this.options;

                    this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
                        controlName + '-in', container, this._zoomIn);
                    this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
                        controlName + '-home', container, this._zoomHomeWrapper);
                    this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
                        controlName + '-out', container, this._zoomOut);

                    this._updateDisabled();
                    map.on('zoomend zoomlevelschange', this._updateDisabled, this);

                    return container;
                },

                onRemove: function (map: any) {
                    map.off('zoomend zoomlevelschange', this._updateDisabled, this);
                },

                _zoomIn: function (e: any) {
                    this._map.zoomIn(e.shiftKey ? 3 : 1);
                },

                _zoomOut: function (e: any) {
                    this._map.zoomOut(e.shiftKey ? 3 : 1);
                },

                _zoomHomeWrapper: function (e: any) {
                    this._zoomHome(e);
                    let zoomScope = this;
                    if (mapScope.viewType === 'indicatorDetail' && !mapScope.isMobile) {
                        window.setTimeout(function () {
                            zoomScope._zoomHome(e);
                        }, 500);
                    }
                },
                _zoomHome: function (e: any) {
                    if (mapScope.viewType === 'indicatorDetail' && !mapScope.isMobile) {
                        this._map.setZoom(6);
                        this._map.panToOffset([44, -121.5], [mapScope.detailViewOffset, 0]);
                    } else {
                        this._map.setView([44, -121.5], 5.5);
                    }
                },

                _createButton: function (html: any, title: any, className: any, container: any, fn: any) {
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
                    var map = this._map,
                        className = 'leaflet-disabled';

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
            // add the new control to the map
            var zoomHome = new L.Control.zoomHome();
            zoomHome.addTo(this.map);

            //plugin https://github.com/domoritz/leaflet-locatecontrol
            let locate = L.control.locate({
                position: 'topright',
                icon: 'fa fa-location-arrow',
                setView: 'once',
            });
            locate.addTo(this.map);

            function onLocationFound(e: any) {
                //console.log('ive been located!', e);
                //window.setTimeout(locate.stop(), 5050);
                if (mapScope.viewType === 'indicatorDetail' && !mapScope.isMobile) {
                    //let mapCoords = mapScope.identifiedLayer.getBounds().getCenter();
                    mapScope.map.panToOffset(e.latlng, [mapScope.detailViewOffset, 100]);
                    //locate.stop();
                }

                //var radius = e.accuracy / 2;
                //L.circle(e.latlng, radius).addTo(mapScope.map);
                //mapScope.map.fitBounds(L.circle(e.latlng, radius).getBounds());

            }

            this.map.on('locationfound', onLocationFound);

            this.countyBtn = this.createLayerBtn('Counties', 3);
            this.tractBtn = this.createLayerBtn('Tracts', 2);
            this.cityBtn = this.createLayerBtn('Cities', 1);

            L.easyBar([this.countyBtn, this.tractBtn, this.cityBtn]).addTo(this.map);
            if (hasCT.length === 0) {
                this.tractBtn.state('layer-inactive');
            }
            this.setDetailView();

            this.crt_layers.bindPopup(function (error: any, featureCollection: any, resp: any): any {
                if (error || featureCollection.features.length === 0) {
                    mapScope.identifiedLayer.clearLayers();
                    return false;
                } else {
                    mapScope.identifiedLayer.clearLayers();
                    let returnText = '';
                    // make sure at least one feature was identified.
                    if (featureCollection.features.length > 0) {
                        mapScope.identifiedLayer.addData(featureCollection.features);
                        if (mapScope.viewType === 'indicatorDetail' && !mapScope.isMobile) {
                            //let mapCoords = mapScope.identifiedLayer.getBounds().getCenter();
                            mapScope.map.fitBounds(mapScope.identifiedLayer.getBounds(), {
                                paddingTopLeft: new L.Point(mapScope.detailViewOffset - 100, 100)
                            });
                        } else {
                            mapScope.map.fitBounds(mapScope.identifiedLayer.getBounds());
                        }
                        let counties = featureCollection.features.filter((feature: any) => feature.layerId === mapScope.crt_layer_counties_id);
                        let tracts = featureCollection.features.filter((feature: any) => feature.layerId === mapScope.crt_layer_tracts_id);
                        let cities = featureCollection.features.filter((feature: any) => feature.layerId === mapScope.crt_layer_cities_id);
                        if (counties.length > 0) {
                            returnText += '<div class="ptHeading">County</div>';
                            counties.forEach((feature: any) => {
                                //console.log('county prop', feature.properties);
                                let featProp = mapScope.createDataFeature('County', feature.properties);
                                returnText += '<div class="ptPlaceWrapper" data-feature=\'' + featProp + '\'>';
                                returnText += '<div class="ptPlace">' + feature.properties.NAMELSAD10 + '</div>';
                                returnText += '</div>';
                            });
                        }
                        if (tracts.length > 0) {
                            returnText += '<div class="ptHeading">Census Tract</div>';
                            tracts.forEach((feature: any) => {
                                let featProp = mapScope.createDataFeature('Tract', feature.properties);
                                returnText += '<div class="ptPlaceWrapper" data-feature=\'' + featProp + '\'>';
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
                            cities.forEach((feature: any) => {
                                let featProp = mapScope.createDataFeature('City', feature.properties);
                                returnText += '<div class="ptPlaceWrapper" data-feature=\'' + featProp + '\'>';
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
                    //offset: { x: 0, y: 6 },
                    className: 'identLayersPopup',
                    //autoPanPaddingTopLeft: {x:80,y:10}
                });
        }
    }

    handlePopupPlaceClick(mapScope: any) {
        $('.ptPlaceWrapper').on('click', function (feature: any) {
            let place = $(feature.currentTarget).data('feature');
            console.log('saw the blood', place, mapScope);
            if (!mapScope.viewType) {
                //on home add to url and go to explore page
                let places = '';
                if (place.ResID.indexOf('41') === 0) {
                    places = encodeURIComponent(JSON.stringify(mapScope.oregon));
                } else {
                    places = encodeURIComponent(JSON.stringify(mapScope.california));
                }
                place = encodeURIComponent(JSON.stringify(place));
                places += ',' + place;
                mapScope._router.navigate(['Explore', { places: places }]);
                window.scrollTo(0, 0);
            } else {
                //remove from identified layer
                let identLayer = mapScope.identifiedLayer.getLayers().filter((layer: any) => {
                    return layer.feature.properties.GEOID10 ? layer.feature.properties.GEOID10 === $(feature.currentTarget).data('feature').ResID : layer.feature.properties.geoid === $(feature.currentTarget).data('feature').ResID;

                });
                console.log('removing layer', identLayer);
                mapScope.identifiedLayer.removeLayer(identLayer[0]);
                console.log('identLayer', mapScope.identifiedLayer.getLayers());
                //add to selected layer
                console.log('saw the blood', $(feature.currentTarget).data('feature'));
                mapScope.onPlaceSelected.emit($(feature.currentTarget).data('feature'));
            }
        });
    }
    setDetailView() {
        if (this.viewType === 'indicatorDetail' && !this.isMobile) {
            let leftPadding = $('.crt-logo').css('padding-left');
            $('.leaflet-left').css('left', leftPadding);
            //let placeSelWidth = $('#toggleViewRow').width(); 530px;
            let rightPadding = (530 + parseInt(leftPadding.replace('px', ''))) + 'px';
            $('.leaflet-right').css('right', rightPadding);
        }
    }
    setInitialMapView() {
        let initialCoords = [44, -121.5];
        let initialZoom = this.viewType === 'indicatorDetail' && !this.isMobile ? 6 : 5.5;
        this.map.setView(initialCoords, initialZoom);
        let mapScope = this;
        if (this.viewType === 'indicatorDetail' && !this.isMobile) {
            //set offset
            //console.log('leaflet', $('#find-compare-combine').width(), $(window).width());
            window.setTimeout(function () {
                mapScope.map.panToOffset(mapScope.map.getCenter(), [mapScope.detailViewOffset, 0]);
            }, 500);
            var timeOut: any;
            this.map.on('resize', function () {
                //let mapCoords = mapScope.map.getCenter();
                console.log('mapresizing');
                clearTimeout(timeOut);
                timeOut = setTimeout(function () {
                    if (mapScope.selectedLayer.getLayers().length > 0) {
                        let center = mapScope.selectedLayer.getBounds().getCenter();
                        mapScope.map.panToOffset(center, [mapScope.detailViewOffset, 0]);
                        //window.setTimeout(function () {
                        //    mapScope.map.panToOffset(mapScope.map.getCenter(), [mapScope.detailViewOffset, 0]);
                        //}, 350);
                    } else {
                        mapScope.map.panToOffset(mapScope.map.getCenter(), [mapScope.detailViewOffset, 0]);
                    }
                }, 500);
                mapScope.setDetailView();
            });
        }
    }

    createDataFeature(dataType: string, properties: any) {
        let returnData = '';
        let returnObj: any = {};
        switch (dataType) {
            case 'County':
                returnObj = {
                    'Name': properties.NAMELSAD10,
                    'ResID': properties.GEOID10,
                    'Type': 'Place',
                    'TypeCategory': 'Counties',
                    'Desc': 'County'
                };
                break;
            case 'Tract':
                returnObj = {
                    'Name': properties.NAMELSAD10,
                    'ResID': properties.GEOID10,
                    'Type': 'Place',
                    'TypeCategory': 'Tracts',
                    'Desc': 'Tracts'
                };
                break;
            case 'City':
                returnObj = {
                    'Name': properties.name,
                    'ResID': properties.geoid,
                    'Type': 'Place',
                    'TypeCategory': 'Incorporated City',
                    'Desc': 'From Map'
                };
                break;
            default:
                break;
        }
        returnData = JSON.stringify(returnObj);//.replace(/\"/g,"'");
        console.log('json', returnData);
        return returnData;
    }

    //addPlaceToSelectedBin(place: any) {
    //    console.log('got to place add', place);
    //}

    createLayerBtn(layerName: any, layerId: number) {
        let mapScope = this;
        let btn = L.easyButton({
            states: [{
                stateName: 'layer-active',
                icon: '<span>' + layerName + '</span>',
                title: 'Turn ' + layerName + ' layer off',
                onClick: function (btn: any, map: any) {
                    let currLayers = mapScope.crt_layers.getLayers();
                    console.log('currlayers', currLayers);
                    if (currLayers.length === 1) {
                        currLayers = [];
                    } else {
                        currLayers.indexOf(layerId) === -1 ? currLayers.push(layerId) : currLayers.splice(currLayers.indexOf(layerId), 1);
                    }
                    mapScope.crt_layers.setLayers(currLayers);
                    btn.state('layer-inactive');
                }
            },
                {
                    stateName: 'layer-inactive',
                    icon: '<span>' + layerName + '</span>',
                    title: 'Turn ' + layerName + ' layer on',
                    onClick: function (btn: any, map: any) {
                        let currLayers = mapScope.crt_layers.getLayers();
                        currLayers.indexOf(layerId) === -1 ? currLayers.push(layerId) : currLayers.splice(currLayers.indexOf(layerId), 1);
                        mapScope.crt_layers.setLayers(currLayers);
                        btn.state('layer-active');
                    }
                }
            ]
        });
        return btn;
    }

    ngOnInit() {
        console.log('mapload', this.viewType);
        try {
            console.log('mapload check offset', $('.crt-logo').css('padding-left'));

            //this.detailViewOffset = parseInt($('.crt-logo').css('padding-left').replace('px', ''));
            this.loadMap();
        } catch (ex) {
            console.log(ex);
            this.loadMap();
        }
    }

    ngOnChanges(changes: any) {
        console.log('map input changed', changes);
        if (!this.map) {
            console.log('map not loaded');
            this.loadMap();
        }
        //add selected layer for all places in bin
        if (changes.selectedPlaces) {
            console.log('selectedPlaces', changes.selectedPlaces);
            if (changes.selectedPlaces.currentValue) {
                let needsUpdate: boolean = false;
                if (changes.selectedPlaces.currentValue.length === changes.selectedPlaces.previousValue.length) {
                    this.tempPlaces = this.tempPlaces.length === 0 ? changes.selectedPlaces.currentValue : this.tempPlaces;

                    changes.selectedPlaces.currentValue.forEach((place: any) => {
                        let thisPlaceIsIn = false;
                        this.tempPlaces.forEach((tp: any) => {
                            thisPlaceIsIn = tp.ResID === place.ResID ? true : thisPlaceIsIn;
                        });
                        needsUpdate = !thisPlaceIsIn ? true : needsUpdate;
                        if (needsUpdate) {
                            return;
                        }
                    });
                    console.log('needs update map?', needsUpdate);
                } else {
                    needsUpdate = true;
                }
                if (needsUpdate) {
                    console.log('updating map', changes.selectedPlaces.currentValue);
                    let selPlaces = changes.selectedPlaces.currentValue;
                    this.runSelectedPlaceQueries(selPlaces);
                }
                this.tempPlaces = changes.selectedPlaces.currentValue;
            }
        }
        if (changes.refresh) {
            console.log('need to check refresh map');
            if (changes.refresh.currentValue !== true) {
                console.log('henry');
                this.refreshMap();
            }
        }
    }

    runSelectedPlaceQueries(selPlaces: any) {
        this.processedCity = false;
        this.processedCounty = false;
        this.processedTract = false;
        let selectedCities = selPlaces.filter((place: any) => {
            return ['Incorporated City', 'Incorporated Town', 'Census Designated Place', 'Places'].indexOf(place.TypeCategory) !== -1;
            // === 'Incorporated City' || place.TypeCategory === 'Incorporated Town' || place.TypeCategory === 'Census Designated Place' || place.TypeCategory === 'Places';
        });
        let selectedCounties = selPlaces.filter((place: any) => {
            return ['Counties', 'County'].indexOf(place.TypeCategory) !== -1;
            // === 'Counties' || place.TypeCategory === 'County';
        });
        let selectedTracts = selPlaces.filter((place: any) => {
            return ['Census Tract', 'Tracts', 'Unincorporated Place'].indexOf(place.TypeCategory) !== -1;
        });
        let mapScope = this;
        this.selectedLayer.clearLayers();
        for (var id in this.labels) {
            console.log('clearing labels', this, id);
            mapScope.map.removeLayer(mapScope.labels[id]);
        }
        //create query for each layer
        if (selectedCities.length > 0) {
            let cityGeoids = '';
            selectedCities.forEach((city: any) => {
                cityGeoids += '\'' + city.ResID + '\',';
            });
            //remove last comma
            cityGeoids = cityGeoids.substring(0, cityGeoids.length - 1);
            this.crt_layers.query()
                .layer(this.crt_layer_cities_id)
                .where('geoid in (' + cityGeoids + ')')
                .simplify(this.map, 0)
                .run(function (err: any, featureCollection: any, response: any) {
                    mapScope.selectedLayer.addData(featureCollection.features);
                    mapScope.processedCity = true;
                });
        } else {
            this.processedCity = true;
        }
        if (selectedCounties.length > 0) {
            let geoids = '';
            selectedCounties.forEach((county: any) => {
                geoids += '\'' + county.ResID + '\',';
            });
            //remove last comma
            geoids = geoids.substring(0, geoids.length - 1);
            this.crt_layers.query()
                .layer(this.crt_layer_counties_id)
                .where('GEOID10 in (' + geoids + ')')
                .simplify(this.map, 0)
                .run(function (err: any, featureCollection: any, response: any) {
                    mapScope.selectedLayer.addData(featureCollection.features);
                    mapScope.processedCounty = true;
                });
        } else {
            this.processedCounty = true;
        }
        if (selectedTracts.length > 0) {
            let geoids = '';
            selectedTracts.forEach((tract: any) => {
                geoids += '\'' + tract.ResID + '\',';
            });
            //remove last comma
            geoids = geoids.substring(0, geoids.length - 1);
            this.crt_layers.query()
                .layer(this.crt_layer_tracts_id)
                .where('GEOID10 in (' + geoids + ')')
                .simplify(this.map, 0)
                .run(function (err: any, featureCollection: any, response: any) {
                    mapScope.selectedLayer.addData(featureCollection.features);
                    let currLayers = mapScope.crt_layers.getLayers();
                    console.log('currlayers', currLayers, mapScope.crt_layer_tracts_id);
                    //currLayers.indexOf(mapScope.crt_layer_tracts_id) === -1
                    //    ? currLayers.push(mapScope.crt_layer_tracts_id)
                    //    : currLayers.splice(currLayers.indexOf(mapScope.crt_layer_tracts_id), 1);
                    if (currLayers.indexOf(mapScope.crt_layer_tracts_id) === -1) {
                        currLayers.push(mapScope.crt_layer_tracts_id);
                    } else {
                        //currLayers.splice(currLayers.indexOf(mapScope.crt_layer_tracts_id), 1);
                    }
                    console.log('currlayers', currLayers);
                    mapScope.crt_layers.setLayers(currLayers);
                    mapScope.tractBtn.state('layer-active');
                    mapScope.processedTract = true;
                });
        } else {
            this.processedTract = true;
        }
        var runInterval = setInterval(runCheck, 500);
        function runCheck() {
            if (mapScope.processedCity && mapScope.processedCounty && mapScope.processedTract) {
                console.log('finished getting query results', mapScope.selectedLayer.getLayers());
                clearInterval(runInterval);
                if (mapScope.selectedLayer.getLayers().length > 0) {
                    let center = mapScope.selectedLayer.getBounds().getCenter();
                    if (mapScope.viewType === 'indicatorDetail' && !mapScope.isMobile) {
                        mapScope.map.panToOffset(center, [mapScope.detailViewOffset, 0]);
                    } else {
                        mapScope.map.fitBounds(mapScope.selectedLayer.getBounds());
                    }
                } else {
                    console.log('setting initial map view');
                    mapScope.setInitialMapView();
                }
            } else {
                console.log('still waiting for query finish');
                clearInterval(runInterval);
            }
        }
    }

    isIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true;
        } else {
            return false;
        }
    }


    refreshMap() {
        if (this.isIE()) {
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        } else {
            window.dispatchEvent(new Event('resize'));
        }
        this.setInitialMapView();
        if (this.selectedLayer.getLayers().length > 0) {
            let mapScope = this;
            window.setTimeout(function () {
                mapScope.map.fitBounds(mapScope.selectedLayer.getBounds());
                if (mapScope.viewType === 'indicatorDetail' && !mapScope.isMobile) {
                    mapScope.map.panToOffset(mapScope.map.getCenter(), [mapScope.detailViewOffset, 0]);
                }
            }, 500);
        }
    }
}
