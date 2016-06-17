import {Component, OnInit, Input} from '@angular/core';
import {Topic,Indicator} from '../../shared/data_models/index';
import {DataTileComponent, IndicatorsTopicListComponent} from '../../shared/components/index';
import {DetailComponent} from '../indicator_detail/indicator.detail.component';
import {SelectedTopicsPipe, SelectedIndicatorByTopicsPipe, IndicatorScrollCountPipe} from '../topics/pipes/index';
import {InfiniteScroll} from 'angular2-infinite-scroll';

@Component({
    moduleId: module.id,
    selector: 'data',
    templateUrl: 'data.wrapper.component.html',
    styleUrls: ['data.wrapper.component.css'],
    directives: [DataTileComponent, DetailComponent, IndicatorsTopicListComponent, InfiniteScroll],
    //providers: [SelectedIndicatorsService],
    pipes: [SelectedTopicsPipe, SelectedIndicatorByTopicsPipe, IndicatorScrollCountPipe]
})

export class DataComponent implements OnInit {
    @Input() inputTopics: Topic[] = [];
    @Input() inputIndicators: Indicator[] = [];
    resultView: string;
    topicIndicatorCount: any = {};
    processedTopics: number = 0;
    showIndicatorCount: number = 10;
    showIncrement: number = 8;
    scrollDownDistance: number = 3;
    scrollUpDistance: number = 3;
    scrolledToBottom: boolean = false;

    toggleResultView() {
        console.log('resultview clicked');
        console.log(this.resultView);
        this.resultView = this.resultView === 'graph' ? 'map' : 'graph';
    }

    onFilterIndicator(Indicators: Indicator[]) {
        console.log('dope, does this work', Indicators);
        this.inputIndicators = Indicators;
    }

    onScrollDown() {
        this.showIndicatorCount += this.showIncrement;
        console.log('scrolleddown', this.showIndicatorCount);
        var windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
        var body = document.body, html = document.documentElement;
        var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        var windowBottom = windowHeight + window.pageYOffset;
        console.log('window bottom', windowBottom);
        console.log('docHeight', docHeight);
        var scrollScope = this;
        if (windowBottom + 20 >= docHeight) {
            console.log('bottom reached');
            scrollScope.scrolledToBottom = true;
            //window.setTimeout(() => scrollScope.scrolledToBottom = true, 0);
        }
    }

    onScrollUp() {
        if (this.showIndicatorCount !== this.showIncrement) {
            this.showIndicatorCount -= this.showIncrement;
        }
        if (document.body.scrollTop === 0) {
            this.showIndicatorCount = 10;
        }
        console.log('scrolledup', this.showIndicatorCount);
    }

    showTopic(topic: any, index: number) {
        //var showScope = this;
        if (this.topicIndicatorCount[topic.topic] !== undefined) {
            if (index === 0) {
                return true;
            } else {
                if (this.topicIndicatorCount[topic.topic] < this.showIndicatorCount) {
                    return true;
                } else {
                    if (this.scrolledToBottom) {
                        //increment by topic count and then check
                        this.showIndicatorCount += this.topicIndicatorCount[topic.topic] - (this.showIndicatorCount);
                        this.scrolledToBottom = false;
                        //window.setTimeout(() => showScope.scrolledToBottom = false, 10);
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        } else {
            return false;
        }
    }

    createTopicIndicatorObj() {
        console.log('creating TopicIndicator Count', this.inputTopics, this.inputIndicators);
        for (var t = 0; t < this.inputTopics.length; t++) {
            let topicIndicatorCount = this.inputIndicators.filter(indicator => {
                return indicator.topics.split(', ').indexOf(this.inputTopics[t].topic.trim()) !== -1;
            }).length;
            this.topicIndicatorCount[this.inputTopics[t].topic] = topicIndicatorCount;
        }
        console.log('here is the lookup', this.topicIndicatorCount);
    }

    scrollToTop() {
        window.scrollTo(0, 0);
    }

    checkTopicIndicatorLoaded() {
        let runScope = this;
        var runInterval = setInterval(runCheck, 500);
        function runCheck() {
            console.log('still checking');
            if (runScope.inputTopics !== undefined && runScope.inputIndicators !== undefined) {
                if (runScope.inputTopics.length > 0 && runScope.inputIndicators.length > 0) {
                    clearInterval(runInterval);
                    runScope.createTopicIndicatorObj();
                }
            }
        }
        //console.log('checking topic indicator');
        //if (this.inputTopics !== undefined && this.inputIndicators !== undefined) {
        //    console.log('got topics, indicators', this.inputIndicators, this.inputTopics);
        //    this.createTopicIndicatorObj();
        //} else {
        //    window.setTimeout(this.checkTopicIndicatorLoaded, 500);
        //}
    }

    ngOnInit() {
        //check input topics set all topics to all
        this.resultView = 'graph';
        console.log('Data Component: Topics Input ' + this.inputTopics);
        this.checkTopicIndicatorLoaded();
    }
}


