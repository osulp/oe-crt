var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var table_data_filter_pipe_1 = require('./table.data.filter.pipe');
var TableViewComponent = (function () {
    function TableViewComponent() {
        this.tableYears = [];
        this.tableCategories = [];
        this.isCustomTable = false;
        this.isTextDataTable = false;
        this.customYear = '';
        this.customPlace = '';
        this.showMoes = true;
        this.selectedPlaces = [];
        this.hasDataSuppressed = false;
    }
    TableViewComponent.prototype.getDataValue = function (data) {
        console.log(data);
        return data;
    };
    TableViewComponent.prototype.processData = function () {
        var _this = this;
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
            for (var place in this.chartData.data.place_data_years) {
                console.log('place in table data', place);
                if (place.replace(' County', '').trim() === this.customPlace.Name.replace(' County', '').trim()) {
                    var placeData = this.chartData.data.place_data_years[place];
                    this.tableCategories = placeData.categories;
                    placeData.categories.forEach(function (cat, idx) {
                        if (Array.isArray(placeData.data)) {
                            console.log('is array', placeData.data, _this.customYear, placeData.data[_this.customYear]);
                            var placeYearData = placeData.data;
                            if (placeYearData[_this.customYear] && $.isNumeric(_this.tableMetadata.CustomChart.indexOf('211') !== -1
                                || _this.tableMetadata.CustomChart.indexOf('NAICS') !== -1
                                ? placeYearData[_this.customYear].data[idx].y
                                : placeYearData[_this.customYear].data[idx])) {
                                var td = {
                                    category: cat,
                                    data: _this.tableMetadata.CustomChart.indexOf('211') !== -1 ||
                                        _this.tableMetadata.CustomChart.indexOf('NAICS') !== -1
                                        ? _this.formatValue(Math.abs(placeYearData[_this.customYear].data[idx].y))
                                        : _this.formatValue(Math.abs(placeYearData[_this.customYear].data[idx])),
                                    data_moe: _this.customYear.indexOf('-') !== -1
                                        ? placeYearData[_this.customYear].data_moe[idx]
                                        : ''
                                };
                                console.log('twitter', td);
                                _this.tableData.push(td);
                            }
                        }
                        else {
                            console.log('not array', placeData.data);
                            for (var placeCat in placeData.data) {
                                var placeYearData = placeData.data[placeCat];
                                if (placeYearData[_this.customYear] && $.isNumeric(placeYearData[_this.customYear].data[idx])) {
                                    var td = {
                                        category: placeCat + ' ' + cat,
                                        data: _this.formatValue(Math.abs(placeYearData[_this.customYear].data[idx])),
                                        data_moe: _this.customYear.indexOf('-') !== -1 && placeYearData[_this.customYear].data_moe[idx] ? _this.formatValue(placeYearData[_this.customYear].data_moe[idx]) : ''
                                    };
                                    _this.tableData.push(td);
                                }
                            }
                        }
                    });
                }
            }
        }
        else {
            if (this.chartData.data.Data) {
                this.tableData = this.chartData.data.Data.map(function (data) {
                    var formattedData = {};
                    for (var attr in data) {
                        if (['community', 'Name'].indexOf(attr) !== -1) {
                            formattedData[attr] = data[attr] === 'Statewide' ? 'Oregon' : data[attr];
                        }
                        else {
                            if (!isNaN(parseInt(attr.substring(0, 1)))) {
                                if (_this.chartData.data.Metadata[0].Variable_Represent.trim() === 'Text') {
                                    formattedData[attr] = data[attr];
                                }
                                else if ($.isNumeric(data[attr])) {
                                    formattedData[attr] = _this.formatValue(data[attr]);
                                }
                                else {
                                    _this.hasDataSuppressed = data[attr] === '//' ? true : _this.hasDataSuppressed;
                                    formattedData[attr] = data[attr];
                                }
                            }
                            else {
                                formattedData[attr] = data[attr];
                            }
                        }
                    }
                    return formattedData;
                });
                this.tableYears = this.chartData.data.Years;
            }
            else if (this.chartData.data.place_data) {
                this.isTextDataTable = true;
                this.selectedPlaces = this.chartData.data.place_data
                    .filter(function (data) { return data.selected; });
                var formattedData = [];
                this.selectedPlaces.forEach(function (sp, idx) {
                    if (idx === 0) {
                        formattedData.push(sp.year);
                    }
                    formattedData.push(sp.value);
                });
                this.tableData = formattedData;
                console.log('snow!', this.tableData, this.chartData.data.place_data_years);
            }
        }
    };
    TableViewComponent.prototype.formatValue = function (val) {
        var numberVal = +val;
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
    };
    TableViewComponent.prototype.formatAbvNumbers = function (val, isLegend, numDecimals) {
        return (val > 999999999 ? (this.addCommas((val / 1000000000).toFixed(isLegend ? (val / 1000000000) < 10 ? 1 : 0 : numDecimals)) + 'bn') : val > 999999 ? (this.addCommas((val / 1000000).toFixed(isLegend ? (val / 1000000) < 10 ? 1 : 0 : numDecimals)) + 'mil') : val > 999 ? (this.addCommas((val / 1000).toFixed(isLegend ? (val / 1000) < 10 ? 1 : 0 : numDecimals)) + 'k') : val);
    };
    TableViewComponent.prototype.addCommas = function (nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    };
    TableViewComponent.prototype.toCamelCase = function (str) {
        return str !== null ? str.replace(/([^\W_]+[^\s-]*) */g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : null;
    };
    TableViewComponent.prototype.ngOnChanges = function (changes) {
        console.log('Change detected in table view:', changes);
        console.log(changes['chartData'].currentValue);
        console.log(this.tableData);
        this.chartData = changes['chartData'].currentValue;
        if (this.chartData.data !== undefined) {
            this.processData();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TableViewComponent.prototype, "chartData", void 0);
    TableViewComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'table-view',
            templateUrl: 'table.view.component.html',
            pipes: [table_data_filter_pipe_1.TableDataFilterPipe],
            styleUrls: ['table.view.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], TableViewComponent);
    return TableViewComponent;
})();
exports.TableViewComponent = TableViewComponent;
//# sourceMappingURL=table.view.component.js.map