import {Pipe, PipeTransform} from '@angular/core';
import {Topic} from '../../../shared/data_models/index';

@Pipe({
    name: 'SelectedTopicsPipe'
})

//export class SelectedTopicsPipe implements PipeTransform {
//    transform(topics: Topic[], collection: any): any {
//        if (topics !== undefined && collection) {
//            let selectedCollection = collection.filter((coll: any) => coll.selected);
//            if (selectedCollection.length > 0) {
//                let selectedTopics = topics.filter(topic => topic.selected && (selectedCollection[0].collection !== 'Show All' ? topic.collections ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false : true));
//                console.log('selectedCRTTOPICs', topics, collection, selectedCollection, selectedTopics);
//                if (selectedTopics.length === 0) {
//                    //filter by selected collection
//                    return topics.filter(topic => selectedCollection[0].collection !== 'Show All' ? topic.collections ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false : true);
//                } else {
//                    return selectedTopics;
//                }
//            } else {
//                let selectedTopics = topics.filter(topic => topic.selected);
//                return selectedTopics;
//            }
//        }
//    }
//}

export class SelectedTopicsPipe implements PipeTransform {
    transform(topics: Topic[], collection: any, topicIndicatorCount: any): any {
        console.log('selectedTopicsPipe', topicIndicatorCount, collection);
        if (topics !== undefined && collection) {
            let selectedCollection = collection.filter((coll: any) => coll.selected);
            let isAllTopics = topics.filter(topic => topic.selected).length === 0;
            if (selectedCollection.length > 0) {
                let selectedTopics = topics.filter((topic: Topic) => {
                    if (topicIndicatorCount ? topicIndicatorCount[topic.topic]: false) {
                        if (topic.selected || isAllTopics) {
                            return selectedCollection[0].collection !== 'Show All'
                                ? topic.collections
                                    ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1
                                        ? topicIndicatorCount[topic.topic][selectedCollection[0].collection].maxCount > 0
                                        : false
                                    : false
                                : topicIndicatorCount[topic.topic]
                                    ? topicIndicatorCount[topic.topic]['Show All'].maxCount > 0
                                    : true;
                        } else {
                            return topicIndicatorCount[topic.topic]
                                ? topicIndicatorCount[topic.topic]['Show All'].maxCount > 0
                                : true;
                        }
                        //console.log('topic filter check', topic, topicIndicatorCount[topic.topic]);
                    } else {
                        return topic.selected && (selectedCollection[0].collection !== 'Show All'
                            ? topic.collections
                                ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1
                                : false
                            : true);
                    }
                });
                console.log('selectedCRTTOPICs', topics, collection, selectedCollection, selectedTopics);
                if (selectedTopics.length === 0) {
                    //filter by selected collection
                    return topics.filter(topic => selectedCollection[0].collection !== 'Show All' ? topic.collections ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false : true).sort((a: any, b: any) => a.topic.localeCompare(b.topic));
                } else {
                    return selectedTopics.sort((a: any, b: any) => a.topic.localeCompare(b.topic));
                }
            } else {
                let selectedTopics = topics.filter((topic:Topic) => {
                    if (topicIndicatorCount) {
                        return topicIndicatorCount[topic.topic][selectedCollection].maxCount > 0 && topic.selected;
                    } else {
                        return topic.selected;
                    }
                });
                return selectedTopics.sort((a: any, b: any) => a.topic.localeCompare(b.topic));
            }
        }
    }



}

