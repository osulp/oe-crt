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
var router_1 = require('@angular/router');
var topics_select_component_1 = require('./topics/topics.select.component');
var places_wrapper_component_1 = require('./places_wrapper/places.wrapper.component');
var index_1 = require('../shared/components/index');
var index_2 = require('../shared/services/index');
var ExploreComponent = (function () {
    function ExploreComponent(_selectedPlacesService, _router, routeParams) {
        this._selectedPlacesService = _selectedPlacesService;
        this._router = _router;
        this.routeParams = routeParams;
        this.indicatorDetailView = false;
        this.selectedTopics = routeParams.getParam('topics');
        this.selectedPlaces = routeParams.getParam('places');
        this.selectedIndicators = routeParams.getParam('indicators');
        this.selectedIndicator = routeParams.getParam('indicator');
        this.initialIndicator = true;
        this.indicatorDetailView = this.selectedIndicator !== null && this.selectedIndicator !== undefined ? true : false;
        console.log(this.indicatorDetailView);
        console.log(this.selectedIndicator);
        console.log(routeParams.getParam('indicator') + ' received on load of explore Component');
    }
    ExploreComponent.prototype.onSelectedSearchResult = function (results) {
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                this._router.navigate(['Explore', { indicator: encodeURI(results.Name), topics: results.TypeCategory.split(';')[1] }]);
            }
            else {
                this._router.navigate(['Explore', { places: encodeURI(results.Name), topics: 'All Topics' }]);
            }
        }
    };
    ExploreComponent.prototype.onGetSelectedTopicsFromComp = function (results) {
        this.selectedTopics = results;
        var queryString = '';
        if (this.selectedTopics.length > 0) {
            for (var x = 0; x < this.selectedTopics.length; x++) {
                queryString += this.selectedTopics[x].replace('&', '%26');
                if (x < this.selectedTopics.length - 1) {
                    queryString += ',';
                }
            }
        }
        else {
            queryString = 'All Topics';
        }
        var qsParams = [];
        var topicsParam = { key: 'topics', value: queryString };
        qsParams.push(topicsParam);
        if (this.initialIndicator) {
            this.initialIndicator = false;
        }
        else {
            this.selectedIndicators = '';
            var indicatorParam = { key: 'indicators', value: '' };
            qsParams.push(indicatorParam);
        }
        var newState = this.updateQueryStringParam(qsParams);
        window.history.pushState({}, '', newState);
    };
    ExploreComponent.prototype.onGetAllTopicsFromComp = function (results) {
        this.allTopics = results;
    };
    ExploreComponent.prototype.onGetAllIndicatorsFromComp = function (results) {
        this.allIndicators = results;
    };
    ExploreComponent.prototype.onPlacesChanged = function (selectedPlaces) {
        var qsParams = [];
        var places = '';
        for (var x = 0; x < selectedPlaces.length; x++) {
            places += encodeURIComponent(JSON.stringify(selectedPlaces[x]));
            if (x !== selectedPlaces.length - 1) {
                places += ',';
            }
        }
        var placeParam = { key: 'places', value: places };
        qsParams.push(placeParam);
        var newState = this.updateQueryStringParam(qsParams);
        window.history.pushState({}, '', newState);
    };
    ExploreComponent.prototype.updateQueryStringParam = function (qsParams) {
        var baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
        var urlQueryString = document.location.search;
        var allParams = '';
        for (var x = 0; x < qsParams.length; x++) {
            var newParam = qsParams[x].value === '' ? '' : qsParams[x].key + '=' + qsParams[x].value;
            allParams = '?' + newParam;
            if (urlQueryString) {
                var keyRegex = new RegExp('([\?&])' + qsParams[x].key + '([^&]*|[^,]*)');
                if (urlQueryString.match(keyRegex) !== null) {
                    allParams = urlQueryString.replace(keyRegex, '$1' + newParam);
                }
                else {
                    allParams = urlQueryString + (qsParams[x].value !== '' ? '&' : '') + newParam;
                }
            }
            urlQueryString = allParams;
        }
        return (baseUrl + allParams).replace('?&', '?');
    };
    ;
    ExploreComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.allTopics = [];
        this.subscription = this._selectedPlacesService.selectionChanged$.subscribe(function (data) {
            console.log('subscribe throwing event');
            console.log(data);
            _this.onPlacesChanged(data);
        }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
        this._selectedPlacesService.load();
    };
    ExploreComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'explore',
            templateUrl: 'explore.component.html',
            styleUrls: ['explore.component.css'],
            directives: [index_1.SearchComponent, topics_select_component_1.TopicsComponent, places_wrapper_component_1.PlacesWrapperComponent],
            providers: [index_2.SelectedPlacesService]
        }), 
        __metadata('design:paramtypes', [index_2.SelectedPlacesService, router_1.Router, router_1.RouteSegment])
    ], ExploreComponent);
    return ExploreComponent;
})();
exports.ExploreComponent = ExploreComponent;
//# sourceMappingURL=explore.component.js.map