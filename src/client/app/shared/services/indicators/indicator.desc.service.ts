import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
//import {Indicator} from '../../data_models/indicator';

@Injectable()

export class IndicatorDescService {
    constructor(public jsonp: Jsonp) { }
    getIndicator(inputIndicator: string) {
        console.log('indicator service, indicator', inputIndicator);
        let serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api_dev/indicators';
        var params = new URLSearchParams();
        params.set('indicator', inputIndicator); // the user's search value
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map((request: any) => <string[]>request.json());
    }
}


