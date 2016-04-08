import { Component, ElementRef, Input, Output, EventEmitter } from 'angular2/core';
import { MapService } from '../../services/map/map.service';

@Component({
    selector: 'esri-map',
    template: '<div><ng-content></ng-content></div>',
    providers: [MapService]
})
export class MapComponent {
    @Input() options: Object;
    @Input() itemId: any;
    @Output() mapLoaded = new EventEmitter();

    map: any;

    constructor(private elRef: ElementRef, private _mapService: MapService) { }

    ngOnInit() {
        console.log('map options');
        console.log(this.options);
        if (this.options === null) {
            this.options = {
                basemap: 'dark-gray',
                center: [-121, 44], // lon, lat
                zoom: 6,
                scrollWheelZoom: false
            };
        }
        console.log(this.options);
        // create the map
        this.map = this._mapService.createMap(this.elRef.nativeElement.firstChild, this.options);
        this.mapLoaded.next(this.map);
    }

    setBasemap(basemapName: any) {
        this._mapService.clearBasemap(this.map);
        this.map.setBasemap(basemapName);
    }

    // destroy map
    ngOnDestroy() {
        if (this.map) {
            this.map.destroy();
        }
    }
}
