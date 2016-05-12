import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class GetGeoJSONService {
    constructor(private jsonp: Jsonp) { }
    load(placeType: any[], mostRecent: boolean) {
        let observables: any[] = [];
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/geojson';
        for (var p = 0; p < placeType.length; p++) {
            var params = new URLSearchParams();
            params.set('f', 'json');
            params.set('placeType', placeType[p]);
            params.set('callback', 'JSONP_CALLBACK');
            observables.push(this.jsonp
                .get(serviceUrl, { search: params })
                .map(request => <string[]>request.json()));

        }
        return Observable.forkJoin(observables);
    }
}
