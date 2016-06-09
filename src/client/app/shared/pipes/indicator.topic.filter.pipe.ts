import {Pipe, PipeTransform} from '@angular/core';
import {Indicator,Topic} from '../../shared/data_models/index';

@Pipe({
    name: 'indicatorTopicFilterPipe'
})

export class IndicatorTopicFilterPipe implements PipeTransform {
    transform(indicators: Indicator[], topics: Topic[]): any {
        if (indicators !== undefined) {
            let selectedTopics: any = [];
            if (topics !== undefined) {
                for (var x = 0; x < topics.length; x++) {
                    if (topics[x].selected) {
                        selectedTopics.push(topics[x].topic);
                    }
                }
            }
            if (selectedTopics.length > 0) {
                return indicators.filter(indicator => selectedTopics.indexOf(indicator.topics) !== -1);
            } else {
                return indicators;
            }
        }
        return indicators;
    }
}


