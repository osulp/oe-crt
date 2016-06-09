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
                let filteredIndicators = indicators.filter(indicator => selectedTopics.indexOf(indicator.topics) !== -1);
                console.log('filtered indicators', filteredIndicators);
                return filteredIndicators;
            } else {
                console.log('shouldnt be here');
                return indicators;
            }
        //}
        //return indicators;
    }
}


