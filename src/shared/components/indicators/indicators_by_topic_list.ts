import {Component, Input, OnInit, Output, EventEmitter} from 'angular2/core';
import {JSONP_PROVIDERS}  from 'angular2/http';

import {IndicatorTopicFilterPipe} from '../../../shared/pipes/indicator-topic-filter-pipe';
import {Topic} from '../../../shared/data_models/topic';
import {Indicator} from '../../../shared/data_models/indicator';
import {IndicatorsService} from '../../../shared/services/indicators/indicators.service';

@Component({
    selector: 'indicators-by-topic-list',
    templateUrl: './shared/components/indicators/indicators_by_topic_list.html',
    styleUrls: ['./shared/components/indicators/indicators_by_topic_list.css'],
    pipes: [IndicatorTopicFilterPipe],
    providers: [JSONP_PROVIDERS, IndicatorsService]
})


export class IndicatorsTopicList implements OnInit {
    @Input() topic: Topic;
    @Input() inputIndicators: Indicator[];
    @Input() inputTopics: Topic[];
    @Input() allTopicsView: boolean;
    @Output() filteredIndicatorsFromComp = new EventEmitter();
    selTopics: Topic[] = [];
    //public Indicators: Indicator[] = [];
    public _selectedIndicators: any;

    constructor(public _indicatorService: IndicatorsService) { }

    toggleIndicator(indicator: Indicator, value?: boolean) {
        if (value) {
            indicator.selected = value;
        } else {
            indicator.toggleSelected();
        }
        const i = this.inputIndicators.indexOf(indicator);
        this.inputIndicators = [
            ...this.inputIndicators.slice(0, i),
            indicator,
            ...this.inputIndicators.slice(i + 1)
        ];
        this._selectedIndicators = [];
        for (var x = 0; x < this.inputIndicators.length; x++) {
            if (this.inputIndicators[x].selected) {
                this._selectedIndicators.push(this.inputIndicators[x]);
            }
        }
        this.filteredIndicatorsFromComp.emit(this.inputIndicators);
    }

    ngOnInit() {
        console.log('horses');
        console.log(this.inputTopics);
        this.selTopics = this.inputTopics;
        //console.log(this.inputTopics);
        //if (this.topic !== undefined) {
        //    this.selTopics.push(this.topic);
        //} else {
        //    console.log('HOT SHIT');
        //    console.log(this.inputTopics);
        //    this.selTopics = this.inputTopics;
        //}
        //this.selTopics.push(this.topic);
        //if (this.allTopicsView) {

        //} else {
        //    this.selTopics.push(this.topic);
        //}       
    }
}



