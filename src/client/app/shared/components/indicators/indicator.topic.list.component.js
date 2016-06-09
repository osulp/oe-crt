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
var http_1 = require('@angular/http');
var index_1 = require('../../../shared/pipes/index');
var index_2 = require('../../../shared/data_models/index');
var index_3 = require('../../../shared/services/index');
var IndicatorsTopicListComponent = (function () {
    function IndicatorsTopicListComponent(_indicatorService) {
        this._indicatorService = _indicatorService;
        this.filteredIndicatorsFromComp = new core_1.EventEmitter();
        this.selTopics = [];
    }
    IndicatorsTopicListComponent.prototype.toggleIndicator = function (indicator, value) {
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
    IndicatorsTopicListComponent.prototype.ngOnInit = function () {
        console.log('this is the input topics for checkbox display', this.inputTopics);
        this.selTopics = this.inputTopics;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', index_2.Topic)
    ], IndicatorsTopicListComponent.prototype, "topic", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], IndicatorsTopicListComponent.prototype, "inputIndicators", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], IndicatorsTopicListComponent.prototype, "inputTopics", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], IndicatorsTopicListComponent.prototype, "allTopicsView", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], IndicatorsTopicListComponent.prototype, "filteredIndicatorsFromComp", void 0);
    IndicatorsTopicListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'indicators-by-topic-list',
            templateUrl: 'indicator.topic.list.component.html',
            styleUrls: ['indicator.topic.list.component.css'],
            pipes: [index_1.IndicatorTopicFilterPipe],
            providers: [http_1.JSONP_PROVIDERS, index_3.IndicatorsService]
        }), 
        __metadata('design:paramtypes', [index_3.IndicatorsService])
    ], IndicatorsTopicListComponent);
    return IndicatorsTopicListComponent;
})();
exports.IndicatorsTopicListComponent = IndicatorsTopicListComponent;
//# sourceMappingURL=indicator.topic.list.component.js.map