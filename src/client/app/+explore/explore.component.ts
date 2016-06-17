import { Component, OnInit, OnDestroy} from '@angular/core';
import {Router, RouteSegment, RouteTree, OnActivate} from '@angular/router';
//import {Router, RouteParams} from '@angular/router-deprecated';
import {Subscription}   from 'rxjs/Subscription';
import {TopicsComponent} from './topics/topics.select.component';
import {PlacesWrapperComponent} from './places_wrapper/places.wrapper.component';
import {DataComponent} from './data/data.wrapper.component';
import {DetailComponent} from './indicator_detail/indicator.detail.component';
import {SearchComponent} from '../shared/components/index';
import {SearchResult, Topic, Indicator} from '../shared/data_models/index';
import {SelectedPlacesService} from '../shared/services/index';

interface QueryStringParams {
    key: string;
    value: string;
}

/**
 * This class represents the lazy loaded ExploreComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'explore',
    templateUrl: 'explore.component.html',
    styleUrls: ['explore.component.css'],
    directives: [SearchComponent, TopicsComponent, PlacesWrapperComponent, DataComponent, DetailComponent]//,
    //providers: [SelectedPlacesService]
})

export class ExploreComponent implements OnInit, OnActivate, OnDestroy {
    //export class ExploreComponent implements OnInit {
    selectedTopics: any;
    selectedIndicators: any;
    selectedIndicator: any;
    selectedPlaces: any;
    allIndicators: Indicator[];
    allTopics: Topic[] = [];
    indicatorDetailView: boolean = false;
    initialIndicator: boolean;
    selectedSearchResult: SearchResult;
    subscription: Subscription;

    constructor(
        public _selectedPlacesService: SelectedPlacesService,
        private _router: Router
    ) {
        this.initialIndicator = true;
    }

    routerOnActivate(curr: RouteSegment, prev?: RouteSegment,
        currTree?: RouteTree, prevTree?: RouteTree): void {
        this.selectedTopics = decodeURI(curr.getParam('topics'));
        this.selectedIndicator = decodeURI(curr.getParam('indicator'));
        this.selectedIndicators = decodeURI(curr.getParam('indicators'));
        this.selectedPlaces = decodeURI(curr.getParam('places'));
        this.indicatorDetailView = this.selectedIndicator !== null && this.selectedIndicator !== 'undefined' ? true : false;
    }

    //emitted from search component
    onSelectedSearchResult(results: SearchResult) {
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                this._router.navigate(['/Explore', { indicator: encodeURI(results.Name.replace('(', '%28').replace(')', '%29')) }]);
            } else {
                //this._router.navigate(['/Explore', { places: encodeURI(results.Name), topics: 'All Topics' }]);
                this._router.navigate(['/Explore', { topics: 'All Topics' }]);
            }
        }
    }
    //bubble up from topics component selection
    onGetSelectedTopicsFromComp(results: any) {
        console.log('emitted selected topics ' + results);
        this.selectedTopics = results;
        var queryString = '';
        if (this.selectedTopics.length > 0) {
            for (var x = 0; x < this.selectedTopics.length; x++) {
                queryString += this.selectedTopics[x].replace('&', '%26');
                if (x < this.selectedTopics.length - 1) {
                    queryString += ',';
                }
            }
        } else {
            queryString = 'All Topics';
        }
        var qsParams: QueryStringParams[] = [];
        var topicsParam: QueryStringParams = { key: 'topics', value: queryString };
        qsParams.push(topicsParam);

        if (this.initialIndicator) {
            this.initialIndicator = false;
        } else {
            //clear out indicator selection
            this.selectedIndicators = '';
            var indicatorParam: QueryStringParams = { key: 'indicators', value: '' };
            qsParams.push(indicatorParam);
        }
        var newState = this.updateQueryStringParam(qsParams);
        window.history.pushState({}, '', newState);
    }

    onGetAllTopicsFromComp(results: any) {
        //console.log('Got All Topics From COMP! ' + results);
        this.allTopics = results;
    }
    onGetAllIndicatorsFromComp(results: any) {
        //console.log('Got All Indicators From COMP!');
        this.allIndicators = results;
    }

    onPlacesChanged(selectedPlaces: SearchResult[]) {
        console.log('place added via explore comp', selectedPlaces);
        var qsParams: QueryStringParams[] = [];
        var places: string = '';
        for (var x = 0; x < selectedPlaces.length; x++) {
            //console.log('PROCESSING PLACE CHANGE: EXPLORE.TS');
            places += encodeURIComponent(JSON.stringify(selectedPlaces[x]));
            //places += selectedPlaces[x].Name;
            if (x !== selectedPlaces.length - 1) {
                places += ',';
            }
        }
        var placeParam: QueryStringParams = { key: 'places', value: places };
        qsParams.push(placeParam);
        var newState = this.updateQueryStringParam(qsParams);
        //console.log('NEW STATE!!!!!!!!!!!');
        //console.log(newState);
        window.history.pushState({}, '', newState);
    }


    updateQueryStringParam(qsParams: QueryStringParams[]) {
        var baseUrl = [location.protocol, '//', location.host, location.pathname.split(';')[0]].join('');
        var urlQueryString = location.pathname.replace(location.pathname.split(';')[0], '').replace('/Explore', '');
        var allParams: string = '';
        for (var x = 0; x < qsParams.length; x++) {
            var newParam = qsParams[x].value === '' ? '' : qsParams[x].key + '=' + qsParams[x].value;
            // If the 'search' string exists, then build params from it
            if (urlQueryString) {
                var keyRegex = new RegExp('([\;])' + qsParams[x].key + '([^;]*|[^,]*)');
                // If param exists already, update it
                if (urlQueryString.match(keyRegex) !== null) {
                    allParams = urlQueryString.replace(keyRegex, '$1' + newParam);
                } else { // Otherwise, add it to end of query string                    
                    allParams = urlQueryString + (qsParams[x].value !== '' ? ';' : '') + newParam;
                }
            } else {
                let pathname = document.location.pathname;
                var keyRegex = new RegExp('([\;])' + qsParams[x].key + '([^;]*|[^,]*)');
                if (pathname.match(keyRegex) !== null) {
                    allParams = pathname.replace(keyRegex, '$1' + newParam);
                } else {
                    allParams = (qsParams[x].value !== '' ? ';' : '') + newParam;
                }
            }
            urlQueryString = allParams;
        }
        return (baseUrl + allParams).replace('?&', '?');
    };

    ngOnInit() {
        //this.selectedTopics = this._routeParams.getParam('topics');
        //this.selectedTopics = this.getParameterByName('topics');
        console.log('topics from init?', this.selectedTopics);
        this.subscription = this._selectedPlacesService.selectionChanged$.subscribe(
            data => {
                console.log('subscribe throwing event');
                console.log(data);
                this.onPlacesChanged(data);
            },
            err => console.error(err),
            () => console.log('done with subscribe event places selected')
        );
        //Sthis._selectedPlacesService
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }
}


