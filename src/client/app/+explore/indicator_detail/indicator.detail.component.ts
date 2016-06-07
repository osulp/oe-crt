import {Component, Input, OnInit} from '@angular/core';
import {JSONP_PROVIDERS}  from '@angular/http';
import {Router} from '@angular/router';
import {DataTileComponent,PlacesMapSelectComponent} from '../../shared/components/index';
import {IndicatorDescService,SelectedPlacesService,SelectedDataService} from '../../shared/services/index';
import {SearchResult, CommunityData} from '../../shared/data_models/index';
import {Subscription}   from 'rxjs/Subscription';

@Component({
    moduleId: module.id,
    selector: 'indicator-detail',
    templateUrl: 'indicator.detail.component.html',
    styleUrls: ['indicator.detail.component.css'],
    providers: [JSONP_PROVIDERS, IndicatorDescService, SelectedDataService, SelectedPlacesService],
    directives: [PlacesMapSelectComponent, DataTileComponent]
})

export class DetailComponent implements OnInit {
    @Input() inputIndicator: any;
    SelectedData: CommunityData;
    indicatorDesc: any = [];
    showMap: boolean;
    showGraph: boolean;
    showTable: boolean;
    selectedPlaceType: any = 'Oregon';
    selectedDataSubscription: Subscription;
    selectedPlaceSubscription: Subscription;
    highmapSelectedSubscription: Subscription;
    urlPlaces: SearchResult[] = [];
    visible: boolean = false;
    indInfo: string = 'desc';

    constructor(private _indicatorDescService: IndicatorDescService,
        private _selectedDataService: SelectedDataService,
        private _selectedPlacesService: SelectedPlacesService,
        private _router: Router
    ) { }

    getClass() {
        return this.visible ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    }
    toggleCommunitiesWrapper() {
        this.visible = !this.visible;
    }

    goBack() {
        this._router.navigate(['Explore']);
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

        this.selectedDataSubscription = this._selectedDataService.selectionChanged$.subscribe(
            data => {
                console.log('Community Data throwing event');
                console.log(data);
                this.SelectedData = data[0];
            },
            err => console.error(err),
            () => console.log('done with subscribe event places selected')
        );

        this.selectedPlaceSubscription = this._selectedPlacesService.selectionChanged$.subscribe(
            data => {
                console.log('subscribe throwing event');
                console.log(data);
                //this.onPlacesChanged(data);
            },
            err => console.error(err),
            () => console.log('done with subscribe event places selected')
        );

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


