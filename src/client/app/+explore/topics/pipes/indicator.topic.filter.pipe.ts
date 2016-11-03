import {Pipe, PipeTransform} from '@angular/core';
import {Indicator, Topic} from '../../../shared/data_models/index';

@Pipe({
    name: 'indicatorTopicFilterPipe',
    pure: true
})

export class IndicatorTopicFilterPipe implements PipeTransform {
    transform(indicators: Indicator[], topics: Topic[], collections: any, filterText: string, sortAlpha: boolean): any {
        console.log('water');
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
            .filter((indicator: Indicator) => {
                if (filterText !== '') {
                    return indicator.indicator_display.toUpperCase().indexOf(filterText.toUpperCase()) !== -1;
                } else {
                    return true;
                }
            })
            .sort((a: any, b: any) => {
                //if (sortAlpha) {
                //    return a.indicator_display.localeCompare(b.indicator_display);
                //} else {
                //    return b.indicator_display.localeCompare(a.indicator_display);
                //}
                if (sortAlpha) {
                    return a.indicator.toUpperCase().localeCompare(b.indicator.toUpperCase());
                } else {
                    return b.indicator.toUpperCase().localeCompare(a.indicator.toUpperCase());
                }
            })
            : [];
        return returnIndicators;
    }
}


