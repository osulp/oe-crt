import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
import {Indicator} from '../../data_models/indicator.model';

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
            .map((request: any) => <string[]>request.json())
            .map((indicators: Array<any>) => {
                let result: Array<Indicator> = [];
                if (indicators) {
                    indicators.forEach((indicator) => {
                        result.push(new Indicator(indicator.Indicator, indicator.topics, indicator.collections, false));
                    });
                }
                return result;
            });
    }
}


