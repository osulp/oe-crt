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
var IndicatorTopicFilterPipe = (function () {
    function IndicatorTopicFilterPipe() {
    }
    IndicatorTopicFilterPipe.prototype.transform = function (indicators, topic, collections, selectedOnly) {
        var selectedCollection = collections ? collections.filter(function (coll) { return coll.selected; }).length > 0 ? collections.filter(function (coll) { return coll.selected; })[0].collection : 'Show All' : 'Show All';
        var returnIndicators = indicators ? indicators
            .filter(function (indicator) {
            if (topic) {
                var inSelectedTopics = false;
                inSelectedTopics = indicator.topics ? (indicator.topics.split(', ').indexOf(topic.topic) !== -1 ? true : inSelectedTopics) : false;
                return inSelectedTopics;
            }
            else {
                return false;
            }
        })
            .filter(function (indicator) {
            var inCollection = selectedCollection === 'Show All' ? true : false;
            if (!inCollection) {
                inCollection = indicator.collections ? (indicator.collections.split(', ').indexOf(selectedCollection) !== -1 ? true : false) : false;
            }
            return inCollection;
        })
            .filter(function (indicator) {
            return selectedOnly ? indicator.selected : true;
        })
            .sort(function (a, b) { return a.indicator.localeCompare(b.indicator); })
            : [];
        return returnIndicators;
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
//# sourceMappingURL=indicator.topic.filter.pipe.js.map