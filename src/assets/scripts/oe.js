var map;

require(["esri/map","application/bootstrapmap", "dojo/on", "esri/layers/WebTiledLayer", "dojo/domReady!"],
    function (Map, BootstrapMap, on, WebTiledLayer) {
        window.setTimeout(function () {

            // Get a reference to the ArcGIS Map class
            var map = BootstrapMap.create("viewDiv", {
                basemap: "national-geographic",
                center: [-122.45, 37.77],
                zoom: 12,
                scrollWheelZoom: false
            });
            function showMap(div, responsive, fillPage) {
                if (map) {
                    map.destroy();
                    BootstrapMap.destroy(map);
                }
                if (responsive) {
                    map = BootstrapMap.create(div, {
                        basemap: "national-geographic",
                        center: [-122.45, 37.77],
                        zoom: 12,
                        scrollWheelZoom: false
                    });
                } else {
                    map = new Map(div, {
                        basemap: "national-geographic",
                        center: [-122.45, 37.77],
                        zoom: 12,
                        smartNavigation: false
                    });
                    on(map, "load", function () {
                        map.disableScrollWheelZoom();
                    });
                }
            }

            //showMap("viewDiv", true);
        }, 1000);
            
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
});







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


