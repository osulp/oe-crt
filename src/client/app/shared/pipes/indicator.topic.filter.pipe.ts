import {Pipe, PipeTransform} from '@angular/core';
import {Indicator,Topic} from '../../shared/data_models/index';

@Pipe({
    name: 'indicatorTopicFilterPipe'
})

export class IndicatorTopicFilterPipe implements PipeTransform {
    transform(indicators: Indicator[], topic: Topic, collections: any): any {
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
                let inCollection = selectedCollection === 'Show All' ? true : false;
                if (!inCollection) {
                    inCollection = indicator.collections ? (indicator.collections.split(', ').indexOf(selectedCollection) !== -1 ? true : false) : false;
                }
                return inCollection;
            })
            .sort((a: any, b: any) => a.indicator.localeCompare(b.indicator))
            : [];
        return returnIndicators;
        //console.log('collectthis', collection);
        //if (indicators !== undefined) {
        //    let selectedTopics: any = [];
        //    if (topics !== undefined) {
        //        for (var x = 0; x < topics.length; x++) {
        //            if (topics[x].selected) {
        //                selectedTopics.push(topics[x].topic);
        //            }
        //        }
        //    }
        //    if (selectedTopics.length > 0) {
        //        let filteredIndicators: any[] = [];
        //        for (var i = 0; i < indicators.length; i++) {
        //            //console.log('shared pipe showing ', indicators[i]);
        //            let assocTopics = indicators[i].topics.split(', ');
        //            //console.log(assocTopics);
        //            for (let t of selectedTopics) {
        //                //console.log('checking t:', t);
        //                if (assocTopics.indexOf(t) !== -1) {
        //                    let selCollection = collection.filter((coll: any) => coll.selected);
        //                    if (collection.length > 0 && indicators[i].collections) {
        //                        if (indicators[i].collections.split(', ').indexOf(selCollection[0].collection) !== -1 || selCollection[0].collection === 'Show All') {
        //                            filteredIndicators.push(indicators[i]);
        //                        }
        //                    } else if (indicators[i].collections || selCollection[0].collection === 'Show All') {
        //                        filteredIndicators.push(indicators[i]);
        //                    }
        //                }
        //            }
        //        }
        //        //console.log('Filtered Indicators: ', filteredIndicators);
        //        return filteredIndicators;
        //    } else {
        //        return indicators;
        //    }
        //}
        //return indicators;
    }
}


