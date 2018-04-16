var Indicator = (function () {
    function Indicator(indicator, topics, collections, selected, indicator_display) {
        this.indicator = indicator;
        this.indicator_display = indicator_display;
        this.topics = topics;
        this.collections = collections;
        this.selected = selected;
    }
    Indicator.prototype.toggleSelected = function () {
        this.selected = !this.selected;
    };
    return Indicator;
})();
exports.Indicator = Indicator;
//# sourceMappingURL=indicator.model.js.map