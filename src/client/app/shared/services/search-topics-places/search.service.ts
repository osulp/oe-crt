import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
@Injectable()
export class SearchTopicsPlacesService {
    constructor(private jsonp: Jsonp) { }
    search(term: string, filter?: string) {
        console.log('search service: ', term, filter);
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/search';
        var params = new URLSearchParams();
        params.set('term', term); // the user's search value
        if (filter) {
            params.set('filter', filter);
        }
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');

        //return [{}];
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map((request: any) => <string[]>request.json());
    }
}

