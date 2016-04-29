import {Component, OnInit, Input} from 'angular2/core';
import {Topic} from '../../shared/data_models/topic';
import {Indicator} from '../../shared/data_models/Indicator';
//import {Subscription}   from 'rxjs/Subscription';
import {DataTileCmp} from '../../shared/components/data_tile/data-tile';
import {DetailCmp} from '../indicator_detail/indicator_detail';
import {SelectedTopicsPipe} from '../topics/pipes/selected-topic-pipe';
import {SelectedIndicatorByTopicsPipe} from '../topics/pipes/selected-indicator-topic-pipe';
import {IndicatorsTopicList} from '../../shared/components/indicators/indicators_by_topic_list';
//import {SelectedIndicatorsService} from '../../shared/services/indicators/selected-indicators.service';


@Component({
    selector: 'data',
    templateUrl: './explore/data/data.html',
    styleUrls: ['./explore/data/data.css'],
    directives: [DataTileCmp, DetailCmp, IndicatorsTopicList],
    //providers: [SelectedIndicatorsService],
    pipes: [SelectedTopicsPipe, SelectedIndicatorByTopicsPipe]
})

export class DataCmp implements OnInit {
    @Input() inputTopics: Topic[];
    @Input() inputIndicators: Indicator[];
    //inputIndicators: Indicator[];
    resultView: string;
    //private subscription: Subscription;

    //constructor(private _selectedIndicatorsService: SelectedIndicatorsService) { }

    toggleResultView() {
        console.log('resultview clicked');
        console.log(this.resultView);
        this.resultView = this.resultView === 'graph' ? 'map' : 'graph';
    }

    onFilterIndicator(Indicators:Indicator[]) {
        console.log(Indicators);
        this.inputIndicators = Indicators;
    }

    ngOnInit() {
        //check input topics set all topics to all
        this.resultView = 'graph';
        console.log('Data cmp: Topics Input ' + this.inputTopics);
        //this.subscription = this._selectedIndicatorsService.selectionChanged$.subscribe(
        //    data => {
        //        this.inputIndicators = data;
        //    },
        //    err => console.error(err),
        //    () => console.log('done with subscribe event indicators')
        //);
        //this._selectedIndicatorsService.load();

        //console.log('Data cmp: Places Input ' + this.inputPlaces);
    }
}


