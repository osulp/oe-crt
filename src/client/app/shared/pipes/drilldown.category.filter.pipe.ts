import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'drilldownCategoryFilterPipe'
})

export class DrilldownCategoryFilterPipe implements PipeTransform {
    transform(drilldowns: any[], category:any): any {
        console.log('waggy', drilldowns, category);
        if (drilldowns.length > 0) {
            return drilldowns.filter((dd: any) => {
                return category !== 'All' ? dd.category === category || dd.category === 'Total' : true;
            });
        } else {
            return [];
        }
    }
}


