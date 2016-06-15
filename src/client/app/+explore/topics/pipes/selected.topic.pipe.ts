import {Pipe, PipeTransform} from '@angular/core';
import {Topic} from '../../../shared/data_models/index';

@Pipe({
    name: 'SelectedTopicsPipe'
})

export class SelectedTopicsPipe implements PipeTransform {
    transform(topics: Topic[]): any {
        if (topics !== undefined) {
            let tempTopics = topics.filter(topic => topic.selected);
            //if (tempTopics.length === 0) {
            //    //TODO:  SCROLL on Demand logic
            //    tempTopics = topics.filter(topic => topic.topic === 'Demographics');
            //    if (tempTopics.length !== 0) {
            //        tempTopics[0].selected = true;
            //    }
            //}
            return tempTopics;
        }
    }
}

