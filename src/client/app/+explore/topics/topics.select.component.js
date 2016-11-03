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
var index_1 = require('../../shared/components/index');
var index_2 = require('../../shared/services/index');
var index_3 = require('./pipes/index');
require('rxjs/add/operator/map');
require('rxjs/add/operator/share');
var TopicsComponent = (function () {
    function TopicsComponent(_topicService, _indicatorService, _collectionService) {
        this._topicService = _topicService;
        this._indicatorService = _indicatorService;
        this._collectionService = _collectionService;
        this.selectedTopicsFromComp = new core_1.EventEmitter();
        this.selectedIndicatorsFromComp = new core_1.EventEmitter();
        this.selectedCollectionsFromComp = new core_1.EventEmitter();
        this.allTopicsFromComp = new core_1.EventEmitter();
        this.allIndicatorsFromComp = new core_1.EventEmitter();
        this.hideAllFromComp = new core_1.EventEmitter();
        this.chkBoxCollectVisibile = false;
        this.initialLoad = true;
        this.collections = [];
        this.showIndicatorCount = false;
        this.showAll = true;
        this.hideAll = false;
        this.indicatorTrigger = false;
        this.showFilterIndicator = false;
        this.indicatorSortAlpha = true;
        this.visible = true;
        this.showAllSelected = false;
        this.chkBoxVisibile = false;
    }
    TopicsComponent.prototype.getClass = function () {
        return this.expanded.toString() === 'true' ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    };
    TopicsComponent.prototype.toggleTopicsWrapper = function () {
        console.log('this.expanded', typeof (this.expanded));
        this.expanded = this.expanded.toString() === 'true' ? false : true;
    };
    TopicsComponent.prototype.toggleFilterIndicator = function (filterInput) {
        this.showFilterIndicator = !this.showFilterIndicator;
        console.log('toggleIndicatorList', filterInput);
        filterInput.value = !this.showFilterIndicator ? '' : filterInput.value;
    };
    TopicsComponent.prototype.toggleAllTopics = function (evt) {
        this.showAllSelected = this.showAllSelected ? this.showAllSelected : !this.showAllSelected;
        if (this.showAllSelected) {
            this.selectAllTopics();
        }
    };
    TopicsComponent.prototype.onIndicatorFilterKeyPress = function (event, filterIndicator) {
        var code = event.keyCode || event.which;
        if (code === 13) {
            this.showHideAll('show', filterIndicator);
        }
    };
    TopicsComponent.prototype.selectAllTopics = function () {
        var _this = this;
        console.log('show all selected');
        var tempTopics = this.Topics;
        tempTopics.forEach(function (topic) {
            if (topic.selected) {
                _this.toggleTopic(topic);
            }
            var idx = _this.Topics.indexOf(topic);
            _this.Topics = _this.Topics.slice(0, idx).concat([
                topic
            ], _this.Topics.slice(idx + 1));
        });
        this._selectedTopics = [];
        this._selectedIndicators = [];
        for (var x = 0; x < this.Indicators.length; x++) {
            if (this.Indicators[x].selected) {
                this._selectedIndicators.push(this.Indicators[x]);
            }
        }
        this.selectedTopicsFromComp.emit(this._selectedTopics);
        var tempIndicators = this.Indicators;
        this._selectedIndicators = [];
        tempIndicators.forEach(function (indicator) {
            if (!indicator.selected) {
                indicator.toggleSelected();
            }
            var i = _this.Indicators.indexOf(indicator);
            _this.Indicators = _this.Indicators.slice(0, i).concat([
                indicator
            ], _this.Indicators.slice(i + 1));
            _this._selectedIndicators.push(indicator);
        });
        this.allTopicsFromComp.emit(this.Topics);
        this.allIndicatorsFromComp.emit(this.Indicators);
    };
    TopicsComponent.prototype.getTopics = function () {
        var _this = this;
        this._topicService.getCRTTopics().subscribe(function (data) {
            _this.Topics = data;
            _this.allTopicsFromComp.emit(_this.Topics);
            _this.getIndicators();
        }, function (err) { return console.error(err); }, function () { return console.log('done loading topics'); });
    };
    TopicsComponent.prototype.toggleTopic = function (topic) {
        console.log('topic toggled', topic);
        this.showAllSelected = false;
        topic.toggleSelected();
        var idx = this.Topics.indexOf(topic);
        this.Topics = this.Topics.slice(0, idx).concat([
            topic
        ], this.Topics.slice(idx + 1));
        if (!this.initialLoad) {
            this._selectedTopics = [];
            for (var x = 0; x < this.Topics.length; x++) {
                if (this.Topics[x].selected) {
                    this._selectedTopics.push(this.Topics[x].topic);
                }
            }
            if (this._selectedTopics.length === 0) {
                this.showAllSelected = true;
                this.selectAllTopics();
                return;
            }
            this.selectedTopicsFromComp.emit(this._selectedTopics);
        }
        for (var i = 0; i < this.Indicators.length; i++) {
            var assocTopics = this.Indicators[i].topics.split(', ');
            for (var _i = 0, _a = this._selectedTopics; _i < _a.length; _i++) {
                var t = _a[_i];
                if (assocTopics.indexOf(t) !== -1) {
                    this.toggleIndicator(this.Indicators[i], true);
                }
            }
        }
        this.allTopicsFromComp.emit(this.Topics);
        this.allIndicatorsFromComp.emit(this.Indicators);
    };
    TopicsComponent.prototype.onFilterIndicator = function (Indicators) {
        this.Indicators = Indicators;
        this.allIndicatorsFromComp.emit(this.Indicators);
    };
    TopicsComponent.prototype.showHideAll = function (showType, filterInput) {
        var _this = this;
        this.showAll = showType === 'show';
        this.hideAll = showType === 'hide';
        var isShowing = this.showAll;
        console.log('filtervalue', filterInput.value);
        this.Indicators.forEach(function (indicator) {
            isShowing = indicator.indicator_display.toUpperCase().indexOf(filterInput.value.toUpperCase()) !== -1;
            if (isShowing) {
                console.log('isshowing', indicator);
                _this.toggleIndicator(indicator, _this.showAll, false);
            }
            else if (_this.showAll) {
                _this.toggleIndicator(indicator, false, false);
            }
        });
        this.allIndicatorsFromComp.emit(this.Indicators);
        this.indicatorTrigger = !this.indicatorTrigger;
        this.hideAll = filterInput.value === '' && !this.showAll;
        this.hideAllFromComp.emit({ hide: this.hideAll, trigger: this.indicatorTrigger });
        if (showType === 'visible') {
            filterInput.value = '';
            this.showFilterIndicator = false;
        }
    };
    TopicsComponent.prototype.toggleIndicator = function (indicator, value, emit) {
        if (value !== undefined && value !== null) {
            indicator.selected = value;
        }
        else {
            indicator.toggleSelected();
        }
        var i = this.Indicators.indexOf(indicator);
        this.Indicators = this.Indicators.slice(0, i).concat([
            indicator
        ], this.Indicators.slice(i + 1));
        this._selectedIndicators = [];
        for (var x = 0; x < this.Indicators.length; x++) {
            if (this.Indicators[x].selected) {
                this._selectedIndicators.push(this.Indicators[x]);
            }
        }
        if (emit === undefined) {
            this.showAll = false;
            this.hideAll = false;
            this.allIndicatorsFromComp.emit(this.Indicators);
        }
        else if (emit) {
            this.showAll = false;
            this.hideAll = false;
            this.indicatorTrigger = !this.indicatorTrigger;
            this.hideAllFromComp.emit({ hide: this.hideAll, trigger: this.indicatorTrigger });
            this.allIndicatorsFromComp.emit(this.Indicators);
        }
    };
    TopicsComponent.prototype.toggleCollection = function (toggled_collection) {
        this.collections = this.collections.map(function (coll) {
            coll.selected = coll.collection === toggled_collection.collection ? true : false;
            return coll;
        });
        this.selectedCollectionsFromComp.emit(this.collections);
    };
    TopicsComponent.prototype.getIndicators = function () {
        var _this = this;
        this._indicatorService.getIndicators().subscribe(function (data) {
            _this.Indicators = data;
            console.log('got indicators', _this.Indicators);
            console.log('selected topics?', _this._selectedTopics);
            if (_this.Indicators.length > 0) {
                for (var x = 0; x < _this.Indicators.length; x++) {
                    if (_this._inputIndicators[0] !== '') {
                        if (_this._inputIndicators.indexOf(_this.Indicators[x].indicator) !== -1) {
                            _this.toggleIndicator(_this.Indicators[x]);
                        }
                    }
                }
                console.log(_this.Topics);
                if (_this._selectedTopics.length > 0) {
                    console.log('jack has sause', _this._selectedTopics, _this._inputTopics);
                    _this.showAllSelected = _this._selectedTopics[0] !== 'undefined' ? false : true;
                    for (var x = 0; x < _this.Topics.length; x++) {
                        if (_this._selectedTopics.indexOf(_this.Topics[x].topic) !== -1) {
                            _this.toggleTopic(_this.Topics[x]);
                        }
                    }
                    if (_this.showAllSelected) {
                        for (var i = 0; i < _this.Indicators.length; i++) {
                            _this.toggleIndicator(_this.Indicators[i], true);
                        }
                    }
                }
            }
            _this.initialLoad = false;
            var inScope = _this;
            window.setTimeout(function () {
                inScope.showIndicatorCount = true;
            }, 1000);
        }, function (err) { return console.error(err); }, function () { return console.log('done loading indicators'); });
    };
    TopicsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._inputTopics = this.inputTopics.replace(/\%20/g, ' ').replace(/\%26/g, '&').split(',');
        this._selectedTopics = this._inputTopics.length === 1 && (this._inputTopics[0] === '' || this.inputTopics[0] === 'All Topics') ? ['All Topics'] : this._inputTopics;
        this._inputIndicators = this.inputIndicators.replace(/\%20/g, ' ').replace(/\%26/g, '&').split(';');
        this._selectedIndicators = this._inputIndicators;
        this.getTopics();
        this._collectionService.get().subscribe(function (results) {
            var selectedCollection = _this.inputCollection !== 'undefined' ? _this.inputCollection : 'Show All';
            var all = { collection: 'Show All', selected: selectedCollection === 'Show All' ? true : false };
            _this.collections = results
                .filter(function (coll) { return coll.collection_name !== 'Partner with us'; })
                .map(function (result) {
                return { collection: result.collection_name, icon_path: result.collection_icon_path, selected: selectedCollection === result.collection_name ? true : false };
            });
            _this.collections.push(all);
            _this.selectedCollectionsFromComp.emit(_this.collections);
            window.crt_collections = _this.collections;
        });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TopicsComponent.prototype, "selectedTopicsFromComp", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TopicsComponent.prototype, "selectedIndicatorsFromComp", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TopicsComponent.prototype, "selectedCollectionsFromComp", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TopicsComponent.prototype, "allTopicsFromComp", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TopicsComponent.prototype, "allIndicatorsFromComp", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TopicsComponent.prototype, "hideAllFromComp", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TopicsComponent.prototype, "inputTopics", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TopicsComponent.prototype, "inputIndicators", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TopicsComponent.prototype, "inputCollection", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], TopicsComponent.prototype, "expanded", void 0);
    TopicsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'topics',
            templateUrl: 'topics.select.component.html',
            styleUrls: ['topics.select.component.css'],
            directives: [index_1.IndicatorsTopicListComponent],
            pipes: [index_3.IndicatorTopicFilterPipe, index_3.SelectedTopicsPipe, index_3.SelectedIndicatorByTopicsCountPipe, index_3.SortAlphaTopicPipe],
            providers: [http_1.JSONP_PROVIDERS, index_2.TopicsService, index_2.IndicatorsService, index_2.CollectionsService]
        }), 
        __metadata('design:paramtypes', [index_2.TopicsService, index_2.IndicatorsService, index_2.CollectionsService])
    ], TopicsComponent);
    return TopicsComponent;
})();
exports.TopicsComponent = TopicsComponent;
//# sourceMappingURL=topics.select.component.js.map