import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';
@Injectable()
export class SearchPlacesService {
    constructor(private jsonp: Jsonp) { }
    search(term: string) {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/places';
        var params = new URLSearchParams();
        params.set('term', term); // the user's search value        
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(request => <string[]>request.json());
    }
}

