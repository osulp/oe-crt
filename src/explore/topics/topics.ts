import {Component, OnInit}   from 'angular2/core';
import {JSONP_PROVIDERS}  from 'angular2/http';
import {Observable}       from 'rxjs/Observable';
import {Topic} from '../../shared/data_models/topic';
import {TopicsService} from '../../shared/services/topics/topics.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Component({
    selector: 'topics',
    templateUrl: './explore/topics/topics.html',
    styleUrls: ['./explore/topics/topics.css'],
    providers: [JSONP_PROVIDERS, TopicsService]
})



export class TopicsCmp implements OnInit {
    public Topics;
    visible: boolean;
    showAllSelected: boolean;
    selected: string[];

    constructor(public _topicService: TopicsService) {
        this.visible = true;
        this.showAllSelected = false;
    }

    topics: Observable<Array<Topic>>;

    getClass() {
        return this.visible ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    }

    toggleTopicsWrapper() {
        this.visible = !this.visible;
    }

    toggleAllTopics(evt) {
        this.showAllSelected = !this.showAllSelected;
        if (this.showAllSelected) {
            //turn off any other selected topics and set selected to all
            console.log('show all selected');
            this.Topics.forEach((topic) => {
                if (topic.selected) {
                    topic.toggleSelected();
                }
            });
        }
    }

    getTopics() {
        this._topicService.getTopics().subscribe(
            data => { this.Topics = data; },
            err => console.error(err),
            () => console.log('done loading topics'));
    }

    toggleTopic(topic: Topic) {
        //turn off all topics, if selected
        this.showAllSelected = false;
        topic.toggleSelected();
        const i = this.Topics.indexOf(topic);
        this.Topics = [
            ...this.Topics.slice(0, i),
            topic,
            ...this.Topics.slice(i + 1)
        ];
    }

    ngOnInit() {
        this.getTopics();
        this.selected = ['All Topics'];
    }
}

