import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {SearchCmp} from '../shared/components/search/search';
import {TopicsCmp} from './topics/topics';
import {PlacesWrapperCmp} from './places_wrapper/places_wrapper';
import {DataCmp} from './data/data';
import {DetailCmp} from './indicator_detail/indicator_detail';
import {Topic} from '../shared/data_models/topic';
import {Indicator} from '../shared/data_models/indicator';
import {SelectedPlacesService} from '../shared/services/places/selected-places.service';

interface QueryStringParams {
    key: string;
    value: string;
}

@Component({
    selector: 'explore',
    templateUrl: './explore/explore.html',
    styleUrls: ['./explore/explore.css'],
    directives: [SearchCmp, TopicsCmp, PlacesWrapperCmp, DataCmp, DetailCmp],
    providers: [SelectedPlacesService]
})
export class ExploreCmp implements OnInit {
    selectedTopics: any;
    selectedIndicators: any;
    selectedIndicator: any;
    selectedPlaces: any;
    allIndicators: Indicator[];
    allTopics: Topic[];
    indicatorDetailView: boolean;
    initialIndicator: boolean;

    constructor(
        private _router: Router, routeParams: RouteParams) {
        this.selectedTopics = routeParams.get('topics');
        this.selectedIndicators = routeParams.get('indicators');
        this.selectedIndicator = routeParams.get('indicator');
        this.initialIndicator = true;
        this.indicatorDetailView = this.selectedIndicator !== null ? true : false;
        console.log(routeParams.get('indicator') + ' received on load of explore cmp');
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
        console.log('Got All Topics From COMP! ' + results);
        this.allTopics = results;
    }
    onGetAllIndicatorsFromComp(results: any) {
        console.log('Got All Indicators From COMP!');
        this.allIndicators = results;
    }

    onGetSelectedPlaceFromComp(results: any) {
        console.log('Got Place selection for PlacesCmp');
        this.selectedPlaces = results;
    }

    updateQueryStringParam(qsParams: QueryStringParams[]) {
        var baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
        var urlQueryString = document.location.search;
        var allParams: string = '';
        for (var x = 0; x < qsParams.length; x++) {
            var newParam = qsParams[x].value === '' ? '' : qsParams[x].key + '=' + qsParams[x].value;
            allParams = '?' + newParam;

            // If the "search" string exists, then build params from it
            if (urlQueryString) {
                var keyRegex = new RegExp('([\?&])' + qsParams[x].key + '[^&]*');

                // If param exists already, update it
                if (urlQueryString.match(keyRegex) !== null) {
                    allParams = urlQueryString.replace(keyRegex, '$1' + newParam);
                } else { // Otherwise, add it to end of query string
                    allParams = urlQueryString + (qsParams[x].value !== '' ? '&' : '') + newParam;
                }
            }
            urlQueryString = allParams;
        }
        return (baseUrl + allParams).replace('?&', '?');
    };
    ngOnInit() {
        this.allTopics = [];
    }
}

