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
var SelectedIndicatorByTopicsPipe = (function () {
    function SelectedIndicatorByTopicsPipe() {
    }
    SelectedIndicatorByTopicsPipe.prototype.transform = function (indicators, topic, collections) {
        if (indicators !== undefined) {
            if (topic.topic === 'all') {
                return indicators.filter(function (indicator) { return indicator.selected; }).length;
            }
            else {
                var selectedCollection = collections.filter(function (collection) { return collection.selected; });
                return indicators.filter(function (indicator) {
                    var returnIndicator = indicator.selected && indicator.topics.split(', ').indexOf(topic.topic) !== -1 &&
                        (selectedCollection[0].collection === 'Show All' ? true : (indicator.collections ? indicator.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false));
                    return returnIndicator;
                });
            }
        }
    };
    SelectedIndicatorByTopicsPipe = __decorate([
        core_1.Pipe({
            name: 'SelectedIndicatorByTopicsPipe'
        }), 
        __metadata('design:paramtypes', [])
    ], SelectedIndicatorByTopicsPipe);
    return SelectedIndicatorByTopicsPipe;
})();
exports.SelectedIndicatorByTopicsPipe = SelectedIndicatorByTopicsPipe;
//# sourceMappingURL=selected.indicator.topic.pipe.js.map