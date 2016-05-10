import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';
import {Topic} from '../../data_models/topic';

@Injectable()

export class TopicsService {
    constructor(public jsonp: Jsonp) { }
    getTopics() {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/topics';
        var params = new URLSearchParams();
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(request => <string[]>request.json())
            .map((topics: Array<any>) => {
                let result: Array<Topic> = [];
                if (topics) {
                    topics.forEach((topic) => {
                        result.push(new Topic(topic.topic, topic.domain, false));
                    });
                }
                return result;
            });
    }
    getCRTTopics() {
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/topics';
        var params = new URLSearchParams();
        params.set('f', 'json');
        params.set('crt', 'true');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(request => <string[]>request.json())
            .map((topics: Array<any>) => { return topics; });
    }
}


