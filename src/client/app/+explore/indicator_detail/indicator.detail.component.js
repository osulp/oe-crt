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
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var index_1 = require('../../shared/components/index');
var index_2 = require('../../shared/services/index');
var index_3 = require('../../shared/components/index');
var table_view_component_1 = require('./table_view/table.view.component');
var DetailComponent = (function () {
    function DetailComponent(_indicatorDescService, _router) {
        this._indicatorDescService = _indicatorDescService;
        this._router = _router;
        this.indicatorDesc = [];
        this._chartData = [];
        this.chartData = [];
        this.selectedPlaceType = 'Oregon';
        this.urlPlaces = [];
        this.visible = false;
        this.indInfo = 'desc';
        this.initialLoad = true;
        this.relatedIndicators = [];
        this.indicatorTitle = '';
        this.subTitle = '';
        this.isStatewide = false;
        this.isCountyLevel = false;
    }
    DetailComponent.prototype.onSelectedSearchResult = function (results) {
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                console.log('search result change', this.placeMap.selectedPlaces, this.placeMap.selectedSearchResults);
                this._router.navigate(['Explore', {
                        indicator: encodeURIComponent(results.Name.replace('(', '%28').replace(')', '%29')),
                        places: encodeURIComponent(JSON.stringify(this.placeMap.selectedSearchResults).replace('[', '').replace(']', ''))
                    }]);
            }
        }
    };
    DetailComponent.prototype.getClass = function () {
        return this.visible ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    };
    DetailComponent.prototype.toggleCommunitiesWrapper = function () {
        this.visible = !this.visible;
        if (this.initialLoad) {
            this.placeMap.leafletMap.refreshMap();
            this.initialLoad = false;
        }
    };
    DetailComponent.prototype.setToggleView = function (viewType) {
        switch (viewType) {
            case 'map':
                this.showMap = !this.showMap;
                break;
            case 'graph':
                this.showGraph = !this.showGraph;
                break;
            case 'table':
                this.showTable = !this.showTable;
                break;
            default:
                break;
        }
        this.windowRefresh();
    };
    DetailComponent.prototype.windowRefresh = function () {
        var runInterval = setInterval(runCheck, 50);
        function runCheck() {
            window.dispatchEvent(new Event('resize'));
            clearInterval(runInterval);
        }
    };
    DetailComponent.prototype.goBack = function () {
        this._router.navigate(['/Explore']);
        window.scrollTo(0, 0);
    };
    DetailComponent.prototype.onChartDataUpdate = function (data) {
        console.log('Chart data emitted to indicator detail', data);
        this._chartData = data;
        console.log('Chart data', this.chartData);
    };
    DetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.showMap = true;
        this.showGraph = true;
        this.showTable = false;
        this.chartData = [];
        this.inputIndicator = decodeURI(this.inputIndicator)
            .replace(/\%2528/g, '(')
            .replace(/\%28/g, '(')
            .replace(/\%2529/g, ')')
            .replace(/\%29/g, ')')
            .replace(/\%252C/g, ',')
            .replace(/\%2C/g, ',')
            .replace(/\%2524/g, '$')
            .replace(/\%24/g, '$');
        this._indicatorDescService.getIndicator(this.inputIndicator).subscribe(function (data) {
            var indicator_info = data.Desc[0];
            _this.indicatorDesc = data.Desc;
            _this.relatedIndicators = data.RelatedIndicators;
            console.log('indicatorDesc service', data);
            _this.indicatorTitle = indicator_info.Dashboard_Chart_Title ? indicator_info.Dashboard_Chart_Title : indicator_info.Variable;
            _this.subTitle = indicator_info.Dashboard_Chart_Y_Axis_Label ? indicator_info.Dashboard_Chart_Y_Axis_Label : '';
            _this.isStatewide = indicator_info.Geog_ID === 8 ? true : false;
            _this.isCountyLevel = indicator_info.CountyLevel;
            _this.windowRefresh();
        });
        this.inputIndicator = this.inputIndicator.replace(/\%2B/g, '+');
        this.urlPlaces = this.inputPlaces !== 'undefined' ? JSON.parse('[' + decodeURIComponent(this.inputPlaces) + ']') : [];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DetailComponent.prototype, "inputIndicator", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DetailComponent.prototype, "inputPlaces", void 0);
    __decorate([
        core_1.ViewChild(index_1.PlacesMapSelectComponent), 
        __metadata('design:type', index_1.PlacesMapSelectComponent)
    ], DetailComponent.prototype, "placeMap", void 0);
    __decorate([
        core_1.ViewChild(index_1.DataTileComponent), 
        __metadata('design:type', index_1.DataTileComponent)
    ], DetailComponent.prototype, "dataTile", void 0);
    DetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'indicator-detail',
            templateUrl: 'indicator.detail.component.html',
            styleUrls: ['indicator.detail.component.css'],
            providers: [http_1.JSONP_PROVIDERS, index_2.IndicatorDescService, index_2.SelectedDataService],
            directives: [index_1.PlacesMapSelectComponent, index_1.DataTileComponent, index_3.SearchComponent, table_view_component_1.TableViewComponent]
        }), 
        __metadata('design:paramtypes', [index_2.IndicatorDescService, router_1.Router])
    ], DetailComponent);
    return DetailComponent;
})();
exports.DetailComponent = DetailComponent;
//# sourceMappingURL=indicator.detail.component.js.map