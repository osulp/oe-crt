import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';
import {Indicator} from '../../data_models/indicator';

@Injectable()

export class IndicatorsService {
    constructor(public jsonp: Jsonp) { }
    getIndicators() {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/indicators';
        var params = new URLSearchParams();
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(request => <string[]>request.json())
            .map((indicators: Array<any>) => {
                let result: Array<Indicator> = [];
                if (indicators) {
                    indicators.forEach((indicator) => {
                        result.push(new Indicator(indicator.Indicator, indicator.Topics, false));
                    });
                }
                return result;
            });
    }
}


