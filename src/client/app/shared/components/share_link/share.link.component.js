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
require('rxjs/Rx');
var ShareLinkComponent = (function () {
    function ShareLinkComponent() {
        this.onDownloadClick = new core_1.EventEmitter();
        this.showShare = false;
        this.isMobile = $(window).width() < 770;
        this.fileName = '';
        this.downloadUri = '';
        this.url_api_key = 'AIzaSyDwjtLPJ9fvJ1dhAtguCCKijs-ZIEe1aX8';
    }
    ShareLinkComponent.prototype.print = function () {
        console.log('print?', window);
        window.print();
    };
    ShareLinkComponent.prototype.shareHandler = function (shareType) {
        if (shareType === 'copy') {
            var url = window.location.href;
            this.copyTextToClipboard(url);
        }
        else {
            var shareScope = this;
            $.ajax({
                url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + this.url_api_key,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: '{ longUrl: "' + window.location.href + '"}',
                success: function (response) {
                    console.log('url shortened!', response);
                    shareScope.processShareRequest(shareType, response.id);
                },
                error: function (err) {
                    console.log('failed to get short url');
                    shareScope.processShareRequest(shareType);
                }
            });
        }
    };
    ShareLinkComponent.prototype.processShareRequest = function (shareType, url) {
        url = url ? url : encodeURI(window.location.href);
        switch (shareType) {
            case 'email':
                var body = encodeURIComponent('Check out this tool!\r\n\r\n' + url);
                window.location.href = 'mailto:?Subject=Communities Reporter Tool!&body=' + body;
                break;
            case 'facebook':
                window.open('http://www.facebook.com/sharer.php?u=' + encodeURI(window.location.href), '_blank');
                break;
            case 'google':
                window.open('https://plus.google.com/share?url=' + url, '_blank');
                break;
            case 'linkedin':
                window.open('http://www.linkedin.com/shareArticle?mini=true&amp;url=' + url, '_blank');
                break;
            case 'twitter':
                window.open('https://twitter.com/share?url=' + url + ';text=Communities%20Reporter%20Tool&amp;hashtags=communitiesreportertool', '_blank');
                break;
            case 'pinterest':
                var e = document.createElement('script');
                e.setAttribute('type', 'text/javascript');
                e.setAttribute('charset', 'UTF-8');
                e.setAttribute('src', 'http://assets.pinterest.com/js/pinmarklet.js?r=' + Math.random() * 99999999);
                document.body.appendChild(e);
                break;
            default:
                break;
        }
    };
    ShareLinkComponent.prototype.downloadClickHandler = function () {
        console.log('download click,share');
        toastr['info']('Pulling data for download.', 'Please wait...');
        this.onDownloadClick.emit(true);
    };
    ShareLinkComponent.prototype.ConvertToCSV = function (objArray, years, batch, isLast) {
        var _this = this;
        console.log('data to convert to csv', objArray);
        var data = objArray.Data;
        var Metadata = objArray.Metadata;
        var reportYears = objArray.Years.map(function (year) { return year.Year; });
        var str = '';
        var row = '';
        var line = '';
        var counter = 0;
        var columns;
        var colsToKeep = ['community', 'Variable', 'geoid', 'geoType'];
        str += Metadata[0].Dashboard_Chart_Title !== null ? Metadata[0].Dashboard_Chart_Title : Metadata[0].Variable;
        str += '\r\n';
        str += Metadata[0]['Y-Axis'] !== null ? Metadata[0]['Y-Axis'].replace('$', 'Dollars ') + '\r\n' : '';
        str += Metadata[0].Description_v4 !== null ? Metadata[0].Description_v4.replace(/\<br\/>/g, '') + '\r\n' : '';
        str += Metadata[0].Formula !== null ? Metadata[0].Formula : '';
        str += '\r\r\n';
        console.log('data to convert to csv', reportYears, years);
        if (data.length > 0) {
            data.some(function (row) {
                console.log('data row', row, Object.keys(row));
                columns = Object.keys(row)
                    .sort(_this.sortAlphaNumeric)
                    .filter(function (colsA) {
                    if (reportYears.length > 0) {
                        return reportYears.indexOf(colsA
                            .replace('_MOE', '')
                            .replace('_D', '')
                            .replace('_N', '')
                            .replace('_MOE_D', '')
                            .replace('_MOE_N', '')) !== -1 || colsToKeep.indexOf(colsA) !== -1;
                    }
                    else {
                        return true;
                    }
                })
                    .filter(function (colsB) {
                    if (years.length > 0) {
                        return years.indexOf(colsB
                            .replace('_MOE', '')
                            .replace('_D', '')
                            .replace('_N', '')
                            .replace('_MOE_D', '')
                            .replace('_MOE_N', '')) !== -1 || colsToKeep.indexOf(colsB) !== -1;
                    }
                    else {
                        return true;
                    }
                });
                return counter === 0;
            });
            columns.forEach(function (column) {
                row += (column === 'Variable' ? 'indicator' : column) + ',';
            });
            row = row.slice(0, -1);
            str += row + '\r\n';
            data.forEach(function (row) {
                line = '';
                columns.forEach(function (key) {
                    line += line !== '' ? ',' : '';
                    console.log('row key', row, key);
                    if (row[key]) {
                        var val = row[key].toString();
                        if (val !== null) {
                            if (val.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/)) {
                                var precision = _this.getPrecision(val);
                                val = parseFloat((+val).toFixed(precision));
                            }
                        }
                        line += val === null ? '' : val.indexOf(',') !== -1 ? '\"' + val + '\"' : val;
                    }
                });
                str += line + '\r\n';
            });
            var showDateTimeDownload = batch ? batch && isLast : true;
            if (showDateTimeDownload) {
                var currentDate = new Date();
                var day = currentDate.getDate();
                var month = currentDate.getMonth() + 1;
                var year = currentDate.getFullYear();
                str += '\r\n\Downloaded from the Communities Reporter Tool on ' + month + '/' + day + '/' + year + '\r\n';
                str += window.location.href;
            }
            else {
                str += '\r\n';
                str += '*****************************************************************************************\r\n';
            }
            return str;
        }
        else {
            return '';
        }
    };
    ShareLinkComponent.prototype.getPrecision = function (sval) {
        var arr = new Array();
        arr = sval.split('e');
        arr = arr[0].split('.');
        var precision = arr[1].length;
        return parseInt(precision);
    };
    ShareLinkComponent.prototype.sortAlphaNumeric = function (a, b) {
        var aA = a.replace(/[^a-zA-Z]/g, '').replace('MOE', '');
        var bA = b.replace(/[^a-zA-Z]/g, '').replace('MOE', '');
        if (a === 'community') {
            return -1;
        }
        else if (aA === bA) {
            var aN = parseInt(a.replace(/[^0-9]/g, ''), 10);
            var bN = parseInt(b.replace(/[^0-9]/g, ''), 10);
            return aN === bN ? 0 : aN > bN ? 1 : -1;
        }
        else {
            return aA > bA ? -1 : 1;
        }
    };
    ShareLinkComponent.prototype.copyTextToClipboard = function (text) {
        var textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        }
        catch (err) {
            console.log('Oops, unable to copy');
        }
        document.body.removeChild(textArea);
    };
    ShareLinkComponent.prototype.download = function (JSONData, years, places, indicator, batch) {
        var placeNames = places.map(function (p) { return p.Name; }).toString().replace(/\,/g, '').replace(/\ /g, '');
        var csvData = batch ? JSONData : this.ConvertToCSV(JSONData, years);
        var filename = (batch ? 'CRTDownload' : indicator.replace(/\ /g, '')) + placeNames + '.csv';
        var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            var a = window.document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            toastr.clear();
            document.body.removeChild(a);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ShareLinkComponent.prototype, "renderTo", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ShareLinkComponent.prototype, "onDownloadClick", void 0);
    ShareLinkComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'share-link',
            templateUrl: 'share.link.component.html',
            styleUrls: ['share.link.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], ShareLinkComponent);
    return ShareLinkComponent;
})();
exports.ShareLinkComponent = ShareLinkComponent;
//# sourceMappingURL=share.link.component.js.map