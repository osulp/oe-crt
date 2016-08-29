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
    SelectedTopicsPipe.prototype.transform = function (topics, collection) {
        if (topics !== undefined && collection) {
            var selectedCollection = collection.filter(function (coll) { return coll.selected; });
            if (selectedCollection.length > 0) {
                var selectedTopics = topics.filter(function (topic) { return topic.selected && (selectedCollection[0].collection !== 'Show All' ? topic.collections ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false : true); });
                console.log('selectedCRTTOPICs', topics, collection, selectedCollection, selectedTopics);
                if (selectedTopics.length === 0) {
                    return topics.filter(function (topic) { return selectedCollection[0].collection !== 'Show All' ? topic.collections ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false : true; });
                }
                else {
                    return selectedTopics;
                }
            }
            else {
                var selectedTopics = topics.filter(function (topic) { return topic.selected; });
                return selectedTopics;
            }
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