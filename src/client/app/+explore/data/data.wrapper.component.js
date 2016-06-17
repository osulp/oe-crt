var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var index_1 = require('../../shared/components/index');
var indicator_detail_component_1 = require('../indicator_detail/indicator.detail.component');
var index_2 = require('../topics/pipes/index');
var angular2_infinite_scroll_1 = require('angular2-infinite-scroll');
var DataComponent = (function () {
    function DataComponent() {
        this.inputTopics = [];
        this.inputIndicators = [];
        this.topicIndicatorCount = {};
        this.processedTopics = 0;
        this.showIndicatorCount = 10;
        this.showIncrement = 8;
        this.scrollDownDistance = 3;
        this.scrollUpDistance = 3;
        this.scrolledToBottom = false;
    }
    DataComponent.prototype.toggleResultView = function () {
        console.log('resultview clicked');
        console.log(this.resultView);
        this.resultView = this.resultView === 'graph' ? 'map' : 'graph';
    };
    DataComponent.prototype.onFilterIndicator = function (Indicators) {
        console.log('dope, does this work', Indicators);
        this.inputIndicators = Indicators;
    };
    DataComponent.prototype.onScrollDown = function () {
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
        }
    };
    DataComponent.prototype.onScrollUp = function () {
        if (this.showIndicatorCount !== this.showIncrement) {
            this.showIndicatorCount -= this.showIncrement;
        }
        if (document.body.scrollTop === 0) {
            this.showIndicatorCount = 10;
        }
        console.log('scrolledup', this.showIndicatorCount);
    };
    DataComponent.prototype.showTopic = function (topic, index) {
        if (this.topicIndicatorCount[topic.topic] !== undefined) {
            if (index === 0) {
                return true;
            }
            else {
                if (this.topicIndicatorCount[topic.topic] < this.showIndicatorCount) {
                    return true;
                }
                else {
                    if (this.scrolledToBottom) {
                        this.showIndicatorCount += this.topicIndicatorCount[topic.topic] - (this.showIndicatorCount);
                        this.scrolledToBottom = false;
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        else {
            return false;
        }
    };
    DataComponent.prototype.createTopicIndicatorObj = function () {
        var _this = this;
        console.log('creating TopicIndicator Count', this.inputTopics, this.inputIndicators);
        for (var t = 0; t < this.inputTopics.length; t++) {
            var topicIndicatorCount = this.inputIndicators.filter(function (indicator) {
                return indicator.topics.split(', ').indexOf(_this.inputTopics[t].topic.trim()) !== -1;
            }).length;
            this.topicIndicatorCount[this.inputTopics[t].topic] = topicIndicatorCount;
        }
        console.log('here is the lookup', this.topicIndicatorCount);
    };
    DataComponent.prototype.scrollToTop = function () {
        window.scrollTo(0, 0);
    };
    DataComponent.prototype.checkTopicIndicatorLoaded = function () {
        var runScope = this;
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
    };
    DataComponent.prototype.ngOnInit = function () {
        this.resultView = 'graph';
        console.log('Data Component: Topics Input ' + this.inputTopics);
        this.checkTopicIndicatorLoaded();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], DataComponent.prototype, "inputTopics", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], DataComponent.prototype, "inputIndicators", void 0);
    DataComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'data',
            templateUrl: 'data.wrapper.component.html',
            styleUrls: ['data.wrapper.component.css'],
            directives: [index_1.DataTileComponent, indicator_detail_component_1.DetailComponent, index_1.IndicatorsTopicListComponent, angular2_infinite_scroll_1.InfiniteScroll],
            pipes: [index_2.SelectedTopicsPipe, index_2.SelectedIndicatorByTopicsPipe, index_2.IndicatorScrollCountPipe]
        }), 
        __metadata('design:paramtypes', [])
    ], DataComponent);
    return DataComponent;
})();
exports.DataComponent = DataComponent;
//# sourceMappingURL=data.wrapper.component.js.map