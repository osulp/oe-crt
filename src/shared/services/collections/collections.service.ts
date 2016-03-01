import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';
@Injectable()
export class CollectionsService {
    constructor(private jsonp: Jsonp) { }
    search(term: string) {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/collections';
        var params = new URLSearchParams();
        //params.set('search', term); // the user's search value
        //params.set('action', 'opensearch');
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        // TODO: Add error handling
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(request => <string[]>request.json());
    }
}

