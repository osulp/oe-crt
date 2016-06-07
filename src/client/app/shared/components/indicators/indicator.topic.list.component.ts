import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {JSONP_PROVIDERS}  from '@angular/http';

import {IndicatorTopicFilterPipe} from '../../../shared/pipes/index';
import {Topic, Indicator} from '../../../shared/data_models/index';
import {IndicatorsService} from '../../../shared/services/index';

@Component({
    moduleId: module.id,
    selector: 'indicators-by-topic-list',
    templateUrl: 'indicator.topic.list.component.html',
    styleUrls: ['indicator.topic.list.component.css'],
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



