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
                let filteredIndicators: any[] = [];
                for (var i = 0; i < indicators.length; i++) {
                    //console.log('shared pipe showing ', indicators[i]);
                    let assocTopics = indicators[i].topics.split(', ');
                    //console.log(assocTopics);
                    for (let t of selectedTopics) {
                        //console.log('checking t:', t);
                        if (assocTopics.indexOf(t) !== -1) {
                            filteredIndicators.push(indicators[i]);
                        }
                    }
                }
                console.log('Filtered Indicators: ', filteredIndicators);
                return filteredIndicators;
            } else {
                return indicators;
            }
        }
        return indicators;
    }
}


