import {Component, OnInit, Input} from 'angular2/core';
import {Topic} from '../../shared/data_models/topic';
import {Indicator} from '../../shared/data_models/Indicator';
import {DataTileCmp} from '../../shared/components/data_tile/data-tile';
import {DetailCmp} from '../indicator_detail/indicator_detail';
import {SelectedTopicsPipe} from '../topics/pipes/selected-topic-pipe';
import {SelectedIndicatorByTopicsPipe} from '../topics/pipes/selected-indicator-topic-pipe';


@Component({
    selector: 'data',
    templateUrl: './explore/data/data.html',
    styleUrls: ['./explore/data/data.css'],
    directives: [DataTileCmp, DetailCmp],
    pipes: [SelectedTopicsPipe, SelectedIndicatorByTopicsPipe]
})

export class DataCmp implements OnInit {
    @Input() inputTopics: Topic[];
    @Input() inputIndicators: Indicator[];
    resultView: string;


    toggleResultView() {
        console.log('resultview clicked');
        console.log(this.resultView);
        this.resultView = this.resultView === 'graph' ? 'map' : 'graph';
    }

    ngOnInit() {
        //check input topics set all topics to all
        this.resultView = 'graph';
        console.log('Data cmp: Topics Input ' + this.inputTopics);
        //console.log('Data cmp: Places Input ' + this.inputPlaces);
    }
}


