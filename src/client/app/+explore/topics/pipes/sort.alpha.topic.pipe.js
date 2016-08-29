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
var SortAlphaTopicPipe = (function () {
    function SortAlphaTopicPipe() {
    }
    SortAlphaTopicPipe.prototype.transform = function (topics, collections) {
        if (topics !== undefined) {
            if (collections) {
                var selectedCollection = collections.filter(function (coll) { return coll.selected; });
                var selectedTopics = topics.sort(function (a, b) { return a.topic.localeCompare(b.topic); }).filter(function (topic) {
                    if (selectedCollection.length > 0) {
                        return (selectedCollection[0].collection !== 'Show All' ? topic.collections ? topic.collections.split(', ').indexOf(selectedCollection[0].collection) !== -1 : false : true);
                    }
                    else {
                        return true;
                    }
                });
                return selectedTopics;
            }
            else {
                return topics.sort(function (a, b) { return a.topic.localeCompare(b.topic); });
            }
        }
    };
    SortAlphaTopicPipe = __decorate([
        core_1.Pipe({
            name: 'SortAlphaTopicPipe'
        }), 
        __metadata('design:paramtypes', [])
    ], SortAlphaTopicPipe);
    return SortAlphaTopicPipe;
})();
exports.SortAlphaTopicPipe = SortAlphaTopicPipe;
//# sourceMappingURL=sort.alpha.topic.pipe.js.map