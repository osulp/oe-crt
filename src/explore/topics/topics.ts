import {Component, OnInit, Output, EventEmitter}   from 'angular2/core';
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
    //selectedIndicators = new EventEmitter();
    public Indicators;
    public Topics;
    public _selectedIndicators;
    public _selectedTopics;
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
            data => { this.Topics = data; },
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
        this.getTopics();
        this.getIndicators();
        this.selected = ['All Topics'];
        this.selectedTopics.emit('test');
    }
}



