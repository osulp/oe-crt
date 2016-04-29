import {Component, OnInit, Input, Output, EventEmitter}   from 'angular2/core';
import {JSONP_PROVIDERS}  from 'angular2/http';
import {IndicatorsTopicList}  from '../../shared/components/indicators/indicators_by_topic_list';
import {Topic} from '../../shared/data_models/topic';
import {Indicator} from '../../shared/data_models/indicator';
import {TopicsService} from '../../shared/services/topics/topics.service';
import {IndicatorsService} from '../../shared/services/indicators/indicators.service';
//import {Subscription}   from 'rxjs/Subscription';
import {SelectedTopicsPipe} from './pipes/selected-topic-pipe';
import {IndicatorTopicFilterPipe} from './pipes/indicator-topic-filter-pipe';
import {SelectedIndicatorByTopicsCountPipe} from './pipes/selected-indicator-topic-count-pipe';
//import {SelectedIndicatorsService} from '../../shared/services/indicators/selected-indicators.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Component({
    selector: 'topics',
    templateUrl: './explore/topics/topics.html',
    styleUrls: ['./explore/topics/topics.css'],
    directives: [IndicatorsTopicList],
    pipes: [IndicatorTopicFilterPipe, SelectedTopicsPipe, SelectedIndicatorByTopicsCountPipe],
    providers: [JSONP_PROVIDERS, TopicsService, IndicatorsService]
})



export class TopicsCmp implements OnInit {
    @Output() selectedTopicsFromComp = new EventEmitter();
    @Output() selectedIndicatorsFromComp = new EventEmitter();
    @Output() allTopicsFromComp = new EventEmitter();
    @Output() allIndicatorsFromComp = new EventEmitter();
    @Input() inputTopics: string;
    @Input() inputIndicators: string;

    //selectedIndicators = new EventEmitter();    
    public Indicators: any;
    public Topics: any;
    public _selectedIndicators: any;
    public _selectedTopics: any;
    public _inputTopics: any;
    public _inputIndicators: any;

    visible: boolean;
    chkBoxVisibile: boolean;
    showAllSelected: boolean;
    selected: string[];
    //private subscription: Subscription;

