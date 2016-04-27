import { Injectable } from 'angular2/core';
import {
esriMap,
esriDynamicMapServiceLayer,
WebTiledLayer,
esriBasemaps,
Legend,
Search,
RasterLayer,
ImageServiceParameters,
RasterFunction
} from 'esri';
//from 'esri-system-js/dist/esriSystem';

@Injectable()
export class MapService {
    _basemaps: any[];
    oregon_mask_url: any = 'http://arcgis.oregonexplorer.info/arcgis/rest/services/_explorer/explorer_places/MapServer';
    oregon_mask_layer: any;
    hillshade_esri: any = 'http://utility.arcgis.com/usrsvcs/servers/2e6c280b68d84dc1a6b8e4e830efbfaf/rest/services/WorldElevation/Terrain/ImageServer';
    hillshade_esri_layer: RasterLayer;
    esri_light_gray_reference = 'http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer';
    esri_light_gray_reference_layer: esriDynamicMapServiceLayer;
    mapbox_weather = 'http://{subDomain}.tiles.mapbox.com/v4/weather.5svtc1nj/{level}/{col}/{row}.jpg80?access_token=pk.eyJ1Ijoid2VhdGhlciIsImEiOiJjaWlxNG01czkwMjM2dnFtNTdlMjVidTByIn0.Ml63Jx_BQtTx4CEXihwjyA';
    carto_db_light = 'http://{subDomain}.basemaps.cartocdn.com/light_nolabels/{level}/{col}/{row}.png';
    carto_db_light_labels = 'http://{subDomain}.basemaps.cartocdn.com/light_only_labels/{level}/{col}/{row}.png';
    carto_db_dark = 'http://{subDomain}.basemaps.cartocdn.com/dark_nolabels/{level}/{col}/{row}.png';
    carto_db_dark_labels = 'http://{subDomain}.basemaps.cartocdn.com/dark_only_labels/{level}/{col}/{row}.png';
    carto_db_light_layer: WebTiledLayer;
    carto_db_light_labels_layer: WebTiledLayer;
    carto_db_dark_layer: WebTiledLayer;
    carto_db_dark_labels_layer: WebTiledLayer;
    mapbox_weather_layer: WebTiledLayer;
    // load a web map and return response
    createMap(domNodeOrId: any, options: Object) {
        let map = new esriMap(domNodeOrId, options);
        //add dynamic map service
        this.setMapLayers();
        map.addLayer(this.hillshade_esri_layer);
        //map.addLayer(this.carto_db_light_layer);
        map.addLayer(this.carto_db_dark_layer);
        map.addLayer(this.oregon_mask_layer);
        //map.addLayer(this.mapbox_weather_layer);        
        //map.addLayer(this.carto_db_light_labels_layer);
        map.addLayer(this.carto_db_dark_labels_layer);
        //map.addLayer(this.esri_light_gray_reference_layer);
        return map;
    };

    // create a search dijit at the dom node
    createSearch(options: Object, domNodeOrId: any) {
        return new Search(options, domNodeOrId);
    };

    // create a legend dijit at the dom node
    createLegend(options: Object, domNodeOrId: any) {
        return new Legend(options, domNodeOrId);
    };

    // get esriBasemaps as array of basemap defintion objects
    getBasemaps() {
        if (!this._basemaps) {
            this._basemaps = Object.keys(esriBasemaps).map((name) => {
                let basemap = esriBasemaps[name];
                basemap.name = name;
                return basemap;
            });
        }
        return this._basemaps;
    }

    // get the name of basemap layer
    getBasemapName(map: any) {
        let basemapName = map.getBasemap();
        if (basemapName) {
            return basemapName;
        }
        // loop through map layers
        map.layerIds.some((layerId: any) => {
            const layerUrl = map.getLayer(layerId).url;
            // loop through known basemap definitions
            return this.getBasemaps().some(basemapDef => {
                // loop through layers in basemap definition (isn't this fun?)
                return basemapDef.baseMapLayers.some((basemapDefLayer: any) => {
                    const match = basemapDefLayer.url.toLowerCase() === layerUrl.toLowerCase();
                    if (match) {
                        basemapName = basemapDef.name;
                    }
                    return match;
                });
            });
        });
        return basemapName;
    }

    // try to remove basemap layers from map
    // if not defined, then remove the first layer
    clearBasemap(map: any) {
        if (map.basemapLayerIds && map.basemapLayerIds.length > 0) {
            map.basemapLayerIds.forEach(function (lid: any) {
                map.removeLayer(map.getLayer(lid));
            });
            map.basemapLayerIds = [];
        } else {
            map.removeLayer(map.getLayer(map.layerIds[0]));
        }
    }

    setMapLayers() {
        let layer_options = {
            'opacity': 0.7,
            'showAttribution': true
        };
        this.oregon_mask_layer = new esriDynamicMapServiceLayer(this.oregon_mask_url, layer_options);
        this.oregon_mask_layer.setVisibleLayers([10]);
        this.mapbox_weather_layer = new WebTiledLayer(this.mapbox_weather, {
            'copyright': 'Base map by the Weather Channel/Map Box',
            'id': 'MapBox Weather Channel',
            'subDomains': ['a', 'b', 'c', 'd'],
            'opacity': 0.7
        });
        this.carto_db_dark_layer = new WebTiledLayer(this.carto_db_dark, {
            'copyright': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            'id': 'CartoDB_Dark',
            'subDomains': ['a', 'b', 'c'],
            'opacity': 0.7
        });
        this.carto_db_dark_labels_layer = new WebTiledLayer(this.carto_db_dark_labels, {
            'copyright': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            'id': 'CartoDB_Dark_Labels',
            'subDomains': ['a', 'b', 'c'],
            'opacity': 0.7
        });
        this.carto_db_light_layer = new WebTiledLayer(this.carto_db_light, {
            'copyright': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            'id': 'CartoDB_Light',
            'subDomains': ['a', 'b', 'c'],
            'opacity': 0.7
        });
        this.carto_db_light_labels_layer = new WebTiledLayer(this.carto_db_light_labels, {
            'copyright': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            'id': 'CartoDB_LightLables',
            'subDomains': ['a', 'b', 'c'],
            'opacity':1.0
        });
        this.esri_light_gray_reference_layer = new esriDynamicMapServiceLayer(this.esri_light_gray_reference);
        var params = new ImageServiceParameters();
        //the service has a default "Stretched" function and a "None" function, we want original data "None"
        var rf = new RasterFunction();
        rf.functionName = 'Multi-Directional_Hillshade';
        params.renderingRule = rf;

        //Define the raster layer and add to map
        this.hillshade_esri_layer = new RasterLayer(this.hillshade_esri, {
            id: 'hillshade_esri',
            opacity: .9,
            imageServiceParameters: params
        });
    }
}
