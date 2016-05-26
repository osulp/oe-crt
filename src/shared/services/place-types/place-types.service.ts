import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';
@Injectable()
export class PlaceTypeService {
    constructor(private jsonp: Jsonp) { }
    get() {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/placetypes';
        var params = new URLSearchParams();
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(request => <string[]>request.json());
    }
}

