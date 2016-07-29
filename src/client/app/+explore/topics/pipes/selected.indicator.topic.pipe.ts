import {Pipe, PipeTransform} from '@angular/core';
//import {Topic} from '../../../shared/data_models/topic';
import {Indicator} from '../../../shared/data_models/index';


@Pipe({
    name: 'SelectedIndicatorByTopicsPipe'
})

export class SelectedIndicatorByTopicsPipe implements PipeTransform {
    transform(indicators: Indicator[], topic: any, collections?: any[]): any {        
        if (indicators !== undefined) {
            if (topic.topic === 'all') {
                return indicators.filter(indicator => indicator.selected).length;
            } else {
                //return indicators.filter(indicator => indicator.selected && indicator.topics.split(', ').indexOf(topic.topic) !== -1);
                let selectedCollection: any = collections.filter(collection => { return collection.selected; });
                return indicators.filter(indicator => {
                    let returnIndicator = indicator.selected && indicator.topics.split(', ').indexOf(topic.topic) !== -1 &&
                        (selectedCollection[0].collection === 'Show All' ? true : (indicator.collections ? indicator.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false));
                    return returnIndicator;
                });
            }
        }
    }
}


