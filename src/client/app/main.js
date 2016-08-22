var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var common_1 = require('@angular/common');
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var router_1 = require('@angular/router');
var http_1 = require('@angular/http');
var app_component_1 = require('./app.component');
if ('<%= ENV %>' === 'prod') {
    core_1.enableProdMode();
}
var ArrayLogger = (function () {
    function ArrayLogger() {
        this.res = [];
    }
    ArrayLogger.prototype.log = function (s) { this.res.push(s); };
    ArrayLogger.prototype.logError = function (s) { this.res.push(s); };
    ArrayLogger.prototype.logGroup = function (s) { this.res.push(s); };
    ArrayLogger.prototype.logGroupEnd = function () { ; };
    ;
    return ArrayLogger;
})();
exports.ArrayLogger = ArrayLogger;
var AppExceptionHandler = (function (_super) {
    __extends(AppExceptionHandler, _super);
    function AppExceptionHandler(injector) {
        _super.call(this, new ArrayLogger(), true);
        this.injector = injector;
    }
    AppExceptionHandler.prototype.call = function (exception, stackTrace, reason) {
        this.getDependencies();
        console.log('error handler', exception);
        this.router.navigate(['Error']);
        _super.prototype.call.call(this, exception, stackTrace, reason);
    };
    AppExceptionHandler.prototype.getDependencies = function () {
        if (!this.router) {
            this.router = this.injector.get(router_1.Router);
        }
    };
    AppExceptionHandler = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.Injector])
    ], AppExceptionHandler);
    return AppExceptionHandler;
})(core_1.ExceptionHandler);
exports.AppExceptionHandler = AppExceptionHandler;
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    http_1.HTTP_PROVIDERS,
    router_1.ROUTER_PROVIDERS,
    core_1.provide(common_1.APP_BASE_HREF, { useValue: '<%= ENV %>' === 'prod' ? '<%= APP_BASE %>' : '/' }),
    core_1.provide(core_1.ExceptionHandler, { useClass: AppExceptionHandler })
]);
//# sourceMappingURL=main.js.map