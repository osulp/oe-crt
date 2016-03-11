import {Pipe} from 'angular2/core';
import {Indicator} from '../../../shared/data_models/indicator';
import {Topic} from '../../../shared/data_models/topic';

@Pipe({
    name: 'indicatorTopicFilterPipe'
})

export class IndicatorTopicFilterPipe {
    transform(indicators: Indicator[], topics: [Topic[]]): any {
        if (indicators !== undefined) {
            let selectedTopics = [];
            if (topics !== undefined) {
                for (var x = 0; x < topics[0].length; x++) {
                    if (topics[0][x].selected) {
                        selectedTopics.push(topics[0][x].topic);
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

