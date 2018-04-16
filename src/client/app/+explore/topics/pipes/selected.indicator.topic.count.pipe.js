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
var SelectedIndicatorByTopicsCountPipe = (function () {
    function SelectedIndicatorByTopicsCountPipe() {
    }
    SelectedIndicatorByTopicsCountPipe.prototype.transform = function (indicators, topic, collections) {
        var selCollection = collections.filter(function (coll) { return coll.selected; });
        if (indicators !== undefined) {
            if (topic === 'all') {
                return indicators.filter(function (indicator) { return indicator.selected && (indicator.collections ? (indicator.collections.split(', ').indexOf(selCollection[0].collection) !== -1 || selCollection[0].collection === 'Show All') : selCollection[0].collection === 'Show All' ? true : false); }).length;
            }
            else {
                return indicators.filter(function (indicator) {
                    return indicator.selected && indicator.topics.split(', ').indexOf(topic.topic) !== -1 && (indicator.collections ? (indicator.collections.split(', ').indexOf(selCollection[0].collection) !== -1 || selCollection[0].collection === 'Show All') : selCollection[0].collection === 'Show All' ? true : false);
                }).length;
            }
        }
    };
    SelectedIndicatorByTopicsCountPipe = __decorate([
        core_1.Pipe({
            name: 'SelectedIndicatorByTopicsCountPipe'
        }), 
        __metadata('design:paramtypes', [])
    ], SelectedIndicatorByTopicsCountPipe);
    return SelectedIndicatorByTopicsCountPipe;
})();
exports.SelectedIndicatorByTopicsCountPipe = SelectedIndicatorByTopicsCountPipe;
//# sourceMappingURL=selected.indicator.topic.count.pipe.js.map