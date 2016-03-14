import {Component, OnInit, Input, Output, EventEmitter}   from 'angular2/core';
import {JSONP_PROVIDERS}  from 'angular2/http';
import {Topic} from '../../shared/data_models/topic';
import {Indicator} from '../../shared/data_models/indicator';
import {TopicsService} from '../../shared/services/topics/topics.service';
import {IndicatorsService} from '../../shared/services/indicators/indicators.service';
import {SelectIndicatorsCmp} from './indicators/select-indicators';
import {IndicatorTopicFilterPipe} from './indicators/indicator-topic-filter-pipe';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Component({
    selector: 'topics',
    templateUrl: './explore/topics/topics.html',
    styleUrls: ['./explore/topics/topics.css'],
    directives: [SelectIndicatorsCmp],
    pipes: [IndicatorTopicFilterPipe],
    providers: [JSONP_PROVIDERS, TopicsService, IndicatorsService]
})



export class TopicsCmp implements OnInit {
    @Output() selectedTopics = new EventEmitter();
    @Input() inputTopics: string;

    //selectedIndicators = new EventEmitter();
    public Indicators;
    public Topics;
    public _selectedIndicators;
    public _selectedTopics;
    public _inputTopics;
    visible: boolean;
    chkBoxVisibile: boolean;
    showAllSelected: boolean;
    selected: string[];

    constructor(
        public _topicService: TopicsService,
        public _indicatorService: IndicatorsService
    ) {
        this.visible = true;
        this.showAllSelected = false;
        this.chkBoxVisibile = false;
    }

    getClass() {
        return this.visible ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    }

    toggleTopicsWrapper() {
        this.visible = !this.visible;
    }

    toggleAllTopics(evt) {
        this.showAllSelected = !this.showAllSelected;
        if (this.showAllSelected) {
            //turn off any other selected topics and set selected to all
            console.log('show all selected');
            this.Topics.forEach((topic) => {
                if (topic.selected) {
                    topic.toggleSelected();
                }
            });
            this._selectedTopics = [];
            this.selectedTopics.emit(this._selectedTopics);
        }
    }

    getTopics() {
        this._topicService.getTopics().subscribe(
            data => {
                this.Topics = data;
                this._inputTopics = this._inputTopics.replace(/\%20/g, ' ').replace(/\%26/g, '&');
                var inputTopicsArr = this._inputTopics.split(',');
                if (inputTopicsArr.length > 0 && this._inputTopics !== 'All Topics') {
                    for (var x = 0; x < this.Topics.length; x++) {
                        if (inputTopicsArr.indexOf(this.Topics[x].topic) !== -1) {
                            this.Topics[x].toggleSelected();
                        }
                    }
                } else {
                    this.showAllSelected = true;
                }
            },
            err => console.error(err),
            () => console.log('done loading topics'));
    }

    toggleTopic(topic: Topic) {
        //turn off all topics, if selected
        this.showAllSelected = false;
        topic.toggleSelected();
        const i = this.Topics.indexOf(topic);
        this.Topics = [
            ...this.Topics.slice(0, i),
            topic,
            ...this.Topics.slice(i + 1)
        ];
        this._selectedTopics = [];
        for (var x = 0; x < this.Topics.length; x++) {
            if (this.Topics[x].selected) {
                this._selectedTopics.push(this.Topics[x].topic);
            }
        }
        this.selectedTopics.emit(this._selectedTopics);
    }

    getIndicators() {
        this._indicatorService.getIndicators().subscribe(
            data => {
                this.Indicators = data;
                //var inputTopicsArr = this.inputTopics.split(',');                
                //if (this.Indicators.length > 0) {
                //    for (var x = 0; x < this.Indicators.length; x++) {
                //        if (inputTopicsArr.indexOf(this.Indicators[x].indicator) !== -1) {
                //            this.Indicators[x].toggleSelected();
                //        }                        
                //    }
                //}                
            },
            err => console.error(err),
            () => console.log('done loading indicators'));
    }

    toggleIndicator(indicator: Indicator) {
        indicator.toggleSelected();
        const i = this.Indicators.indexOf(indicator);
        this.Indicators = [
            ...this.Indicators.slice(0, i),
            indicator,
            ...this.Indicators.slice(i + 1)
        ];
    }


    ngOnInit() {
        console.log('Input Topics: ' + this.inputTopics);
        this._inputTopics = this.inputTopics;
        this.getTopics();
        this.getIndicators();
        this.selected = ['All Topics'];
        this.selectedTopics.emit(this.selected);
    }
}



