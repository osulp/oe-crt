import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';

@Injectable()

export class FeaturedIndicatorsService {
    constructor(public jsonp: Jsonp) { }
    getFeaturedIndicators() {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/indicators';
        var params = new URLSearchParams();
        params.set('f', 'json');
        params.set('featured', '');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map((request: any) => <string[]>request.json());
            //.map((indicators: Array<any>) => {
            //    let result: Array<Indicator> = [];
            //    if (indicators) {
            //        indicators.forEach((indicator) => {
            //            result.push(new Indicator(indicator.Indicator, indicator.topics, indicator.collections, false));
            //        });
            //    }
            //    return result;
            //});
    }
}


