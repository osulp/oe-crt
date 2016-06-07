import {Pipe} from '@angular/core';
import {Indicator,Topic} from '../../shared/data_models/index';

@Pipe({
    name: 'indicatorTopicFilterPipe'
})

export class IndicatorTopicFilterPipe {
    transform(indicators: Indicator[], topics: [Topic[]]): any {
        if (indicators !== undefined) {
            let selectedTopics: any = [];
            if (topics[0] !== undefined) {
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


