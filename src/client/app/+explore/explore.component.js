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
var data_wrapper_component_1 = require('./data/data.wrapper.component');
var indicator_detail_component_1 = require('./indicator_detail/indicator.detail.component');
var index_1 = require('../shared/components/index');
var index_2 = require('../shared/services/index');
var ExploreComponent = (function () {
    function ExploreComponent(_selectedPlacesService, _router) {
        this._selectedPlacesService = _selectedPlacesService;
        this._router = _router;
        this.urlCollection = 'Show All';
        this.allTopics = [];
        this.indicatorDetailView = false;
        this.initialIndicator = true;
    }
    ExploreComponent.prototype.routerOnActivate = function (curr, prev, currTree, prevTree) {
        this.selectedTopics = decodeURI(curr.getParam('topics'));
        this.selectedTopics = this.selectedTopics ? this.selectedTopics : 'All Topics';
        this.selectedIndicator = decodeURI(curr.getParam('indicator'));
        this.selectedIndicators = decodeURI(curr.getParam('indicators'));
        this.selectedPlaces = decodeURI(curr.getParam('places'));
        this.urlCollection = decodeURI(curr.getParam('collection'));
        this.indicatorDetailView = this.selectedIndicator !== null && this.selectedIndicator !== 'undefined' ? true : false;
    };
    ExploreComponent.prototype.onSelectedSearchResult = function (results) {
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                this._router.navigate(['/Explore', { indicator: encodeURI(results.Name).replace('(', '%28').replace(')', '%29') }]);
            }
        }
    };
    ExploreComponent.prototype.onGetSelectedTopicsFromComp = function (results) {
        console.log('emitted selected topics ' + results);
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
    ExploreComponent.prototype.onGetSelectedCollectionsFromComp = function (results) {
        this.selectedCollection = results;
        this.dataComp.collections = results;
        this.dataComp.selectedCollection = results.filter(function (coll) { return coll.selected; })[0].collection;
        this.dataComp.indTopListComps.toArray().forEach(function (child) { return child.selCollections = results; });
    };
    ExploreComponent.prototype.onPlacesChanged = function (selectedPlaces) {
        console.log('place added via explore comp', selectedPlaces);
        var qsParams = [];
        var places = '';
        for (var x = 0; x < selectedPlaces.length; x++) {
            console.log('PROCESSING PLACE CHANGE: EXPLORE.TS');
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
        var baseUrl = [location.protocol, '//', location.host, location.pathname.split(';')[0]].join('');
        var urlQueryString = location.pathname.replace(location.pathname.split(';')[0], '').replace('/Explore', '');
        var allParams = '';
        for (var x = 0; x < qsParams.length; x++) {
            var newParam = qsParams[x].value === '' ? '' : qsParams[x].key + '=' + qsParams[x].value;
            if (urlQueryString) {
                var keyRegex = new RegExp('([\;])' + qsParams[x].key + '([^;]*|[^,]*)');
                if (urlQueryString.match(keyRegex) !== null) {
                    allParams = urlQueryString.replace(keyRegex, '$1' + newParam);
                }
                else {
                    allParams = urlQueryString + (qsParams[x].value !== '' ? ';' : '') + newParam;
                }
            }
            else {
                var pathname = document.location.pathname;
                var keyRegex = new RegExp('([\;])' + qsParams[x].key + '([^;]*|[^,]*)');
                if (pathname.match(keyRegex) !== null) {
                    allParams = pathname.replace(keyRegex, '$1' + newParam);
                }
                else {
                    allParams = (qsParams[x].value !== '' ? ';' : '') + newParam;
                }
            }
            urlQueryString = allParams;
        }
        return (baseUrl + allParams).replace('?&', '?');
    };
    ;
    ExploreComponent.prototype.onBlurExplorePage = function (evt) {
        if (!$(evt.target).closest('.selectBox').length) {
            this.topicsComp.chkBoxVisibile = false;
        }
        if (!$(evt.target).closest('.multiselect').length) {
            this.dataComp.indTopListComps.toArray().forEach(function (child) { return child.chkBoxVisibile = false; });
        }
    };
    ExploreComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('topics from init?', this.selectedTopics);
        this.subscription = this._selectedPlacesService.selectionChanged$.subscribe(function (data) {
            console.log('subscribe throwing event');
            console.log(data);
            _this.onPlacesChanged(data);
        }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
    };
    ExploreComponent.prototype.ngOnDestroy = function () {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    };
    __decorate([
        core_1.ViewChild(data_wrapper_component_1.DataComponent), 
        __metadata('design:type', data_wrapper_component_1.DataComponent)
    ], ExploreComponent.prototype, "dataComp", void 0);
    __decorate([
        core_1.ViewChild(topics_select_component_1.TopicsComponent), 
        __metadata('design:type', topics_select_component_1.TopicsComponent)
    ], ExploreComponent.prototype, "topicsComp", void 0);
    ExploreComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'explore',
            templateUrl: 'explore.component.html',
            styleUrls: ['explore.component.css'],
            directives: [index_1.SearchComponent, topics_select_component_1.TopicsComponent, places_wrapper_component_1.PlacesWrapperComponent, data_wrapper_component_1.DataComponent, indicator_detail_component_1.DetailComponent],
            providers: [index_2.SelectedPlacesService]
        }), 
        __metadata('design:paramtypes', [index_2.SelectedPlacesService, router_1.Router])
    ], ExploreComponent);
    return ExploreComponent;
})();
exports.ExploreComponent = ExploreComponent;
//# sourceMappingURL=explore.component.js.map