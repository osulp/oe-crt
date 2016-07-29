import {Pipe, PipeTransform} from '@angular/core';
import {Indicator, Topic} from '../../../shared/data_models/index';

@Pipe({
    name: 'indicatorTopicFilterPipe'
})

export class IndicatorTopicFilterPipe implements PipeTransform {
    transform(indicators: Indicator[], topics: Topic[], collections: any): any {
        //if (indicators !== undefined) {
        let selectedCollection = collections ? collections.filter((coll: any) => coll.selected).length > 0 ? collections.filter((coll: any) => coll.selected)[0].collection : 'Show All' : 'Show All';
        let selectedTopics = topics ? topics.filter((topic: Topic) => topic.selected) : [];
        let returnIndicators = indicators ? indicators
            .filter((indicator: Indicator) => {
                if (selectedTopics.length > 0) {
                    let inSelectedTopics = false;
                    selectedTopics.forEach((topic: Topic) => {
                        inSelectedTopics = indicator.topics ? (indicator.topics.split(', ').indexOf(topic.topic) !== -1 ? true : inSelectedTopics) : false;
                    });
                    return inSelectedTopics;
                } else {
                    return true;
                }
            })
            .filter((indicator: Indicator) => {
                let inCollection = selectedCollection === 'Show All' ? true : false;
                if (!inCollection) {
                    inCollection = indicator.collections ? (indicator.collections.split(', ').indexOf(selectedCollection) !== -1 ? true : false) : false;
                }
                return inCollection;
            })
            .sort((a: any, b: any) => a.indicator.localeCompare(b.indicator))
            : [];
        return returnIndicators;
    }
}


