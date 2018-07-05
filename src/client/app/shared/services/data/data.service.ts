import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/observable/forkJoin';

@Injectable()

export class DataService {
    constructor(private jsonp: Jsonp) { }

    get(geoids: string, indicators: string) {
        let serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
        var params = new URLSearchParams();
        params.set('geoids', geoids);
        params.set('indicators', indicators);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map((request:any) => <string[]>request.json());
    }

    getAllbyGeoType(geoType: string, indicator: string) {
        console.log('GETTING ALL BY GEOTYPE', geoType, indicator);
        if (geoType === 'Schools') {
            let serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api/schools';
            var params = new URLSearchParams();
            params.set('schooldistrict', '1');
            params.set('indicator', indicator);
            params.set('schooldists', 'all');
            params.set('f', 'json');
            params.set('callback', 'JSONP_CALLBACK');
            return this.jsonp
                .get(serviceUrl, { search: params })
                .map((request: any) => <string[]>request.json());

        } else {
            let serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
            var params = new URLSearchParams();
            params.set('geoType', geoType);
            params.set('indicator', indicator);
            params.set('f', 'json');
            params.set('callback', 'JSONP_CALLBACK');
            return this.jsonp
                .get(serviceUrl, { search: params })
                .map((request: any) => <string[]>request.json());
        }
    }

    getDrilldownIndicatorData(subtopic: string, geoid: string) {
        let serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
        var params = new URLSearchParams();
        params.set('subtopic', subtopic);
        params.set('drilldown', '1');
        params.set('geoid', geoid);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map((request: any) => <string[]>request.json());
    }

    getIndicatorDataWithMetadata(geoids: string, geonames: string, indicator: string) {
        let serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
        var params = new URLSearchParams();
        params.set('viewType', 'basic');
        params.set('indicator', indicator);
        params.set('geoids', geoids);
        params.set('geonames', geonames);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map((request: any) => <string[]>request.json());
    }

    getIndicatorDetailDataWithMetadata(geoids: string, indicator: string) {
        let serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
        var params = new URLSearchParams();
        params.set('viewType', 'combined');
        params.set('indicator', indicator);
        params.set('geoids', geoids);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map((request: any) => <string[]>request.json());
    }

    getIndicatorDataWithMetadataBatch(geoids: string, indicators: any[]) {
        let observables: any[] = [];
        indicators.forEach((indicator: any) => {
            let serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
            var params = new URLSearchParams();
            params.set('viewType', 'basic');
            params.set('indicator', indicator.indicator.replace(/\+/g, '%2B').replace(/\&/g, '%26').replace(/\=/g, '%3D'));
            params.set('geoids', geoids);
            params.set('geonames', '');
            params.set('f', 'json');
            params.set('callback', 'JSONP_CALLBACK');
            observables.push(this.jsonp
                .get(serviceUrl, { search: params })
                .map((request: any) => <string[]>request.json()));
        });
        return Observable.forkJoin(observables);
    }

    getSchoolDistrictData(school_districts: string, indicator: string,counties:string,cts:string) {
        let serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api/schools';
        var params = new URLSearchParams();
        params.set('schooldistrict', '1');
        params.set('indicator', indicator);
        params.set('schooldists', school_districts);
        params.set('counties', counties);
        params.set('cts', cts);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map((request: any) => <string[]>request.json());
    }
}


