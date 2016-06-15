import {Pipe, PipeTransform} from '@angular/core';
import {Indicator, Topic} from '../../../shared/data_models/index';

@Pipe({
    name: 'indicatorTopicFilterPipe'
})

export class IndicatorTopicFilterPipe implements PipeTransform {
    transform(indicators: Indicator[], topics: Topic[]): any {
        //if (indicators !== undefined) {
        let selectedTopics: any = [];
        console.log(topics);
        if (topics !== undefined) {
            for (var x = 0; x < topics.length; x++) {
                if (topics[x].selected) {
                    selectedTopics.push(topics[x].topic);
                }
            }
        }
        console.log('selected topics', selectedTopics);
        if (selectedTopics.length > 0) {
            let filteredIndicators: any[] = [];
            for (var i = 0; i < indicators.length; i++) {
                //console.log('explore topic filter pipe, indicator', indicators[i]);
                let assocTopics = indicators[i].topics.split(', ');
                //console.log(assocTopics);
                for (let t of selectedTopics) {
                    //console.log('checking t:', t);
                    if (assocTopics.indexOf(t) !== -1) {
                        filteredIndicators.push(indicators[i]);
                    }
                }
            }
            console.log('Filtered Indicators explore filter pipe: ', filteredIndicators);
            return filteredIndicators;
        } else {
            console.log('shouldnt be here');
            return indicators;
        }
        //}
        //return indicators;
    }
}


