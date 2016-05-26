var core_1 = require('angular2/core');
var browser_1 = require('angular2/platform/browser');
var router_1 = require('angular2/router');
var http_1 = require('angular2/http');
var topics_service_1 = require('./shared/services/topics/topics.service');
var app_1 = require('./app/components/app');
if ('<%= ENV %>' === 'prod') {
    core_1.enableProdMode();
}
browser_1.bootstrap(app_1.AppCmp, [
    router_1.ROUTER_PROVIDERS,
    http_1.HTTP_PROVIDERS,
    core_1.provide(router_1.APP_BASE_HREF, { useValue: '<%= APP_BASE %>' }),
    topics_service_1.TopicsService
]);
