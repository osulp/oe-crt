import {Component, OnInit}        from 'angular2/core';
import {JSONP_PROVIDERS}  from 'angular2/http';
import {Observable}       from 'rxjs/Observable';
import {TopicsService} from '../../../shared/services/topics/topics.service';
import 'rxjs/add/operator/map';

@Component({
    selector: 'topics',
    templateUrl: './home/find/topics/topics.html',
    styleUrls: ['./home/find/topics/topics.css'],
    providers: [JSONP_PROVIDERS, TopicsService]
})



export class TopicsCmp implements OnInit {
    public Topics;
    constructor(private _topicService: TopicsService) { }

    items: Observable<string[]>;

    search(term: string) {
        //this._topicService.search(term).then(items => this.items = items);  
        this._topicService.getTopics().subscribe(
            data => { this.Topics = data; },
            err => console.error(err),
            () => console.log('done loading topics'));
        //this.items = this._topicService.getTopics();
    }

    ngOnInit() {
        this.search('');
    }
}

