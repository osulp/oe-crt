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
var SelectedTopicsPipe = (function () {
    function SelectedTopicsPipe() {
    }
    SelectedTopicsPipe.prototype.transform = function (topics, collection, topicIndicatorCount) {
        console.log('selectedTopicsPipe', topicIndicatorCount, collection);
        try {
            if (topics && collection) {
                var selectedCollection = collection.filter(function (coll) { return coll.selected; });
                var isAllTopics = topics.filter(function (topic) { return topic.selected; }).length === 0;
                if (selectedCollection.length > 0) {
                    var selectedTopics = topics.filter(function (topic) {
                        if (topicIndicatorCount ? topicIndicatorCount[topic.topic] : false) {
                            if (topic.selected || isAllTopics) {
                                return selectedCollection[0].collection !== 'Show All'
                                    ? topic.collections
                                        ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1
                                            ? topicIndicatorCount[topic.topic][selectedCollection[0].collection].maxCount > 0
                                            : false
                                        : false
                                    : topicIndicatorCount[topic.topic]
                                        ? topicIndicatorCount[topic.topic]['Show All'].maxCount > 0
                                        : true;
                            }
                            else {
                                return topicIndicatorCount[topic.topic]
                                    ? topicIndicatorCount[topic.topic]['Show All'].maxCount > 0
                                    : true;
                            }
                        }
                        else {
                            return topic.selected && (selectedCollection[0].collection !== 'Show All'
                                ? topic.collections
                                    ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1
                                    : false
                                : true);
                        }
                    });
                    console.log('selectedCRTTOPICs', topics, collection, selectedCollection, selectedTopics);
                    if (selectedTopics.length === 0) {
                        return topics.filter(function (topic) { return selectedCollection[0].collection !== 'Show All' ? topic.collections ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false : true; }).sort(function (a, b) { return a.topic.localeCompare(b.topic); });
                    }
                    else {
                        return selectedTopics.sort(function (a, b) { return a.topic.localeCompare(b.topic); });
                    }
                }
                else {
                    var selectedTopics = topics.filter(function (topic) {
                        if (topicIndicatorCount) {
                            return topicIndicatorCount[topic.topic][selectedCollection].maxCount > 0 && topic.selected;
                        }
                        else {
                            return topic.selected;
                        }
                    });
                    return selectedTopics.sort(function (a, b) { return a.topic.localeCompare(b.topic); });
                }
            }
        }
        catch (ex) {
            console.log('error in selected topic pipe', ex);
            return topics;
        }
    };
    SelectedTopicsPipe = __decorate([
        core_1.Pipe({
            name: 'SelectedTopicsPipe'
        }), 
        __metadata('design:paramtypes', [])
    ], SelectedTopicsPipe);
    return SelectedTopicsPipe;
})();
exports.SelectedTopicsPipe = SelectedTopicsPipe;
//# sourceMappingURL=selected.topic.pipe.js.map