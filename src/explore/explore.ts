import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {SearchCmp} from '../shared/components/search/search';
import {TopicsCmp} from './topics/topics';
import {PlacesCmp} from './places/places';

@Component({
    selector: 'explore',
    templateUrl: './explore/explore.html',
    styleUrls: ['./explore/explore.css'],
    directives: [SearchCmp, TopicsCmp, PlacesCmp]
})
export class ExploreCmp {
    public selectedTopics;

    constructor(
        private _router: Router, routeParams: RouteParams) {
        this.selectedTopics = routeParams.get('topics');
        console.log(routeParams.get('topics'));
    }
    onGetSelectedTopics(results) {
        this.selectedTopics = results;
        var queryString = '';
        if (this.selectedTopics.length > 0) {
            console.log(this.selectedTopics[0]);
            for (var x = 0; x < this.selectedTopics.length; x++) {
                queryString += this.selectedTopics[x].replace('&', '%26');
                if (x < this.selectedTopics.length - 1) {
                    queryString += ',';
                }
            }
        } else {
            queryString = 'All Topics';
        }
        console.log(queryString);
        this.updateQueryStringParam('topics', queryString);
    }

    updateQueryStringParam(key: string, value: string) {
        var baseUrl = [location.protocol, '//', location.host, location.pathname].join(''),
            urlQueryString = document.location.search,
            newParam = key + '=' + value,
            params = '?' + newParam;

        // If the "search" string exists, then build params from it
        if (urlQueryString) {
            var keyRegex = new RegExp('([\?&])' + key + '[^&]*');

            // If param exists already, update it
            if (urlQueryString.match(keyRegex) !== null) {
                params = urlQueryString.replace(keyRegex, '$1' + newParam);
            } else { // Otherwise, add it to end of query string
                params = urlQueryString + '&' + newParam;
            }
        }
        window.history.replaceState({}, '', baseUrl + params);
    };
}

