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
    IndicatorTopicFilterPipe.prototype.transform = function (indicators, topics) {
        var selectedTopics = [];
        console.log(topics);
        if (topics !== undefined) {
            for (var x = 0; x < topics.length; x++) {
                if (topics[x].selected) {
                    selectedTopics.push(topics[x].topic);
                }
            }
        }
        console.log('selected topics', selectedTopics);
        if (selectedTopics.length > 0) {
            var filteredIndicators = [];
            for (var i = 0; i < indicators.length; i++) {
                var assocTopics = indicators[i].topics.split(', ');
                for (var _i = 0; _i < selectedTopics.length; _i++) {
                    var t = selectedTopics[_i];
                    if (assocTopics.indexOf(t) !== -1) {
                        filteredIndicators.push(indicators[i]);
                    }
                }
            }
            return filteredIndicators;
        }
        else {
            console.log('shouldnt be here');
            return indicators;
        }
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