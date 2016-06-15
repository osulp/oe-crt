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
var router_1 = require('@angular/router');
var index_1 = require('../../../shared/services/index');
var topic_count_pipe_1 = require('./topic.count.pipe');
require('rxjs/add/operator/map');
var TopicsComponent = (function () {
    function TopicsComponent(_topicService, _router) {
        this._topicService = _topicService;
        this._router = _router;
        this.Topics = [];
        this.maxCount = 8;
    }
    TopicsComponent.prototype.gotoTopic = function (topic) {
        console.log('topic clicked', topic);
        var targetUrl = topic === 'all' ? '/Explore' : '/Explore;topics=' + encodeURI(topic.topic.replace('&', '%26'));
        console.log('target url', targetUrl);
        this._router.navigateByUrl(targetUrl);
    };
    TopicsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._topicService.getCRTTopics().subscribe(function (data) {
            console.log(data);
            _this.Topics = data;
        }, function (err) { return console.error(err); }, function () { return console.log('done loading topics'); });
    };
    TopicsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'topics',
            templateUrl: 'topics.component.html',
            styleUrls: ['topics.component.css'],
            providers: [http_1.JSONP_PROVIDERS, index_1.TopicsService],
            pipes: [topic_count_pipe_1.TopicCountPipe]
        }), 
        __metadata('design:paramtypes', [index_1.TopicsService, router_1.Router])
    ], TopicsComponent);
    return TopicsComponent;
})();
exports.TopicsComponent = TopicsComponent;
//# sourceMappingURL=topics.component.js.map