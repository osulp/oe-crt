import { Component, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { ShareLinkComponent } from '../index';

@Component({
  moduleId: module.id,
  selector: 'indicator-title',
  templateUrl: 'indicator.title.component.html',
  styleUrls: ['indicator.title.component.css'],
  directives: [ShareLinkComponent],
})


export class IndicatorTitleComponent implements OnChanges {
  @Input() indicatorData: any;
  @Input() isStatewide: boolean;
  @Input() isMobile: boolean;
  @Input() isCountyLevel: boolean;
  @Input() showShare: boolean;
  @Output() drillDownOutput = new EventEmitter();
  @Output() indicatorChange = new EventEmitter();
  @Output() onDownloadClick = new EventEmitter();
  @ViewChild(ShareLinkComponent) shareComp: ShareLinkComponent;
  //@Input() drillDownIndicators: any;
  indicatorTitle: string;
  subTitle: string;
  hasDrilldowns: boolean;
  drillDownType: string;
  ddRemoveText: string;
  ddBaseIndicator: string;
  drillDowns: any[];
  drillDownCategories: any[] = [];

  constructor() {
    console.log('indicator title created');
   }

  getDDRemoveText(drillDowns: any[]) {
    //////////////////////
    // Function to find similiar words to remove for drilldown series name display
    // Compares the drill down categories against each other and keeps the words that are the same in the  same order
    /////////////////////
    var removeText = '';
    var prevArray: any[] = [],
      curArray: any[] = [];
    drillDowns.forEach((dd: any) => {
      curArray = dd['Indicator'].split(' ');

      console.log('prague 2019', curArray);
      let removeTextArray: any[] = removeText.split(' ');
      if (prevArray.length !== 0) {
        for (var x = 0; x < prevArray.length; x++) {
          console.log('removeCandidate', prevArray[x]);
          if (prevArray[x] === curArray[x]
            && removeTextArray[x] !== prevArray[x]
            && removeText.indexOf(prevArray[x]) === -1
          ) {
            removeText += prevArray[x] + ' ';
          } else {
            removeText = removeText;
          }
        }
      } else {
        prevArray = curArray;
      }
    });

    removeText = removeText.split(':')[0] + ':';
    console.log('frumpy removetext', removeText);
    return removeText;
  }

  onDDIndicatorChange(ddIndicator: any) {
    console.log('ddInidicator', ddIndicator);
    this.indicatorChange.emit(ddIndicator);
    //this.goToNewExplorePage(ddIndicator);
  }

  ngOnChanges(change: any) {
    console.log('title change!', change);
    if (change.indicatorData.currentValue) {
      this.createTitle();
    }
  }

  onShareDownloadClick(download: any) {
    this.onDownloadClick.emit(download);
  }

  createTitle() {
    console.log('creating title', this.indicatorData);
    let indicator_info = this.indicatorData.Desc[0];
    let drillDownIndicators = this.indicatorData.DrilldownIndicators;
    this.indicatorTitle = indicator_info.Dashboard_Chart_Title
      ? indicator_info.Dashboard_Chart_Title
      : indicator_info.Variable;

    this.subTitle = indicator_info.Dashboard_Chart_Y_Axis_Label ? indicator_info.Dashboard_Chart_Y_Axis_Label : '';

    if (drillDownIndicators) {
      this.hasDrilldowns = true;
      let ddTypeArr = drillDownIndicators.filter((dd: any) => dd.Sub_Sub_Topic !== 'Total');
      this.drillDownType = ddTypeArr[0].Sub_Sub_Topic ? ddTypeArr[0].Sub_Sub_Topic : '';
      this.ddRemoveText = this.getDDRemoveText(drillDownIndicators);
      this.ddBaseIndicator = this.indicatorTitle.split(':')[0] + ':';

      this.drillDowns = drillDownIndicators.map((dd: any) => {
        console.log('corpus loop', dd, this.indicatorTitle);
        let returnVal = dd.Indicator;
        //let colonSeparator = this.indicatorDesc.ddRemoveText.indexOf(':') !== -1;
        if (dd.Indicator.split(':').length > 1) {
          returnVal = dd.Indicator.split(':')[1];
        } else {
          this.ddRemoveText.split(' ').forEach((removeText: string) => {
            returnVal = returnVal.replace(removeText, '');
          });
        }

        return {
          'ddDisplay': returnVal,
          'indicator': dd.Indicator,
          'variable': dd.Variable,
          'selected': dd.Indicator === this.indicatorTitle ? 'selected' : null,
          'category': drillDownIndicators.filter((di: any) => di.Sub_Sub_Topic === dd.Sub_Sub_Topic).length > 1 || dd.Sub_Sub_Topic === 'Total' ? dd.Sub_Sub_Topic : dd.Sub_Sub_Topic
        };
      })
        .sort((a: any, b: any) => {
          return a.category === 'Total'
            ? -1000
            : b.category === 'Total'
              ? 1000
              : a.ddDisplay.localeCompare(b.ddDisplay);
        });
      //if only one type of drilldown type not including total, don't add 'All'
      let uniqueCats = this.drillDowns
        .map((dd: any) => dd.category)
        .filter((val: any, idx: number, self: any) => self.indexOf(val) === idx && val !== 'Total');
      if (uniqueCats.length > 1) {
        this.drillDownCategories.push({
          'category': 'All',
          'selected': true
        });
      }
      uniqueCats.forEach((ddCat: any) => {
        this.drillDownCategories.push({
          'category': ddCat,
          'selected': uniqueCats.length === 1 ? true : false
        });
      });
      //this.drillDownCategories.sort();
      this.drillDownCategories.sort((a: any, b: any) => {
        return a.category.localeCompare(b.category);
      });
      this.drillDownOutput.emit({
        drillDowns: this.drillDowns,
        drillDownCategories: this.drillDownCategories
      });
    }
  }
}
