import { Component, Input } from 'angular2/core';

@Component({
    selector: 'leaflet-map',
    templateUrl: './shared/components/map/map.leaflet.component.html',
    styleUrls: ['./shared/components/map/map.leaflet.component.css']
})
export class MapLeafletComponent {
    @Input() options: Object;
    map: any;

    loadMap() {
        this.map = L.map('map').setView([45, -122], 5);
        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(this.map);
        //console.log(L);
        L.esri.dynamicMapLayer({
            url: 'http://arcgis.oregonexplorer.info/arcgis/rest/services/_explorer/explorer_places/MapServer',
            opacity: 0.9,
            layers: [10],
            useCors: true
        }).addTo(this.map);
    }

    ngOnInit() {
        try {
            this.loadMap();
        } catch (ex) {
            console.log(ex);
            this.loadMap();
        }
    }
}


