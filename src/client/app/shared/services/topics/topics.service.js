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
var index_1 = require('../../data_models/index');
var TopicsService = (function () {
    function TopicsService(jsonp) {
        this.jsonp = jsonp;
    }
    TopicsService.prototype.getCRTTopics = function () {
        var serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/topics';
        var params = new http_1.URLSearchParams();
        params.set('f', 'json');
        params.set('crt', 'true');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(function (request) { return request.json(); })
            .map(function (topics) {
            var result = [];
            if (topics) {
                topics.forEach(function (topic) {
                    result.push(new index_1.Topic(topic.topic, topic.icon, topic.featured, false, topic.collections));
                });
            }
            return result;
        });
    };
    TopicsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Jsonp])
    ], TopicsService);
    return TopicsService;
})();
exports.TopicsService = TopicsService;
//# sourceMappingURL=topics.service.js.map