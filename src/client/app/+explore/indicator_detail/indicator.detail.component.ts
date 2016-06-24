import {Component, Input, ViewChild, OnInit} from '@angular/core';
import {JSONP_PROVIDERS}  from '@angular/http';
import {Router} from '@angular/router';
import {DataTileComponent,PlacesMapSelectComponent} from '../../shared/components/index';
import {IndicatorDescService, SelectedDataService} from '../../shared/services/index';
import {SearchResult} from '../../shared/data_models/index';
import {SearchComponent} from '../../shared/components/index';
import {TableViewComponent} from './table_view/table.view.component';

@Component({
    moduleId: module.id,
    selector: 'indicator-detail',
    templateUrl: 'indicator.detail.component.html',
    styleUrls: ['indicator.detail.component.css'],
    providers: [JSONP_PROVIDERS, IndicatorDescService, SelectedDataService],
    directives: [PlacesMapSelectComponent, DataTileComponent, SearchComponent, TableViewComponent]
})

export class DetailComponent implements OnInit {
    @Input() inputIndicator: any;
    @Input() inputPlaces: any;
    @ViewChild(PlacesMapSelectComponent) placeMap: PlacesMapSelectComponent;
    //@ViewChild(TableViewComponent) tableView: TableViewComponent;
    //SelectedData: CommunityData;
    indicatorDesc: any = [];
    _chartData: any = [];
    showMap: boolean;
    showGraph: boolean;
    showTable: boolean;
    chartData: any = [];
    selectedSearchResult: SearchResult;
    selectedPlaceType: any = 'Oregon';
    urlPlaces: SearchResult[] = [];
    visible: boolean = false;
    indInfo: string = 'desc';
    initialLoad: boolean = true;

    constructor(private _indicatorDescService: IndicatorDescService,
        private _router: Router
    ) { }

    //emitted from search component
    onSelectedSearchResult(results: SearchResult) {
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                //this._router.navigate(['Explore', { indicator: encodeURIComponent(results.Name), topics: results.TypeCategory.split(';')[1] }]);
                console.log('search result change', this.placeMap.selectedPlaces, this.placeMap.selectedSearchResults);
                this._router.navigate(['Explore', {
                    indicator: encodeURIComponent(results.Name.replace('(', '%28').replace(')', '%29')),
                    places: encodeURIComponent(JSON.stringify(this.placeMap.selectedSearchResults).replace('[', '').replace(']', ''))
                }]);
            }
        }
    }

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

    setToggleView(viewType: any) {
        switch (viewType) {
            case 'map':
                this.showMap = !this.showMap;
                break;
            case 'graph':
                this.showGraph = !this.showGraph;
                break;
            case 'table':
                this.showTable = !this.showTable;
                break;
            default:
                break;
        }

        var runInterval = setInterval(runCheck, 50);
        function runCheck() {
            window.dispatchEvent(new Event('resize'));
            clearInterval(runInterval);
        }
    }

    goBack() {
        this._router.navigate(['/Explore']);
        window.scrollTo(0, 0);
    }

    onChartDataUpdate(data: any) {
        console.log('Chart data emitted to indicator detail', data);
        this._chartData = data;
        console.log('Chart data', this.chartData);
        //this.tableView.tableData = data;
    }

    ngOnInit() {
        this.showMap = true;
        this.showGraph = true;
        this.showTable = true;
        this.chartData = [];
        this.inputIndicator = decodeURI(this.inputIndicator)
            .replace(/\%2528/g, '(')
            .replace(/\%28/g, '(')
            .replace(/\%2529/g, ')')
            .replace(/\%29/g, ')')
            .replace(/\%252C/g, ',')
            .replace(/\%2C/g, ',')
            .replace(/\%2524/g, '$')
            .replace(/\%24/g, '$')
            .replace(/\%2B/g, '+');
        this._indicatorDescService.getIndicator(this.inputIndicator).subscribe(
            (data: any) => {
                this.indicatorDesc = data;// IndicatorDescSer    
                console.log('indicatorDesc service', data);
            });

        this.urlPlaces = this.inputPlaces !== 'undefined' ? JSON.parse('[' + decodeURIComponent(this.inputPlaces) + ']') : [];
        //var urlQueryString = document.location.search;
        //var keyRegex = new RegExp('([\?&])places([^&]*|[^,]*)');
        //// If param exists already, update it
        //if (urlQueryString.match(keyRegex) !== null) {
        //    let temp = urlQueryString.match(keyRegex)[0];
        //    let tempPlaces: string[] = temp.replace(new RegExp('([\?&])places='), '').split(',');
        //    for (var x = 0; x < tempPlaces.length; x++) {
        //        let place: SearchResult = JSON.parse(decodeURIComponent(tempPlaces[x]));
        //        this.urlPlaces.push(place);
        //    }
        //}
    }
}


