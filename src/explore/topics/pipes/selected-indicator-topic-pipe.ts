import {Pipe} from 'angular2/core';
//import {Topic} from '../../../shared/data_models/topic';
import {Indicator} from '../../../shared/data_models/indicator';


@Pipe({
    name: 'SelectedIndicatorByTopicsPipe'
})

export class SelectedIndicatorByTopicsPipe {
    transform(indicators: Indicator[], topic: [any]): any {
        if (indicators !== undefined) {
            if (topic[0] === 'all') {
                return indicators.filter(indicator => indicator.selected).length;
            } else {
                return indicators.filter(indicator => indicator.selected && indicator.topics === topic[0].topic);
            }
        }
    }
}


