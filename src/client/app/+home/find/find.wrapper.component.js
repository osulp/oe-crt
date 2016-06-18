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
var topics_component_1 = require('./topics/topics.component');
var places_component_1 = require('./places/places.component');
var search_component_1 = require('../../shared/components/search/search.component');
var router_1 = require('@angular/router');
var FindWrapperComponent = (function () {
    function FindWrapperComponent(_router) {
        this._router = _router;
    }
    FindWrapperComponent.prototype.goto = function (page) {
        this._router.navigate([page]);
    };
    FindWrapperComponent.prototype.onSelectedSearchResult = function (results) {
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                this._router.navigate(['Explore', {
                        indicator: encodeURIComponent(results.Name.replace('(', '%28').replace(')', '%29'))
                    }]);
            }
            else {
                this._router.navigate(['Explore', { topics: 'All Topics' }]);
            }
        }
    };
    FindWrapperComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'find-wrapper',
            templateUrl: 'find.wrapper.component.html',
            styleUrls: ['find.wrapper.component..css'],
            directives: [search_component_1.SearchComponent, places_component_1.PlacesComponent, topics_component_1.TopicsComponent]
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], FindWrapperComponent);
    return FindWrapperComponent;
})();
exports.FindWrapperComponent = FindWrapperComponent;
//# sourceMappingURL=find.wrapper.component.js.map