import {Pipe, PipeTransform} from '@angular/core';
import {Topic} from '../../../shared/data_models/index';

@Pipe({
    name: 'SortAlphaTopicPipe'
})

export class SortAlphaTopicPipe implements PipeTransform {
    transform(topics: Topic[], collections:any): any {
        if (topics !== undefined) {
            let selectedCollection = collections.filter((coll: any) => coll.selected);
            let selectedTopics = topics.sort((a: any, b: any) => a.topic.localeCompare(b.topic)).filter(topic => (selectedCollection[0].collection !== 'Show All' ? topic.collections ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false : true));
            return selectedTopics;
        }
    }
}

