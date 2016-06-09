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
var Subject_1 = require('rxjs/Subject');
var Rx_1 = require('rxjs/Rx');
var indicators_service_1 = require('../../services/indicators/indicators.service');
var initialState = [];
var SelectedIndicatorsService = (function () {
    function SelectedIndicatorsService(_indicatorService) {
        this._indicatorService = _indicatorService;
        this.selectionChanged$ = new Rx_1.ReplaySubject(1);
        this.updates = new Subject_1.Subject();
        this.loadIndicators = new Subject_1.Subject();
        this.toggleIndicator = new Subject_1.Subject();
        this.removeIndicator = new Subject_1.Subject();
        this.getAll = new Subject_1.Subject();
        this.updates
            .scan(function (accumulator, operation) {
            return operation(accumulator);
        }, initialState)
            .subscribe(this.selectionChanged$);
        this.loadIndicators
            .map(function (indicators) {
            return function (state) { return indicators; };
        })
            .subscribe(this.updates);
        this.toggleIndicator
            .map(function (indicator) {
            return function (Indicators) {
                if (indicator[1]) {
                    indicator[0].selected = indicator[1];
                }
                else {
                    indicator[0].toggleSelected();
                }
                console.log(Indicators);
                var i = Indicators.indexOf(indicator[0]);
                Indicators = Indicators.slice(0, i).concat([
                    indicator[0]
                ], Indicators.slice(i + 1));
                console.log(Indicators);
                return Indicators;
            };
        })
            .subscribe(this.updates);
    }
    SelectedIndicatorsService.prototype.load = function () {
        var _this = this;
        this._indicatorService.getIndicators().subscribe(function (data) {
            console.log(data);
            _this.loadIndicators.next(data);
        }, function (err) { return console.error(err); }, function () { return console.log('done loading indicators'); });
    };
    SelectedIndicatorsService.prototype.toggle = function (indicator, value) {
        this.toggleIndicator.next([indicator, value]);
    };
    SelectedIndicatorsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [indicators_service_1.IndicatorsService])
    ], SelectedIndicatorsService);
    return SelectedIndicatorsService;
})();
exports.SelectedIndicatorsService = SelectedIndicatorsService;
//# sourceMappingURL=selected.indicators.service.js.map