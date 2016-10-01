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
var http_1 = require('@angular/http');
var index_1 = require('./+about/index');
var index_2 = require('./+collections/index');
var explore_component_1 = require('./+explore/explore.component');
var home_component_1 = require('./+home/home.component');
var index_3 = require('./+howto/index');
var index_4 = require('./+error/index');
var index_5 = require('./shared/services/index');
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'sd-app',
            viewProviders: [http_1.HTTP_PROVIDERS],
            templateUrl: 'app.component.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [index_5.SelectedPlacesService]
        }),
        router_1.Routes([
            {
                path: '/',
                component: home_component_1.HomeComponent
            },
            {
                path: '/About',
                component: index_1.AboutComponent
            },
            {
                path: '/Explore',
                component: explore_component_1.ExploreComponent
            },
            {
                path: '/Collections',
                component: index_2.CollectionsComponent
            },
            {
                path: '/HowTo',
                component: index_3.HowToComponent
            },
            {
                path: '/Error',
                component: index_4.ErrorComponent
            }
        ]), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
})();
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map