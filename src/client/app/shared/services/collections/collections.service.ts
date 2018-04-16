import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
@Injectable()
export class CollectionsService {
    constructor(private jsonp: Jsonp) { }
    get() {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/collections';
        var params = new URLSearchParams();
        //params.set('search', term); // the user's search value
        //params.set('action', 'opensearch');
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        // TODO: Add error handling
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map((request:any) => <string[]>request.json());
    }
}

