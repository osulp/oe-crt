import {Component, OnInit, Input, Output, EventEmitter}   from '@angular/core';
import {JSONP_PROVIDERS}  from '@angular/http';
import {IndicatorsTopicListComponent}  from '../../shared/components/index';
import {Topic, Indicator} from '../../shared/data_models/index';
import {TopicsService, IndicatorsService, CollectionsService} from '../../shared/services/index';
//import {Subscription}   from 'rxjs/Subscription';
import {SelectedTopicsPipe, IndicatorTopicFilterPipe,SelectedIndicatorByTopicsCountPipe, SortAlphaTopicPipe} from './pipes/index';
//import {SelectedIndicatorsService} from '../../shared/services/indicators/selected-indicators.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

declare var window: any;

@Component({
    moduleId: module.id,
    selector: 'topics',
    templateUrl: 'topics.select.component.html',
    styleUrls: ['topics.select.component.css'],
    directives: [IndicatorsTopicListComponent],
    pipes: [IndicatorTopicFilterPipe, SelectedTopicsPipe, SelectedIndicatorByTopicsCountPipe, SortAlphaTopicPipe],
    providers: [JSONP_PROVIDERS, TopicsService, IndicatorsService, CollectionsService]
})



export class TopicsComponent implements OnInit {
    @Output() selectedTopicsFromComp = new EventEmitter();
    @Output() selectedIndicatorsFromComp = new EventEmitter();
    @Output() selectedCollectionsFromComp = new EventEmitter();
    @Output() allTopicsFromComp = new EventEmitter();
    @Output() allIndicatorsFromComp = new EventEmitter();
    @Input() inputTopics: string;
    @Input() inputIndicators: string;
    @Input() inputCollection: string;
    @Input() expanded: boolean;

    //selectedIndicators = new EventEmitter();
    Indicators: any;
    Topics: any;
    _selectedIndicators: any;
    _selectedTopics: any;
    _inputTopics: any;
    _inputIndicators: any;

    visible: boolean;
    chkBoxVisibile: boolean;
    chkBoxCollectVisibile: boolean = false;
    showAllSelected: boolean;
    selected: string[];
    initialLoad: boolean = true;
    collections: any[] = [];
    showIndicatorCount: boolean = false;
    //private subscription: Subscription;

    constructor(
        public _topicService: TopicsService,
        public _indicatorService: IndicatorsService,
        private _collectionService: CollectionsService
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
        console.log('this.expanded', typeof(this.expanded));
        //this.expanded = typeof (this.expanded) === 'string' ? (this.expanded.toString() !== 'true' ? true : false) : !this.expanded;
        this.expanded = this.expanded.toString() === 'true' ? false : true;
        //this.visible = !this.visible;
    }

    toggleAllTopics(evt?: any) {
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
        this._topicService.getCRTTopics().subscribe(
            (data: any) => {
                this.Topics = data;
                this.allTopicsFromComp.emit(this.Topics);
                //console.log('input topics = ', this._inputTopics);
                //console.log('all topics', this.Topics);
                this.getIndicators();
            },
            (err: any) => console.error(err),
            () => console.log('done loading topics'));
    }

    toggleTopic(topic: Topic) {
        //turn off all topics, if selected
        console.log('topic toggled', topic);
        this.showAllSelected = false;
        topic.toggleSelected();
        const idx = this.Topics.indexOf(topic);
        this.Topics = [
            ...this.Topics.slice(0, idx),
            topic,
            ...this.Topics.slice(idx + 1)
        ];
        if (!this.initialLoad) {
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
        }
        //sync indicator selections
        for (var i = 0; i < this.Indicators.length; i++) {
            let assocTopics = this.Indicators[i].topics.split(', ');
            //console.log(assocTopics);
            for (let t of this._selectedTopics) {
                //console.log('checking t:', t);
                if (assocTopics.indexOf(t) !== -1) {
                    this.toggleIndicator(this.Indicators[i], true);
                }
            }
            //if (this._selectedTopics.indexOf(this.Indicators[i].topics) !== -1) {
            //    this.toggleIndicator(this.Indicators[i], true);
            //    //this._selectedIndicatorsService.toggle(this.Indicators[i], true);
            //}
        }
        this.allTopicsFromComp.emit(this.Topics);
        this.allIndicatorsFromComp.emit(this.Indicators);
    }

    onFilterIndicator(Indicators: Indicator[]) {
        this.Indicators = Indicators;
        this.allIndicatorsFromComp.emit(this.Indicators);
    }

    toggleIndicator(indicator: Indicator, value?: boolean) {
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

    toggleCollection(toggled_collection: any) {
        //toggled_collection.selected = true;
        this.collections = this.collections.map((coll: any) => {
            coll.selected = coll.collection === toggled_collection.collection ? true : false;
            return coll;
        });
        this.selectedCollectionsFromComp.emit(this.collections);
    }

    getIndicators() {
        this._indicatorService.getIndicators().subscribe(
            (data: any) => {
                this.Indicators = data;
                console.log('got indicators', this.Indicators);
                console.log('selected topics?', this._selectedTopics);
                if (this.Indicators.length > 0) {
                    for (var x = 0; x < this.Indicators.length; x++) {
                        if (this._inputIndicators[0] !== '') {
                            //turn on individual indicator from input url/selection
                            if (this._inputIndicators.indexOf(this.Indicators[x].indicator) !== -1) {
                                this.toggleIndicator(this.Indicators[x]);
                            }
                        }
                    }
                    console.log(this.Topics);
                    if (this._selectedTopics.length > 0) {
                        console.log('jack has sause', this._selectedTopics, this._inputTopics);
                        this.showAllSelected = this._selectedTopics[0] !== 'undefined' ? false : true;
                        for (var x = 0; x < this.Topics.length; x++) {
                            if (this._selectedTopics.indexOf(this.Topics[x].topic) !== -1) {
                                this.toggleTopic(this.Topics[x]);
                            }
                        }
                        if (this.showAllSelected) {
                            for (var i = 0; i < this.Indicators.length; i++) {
                                this.toggleIndicator(this.Indicators[i], true);
                            }
                        }
                    }
                }
                this.initialLoad = false;
                let inScope = this;
                window.setTimeout(function () {
                    inScope.showIndicatorCount = true;
                },1000);
            },
            (err: any) => console.error(err),
            () => console.log('done loading indicators'));
    }

    ngOnInit() {
        this._inputTopics = this.inputTopics.replace(/\%20/g, ' ').replace(/\%26/g, '&').split(',');

        this._selectedTopics = this._inputTopics.length === 1 && (this._inputTopics[0] === '' || this.inputTopics[0] === 'All Topics') ? ['All Topics'] : this._inputTopics;
        this._inputIndicators = this.inputIndicators.replace(/\%20/g, ' ').replace(/\%26/g, '&').split(';');
        this._selectedIndicators = this._inputIndicators;
        this.getTopics();
        this._collectionService.get().subscribe((results: any) => {
            let selectedCollection = this.inputCollection !== 'undefined' ? this.inputCollection : 'Show All';
            let all = { collection: 'Show All', selected: selectedCollection === 'Show All' ? true : false };
            this.collections = results
                .filter((coll: any) => { return coll.collection_name !== 'Partner with us'; })
                .map((result: any) => {
                    return { collection: result.collection_name, icon_path: result.collection_icon_path, selected: selectedCollection === result.collection_name ? true : false };
                });
            this.collections.push(all);
            this.selectedCollectionsFromComp.emit(this.collections);
            //set global for use in all tiles without having to import/dupe service calls etc
            window.crt_collections = this.collections;
        });
    }
}


