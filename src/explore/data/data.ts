import {Component, OnInit, Input} from 'angular2/core';
import {Topic} from '../../shared/data_models/topic';
import {Indicator} from '../../shared/data_models/Indicator';
import {DataTileCmp} from '../../shared/components/data_tile/data-tile';
import {SelectedTopicsPipe} from '../topics/pipes/selected-topic-pipe';
import {SelectedIndicatorByTopicsPipe} from '../topics/pipes/selected-indicator-topic-pipe';


@Component({
    selector: 'data',
    templateUrl: './explore/data/data.html',
    styleUrls: ['./explore/data/data.css'],
    directives: [DataTileCmp],
    pipes: [SelectedTopicsPipe, SelectedIndicatorByTopicsPipe]
})

export class DataCmp implements OnInit {
    @Input() inputTopics: Topic[];
    @Input() inputIndicators: Indicator[];
    @Input() inputPlaces: any;

    ngOnInit() {
        //check input topics set all topics to all
        console.log('Data cmp: Topics Input ' + this.inputTopics);
    }
    //ngOnChanges(changedStuff: any) {
    //    //console.log('SOMETHING CHANGED:  ' + changedStuff);
    //    //console.log(changedStuff);
    //}
}


