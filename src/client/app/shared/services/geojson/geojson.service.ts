import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams, Response, Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
//import {PlaceTypeService} from '../../services/place-types/place-types.service';


@Injectable()
export class GetGeoJSONService {
    http: Http;
    //_placeTypeService: PlaceTypeService;
    //@Provider [PlaceTypeService];

    constructor(
        private jsonp: Jsonp,
        http: Http
        //_placeTypeService: PlaceTypeService
    ) {
        this.http = http;
        //this._placeTypeService = _placeTypeService;
    }

    getByPlaceType(placeType: any, years: any[]) {
        let observables: any[] = [];
        //console.log('THESE ARE THE YEAR');
        if (placeType === 'oregon_siskiyou_boundary') {
            observables.push(this.http.get('./assets/geojson/oregon_siskiyou_boundary.json').map((res: Response) => res.json()));
        } else {
            let geoyears = years[placeType];
            for (var year of geoyears) {
                observables.push(this.http.get('./assets/geojson/' + placeType.toLowerCase() + '_' + year.Year + '.json').map((res: Response) => res.json()));
            }
        }
        return Observable.forkJoin(observables);
    }

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
                .map((request: any) => <string[]>request.json()));

        }
        return Observable.forkJoin(observables);
    }
}
