import {Pipe, PipeTransform} from '@angular/core';
//import {Topic} from '../../../shared/data_models/topic';
import {Indicator} from '../../../shared/data_models/index';


@Pipe({
    name: 'SelectedIndicatorByTopicsCountPipe'
})

export class SelectedIndicatorByTopicsCountPipe implements PipeTransform {
    transform(indicators: Indicator[], topic: any): any {
        if (indicators !== undefined) {
            if (topic.topic === 'all') {
                return indicators.filter(indicator => indicator.selected).length;
            } else {
                return indicators.filter(indicator => indicator.selected && indicator.topics === topic.topic).length;
            }
        }
    }
}


