import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'IndicatorScrollCountPipe'
})

export class IndicatorScrollCountPipe implements PipeTransform {
    transform(indicators: any[], scrollCount: number): any {
        console.log('scrollcount', scrollCount);
        if (indicators !== undefined) {
            return indicators.slice(0, scrollCount);
        }
    }
}

