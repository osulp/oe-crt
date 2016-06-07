import {Injectable} from '@angular/core';
import {Indicator} from '../../data_models/indicator.model';
import {Subject}    from 'rxjs/Subject';
import {ReplaySubject}    from 'rxjs/Rx';
import {IndicatorsService} from '../../services/indicators/indicators.service';

let initialState: Indicator[] = [];

@Injectable()
export class SelectedIndicatorsService {
    selectionChanged$: ReplaySubject<any[]> = new ReplaySubject(1);
    updates: Subject<any> = new Subject<any>();
    loadIndicators: Subject<any> = new Subject<any>();
    //toggleIndicator: Subject<[Indicator, boolean]> = new Subject<[Indicator, boolean]>();
    toggleIndicator: Subject<any> = new Subject<any>();
    removeIndicator: Subject<any> = new Subject<any>();
    getAll: Subject<any> = new Subject<any>();

    constructor(private _indicatorService: IndicatorsService) {
        this.updates
            .scan((accumulator: Object[], operation: Function) => {
                return operation(accumulator);
            }, initialState)
            .subscribe(this.selectionChanged$);

        this.loadIndicators
            .map((indicators: any) => {
                return (state: Indicator[]) => { return indicators; };
            })
            .subscribe(this.updates);

        this.toggleIndicator
            .map((indicator: any) => {
                return (Indicators: Indicator[]) => {
                    if (indicator[1]) {
                        indicator[0].selected = indicator[1];
                    } else {
                        indicator[0].toggleSelected();
                    }
                    console.log(Indicators);
                    const i = Indicators.indexOf(indicator[0]);
                    Indicators = [
                        ...Indicators.slice(0, i),
                        indicator[0],
                        ...Indicators.slice(i + 1)
                    ];
                    console.log(Indicators);
                    return Indicators;
                };
            })
            .subscribe(this.updates);
    }

    load() {
        this._indicatorService.getIndicators().subscribe(
            (data: any) => {
                //initialState = data;
                //console.log('roasted testes');
                console.log(data);
                this.loadIndicators.next(data);
            },
            (err: any) => console.error(err),
            () => console.log('done loading indicators'));
    }

    toggle(indicator: Indicator, value?: boolean) {
        this.toggleIndicator.next([indicator, value]);
    }
}





