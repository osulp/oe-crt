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
var IndicatorTopicFilterPipe = (function () {
    function IndicatorTopicFilterPipe() {
    }
    IndicatorTopicFilterPipe.prototype.transform = function (indicators, topics) {
        if (indicators !== undefined) {
            var selectedTopics = [];
            if (topics[0] !== undefined) {
                for (var x = 0; x < topics[0].length; x++) {
                    if (topics[0][x].selected) {
                        selectedTopics.push(topics[0][x].topic);
                    }
                }
            }
            if (selectedTopics.length > 0) {
                return indicators.filter(function (indicator) { return selectedTopics.indexOf(indicator.topics) !== -1; });
            }
            else {
                return indicators;
            }
        }
        return indicators;
    };
    IndicatorTopicFilterPipe = __decorate([
        core_1.Pipe({
            name: 'indicatorTopicFilterPipe'
        }), 
        __metadata('design:paramtypes', [])
    ], IndicatorTopicFilterPipe);
    return IndicatorTopicFilterPipe;
})();
exports.IndicatorTopicFilterPipe = IndicatorTopicFilterPipe;
//# sourceMappingURL=indicator-topic-filter-pipe.js.map