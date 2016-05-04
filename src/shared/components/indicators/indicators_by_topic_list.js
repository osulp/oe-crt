var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var http_1 = require('angular2/http');
var indicator_topic_filter_pipe_1 = require('../../../shared/pipes/indicator-topic-filter-pipe');
var topic_1 = require('../../../shared/data_models/topic');
var indicators_service_1 = require('../../../shared/services/indicators/indicators.service');
var IndicatorsTopicList = (function () {
    function IndicatorsTopicList(_indicatorService) {
        this._indicatorService = _indicatorService;
        this.filteredIndicatorsFromComp = new core_1.EventEmitter();
        this.selTopics = [];
    }
    IndicatorsTopicList.prototype.toggleIndicator = function (indicator, value) {
        if (value) {
            indicator.selected = value;
        }
        else {
            indicator.toggleSelected();
        }
        var i = this.inputIndicators.indexOf(indicator);
        this.inputIndicators = this.inputIndicators.slice(0, i).concat([
            indicator
        ], this.inputIndicators.slice(i + 1));
        this._selectedIndicators = [];
        for (var x = 0; x < this.inputIndicators.length; x++) {
            if (this.inputIndicators[x].selected) {
                this._selectedIndicators.push(this.inputIndicators[x]);
            }
        }
        this.filteredIndicatorsFromComp.emit(this.inputIndicators);
    };
    IndicatorsTopicList.prototype.ngOnInit = function () {
        console.log('horses');
        console.log(this.inputTopics);
        this.selTopics = this.inputTopics;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', topic_1.Topic)
    ], IndicatorsTopicList.prototype, "topic", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], IndicatorsTopicList.prototype, "inputIndicators", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], IndicatorsTopicList.prototype, "inputTopics", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], IndicatorsTopicList.prototype, "allTopicsView", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], IndicatorsTopicList.prototype, "filteredIndicatorsFromComp", void 0);
    IndicatorsTopicList = __decorate([
        core_1.Component({
            selector: 'indicators-by-topic-list',
            templateUrl: './shared/components/indicators/indicators_by_topic_list.html',
            styleUrls: ['./shared/components/indicators/indicators_by_topic_list.css'],
            pipes: [indicator_topic_filter_pipe_1.IndicatorTopicFilterPipe],
            providers: [http_1.JSONP_PROVIDERS, indicators_service_1.IndicatorsService]
        }), 
        __metadata('design:paramtypes', [indicators_service_1.IndicatorsService])
    ], IndicatorsTopicList);
    return IndicatorsTopicList;
})();
exports.IndicatorsTopicList = IndicatorsTopicList;
//# sourceMappingURL=indicators_by_topic_list.js.map