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
var DataComponent = (function () {
    function DataComponent() {
    }
    DataComponent.prototype.toggleResultView = function () {
        console.log('resultview clicked');
        console.log(this.resultView);
        this.resultView = this.resultView === 'graph' ? 'map' : 'graph';
    };
    DataComponent.prototype.onFilterIndicator = function (Indicators) {
        console.log(Indicators);
        this.inputIndicators = Indicators;
    };
    DataComponent.prototype.ngOnInit = function () {
        this.resultView = 'graph';
        console.log('Data Component: Topics Input ' + this.inputTopics);
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
            directives: [index_1.DataTileComponent, indicator_detail_component_1.DetailComponent, index_1.IndicatorsTopicListComponent],
            pipes: [index_2.SelectedTopicsPipe, index_2.SelectedIndicatorByTopicsPipe]
        }), 
        __metadata('design:paramtypes', [])
    ], DataComponent);
    return DataComponent;
})();
exports.DataComponent = DataComponent;
//# sourceMappingURL=data.wrapper.component.js.map