import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
@Injectable()
export class PlaceInfoService {
    constructor(private jsonp: Jsonp) { }
    getInfo(place: string) {
        let serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api_dev/places';
        var params = new URLSearchParams();
        params.set('place', place); // the user's search value
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map((request: any) => <string[]>request.json());
    }
}
