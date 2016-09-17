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
    @ViewChildren(IndicatorsTopicListComponent) indTopListComps: QueryList<IndicatorsTopicListComponent>;
    resultView: string;
    topicIndicatorCount: any = {};
    collections: any[] = [];
    selectedCollection: string = 'Show All';
    processedTopics: number = 0;
    showIndicatorDefault: number = 6;
    showIndicatorCount: number = 6;
    showTopicIndicatorCount: number = 6;
    showIncrement: number = 3;
    scrollDownDistance: number = 8;
    scrollUpDistance: number = 10;
    //scrolledToBottom: boolean = false;
    showTopicMax: number = 1;
    SelectedTopics: Topic[] = [];

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
        for (var t = 0; t < this.inputTopics.length; t++) {
            this.topicIndicatorCount[this.inputTopics[t].topic] = {};
            this.collections.forEach(coll => {
                let topicIndicatorCount = this.inputIndicators.filter(indicator => {
                    return indicator.topics.split(', ').indexOf(this.inputTopics[t].topic.trim()) !== -1 && (indicator.collections ? (indicator.collections.split(', ').indexOf(coll.collection) !== -1 || coll.collection === 'Show All') : coll.collection === 'Show All' ? true : false);
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
            //console.log('still checking');
            if (runScope.inputTopics !== undefined && runScope.inputIndicators !== undefined && runScope.collections !== undefined) {
                if (runScope.inputTopics.length > 0 && runScope.inputIndicators.length > 0) {
                    clearInterval(runInterval);
                    runScope.createTopicIndicatorObj();
                    //runScope.onScrollDown();
                }
            }
        }
    }

    ngOnInit() {
        //check input topics set all topics to all
        this.resultView = 'graph';
        //console.log('Data Component: Collections Input ' + this.inputCollections);
        this.checkTopicIndicatorLoaded();
        //check screen size and adjust scroll load settings accordingly
        let windowWidth = $(window).width();
        if (windowWidth < 767) {
            this.scrollDownDistance = 5;
            this.scrollUpDistance = 5;
            this.showIncrement = 1;
        } else if (windowWidth < 991) {
            this.scrollDownDistance = 3;
            this.scrollUpDistance = 3;
            this.showIncrement = 2;
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
    }

    ngOnChanges(inputChanges: any) {
        //console.log('inputChanges in DataWrapper', inputChanges);
        if (inputChanges.inputTopics) {
            //console.log('yep selected topics changed!', inputChanges.inputTopics);
            let selectedTopics = inputChanges.inputTopics.currentValue.filter((topic: Topic) => topic.selected);
            //console.log('yep selected topics', selectedTopics);
            this.SelectedTopics = selectedTopics.length === 0 ? inputChanges.inputTopics.currentValue : selectedTopics;
        }
    }
}


