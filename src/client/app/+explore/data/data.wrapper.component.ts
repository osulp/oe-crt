import {Component, OnInit, Input, ViewChildren, AfterViewInit, QueryList, OnChanges } from '@angular/core';
import {Topic,Indicator} from '../../shared/data_models/index';
import {DataTileComponent, IndicatorsTopicListComponent} from '../../shared/components/index';
import {DetailComponent} from '../indicator_detail/indicator.detail.component';
import {SelectedTopicsPipe, IndicatorScrollCountPipe} from '../topics/pipes/index';
import {IndicatorTopicFilterPipe} from '../../shared/pipes/index';
import {InfiniteScroll} from 'angular2-infinite-scroll';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'data',
    templateUrl: 'data.wrapper.component.html',
    styleUrls: ['data.wrapper.component.css'],
    directives: [DataTileComponent, DetailComponent, IndicatorsTopicListComponent, InfiniteScroll],
    //providers: [SelectedIndicatorsService],
    pipes: [SelectedTopicsPipe, IndicatorTopicFilterPipe, IndicatorScrollCountPipe]
})

export class DataComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() inputTopics: Topic[] = [];
    @Input() inputIndicators: Indicator[] = [];
    @Input() inputCollections: any[] = [];
    @Input() _hideAll: any;
    @ViewChildren(IndicatorsTopicListComponent) indTopListComps: QueryList<IndicatorsTopicListComponent>;
    resultView: string;
    topicIndicatorCount: any = {};
    collections: any[] = [];
    selectedCollection: string = 'Show All';
    processedTopics: number = 0;
    showIndicatorDefault: number = 9;
    showIndicatorCount: number = 6;
    showTopicIndicatorCount: number = 6;
    showIncrement: number = 3;
    scrollDownDistance: number = 8;
    scrollUpDistance: number = 10;
    //scrolledToBottom: boolean = false;
    showTopicMax: number = 1;
    SelectedTopics: Topic[] = [];
    showScrollUpCount: number = 3;
    hideAll: boolean = false;
    initLoad: boolean = true;
    isMobile: boolean = false;

    toggleResultView() {
        //console.log('resultview clicked');
        //console.log(this.resultView);
        this.resultView = this.resultView === 'graph' ? 'map' : 'graph';
    }

    onFilterIndicator(Indicators: Indicator[]) {
        //console.log('dope, does this work', Indicators);
        this.inputIndicators = Indicators;
    }

    onScrollDown() {
        let incrementedIndicatorCount = false;
        this.SelectedTopics.forEach((topic: Topic, idx: number) => {
            if ((this.topicIndicatorCount[topic.topic][this.selectedCollection].showCount < this.topicIndicatorCount[topic.topic][this.selectedCollection].maxCount || this.topicIndicatorCount[topic.topic][this.selectedCollection].maxCount < this.showIndicatorDefault) && !incrementedIndicatorCount) {
                this.topicIndicatorCount[topic.topic][this.selectedCollection].showCount += this.showIncrement;
                incrementedIndicatorCount = this.topicIndicatorCount[topic.topic][this.selectedCollection].maxCount < this.showIndicatorDefault ? false : true;
                this.showTopicMax = idx + 1;
            }
        });
        console.log('scrollingdown', this.topicIndicatorCount);
    }

    onScrollUp() {
        let decrementedIndicatorCount = false;
        this.SelectedTopics.forEach((topic: Topic, idx: number) => {
            if (this.topicIndicatorCount[topic.topic][this.selectedCollection].showCount < this.topicIndicatorCount[topic.topic][this.selectedCollection].maxCount && !decrementedIndicatorCount) {
                this.topicIndicatorCount[topic.topic][this.selectedCollection].showCount -= this.showIncrement;
                decrementedIndicatorCount = true;
                this.showTopicMax = idx + 1;
            }
            if ($(window).scrollTop() === 0) {
                this.topicIndicatorCount[topic.topic][this.selectedCollection].showCount = this.showIndicatorDefault;
                this.showTopicMax = 1;
            }
        });
        console.log('scollingup', this.topicIndicatorCount);
    }

    createTopicIndicatorObj() {
        //console.log('creating TopicIndicator Count', this.inputTopics, this.inputIndicators, this.collections);
        this.topicIndicatorCount = {};
        for (var t = 0; t < this.inputTopics.length; t++) {
            this.topicIndicatorCount[this.inputTopics[t].topic] = {};
            this.collections.forEach(coll => {
                let topicIndicatorCount = this.inputIndicators.filter(indicator => {
                    if (indicator.selected) {
                        return indicator.topics.split(', ').indexOf(this.inputTopics[t].topic.trim()) !== -1 && (indicator.collections
                            ? (indicator.collections.split(', ').indexOf(coll.collection) !== -1 || coll.collection === 'Show All')
                            : coll.collection === 'Show All'
                                ? true
                                : false);
                    } else {
                        return false;
                    }
                }).length;

                this.topicIndicatorCount[this.inputTopics[t].topic][coll.collection] = { maxCount: topicIndicatorCount, showCount: this.showIndicatorDefault };
            });
        }
        //console.log('here is the lookup', this.topicIndicatorCount);
    }

    resetTopicIndicatorCounts() {
        //called when collection changed
    }

    scrollToTop() {
        window.scrollTo(0, 0);
    }

    checkTopicIndicatorLoaded() {
        let runScope = this;
        var runInterval = setInterval(runCheck, 500);
        function runCheck() {
            console.log('still checking');
            if (runScope.SelectedTopics !== undefined && runScope.inputIndicators !== undefined && runScope.collections !== undefined) {
                if (runScope.SelectedTopics.length > 0 && runScope.inputIndicators.length > 0) {
                    clearInterval(runInterval);
                    runScope.createTopicIndicatorObj();
                    //runScope.onScrollDown();
                }
            }
        }
    }

    onResize(event: any) {
        let windowWidth = $(window).width();
        this.isMobile = windowWidth < 767;
        if (windowWidth < 767) {
            //this.scrollDownDistance = 5;
            //this.scrollUpDistance = 5;
            //this.showIncrement = 1;
        } else if (windowWidth < 993) {
            //this.scrollDownDistance = 3;
            //this.scrollUpDistance = 3;
            //this.showIncrement = 2;
            this.showScrollUpCount = 1;
        } else if (windowWidth < 1200) {
            this.showScrollUpCount = 2;
        } else {
            this.showScrollUpCount = 3;
        }
    }

    ngOnInit() {
        //check input topics set all topics to all
        this.resultView = 'graph';
        //console.log('Data Component: Collections Input ' + this.inputCollections);
        this.checkTopicIndicatorLoaded();
        this.hideAll = false;
        //check screen size and adjust scroll load settings accordingly
        let windowWidth = $(window).width();
        this.isMobile = windowWidth < 767;
        if (windowWidth < 767) {
            this.showIndicatorDefault = 3;
            this.showIndicatorCount = 3;
            this.showTopicIndicatorCount = 3;
            this.scrollDownDistance = 16;
            this.scrollUpDistance = 20;
            this.showIncrement = 1;
            this.showScrollUpCount = 1;
        } else if (windowWidth < 993) {
            this.showIndicatorDefault = 6;
            this.showIndicatorCount = 6;
            this.showTopicIndicatorCount = 6;
            this.scrollDownDistance = 3;
            this.scrollUpDistance = 3;
            this.showIncrement = 2;
            this.showScrollUpCount = 1;
        } else if (windowWidth < 1200) {
            this.showScrollUpCount = 2;
        }

        let windowHeight = $(window).height();
        let bodyHeight = $('body').height();
        console.log('windowHeight', windowHeight, bodyHeight);
        //if (windowHeight > 800) {
        //    this.scrollDownDistance = 12;
        //    this.scrollUpDistance = 5;
        //    this.showIncrement = 6;
        //} else {

        //}
        //this.onScrollDown();
    }

    ngAfterViewInit() {
        console.log(this.indTopListComps);
        this.initLoad = false;
    }

    ngOnChanges(inputChanges: any) {
        //console.log('inputChanges in DataWrapper', inputChanges);
        if (inputChanges.inputTopics) {
            console.log('yep selected topics changed!', inputChanges.inputTopics);
            let selectedTopics = inputChanges.inputTopics.currentValue.filter((topic: Topic) => topic.selected);
            console.log('yep selected topics', selectedTopics, inputChanges.inputTopics.currentValue);
            this.SelectedTopics = selectedTopics.length === 0 ? inputChanges.inputTopics.currentValue : selectedTopics;
            this.SelectedTopics.sort((a: any, b: any) => a.topic.localeCompare(b.topic));
            this.checkTopicIndicatorLoaded();
        }
        if (inputChanges._hideAll) {
            //console.log('inputChanges in DataWrapper', inputChanges);
            this.hideAll = this._hideAll.hide;// ? this._hideAll.hide : this.hideAll;
            this.createTopicIndicatorObj();
            //console.log('hideall called and here is the topicindicator obj', this.topicIndicatorCount);
            //this.createTopicIndicatorObj();
        }
        //if (inputChanges.inputIndicators && !this.initLoad) {
        //    this.createTopicIndicatorObj();
        //    console.log('hideall indicators called and here is the topicindicator obj', this.topicIndicatorCount);
        //    //this.createTopicIndicatorObj();
        //}
    }
}


