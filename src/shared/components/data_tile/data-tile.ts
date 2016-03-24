import {Component, OnInit, Input} from 'angular2/core';
import {Indicator} from '../../data_models/Indicator';


@Component({
    selector: 'data-tile',
    templateUrl: './shared/components/data_tile/data-tile.html',
    styleUrls: ['../shared/components/data_tile/data-tile.css']

})

export class DataTileCmp implements OnInit {
    @Input() indicator: Indicator;
    @Input() places: any;
    @Input() tileType: any;

    ngOnInit() {
        //check input topics set all topics to all
        console.log('Data cmp: Topics Input ' + this.indicator);
    }
    ngOnChanges(inputs: any) {
        console.log('TILE INFO CHANGED:  ' + inputs);
        console.log(inputs.indicator);
    }
}


