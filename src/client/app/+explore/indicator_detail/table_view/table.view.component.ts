import {Component, Input, OnChanges} from '@angular/core';
import {TableDataFilterPipe} from './table.data.filter.pipe';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'table-view',
    templateUrl: 'table.view.component.html',
    pipes: [TableDataFilterPipe],
    styleUrls: ['table.view.component.css']
})

export class TableViewComponent implements OnChanges {
    @Input() chartData: any;
    tableData: any;
    tableYears: any[] = [];
    tableMetadata: any;
    tableCategories: any[] = [];
    isCustomTable: boolean = false;
    isTextDataTable: boolean = false;
    customYear: any = '';
    customPlace: any = '';
    showMoes: boolean = true;
    selectedPlaces: any[] = [];
    hasDataSuppressed: boolean = false;

    getDataValue(data: any) {
        console.log(data);
        return data;
    }

    processData() {
        console.log('processing table view', this.chartData);
        this.isCustomTable = this.chartData.customYear !== undefined;
        this.tableMetadata = this.chartData.metadata;
        this.tableCategories = [];
        if (this.isCustomTable) {
            this.showMoes = this.chartData.metadata.CustomChart !== 'PropOwnByAgeEstimate'
                && this.chartData.metadata.CustomChart !== 'PropOwnByAge'
                && this.chartData.metadata.CustomChart !== 'NAICS_Farms';
            this.customYear = this.chartData.customYear;
            this.customPlace = this.chartData.customPlace;
            this.tableData = [];

            for (let place in this.chartData.data.place_data_years) {
                console.log('place in table data', place);
                if (place.replace(' County', '').trim() === this.customPlace.Name.replace(' County', '').trim()) {
                    var placeData = this.chartData.data.place_data_years[place];
                    this.tableCategories = placeData.categories;
                    placeData.categories.forEach((cat: any, idx: number) => {
                        if (Array.isArray(placeData.data)) {
                            console.log('is array', placeData.data, this.customYear, placeData.data[this.customYear]);
                            var placeYearData = placeData.data;
                            if (placeYearData[this.customYear] && $.isNumeric(this.tableMetadata.CustomChart.indexOf('211') !== -1
                                || this.tableMetadata.CustomChart.indexOf('NAICS') !== -1
                                ? placeYearData[this.customYear].data[idx].y
                                : placeYearData[this.customYear].data[idx])) {
                                let td: any = {
                                    category: cat,
                                    data: this.tableMetadata.CustomChart.indexOf('211') !== -1 ||
                                        this.tableMetadata.CustomChart.indexOf('NAICS') !== -1
                                        ? this.formatValue(Math.abs(placeYearData[this.customYear].data[idx].y))
                                        : this.formatValue(Math.abs(placeYearData[this.customYear].data[idx])),
                                    data_moe: this.customYear.indexOf('-') !== -1
                                        ? placeYearData[this.customYear].data_moe[idx]
                                        : ''
                                };
                                console.log('twitter', td);
                                this.tableData.push(td);
                            }
                        } else {
                            console.log('not array', placeData.data);
                            for (let placeCat in placeData.data) {
                                //console.log('placeCat', placeCat, placeData.data);
                                var placeYearData = placeData.data[placeCat];
                                if (placeYearData[this.customYear] && $.isNumeric(placeYearData[this.customYear].data[idx])) {
                                    let td: any = {
                                        category: placeCat + ' ' + cat,
                                        data: this.formatValue(Math.abs(placeYearData[this.customYear].data[idx])),
                                        data_moe: this.customYear.indexOf('-') !== -1 && placeYearData[this.customYear].data_moe[idx] ? this.formatValue(placeYearData[this.customYear].data_moe[idx]) : ''
                                    };
                                    this.tableData.push(td);
                                }
                            }
                        }
                    });
                }
            }

            //console.log('custom table data!', this.tableData, this.tableCategories);
            //this.tableYears = this.chartData.data.Years;
        } else {

            //console.log('formatting table', this.chartData);
            if (this.chartData.data.Data) {
                this.tableData = this.chartData.data.Data.map((data: any) => {
                    let formattedData: any = {};
                    for (var attr in data) {
                        if (['community', 'Name'].indexOf(attr) !== -1) {
                            formattedData[attr] = data[attr] === 'Statewide' ? 'Oregon' : data[attr];
                        } else {
                            //console.log('formatting table year', attr, data['community']);
                            if (!isNaN(parseInt(attr.substring(0, 1)))) {
                                //console.log('formatting table year', attr, data['community']);
                                if (this.chartData.data.Metadata[0].Variable_Represent.trim() === 'Text') {
                                    formattedData[attr] = data[attr];
                                } else if ($.isNumeric(data[attr])) {
                                    formattedData[attr] = this.formatValue(data[attr]);
                                } else {
                                    this.hasDataSuppressed = data[attr] === '//' ? true : this.hasDataSuppressed;
                                    formattedData[attr] = data[attr];
                                }
                            } else {
                                formattedData[attr] = data[attr];
                            }
                        }
                    }
                    return formattedData;
                });
                this.tableYears = this.chartData.data.Years;
            } else if (this.chartData.data.place_data) {

                this.isTextDataTable = true;
                //is map only data for text content display
                this.selectedPlaces = this.chartData.data.place_data
                    .filter((data: any) => data.selected);

                //this.tableData = this.chartData.data.place_data_years;
                //this.tableData = selectedPlaces;

                let formattedData: any = [];
                this.selectedPlaces.forEach((sp: any, idx: number) => {
                    if (idx === 0) {
                        formattedData.push(sp.year);
                    }
                    formattedData.push(sp.value);
                });

                this.tableData = formattedData;
                //    .map((data: any) => {
                //    let formattedData: any = {};
                //    for (var attr in data) {
                //        formattedData[attr] = da
                //        if (attr === 'name') {
                //            formattedData[attr] = data[attr];
                //        }
                //        if (attr === 'value') {
                //            formattedData[attr] = data[attr];
                //        }
                //    }
                //});
                console.log('snow!', this.tableData, this.chartData.data.place_data_years);
            }
        }
    }

