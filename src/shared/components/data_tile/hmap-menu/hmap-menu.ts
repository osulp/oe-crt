import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';

@Component({
    selector: 'hmap-menu',
    templateUrl: './shared/components/data_tile/hmap-menu/hmap-menu.html',
    styleUrls: ['./shared/components/data_tile/hmap-menu/hmap-menu.css']
})


export class HmapMenu implements OnInit {
    @Input() mapView: any;//Default to county
    @Output() selMapView = new EventEmitter();//county / city / census tract / school district
    private mapViews: any[];
    private _translatedMapView: any;


    mapViewClick(evt: any) {
        console.log(evt.target.value);
        if (evt.target.value !== this._translatedMapView) {
            this.selMapView.emit(evt.target.value);
        }
    }

    ngOnInit() {
        console.log('HMAP MENU INPUT VALUE');
        console.log(this.mapView);
        this.mapViews = ['County', 'City', 'Census Tract', 'School District'];
    }

    ngOnChanges(changes: any) {// { [propName: string]: SimpleChange }) {
        console.log('Change detected:', changes);
        console.log(changes['mapView'].currentValue);
        if (changes['mapView'].currentValue !== changes['mapView'].previousValue) {
            switch (changes['mapView'].currentValue) {
                case 'Counties':
                    this._translatedMapView = 'County';
                    break;
                case 'Places':
                    this._translatedMapView = 'City';
                    break;
                case 'Tracts':
                    this._translatedMapView = 'Census Tract';
                    break;
                case 'School District':
                    this._translatedMapView = 'School District';
                    break;
                default:
                    break;
            }
        }
    }
}
