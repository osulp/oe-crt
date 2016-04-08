import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';
//import {Indicator} from '../../data_models/indicator';

@Injectable()

export class IndicatorDescService {
    constructor(public jsonp: Jsonp) { }
    getIndicator(inputIndicator:string) {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/indicators';
        var params = new URLSearchParams();
        params.set('indicator', inputIndicator); // the user's search value  
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(request => <string[]>request.json())
            .map((indicators: Array<any>) => {
                let result: Array<any> = [];
                if (indicators) {
                    indicators.forEach((indicator) => {
                        result.push(indicator);
                    });
                }
                return result;
            });
    }
}


