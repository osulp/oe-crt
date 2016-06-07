import {Component, OnInit}        from '@angular/core';
import {JSONP_PROVIDERS}  from '@angular/http';
import {Observable}       from 'rxjs/Observable';
import {TopicsService} from '../../../shared/services/index';
import 'rxjs/add/operator/map';

@Component({
    moduleId: module.id,
    selector: 'topics',
    templateUrl: 'topics.component.html',
    styleUrls: ['topics.component.css'],
    providers: [JSONP_PROVIDERS, TopicsService]
})



export class TopicsCmp implements OnInit {
    public Topics: any;
    constructor(private _topicService: TopicsService) { }

    items: Observable<string[]>;

    search(term: string) {
        //this._topicService.search(term).then(items => this.items = items);  
        this._topicService.getCRTTopics().subscribe(
            (data: any) => {
                console.log(data);
                this.Topics = data;
            },
            (err: any) => console.error(err),
            () => console.log('done loading topics'));
        //this.items = this._topicService.getTopics();
    }

    ngOnInit() {
        this.search('');
    }
}

