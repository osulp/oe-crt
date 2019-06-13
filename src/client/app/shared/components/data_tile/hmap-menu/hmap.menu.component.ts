import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'hmap-menu',
    templateUrl: 'hmap.menu.component.html',
    styleUrls: ['hmap.menu.component.css']
})


export class HmapMenuComponent implements OnInit, OnChanges {
    @Input() mapView: any;//Default to county
    @Input() showMenuLeft: boolean;
    @Output() selMapView = new EventEmitter();//county / city / census tract / school district
    private mapViews: any[];
    private _translatedMapView: any;
    //private menuSelected: boolean = false;


    mapViewClick(evt: any) {
        //console.log(evt.target.value, this._translatedMapView);
        // if (evt.target.value !== this._translatedMapView) {

        // }
        this.selMapView.emit(evt.target.value);
    }

    ngOnInit() {
        this.mapViews = ['Counties', 'Cities', 'Census Tracts', 'School Districts'];
    }

    setIndicatorGeoFilter(filter: any) {
        console.log('hmap setting filter', filter);
        switch (filter) {
            case 'Place, Tract & County':
                this.mapViews = ['Counties', 'Cities', 'Census Tracts'];
                break;
            case 'Place and Counties':
                this.mapViews = ['Cities', 'Counties'];
                break;
            case 'County':
                this.mapViews = ['Counties'];
                break;
            case 'School only':
                this.mapViews = ['School Districts'];
                break;
            case 'School and County':
                this.mapViews = ['Counties', 'School Districts'];
                break;
            case 'Place only':
                this.mapViews = ['Cities'];
                break;
            case 'Tract and County':
                this.mapViews = ['Counties', 'Census Tracts'];
                break;
            case 'Tract only':
                this.mapView = ['Census Tracts'];
                break;
            default:
                this.mapViews = ['Counties'];
                break;
        }

    }

    ngOnChanges(changes: any) {// { [propName: string]: SimpleChange }) {
        console.log('Change detected:', changes);
        //console.log(changes['mapView'].currentValue);
        if (changes['mapView']) {
            if (changes['mapView'].currentValue !== changes['mapView'].previousValue) {
                switch (changes['mapView'].currentValue) {
                    case 'Counties':
                        this._translatedMapView = 'Counties';
                        break;
                    case 'Places':
                        this._translatedMapView = 'Cities';
                        break;
                    case 'Tracts':
                    case 'Unicorporated Place':
                    case 'Census Tract':
                    case 'Census Tracts':
                        this._translatedMapView = 'Census Tracts';
                        break;
                    case 'SchoolDistricts':
                        this._translatedMapView = 'School Districts';
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
