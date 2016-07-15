import {Pipe, PipeTransform} from '@angular/core';
import {Topic} from '../../../shared/data_models/index';

@Pipe({
    name: 'SortAlphaTopicPipe'
})

export class SortAlphaTopicPipe implements PipeTransform {
    transform(topics: Topic[]): any {
        if (topics !== undefined) {
            let selectedTopics = topics.sort((a: any, b: any) => a.topic.localeCompare(b.topic));
            return selectedTopics;
        }
    }
}

