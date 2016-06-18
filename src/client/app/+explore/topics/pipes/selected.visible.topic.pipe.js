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
var SelectedVisibleTopicsPipe = (function () {
    function SelectedVisibleTopicsPipe() {
    }
    SelectedVisibleTopicsPipe.prototype.transform = function (topics, indicators, showIndicatorCount) {
        if (topics !== undefined) {
            console.log('Yep', topics, indicators, showIndicatorCount);
            var totalIndicatorCount = 0;
            var topicsProcess = 0;
            var selectedTopics = topics.filter(function (topic) { return topic.selected; });
            var selectedVisTopics = selectedTopics.filter(function (topic) {
                if (topic.selected) {
                    totalIndicatorCount += indicators.filter(function (indicator) {
                        console.log(indicator);
                        return indicator.topics.split(',').indexOf(topic.topic) !== -1;
                    }).length;
                    console.log('topic indicator length', totalIndicatorCount);
                    if (topicsProcess === 0 || totalIndicatorCount < showIndicatorCount) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                topicsProcess++;
            });
            console.log('seletected topic to display', selectedTopics);
            if (selectedTopics.length === 0) {
            }
            else {
                return selectedVisTopics;
            }
        }
    };
    SelectedVisibleTopicsPipe = __decorate([
        core_1.Pipe({
            name: 'SelectedVisibleTopicsPipe'
        }), 
        __metadata('design:paramtypes', [])
    ], SelectedVisibleTopicsPipe);
    return SelectedVisibleTopicsPipe;
})();
exports.SelectedVisibleTopicsPipe = SelectedVisibleTopicsPipe;
//# sourceMappingURL=selected.visible.topic.pipe.js.map