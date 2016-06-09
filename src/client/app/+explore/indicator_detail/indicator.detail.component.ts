import {Component, Input, ViewChild, OnInit} from '@angular/core';
import {JSONP_PROVIDERS}  from '@angular/http';
import {Router} from '@angular/router';
import {DataTileComponent,PlacesMapSelectComponent} from '../../shared/components/index';
import {IndicatorDescService} from '../../shared/services/index';
import {SearchResult} from '../../shared/data_models/index';

@Component({
    moduleId: module.id,
    selector: 'indicator-detail',
    templateUrl: 'indicator.detail.component.html',
    styleUrls: ['indicator.detail.component.css'],
    providers: [JSONP_PROVIDERS, IndicatorDescService],
    directives: [PlacesMapSelectComponent, DataTileComponent]
})

export class DetailComponent implements OnInit {
    @Input() inputIndicator: any;
    @ViewChild(PlacesMapSelectComponent) placeMap: PlacesMapSelectComponent;
    //SelectedData: CommunityData;
    indicatorDesc: any = [];
    showMap: boolean;
    showGraph: boolean;
    showTable: boolean;
    selectedPlaceType: any = 'Oregon';
    urlPlaces: SearchResult[] = [];
    visible: boolean = false;
    indInfo: string = 'desc';
    initialLoad: boolean = true;

    constructor(private _indicatorDescService: IndicatorDescService,
        private _router: Router
    ) { }

    getClass() {
        return this.visible ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    }
    toggleCommunitiesWrapper() {
        this.visible = !this.visible;
        if (this.initialLoad) {
            this.placeMap.leafletMap.refreshMap();
            this.initialLoad = false;
        }
    }

    goBack() {
        this._router.navigate(['/Explore']);
        window.scrollTo(0, 0);
    }

    ngOnInit() {
        this.showMap = true;
        this.showGraph = true;
        this.showTable = false;
        this.inputIndicator = decodeURI(this.inputIndicator).replace(/\%28/g, '(').replace(/\%29/g, ')');
        this._indicatorDescService.getIndicator(this.inputIndicator).subscribe(
            (data: any) => {
                this.indicatorDesc = data;// IndicatorDescSer    
                console.log('indicatorDesc service', data);
            });

        var urlQueryString = document.location.search;
        var keyRegex = new RegExp('([\?&])places([^&]*|[^,]*)');
        // If param exists already, update it
        if (urlQueryString.match(keyRegex) !== null) {
            let temp = urlQueryString.match(keyRegex)[0];
            let tempPlaces: string[] = temp.replace(new RegExp('([\?&])places='), '').split(',');
            for (var x = 0; x < tempPlaces.length; x++) {
                let place: SearchResult = JSON.parse(decodeURIComponent(tempPlaces[x]));
                this.urlPlaces.push(place);
            }
        }
    }
}


