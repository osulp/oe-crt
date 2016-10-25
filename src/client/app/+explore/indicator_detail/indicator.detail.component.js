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
var common_1 = require('@angular/common');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var index_1 = require('../../shared/components/index');
var index_2 = require('../../shared/services/index');
var index_3 = require('../../shared/components/index');
var table_view_component_1 = require('./table_view/table.view.component');
var DetailComponent = (function () {
    function DetailComponent(_indicatorDescService, _router, _location) {
        this._indicatorDescService = _indicatorDescService;
        this._router = _router;
        this._location = _location;
        this.indicatorDesc = [];
        this._chartData = [];
        this.chartData = [];
        this.isCustomChart = false;
        this.customChartSelections = {};
        this._customChartSelections = {};
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
        this.isTOP = false;
        this.detailUrlChanges = 0;
    }
    DetailComponent.prototype.onSelectedSearchResult = function (results) {
        var _this = this;
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                console.log('search result change', this.placeMap.selectedPlaces, this.placeMap.selectedSearchResults);
                var places = '';
                this.placeMap.selectedSearchResults.forEach(function (place, idx) {
                    var place_simple = {
                        Name: place.Name,
                        ResID: place.ResID,
                        TypeCategory: place.TypeCategory,
                        Desc: place.Desc,
                        Combined: place.Combined,
                        GroupName: place.GroupName
                    };
                    places += encodeURIComponent(JSON.stringify(place_simple));
                    places += idx !== _this.placeMap.selectedSearchResults.length - 1 ? ',' : '';
                });
                console.log('indicator detail: places simple', places);
                this._router.navigate(['Explore', {
                        indicator: encodeURIComponent(results.Name.replace('(', '%28').replace(')', '%29')),
                        places: places
                    }]);
                this.detailUrlChanges++;
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
        var _this = this;
        switch (viewType) {
            case 'map':
                this.showMap = !this.showMap;
                break;
            case 'graph':
                this.showGraph = !this.showGraph;
                this.dataTiles.forEach(function (dt) { return dt.showMenuLeft = !_this.showGraph; });
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
    DetailComponent.prototype.showToolTips = function () {
        this._router.navigate(['/HowTo']);
    };
    DetailComponent.prototype.goBack = function (evt) {
        console.log('going back', window['detailBackUrl'], this.detailUrlChanges, window.history);
        if (window['detailBackUrl']) {
            if (window.detailBackUrl.toUpperCase().indexOf('/EXPLORE;') !== -1) {
                console.log('coming from explore page', window.location);
                if (!window.location.origin) {
                    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                }
                var url = decodeURI(window.detailBackUrl.replace(window.location.origin + '<%= APP_BASE %>', ''));
                console.log('url is now :', url);
                this._router.navigateByUrl(url);
            }
            else {
                console.log('coming from home');
                this._router.navigate(['/']);
            }
        }
        else {
            console.log('FREEEEEEEEEEEEEEEE');
            this._router.navigateByUrl('/Explore');
        }
        window.scrollTo(0, 0);
        evt.stopPropagation();
    };
    DetailComponent.prototype.onChartDataUpdate = function (data) {
        console.log('Chart data emitted to indicator detail', data);
        this._chartData = data;
        this.detailUrlChanges++;
        this.pageUrl = decodeURI(window.location.href);
    };
    DetailComponent.prototype.onBlurExplorePage = function (evt) {
        if (!$(evt.target).closest('#map-menu').length && !$(evt.target).hasClass('hamburger-menu')) {
            console.log('ree', evt);
            this.dataTiles.forEach(function (dt) {
                if (dt.hMapMenu) {
                    dt.hMapMenu.menuSelected = false;
                }
            });
        }
    };
    DetailComponent.prototype.getDateAccessed = function () {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        return month + '/' + day + '/' + year;
    };
    DetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.detailUrlChanges = 0;
        console.log('detailurlchanges', this.detailUrlChanges, history);
        this.showMap = true;
        this.showGraph = true;
        this.showTable = false;
        this.dateAccessed = this.getDateAccessed();
        this.pageUrl = decodeURI(window.location.href);
        this.chartData = [];
        this.inputIndicator = decodeURI(this.inputIndicator)
            .replace(/\%28/g, '(')
            .replace(/\%29/g, ')')
            .replace(/\%252C/g, ',')
            .replace(/\%2C/g, ',')
            .replace(/\%2524/g, '$')
            .replace(/\%24/g, '$')
            .replace(/\+/g, '%2B');
        console.log('DECODED!', this.inputIndicator);
        this._indicatorDescService.getIndicator(this.inputIndicator).subscribe(function (data) {
            console.log('indicator detail repsonse from indicator description service:!', data);
            var indicator_info = data.Desc[0];
            if (indicator_info) {
                _this.indicatorDesc = data.Desc;
                _this.relatedIndicators = data.RelatedIndicators;
                console.log('indicatorDesc service', data);
                _this.indicatorTitle = indicator_info.Dashboard_Chart_Title
                    ? indicator_info.Dashboard_Chart_Title
                    : indicator_info.Variable;
                _this.subTitle = indicator_info.Dashboard_Chart_Y_Axis_Label ? indicator_info.Dashboard_Chart_Y_Axis_Label : '';
                _this.isStatewide = indicator_info.Geog_ID === 8 ? true : false;
                _this.isCountyLevel = indicator_info.CountyLevel;
                _this.isTOP = indicator_info.isTOP;
                _this.isCustomChart = indicator_info.ScriptName !== null;
            }
            _this.windowRefresh();
        });
        this.inputIndicator = this.inputIndicator.replace(/\%2B/g, '+');
        console.log('indicator detail input places: ', this.inputPlaces);
        this.urlPlaces = this.inputPlaces !== 'undefined' ? JSON.parse('[' + decodeURIComponent(this.inputPlaces) + ']') : [];
        console.log('indicator detail url places: ', this.urlPlaces);
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
        core_1.ViewChildren(index_1.DataTileComponent), 
        __metadata('design:type', core_1.QueryList)
    ], DetailComponent.prototype, "dataTiles", void 0);
    DetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'indicator-detail',
            templateUrl: 'indicator.detail.component.html',
            styleUrls: ['indicator.detail.component.css'],
            providers: [http_1.JSONP_PROVIDERS, index_2.IndicatorDescService, index_2.SelectedDataService],
            directives: [index_1.PlacesMapSelectComponent, index_1.DataTileComponent, index_3.SearchComponent, table_view_component_1.TableViewComponent]
        }), 
        __metadata('design:paramtypes', [index_2.IndicatorDescService, router_1.Router, common_1.Location])
    ], DetailComponent);
    return DetailComponent;
})();
exports.DetailComponent = DetailComponent;
//# sourceMappingURL=indicator.detail.component.js.map