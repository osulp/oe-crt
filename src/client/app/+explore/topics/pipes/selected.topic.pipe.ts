import {Pipe, PipeTransform} from '@angular/core';
import {Topic} from '../../../shared/data_models/index';

@Pipe({
    name: 'SelectedTopicsPipe'
})

export class SelectedTopicsPipe implements PipeTransform {
    transform(topics: Topic[]): any {
        if (topics !== undefined) {
            let selectedTopics = topics.filter(topic => topic.selected);
            if (selectedTopics.length === 0) {
                return topics;
            } else {
                return selectedTopics;
            }
        }
    }
}

