import {Pipe, PipeTransform} from '@angular/core';
import {Indicator,Topic} from '../../shared/data_models/index';

@Pipe({
    name: 'indicatorTopicFilterPipe'
})

export class IndicatorTopicFilterPipe implements PipeTransform {
    transform(indicators: Indicator[], topic: Topic, collections: any, selectedOnly: boolean): any {
        let selectedCollection = collections ? collections.filter((coll: any) => coll.selected).length > 0 ? collections.filter((coll: any) => coll.selected)[0].collection : 'Show All' : 'Show All';
        //let selectedTopics = topic ? topic.filter((topic: Topic) => topic.selected) : [];
        let returnIndicators = indicators ? indicators
            .filter((indicator: Indicator) => {
                if (topic) {
                    let inSelectedTopics = false;
                    inSelectedTopics = indicator.topics ? (indicator.topics.split(', ').indexOf(topic.topic) !== -1 ? true : inSelectedTopics) : false;
                    return inSelectedTopics;
                } else {
                    return false;
                }
            })
            .filter((indicator: Indicator) => {
                console.log('filtering for collection', indicator, selectedCollection);
                let inCollection = selectedCollection === 'Show All' ? true : false;
                if (!inCollection) {
                    inCollection = indicator.collections ? (indicator.collections.split(', ').indexOf(selectedCollection) !== -1 ? true : false) : false;
                }
                return inCollection;
            })
            .filter((indicator: Indicator) => {
                return selectedOnly ? indicator.selected : true;
            })
            .sort((a: any, b: any) => a.indicator.localeCompare(b.indicator))
            : [];
        return returnIndicators;
    }
}


