import {Pipe, PipeTransform} from '@angular/core';
//import {Topic} from '../../../shared/data_models/topic';
import {Indicator} from '../../../shared/data_models/index';


@Pipe({
    name: 'SelectedIndicatorByTopicsCountPipe'
})

export class SelectedIndicatorByTopicsCountPipe implements PipeTransform {
    transform(indicators: Indicator[], topic: any, collections: any): any {
        let selCollection = collections.filter((coll: any) => coll.selected);
        if (indicators !== undefined) {
            if (topic === 'all') {
                return indicators.filter(indicator => indicator.selected && (indicator.collections ? (indicator.collections.split(', ').indexOf(selCollection[0].collection) !== -1 || selCollection[0].collection === 'Show All') : selCollection[0].collection === 'Show All' ? true : false)).length;
            } else {
                return indicators.filter(indicator => {
                    return indicator.selected && indicator.topics.split(', ').indexOf(topic.topic) !== -1 && (indicator.collections ? (indicator.collections.split(', ').indexOf(selCollection[0].collection) !== -1 || selCollection[0].collection === 'Show All') : selCollection[0].collection === 'Show All' ? true : false);
                }).length;
            }
        }
    }
}