    formatValue(val: any) {
        var numberVal = +val;
        //console.log('formatting number val', numberVal, numberVal.toString(), this.tableMetadata.Variable_Represent.trim());
        val = numberVal.toString();
        var returnVal = val;
        switch (this.tableMetadata.Variable_Represent.trim()) {
            case '%':
                returnVal = Math.round(parseFloat(val) * 100) / 100 + '%';
                break;
            case '%1':
                returnVal = Math.round(parseFloat(val) * 10) / 10 + '%';
                break;
            case '%Tenth':
                returnVal = Math.round(parseFloat(val) * 10) / 10 + '%';
                break;
            case '0':
                returnVal = this.addCommas(Math.round(parseInt(val)).toString());
                break;
            case 'asIs':
                returnVal = this.addCommas(Math.round(parseInt(val)).toString());
                break;
            case '2':
                returnVal = this.addCommas((Math.round(parseFloat(val) * 100) / 100).toString());
                break;
            case '$':
                returnVal = '$' + this.formatAbvNumbers(val, false, 1);
                //addCommas(Math.round(parseFloat(val) * 10) / 10)
                break;
            case '$0':
                returnVal = '$' + this.formatAbvNumbers(val, false, 0);
                break;
            case '$Thousand':
                returnVal = '$' + this.formatAbvNumbers((val * 1000), false, 2);
                break;
            case '$Millions':
                returnVal = '$' + this.addCommas((Math.round(parseFloat(val)).toString())) + 'mil';
                break;
            case '$Bill2009':
                returnVal = '$' + Math.round(parseFloat(val) * 100) / 100 + 'bn';
                break;
            case '#Jobs':
                returnVal = val > 999 ? (val / 1000).toFixed(0) + 'k Jobs' : val;
                break;
            default:
                break;
        }
        console.log('return val check', returnVal);
        return returnVal;
    }

    formatAbvNumbers(val: any, isLegend: boolean, numDecimals: number) {
        return (val > 999999999 ? (this.addCommas((val / 1000000000).toFixed(isLegend ? (val / 1000000000) < 10 ? 1 : 0 : numDecimals)) + 'bn') : val > 999999 ? (this.addCommas((val / 1000000).toFixed(isLegend ? (val / 1000000) < 10 ? 1 : 0 : numDecimals)) + 'mil') : val > 999 ? (this.addCommas((val / 1000).toFixed(isLegend ? (val / 1000) < 10 ? 1 : 0 : numDecimals)) + 'k') : val);
    }

    addCommas(nStr: string) {
        nStr += '';
        let x = nStr.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    toCamelCase(str: string) {
        return str !== null ? str.replace(/([^\W_]+[^\s-]*) */g, function (txt: string) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : null;
    }

    ngOnChanges(changes: any) {// { [propName: string]: SimpleChange }) {
        //comes from
        console.log('Change detected in table view:', changes);
        console.log(changes['chartData'].currentValue);
        console.log(this.tableData);
        this.chartData = changes['chartData'].currentValue;
        if (this.chartData.data !== undefined) {
            this.processData();
        }
    }
}



