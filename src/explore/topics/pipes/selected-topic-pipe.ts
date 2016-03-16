import {Pipe} from 'angular2/core';
import {Topic} from '../../../shared/data_models/topic';

@Pipe({
    name: 'SelectedTopicsPipe'
})

export class SelectedTopicsPipe {
    transform(topics: Topic[]): any {
        if (topics !== undefined) {
            return topics.filter(topic => topic.selected);
        }
    }
}

