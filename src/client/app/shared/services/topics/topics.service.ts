import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
import {Topic} from '../../data_models/index';

@Injectable()

export class TopicsService {

    constructor(public jsonp: Jsonp) { }

    getCRTTopics() {
        let serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api_dev/topics';
        var params = new URLSearchParams();
        params.set('f', 'json');
        params.set('crt', 'true');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map((request: any) => <string[]>request.json())
            .map((topics: Array<any>) => {
                let result: Array<Topic> = [];
                if (topics) {
                    topics.forEach((topic) => {
                        //console.log('adding topic to list', topic);
                        result.push(new Topic(topic.topic, topic.icon, topic.featured, false, topic.collections));
                    });
                }
                return result;
            });
    }
}


