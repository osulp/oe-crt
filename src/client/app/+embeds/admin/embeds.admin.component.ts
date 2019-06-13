import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { JSONP_PROVIDERS } from '@angular/http';

import { IndicatorCollectionFilterPipe } from '../pipes/indicator.collection.filter.pipe';
import { Topic, Indicator } from './../../shared/data_models/index';
import { IndicatorsService } from './../../shared/services/index';


@Component({
  moduleId: module.id,
  selector: 'embeds-admin',
  templateUrl: 'embeds.admin.component.html',
  styleUrls: ['embeds.admin.component.css'],
  pipes: [IndicatorCollectionFilterPipe],
  providers: [JSONP_PROVIDERS, IndicatorsService]
})



export class EmbedsAdminComponent implements OnInit {
  @Output() selectedIndicatorFromCmp = new EventEmitter();
  @Output() selectedCollectionFromCmp = new EventEmitter();
  @Output() embedShowChangeEvt = new EventEmitter();
  @Output() embedDimensionsChangedEvt = new EventEmitter();
  @Output() embedGeoOptsChangedEvt = new EventEmitter();
  @Input() selectedIndicator: any;
  @Input() selectedCollection: any;
  @Input() embedWidth: string;
  @Input() embedHeight: string;
  @Input() embedCode: string;
  @Input() embedShowMap: boolean;
  @Input() embedShowChart: boolean;
  @Input() embedShowTitle: boolean;
  @Input() embedShowDesc: boolean;
  @Input() embedIncludeResponsive: boolean;
  @Input() embedGeoOpts: any;
  @Input() defaultGeo: any;
  @Input() collections: any;
  indicators: Indicator[];
  selTopics: Topic[] = [];
  selCollections: any[] = [];
  chkBoxVisibile: boolean = false;
  indicatorSortAlpha: boolean = true;
  showEmbedDemo: boolean = false;
  embedCodeElem: HTMLTextAreaElement;
  //public Indicators: Indicator[] = [];
  public _selectedIndicators: any;

  constructor(public _indicatorService: IndicatorsService) { }


  ngOnInit() {
    this._indicatorService.getIndicators()
      .subscribe((indicators: any) => {
        let inputIndicators = indicators.map((indicator: any) => {
          //let selected = this.selectedIndicator !== 'undefined' ? this.selectedIndicator === indicator.indicator : false;
          return {
            indicator: indicator.indicator,
            indicator_display: indicator.indicator_display,
            collections: indicator.collections,
            selected: this.selectedIndicator === indicator.indicator
          };
        }).sort((a: any, b: any) => {
          return a.indicator.localeCompare(b.indicator);
        });
        inputIndicators.unshift({ indicator: '<-- Please select an indicator -->', selected: !this.selectedIndicator });
        this.indicators = inputIndicators;
        console.log('indicators from embeds admin', inputIndicators);
      });
    //this.embedCodeElem.dispatchEvent(new Event('resize'));
    //$('#embed-code').css('overflow', 'hidden').autogrow();
  }



  onDDIndicatorChange(ddEmbedIndicator: any) {
    console.log('indicator changed!', ddEmbedIndicator);
    if (ddEmbedIndicator !== '<-- Please select an indicator -->') {
      this.selectedIndicatorFromCmp.emit(ddEmbedIndicator);
    }

  }

  onDDCollectionChange(ddEmbedCollection: any) {
    console.log('collection changed!', ddEmbedCollection);
    this.selectedCollection = ddEmbedCollection;
    this.selectedCollectionFromCmp.emit(ddEmbedCollection);
  }

  onCopyEmbedClick() {
    let copyText: any = document.getElementById('embedCodeElem');
    copyText.select();
    document.execCommand('copy');
    alert('"Copied the text: ' + copyText.value);

  }

  onDemoEmbedClick() {
    this.showEmbedDemo = true;
  }
  hideDemoEmbed() {
    console.log('Demo hide clicked');
    this.showEmbedDemo = false;
  }
  updateDimension(dimension: string, value: string) {
    this.embedDimensionsChangedEvt.emit({ 'dimension': dimension, 'value': value });
  }
  onShowChange(showType: string, value: boolean) {
    this.embedShowChangeEvt.emit({ 'showType': showType, 'value': value });
  }

  onGeoOptionChange(geo: any) {
    console.log('hrady!', geo);
    this.embedGeoOptsChangedEvt.emit(geo);
    //this.defaultGeo = geo;
  }
}



