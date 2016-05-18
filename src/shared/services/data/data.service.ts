import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';
@Injectable()

export class DataService {
    constructor(private jsonp: Jsonp) { }

    get(geoids: string, indicators: string) {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
        var params = new URLSearchParams();
        params.set('geoids', geoids);
        params.set('indicators', indicators);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(request => <string[]>request.json());
    }

    getAllbyGeoType(geoType: string, indicator: string) {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
        var params = new URLSearchParams();
        params.set('geoType', geoType);
        params.set('indicator', indicator);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(request => <string[]>request.json());
    }

    getIndicatorDataWithMetadata(geoids: string, indicator: string) {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
        var params = new URLSearchParams();
        params.set('viewType', 'basic');
        params.set('indicator', indicator);
        params.set('geoids', geoids);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(request => <string[]>request.json());
    }
}