    constructor(
        public _topicService: TopicsService,
        public _indicatorService: IndicatorsService
        //private _selectedIndicatorsService: SelectedIndicatorsService
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

    toggleAllTopics(evt: any) {
        this.showAllSelected = this.showAllSelected ? this.showAllSelected : !this.showAllSelected;
        if (this.showAllSelected) {
            //turn off any other selected topics and set selected to all
            console.log('show all selected');
            this.Topics.forEach((topic: Topic) => {
                if (topic.selected) {
                    this.toggleTopic(topic);
                }
            });
            this._selectedTopics = [];
            this.selectedTopicsFromComp.emit(this._selectedTopics);
            for (var i = 0; i < this.Indicators.length; i++) {
                this.toggleIndicator(this.Indicators[i], true);
                //this._selectedIndicatorsService.toggle(this.Indicators[i], true);
            }
            this.allTopicsFromComp.emit(this.Topics);
            this.allIndicatorsFromComp.emit(this.Indicators);
        }
    }

    getTopics() {
        this._topicService.getTopics().subscribe(
            data => {
                this.Topics = data;
                this.allTopicsFromComp.emit(this.Topics);
                if (this._inputTopics.length > 0 && (this._inputTopics[0] !== 'All Topics' || this._inputTopics[0] !== '')) {
                    this.showAllSelected = this._inputTopics[0] !== 'All Topics' ? false : true;
                    for (var x = 0; x < this.Topics.length; x++) {
                        if (this._inputTopics.indexOf(this.Topics[x].topic) !== -1) {
                            this.Topics[x].toggleSelected();
                        }
                    }
                } else {
                    this.showAllSelected = true;
                }
                this.getIndicators();
            },
            err => console.error(err),
            () => console.log('done loading topics'));
    }

    toggleTopic(topic: Topic) {
        //turn off all topics, if selected
        this.showAllSelected = false;
        topic.toggleSelected();
        const idx = this.Topics.indexOf(topic);
        this.Topics = [
            ...this.Topics.slice(0, idx),
            topic,
            ...this.Topics.slice(idx + 1)
        ];
        this._selectedTopics = [];
        for (var x = 0; x < this.Topics.length; x++) {
            if (this.Topics[x].selected) {
                this._selectedTopics.push(this.Topics[x].topic);
            }
        }
        if (this._selectedTopics.length === 0) {
            this.showAllSelected = true;
        }
        this.selectedTopicsFromComp.emit(this._selectedTopics);
        //sync indicator selections
        for (var i = 0; i < this.Indicators.length; i++) {
            if (this._selectedTopics.indexOf(this.Indicators[i].topics) !== -1) {
                this.toggleIndicator(this.Indicators[i], true);
                //this._selectedIndicatorsService.toggle(this.Indicators[i], true);
            }
        }
        this.allTopicsFromComp.emit(this.Topics);
        this.allIndicatorsFromComp.emit(this.Indicators);
    }

    onFilterIndicator(Indicators: Indicator[]) {
        this.Indicators = Indicators;
        this.allIndicatorsFromComp.emit(this.Indicators);
    }

    toggleIndicator(indicator: Indicator, value?: boolean) {
        console.log('nomnuts');
        if (value) {
            indicator.selected = value;
        } else {
            indicator.toggleSelected();
        }
        const i = this.Indicators.indexOf(indicator);
        this.Indicators = [
            ...this.Indicators.slice(0, i),
            indicator,
            ...this.Indicators.slice(i + 1)
        ];
        this._selectedIndicators = [];
        for (var x = 0; x < this.Indicators.length; x++) {
            if (this.Indicators[x].selected) {
                this._selectedIndicators.push(this.Indicators[x]);
            }
        }
        this.allIndicatorsFromComp.emit(this.Indicators);
    }

    getIndicators() {
        this._indicatorService.getIndicators().subscribe(
            data => {
                this.Indicators = data;
                if (this.Indicators.length > 0) {
                    for (var x = 0; x < this.Indicators.length; x++) {
                        if (this._inputIndicators[0] !== '') {
                            //turn on individual indicator from input url/selection                              
                            if (this._inputIndicators.indexOf(this.Indicators[x].indicator) !== -1) {
                                this.toggleIndicator(this.Indicators[x]);
                            }
                        } else {
                            //turn on for all selected topics                         
                            if (this._inputTopics[0] !== 'All Topics') {
                                if (this._inputTopics.indexOf(this.Indicators[x].topics) !== -1) {
                                    console.log('indicator in selected topic ' + this.Indicators[x]);
                                    this.toggleIndicator(this.Indicators[x], true);
                                }
                            } else {
                                //all indicators for all topics                       
                                this.toggleIndicator(this.Indicators[x], true);
                            }

                        }

                    }
                    this.allIndicatorsFromComp.emit(this.Indicators);
                }
            },
            err => console.error(err),
            () => console.log('done loading indicators'));
    }

    ngOnInit() {
        //console.log('Input Topics: ' + this.inputTopics);
        this._inputTopics = this.inputTopics.replace(/\%20/g, ' ').replace(/\%26/g, '&').split(',');
        this._selectedTopics = this._inputTopics;
        //console.log('Input Indicators: ' + this.inputIndicators);
        this._inputIndicators = this.inputIndicators.replace(/\%20/g, ' ').replace(/\%26/g, '&').split(';');
        this._selectedIndicators = this._inputIndicators;
        //console.log('Selected Indicators: ' + this._selectedIndicators);

        this.getTopics();
        //sync with component to update state/display
        this.selected = this.inputTopics.length === 0 ? ['All Topics'] : this._inputTopics;
        this.selectedTopicsFromComp.emit(this.selected);

        this.selectedIndicatorsFromComp.emit(this._selectedIndicators);

        //this.subscription = this._selectedIndicatorsService.selectionChanged$.subscribe(
        //    data => {
        //        this.Indicators = data;
        //        console.log('testtttttttttttttttttttttt');
        //        if (this.Indicators.length > 0) {
        //            for (var x = 0; x < this.Indicators.length; x++) {
        //                if (this._inputIndicators[0] !== '') {
        //                    //turn on individual indicator from input url/selection                              
        //                    if (this._inputIndicators.indexOf(this.Indicators[x].indicator) !== -1) {
        //                        //this.toggleIndicator(this.Indicators[x]);
        //                        this._selectedIndicatorsService.toggle(this.Indicators[x]);
        //                    }
        //                } else {
        //                    //turn on for all selected topics                         
        //                    if (this._inputTopics[0] !== 'All Topics') {
        //                        if (this._inputTopics.indexOf(this.Indicators[x].topics) !== -1) {
        //                            console.log('indicator in selected topic ' + this.Indicators[x]);
        //                            //this.toggleIndicator(this.Indicators[x], true);
        //                            this._selectedIndicatorsService.toggle(this.Indicators[x], true);
        //                        }
        //                    } else {
        //                        //all indicators for all topics                       
        //                        //this.toggleIndicator(this.Indicators[x], true);
        //                        this._selectedIndicatorsService.toggle(this.Indicators[x], true);
        //                    }

        //                }

        //            }
        //            //this.allIndicatorsFromComp.emit(this.Indicators);
        //        }
        //    },
        //    err => console.error(err),
        //    () => console.log('done with subscribe event indicators')
        //);
        //this._selectedIndicatorsService.load();
    }
}





