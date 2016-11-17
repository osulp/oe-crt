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
        this.urlFilter = '';
        this.allTopics = [];
        this.indicatorDetailView = false;
        this.showTopicsExpanded = false;
        this.showPlacesExpanded = false;
        this.initLoad = true;
        this.hideAll = { hide: false, trigger: null };
        this.initialIndicator = true;
    }
    ExploreComponent.prototype.routerOnActivate = function (curr, prev, currTree, prevTree) {
        this.selectedTopics = decodeURI(curr.getParam('topics'));
        this.selectedTopics = this.selectedTopics ? this.selectedTopics : 'All Topics';
        this.selectedIndicator = decodeURI(curr.getParam('indicator'));
        this.selectedIndicators = decodeURI(curr.getParam('indicators'));
        this.selectedPlaces = decodeURI(curr.getParam('places'));
        this.urlCollection = decodeURI(curr.getParam('collection'));
        this.urlFilter = decodeURI(curr.getParam('filter'));
        this.showTopicsExpanded = curr.getParam('show') === 'Topics';
        this.showPlacesExpanded = curr.getParam('show') === 'Places';
        console.log('routercheck', this.showTopicsExpanded, this.selectedTopics);
        this.indicatorDetailView = this.selectedIndicator !== null && this.selectedIndicator !== 'undefined' ? true : false;
    };
    ExploreComponent.prototype.onHideAll = function (evt) {
        console.log('onhideall', evt);
        if (evt.filter !== undefined) {
            console.log('shark');
            var newState = '';
            if (evt.filter === '') {
                var baseUrl = [location.protocol, '//', location.host, location.pathname.split(';')[0]].join('');
                var urlQueryString = location.pathname.replace(location.pathname.split(';')[0], '').replace('/Explore', '');
                console.log('onhideallqs', urlQueryString);
                var splitQS = urlQueryString.split(';');
                urlQueryString = '';
                splitQS.forEach(function (qs, index) {
                    urlQueryString += qs.indexOf('filter=') === -1 ? (index !== 0 ? ';' : '') + qs : '';
                });
                newState = baseUrl + urlQueryString;
                newState = '<%= ENV %>' !== 'prod' ? newState.replace(new RegExp('\\.', 'g'), '%2E') : newState;
            }
            else {
                var qsParams = [];
                var filterParam = { key: 'filter', value: evt.filter };
                qsParams.push(filterParam);
                newState = this.updateQueryStringParam(qsParams);
            }
            console.log('pushing state for filter', newState);
            window.history.pushState({}, '', newState);
            if ('<%= ENV %>' === 'prod') {
                ga('send', 'pageview', window.location.href);
            }
        }
        this.hideAll = evt;
    };
    ExploreComponent.prototype.onSelectedSearchResult = function (results) {
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                window['detailBackUrl'] = window.location.href;
                this._router.navigate(['/Explore', {
                        indicator: encodeURI(results.Name)
                            .replace('(', '%28')
                            .replace(')', '%29')
                            .replace(/\+/g, '%2B')
                            .replace(/\&/g, '%26')
                            .replace(/\=/g, '%3D'),
                        places: this.selectedPlacesUrl
                    }]);
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
            queryString = '';
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
        console.log('NEW STATE TOPICs!!!!!!!!!!!', newState);
        window.history.pushState({}, '', newState);
        if ('<%= ENV %>' === 'prod') {
            if (ga) {
                ga('send', 'pageview', window.location.href);
            }
        }
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
    ExploreComponent.prototype.onPopState = function (evt) {
        console.log('popping state', evt);
    };
    ExploreComponent.prototype.onPlacesChanged = function (selectedPlaces) {
        console.log('place added via explore comp', selectedPlaces);
        var qsParams = [];
        this.selectedPlacesUrl = '';
        for (var x = 0; x < selectedPlaces.length; x++) {
            var place_simple = {
                Name: selectedPlaces[x].Name,
                ResID: selectedPlaces[x].ResID,
                TypeCategory: selectedPlaces[x].TypeCategory,
                Desc: selectedPlaces[x].Desc,
                Combined: selectedPlaces[x].Combined,
                GroupName: selectedPlaces[x].GroupName
            };
            this.selectedPlacesUrl += encodeURIComponent(JSON.stringify(place_simple));
            if (x !== selectedPlaces.length - 1) {
                this.selectedPlacesUrl += ',';
            }
        }
        var placeParam = { key: 'places', value: this.selectedPlacesUrl };
        qsParams.push(placeParam);
        var newState = this.updateQueryStringParam(qsParams);
        console.log('NEW STATE PLACE !!!!!!!!!!!', newState);
        if (this.initLoad) {
            this.initLoad = false;
            console.log('replacing state', newState);
            window.history.replaceState({}, '', newState);
        }
        else {
            console.log('pushing state', newState);
            window.history.pushState({}, '', newState);
            if ('<%= ENV %>' === 'prod') {
                ga('send', 'pageview', window.location.href);
            }
        }
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
        var returnVal = (baseUrl + allParams).replace('?&', '?');
        returnVal = '<%= ENV %>' !== 'prod' ? returnVal.replace(new RegExp('\\.', 'g'), '%2E') : returnVal;
        return returnVal;
    };
    ;
    ExploreComponent.prototype.onBlurExplorePage = function (evt) {
        try {
            if (!$(evt.target).closest('.data-control-bar').length) {
                this.dataComp.shareLinkComp.showShare = false;
            }
            if (!$(evt.target).closest('.dataset-filter').length) {
                document.getElementById('filteredIndicator').value = '';
                this.topicsComp.showFilterIndicator = false;
            }
            if (!$(evt.target).closest('.multiselect').length) {
                this.dataComp.indTopListComps.toArray().forEach(function (child) { return child.chkBoxVisibile = false; });
            }
        }
        catch (ex) {
            evt.preventDefault();
            console.log('failed to check/hide list boxes');
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
    __decorate([
        core_1.ViewChild(indicator_detail_component_1.DetailComponent), 
        __metadata('design:type', indicator_detail_component_1.DetailComponent)
    ], ExploreComponent.prototype, "detailComp", void 0);
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