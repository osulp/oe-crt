import {Component, OnInit, Input} from '@angular/core';
import {Topic,Indicator} from '../../shared/data_models/index';
import {DataTileComponent, IndicatorsTopicListComponent} from '../../shared/components/index';
import {DetailComponent} from '../indicator_detail/indicator.detail.component';
import {SelectedTopicsPipe, SelectedIndicatorByTopicsPipe} from '../topics/pipes/index';

@Component({
    moduleId: module.id,
    selector: 'data',
    templateUrl: 'data.wrapper.component.html',
    styleUrls: ['data.wrapper.component.css'],
    directives: [DataTileComponent, DetailComponent, IndicatorsTopicListComponent],
    //providers: [SelectedIndicatorsService],
    pipes: [SelectedTopicsPipe, SelectedIndicatorByTopicsPipe]
})

export class DataComponent implements OnInit {
    @Input() inputTopics: Topic[];
    @Input() inputIndicators: Indicator[];
    //inputIndicators: Indicator[];
    resultView: string;
    //private subscription: Subscription;    

    toggleResultView() {
        console.log('resultview clicked');
        console.log(this.resultView);
        this.resultView = this.resultView === 'graph' ? 'map' : 'graph';
    }

    onFilterIndicator(Indicators: Indicator[]) {
        console.log(Indicators);
        this.inputIndicators = Indicators;
    }

    ngOnInit() {
        //check input topics set all topics to all
        this.resultView = 'graph';
        console.log('Data Component: Topics Input ' + this.inputTopics);
        //this.subscription = this._selectedIndicatorsService.selectionChanged$.subscribe(
        //    data => {
        //        this.inputIndicators = data;
        //    },
        //    err => console.error(err),
        //    () => console.log('done with subscribe event indicators')
        //);
        //this._selectedIndicatorsService.load();

        //console.log('Data Component: Places Input ' + this.inputPlaces);
    }
}


