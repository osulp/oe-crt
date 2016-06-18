import {Component, OnInit}  from '@angular/core';
import {JSONP_PROVIDERS}  from '@angular/http';
import {Router} from '@angular/router';
import {Observable}       from 'rxjs/Observable';
import {TopicsService} from '../../../shared/services/topics/topics.service';
import {TopicCountPipe} from './topic.count.pipe';
import 'rxjs/add/operator/map';

@Component({
    moduleId: module.id,
    selector: 'topics',
    templateUrl: 'topics.component.html',
    styleUrls: ['topics.component.css'],
    providers: [JSONP_PROVIDERS, TopicsService],
    pipes: [TopicCountPipe]
})



export class TopicsComponent implements OnInit {
    public Topics: any = [];
    maxCount: number = 8;
    items: Observable<string[]>;

    constructor(private _topicService: TopicsService, private _router: Router) { }

    gotoTopic(topic: any) {
        console.log('topic clicked', topic);
        let targetUrl = topic === 'all' ? '/Explore' : '/Explore;topics=' + encodeURI(topic.topic.replace('&','%26'));
        console.log('target url', targetUrl);
        this._router.navigateByUrl(targetUrl);
        //window.history.pushState({ url: targetUrl}, 'Explore', targetUrl);
        //if (topic === 'all') {
        //    //window.location('/Explore');
        //    this._router.navigateByUrl(targetUrl);
        //} else {
        //    //window.location('/Explore?topics=' + encodeURI(topic.topic));
        //    this._router.navigateByUrl('/Explore?topics=' + encodeURI(topic.topic));
        //}
    }

    ngOnInit() {
        this._topicService.getCRTTopics().subscribe(
            (data: any) => {
                console.log('Home page topic service response:', data);
                this.Topics = data;
            },
            (err: any) => console.error(err),
            () => console.log('done loading topics'));
    }
}

