import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'TableDataFilterPipe'
})

export class TableDataFilterPipe implements PipeTransform {
    transform(years: any, data: any): any {
        if (years && data) {
            years = years.filter((year: any) => {
                return data[0][year.Year];
            });
        }
        return years;
    }
}

