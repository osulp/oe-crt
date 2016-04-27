import {Pipe} from 'angular2/core';
import {Topic} from '../../../shared/data_models/topic';

@Pipe({
    name: 'SelectedTopicsPipe'
})

export class SelectedTopicsPipe {
    transform(topics: Topic[]): any {
        if (topics !== undefined) {
            console.log('RACOON');
            console.log(topics);
            let tempTopics = topics.filter(topic => topic.selected);
            if (tempTopics.length === 0) {
                //TODO:  SCROLL on Demand logic
                tempTopics = topics.filter(topic => topic.topic === 'Age');
                if (tempTopics.length !== 0) {
                    tempTopics[0].selected = true;
                }
            }
            return tempTopics;
        }
    }
}

