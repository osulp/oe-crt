import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'indicator-footer',
  templateUrl: 'indicator.footer.component.html',
  styleUrls: ['indicator.footer.component.css']
})


export class IndicatorFooterComponent {
  @Input() indicatorDesc: any;
  @Input() showCitation:boolean = true;
  indInfo: string = 'desc';

  constructor() {
    console.log('indicator-footer created');
  }

}
