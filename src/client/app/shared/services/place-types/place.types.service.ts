import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
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
            .map((request: any) => <string[]>request.json());
    }
}

