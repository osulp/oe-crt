import {Pipe, PipeTransform} from '@angular/core';
import {Indicator} from './../../shared/data_models/index';

@Pipe({
    name: 'indicatorCollectionFilterPipe',
    pure: true
})

export class IndicatorCollectionFilterPipe implements PipeTransform {
    transform(indicators: Indicator[], collection: string): any {
        console.log('indicator collection filter pipe', indicators, collection);
        if (indicators !== undefined) {
        let selectedCollection = collection !== '' && collection !== '<-- Select a collection -->'
         ? collection
         : 'Show All';
        let returnIndicators = indicators ? indicators
            .filter((indicator: Indicator) => {
                let inCollection = selectedCollection === 'Show All' ? true : false;
                if (!inCollection) {
                    inCollection = indicator.collections
                    ? (indicator.collections.split(', ').indexOf(selectedCollection) !== -1 ? true
                    : false) : false;
                    inCollection = indicator.indicator === '<-- Please select an indicator -->' ? true : inCollection;
                }
                return inCollection;
            })
            .sort((a: any, b: any) => {
                return a.indicator.toUpperCase().localeCompare(b.indicator.toUpperCase());
            })
            : [];
        return returnIndicators;
        } else {
            return indicators;
        }
    }
}


