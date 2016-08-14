import {Pipe, PipeTransform} from '@angular/core';
import {Topic} from '../../../shared/data_models/index';

@Pipe({
    name: 'TableDataFilterPipe'
})

export class TableDataFilterPipe implements PipeTransform {
    transform(years: any, data: any): any {
        if (years) {
            years = years.filter((year: any) => {
                return data[0][year.Year];
            });
        }
        return years;
    }
}

