import {Pipe, PipeTransform} from '@angular/core';
import {Topic} from '../../../shared/data_models/index';

@Pipe({
    name: 'SelectedTopicsPipe'
})

export class SelectedTopicsPipe implements PipeTransform {
    transform(topics: Topic[], collection:any): any {
        if (topics !== undefined && collection) {
            let selectedCollection = collection.filter((coll:any) => coll.selected);
            let selectedTopics = topics.filter(topic => topic.selected && (selectedCollection[0].collection !== 'Show All' ? topic.collections ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false : true));
            console.log('selectedCRTTOPICs', topics, collection, selectedCollection, selectedTopics);
            if (selectedTopics.length === 0) {
                //filter by selected collection
                return topics.filter(topic => selectedCollection[0].collection !== 'Show All' ? topic.collections ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false : true);
            } else {
                return selectedTopics;
            }
        }
    }
}

