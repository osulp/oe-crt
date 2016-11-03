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
var index_3 = require('../../shared/pipes/index');
var angular2_infinite_scroll_1 = require('angular2-infinite-scroll');
var DataComponent = (function () {
    function DataComponent() {
        this.inputTopics = [];
        this.inputIndicators = [];
        this.inputCollections = [];
        this.topicIndicatorCount = {};
        this.collections = [];
        this.selectedCollection = 'Show All';
        this.processedTopics = 0;
        this.showIndicatorDefault = 9;
        this.showIndicatorCount = 6;
        this.showTopicIndicatorCount = 6;
        this.showIncrement = 3;
        this.scrollDownDistance = 8;
        this.scrollUpDistance = 10;
        this.showTopicMax = 1;
        this.SelectedTopics = [];
        this.showScrollUpCount = 3;
        this.hideAll = false;
        this.initLoad = true;
        this.isMobile = false;
    }
    DataComponent.prototype.toggleResultView = function () {
        this.resultView = this.resultView === 'graph' ? 'map' : 'graph';
    };
    DataComponent.prototype.onFilterIndicator = function (Indicators) {
        this.inputIndicators = Indicators;
    };
    DataComponent.prototype.onScrollDown = function () {
        var _this = this;
        var incrementedIndicatorCount = false;
        this.SelectedTopics.forEach(function (topic, idx) {
            if ((_this.topicIndicatorCount[topic.topic][_this.selectedCollection].showCount < _this.topicIndicatorCount[topic.topic][_this.selectedCollection].maxCount || _this.topicIndicatorCount[topic.topic][_this.selectedCollection].maxCount < _this.showIndicatorDefault) && !incrementedIndicatorCount) {
                _this.topicIndicatorCount[topic.topic][_this.selectedCollection].showCount += _this.showIncrement;
                incrementedIndicatorCount = _this.topicIndicatorCount[topic.topic][_this.selectedCollection].maxCount < _this.showIndicatorDefault ? false : true;
                _this.showTopicMax = idx + 1;
            }
        });
        console.log('scrollingdown', this.topicIndicatorCount);
    };
    DataComponent.prototype.onScrollUp = function () {
        var _this = this;
        var decrementedIndicatorCount = false;
        this.SelectedTopics.forEach(function (topic, idx) {
            if (_this.topicIndicatorCount[topic.topic][_this.selectedCollection].showCount < _this.topicIndicatorCount[topic.topic][_this.selectedCollection].maxCount && !decrementedIndicatorCount) {
                _this.topicIndicatorCount[topic.topic][_this.selectedCollection].showCount -= _this.showIncrement;
                decrementedIndicatorCount = true;
                _this.showTopicMax = idx + 1;
            }
            if ($(window).scrollTop() === 0) {
                _this.topicIndicatorCount[topic.topic][_this.selectedCollection].showCount = _this.showIndicatorDefault;
                _this.showTopicMax = 1;
            }
        });
        console.log('scollingup', this.topicIndicatorCount);
    };
    DataComponent.prototype.createTopicIndicatorObj = function () {
        var _this = this;
        this.topicIndicatorCount = {};
        for (var t = 0; t < this.inputTopics.length; t++) {
            this.topicIndicatorCount[this.inputTopics[t].topic] = {};
            this.collections.forEach(function (coll) {
                var topicIndicatorCount = _this.inputIndicators.filter(function (indicator) {
                    if (indicator.selected) {
                        return indicator.topics.split(', ').indexOf(_this.inputTopics[t].topic.trim()) !== -1 && (indicator.collections
                            ? (indicator.collections.split(', ').indexOf(coll.collection) !== -1 || coll.collection === 'Show All')
                            : coll.collection === 'Show All'
                                ? true
                                : false);
                    }
                    else {
                        return false;
                    }
                }).length;
                _this.topicIndicatorCount[_this.inputTopics[t].topic][coll.collection] = { maxCount: topicIndicatorCount, showCount: _this.showIndicatorDefault };
            });
        }
    };
    DataComponent.prototype.resetTopicIndicatorCounts = function () {
    };
    DataComponent.prototype.scrollToTop = function () {
        window.scrollTo(0, 0);
    };
    DataComponent.prototype.checkTopicIndicatorLoaded = function () {
        var runScope = this;
        var runInterval = setInterval(runCheck, 500);
        function runCheck() {
            console.log('still checking');
            if (runScope.SelectedTopics !== undefined && runScope.inputIndicators !== undefined && runScope.collections !== undefined) {
                if (runScope.SelectedTopics.length > 0 && runScope.inputIndicators.length > 0) {
                    clearInterval(runInterval);
                    runScope.createTopicIndicatorObj();
                }
            }
        }
    };
    DataComponent.prototype.onResize = function (event) {
        var windowWidth = $(window).width();
        this.isMobile = windowWidth < 767;
        if (windowWidth < 767) {
        }
        else if (windowWidth < 993) {
            this.showScrollUpCount = 1;
        }
        else if (windowWidth < 1200) {
            this.showScrollUpCount = 2;
        }
        else {
            this.showScrollUpCount = 3;
        }
    };
    DataComponent.prototype.ngOnInit = function () {
        this.resultView = 'graph';
        this.checkTopicIndicatorLoaded();
        this.hideAll = false;
        var windowWidth = $(window).width();
        this.isMobile = windowWidth < 767;
        if (windowWidth < 767) {
            this.showIndicatorDefault = 3;
            this.showIndicatorCount = 3;
            this.showTopicIndicatorCount = 3;
            this.scrollDownDistance = 16;
            this.scrollUpDistance = 20;
            this.showIncrement = 1;
            this.showScrollUpCount = 1;
        }
        else if (windowWidth < 993) {
            this.showIndicatorDefault = 6;
            this.showIndicatorCount = 6;
            this.showTopicIndicatorCount = 6;
            this.scrollDownDistance = 3;
            this.scrollUpDistance = 3;
            this.showIncrement = 2;
            this.showScrollUpCount = 1;
        }
        else if (windowWidth < 1200) {
            this.showScrollUpCount = 2;
        }
        var windowHeight = $(window).height();
        var bodyHeight = $('body').height();
        console.log('windowHeight', windowHeight, bodyHeight);
    };
    DataComponent.prototype.ngAfterViewInit = function () {
        console.log(this.indTopListComps);
        this.initLoad = false;
    };
    DataComponent.prototype.ngOnChanges = function (inputChanges) {
        if (inputChanges.inputTopics) {
            console.log('yep selected topics changed!', inputChanges.inputTopics);
            var selectedTopics = inputChanges.inputTopics.currentValue.filter(function (topic) { return topic.selected; });
            console.log('yep selected topics', selectedTopics, inputChanges.inputTopics.currentValue);
            this.SelectedTopics = selectedTopics.length === 0 ? inputChanges.inputTopics.currentValue : selectedTopics;
            this.SelectedTopics.sort(function (a, b) { return a.topic.localeCompare(b.topic); });
            this.checkTopicIndicatorLoaded();
        }
        if (inputChanges._hideAll) {
            this.hideAll = this._hideAll.hide;
            this.createTopicIndicatorObj();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], DataComponent.prototype, "inputTopics", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], DataComponent.prototype, "inputIndicators", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], DataComponent.prototype, "inputCollections", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DataComponent.prototype, "_hideAll", void 0);
    __decorate([
        core_1.ViewChildren(index_1.IndicatorsTopicListComponent), 
        __metadata('design:type', core_1.QueryList)
    ], DataComponent.prototype, "indTopListComps", void 0);
    DataComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'data',
            templateUrl: 'data.wrapper.component.html',
            styleUrls: ['data.wrapper.component.css'],
            directives: [index_1.DataTileComponent, indicator_detail_component_1.DetailComponent, index_1.IndicatorsTopicListComponent, angular2_infinite_scroll_1.InfiniteScroll],
            pipes: [index_2.SelectedTopicsPipe, index_3.IndicatorTopicFilterPipe, index_2.IndicatorScrollCountPipe]
        }), 
        __metadata('design:paramtypes', [])
    ], DataComponent);
    return DataComponent;
})();
exports.DataComponent = DataComponent;
//# sourceMappingURL=data.wrapper.component.js.map