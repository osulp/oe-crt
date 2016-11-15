import {Component, Input, Output, EventEmitter} from '@angular/core';
import 'rxjs/Rx';

declare var $: any;
declare var toastr: any;

@Component({
    moduleId: module.id,
    selector: 'share-link',
    templateUrl: 'share.link.component.html',
    styleUrls: ['share.link.component.css']
})


export class ShareLinkComponent {
    @Input() renderTo: any;//Coming from detail or explore
    @Output() onDownloadClick = new EventEmitter();
    showShare: boolean = false;
    isMobile: boolean = $(window).width() < 770;
    fileName: string = '';
    downloadUri: string = '';
    url_api_key: string = 'AIzaSyDwjtLPJ9fvJ1dhAtguCCKijs-ZIEe1aX8';

    print() {
        console.log('print?', window);
        window.print();
    }

    shareHandler(shareType: any) {
        //this._bitly.insertUrl(window.location.href).subscribe((result: any) => {
        //    console.log('shortened url!', result);
        //});
        var shareScope = this;
        $.ajax({
            url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + this.url_api_key,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: '{ longUrl: "' + window.location.href + '"}',
            success: function (response: any) {
                console.log('url shortened!', response);
                shareScope.processShareRequest(shareType, response.id);
            },
            error: function (err: any) {
                console.log('failed to get short url');
                shareScope.processShareRequest(shareType);
            }
        });
    }

    processShareRequest(shareType: any, url?: any) {
        url = url ? url : encodeURI(window.location.href);
        switch (shareType) {
            case 'email':
                let body = encodeURIComponent('Check out this tool!\r\n\r\n' + url);
                window.location.href = 'mailto:?Subject=Communities Reporter Tool!&body=' + body;
                break;
            case 'facebook':
                //$('meta[name=title]').attr('content', 'Just checking');
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
    }

    downloadClickHandler() {
        console.log('download click,share');
        toastr['info']('Pulling data for download.', 'Please wait...');
        this.onDownloadClick.emit(true);
    }

    ConvertToCSV(objArray: any, years: any[], batch?: boolean, isLast?: boolean) {
        console.log('data to convert to csv', objArray);
        var data = objArray.Data;
        var Metadata = objArray.Metadata;
        var reportYears = objArray.Years.map((year: any) => year.Year);
        var str = '';
        var row = '';
        var line = '';
        var counter = 0;
        var columns: any;
        var colsToKeep = ['community', 'Variable', 'geoid', 'geoType'];

        //Metadata for indicator
        str += Metadata[0].Dashboard_Chart_Title !== null ? Metadata[0].Dashboard_Chart_Title : Metadata[0].Variable;
        str += '\r\n';
        str += Metadata[0]['Y-Axis'] !== null ? Metadata[0]['Y-Axis'].replace('$', 'Dollars ') + '\r\n' : '';
        str += Metadata[0].Description_v4 !== null ? Metadata[0].Description_v4.replace(/\<br\/>/g, '') + '\r\n' : '';
        str += Metadata[0].Formula !== null ? Metadata[0].Formula : '';
        str += '\r\r\n';
        if (data.length > 0) {
            data.some((row: any) => {
                columns = Object.keys(row)
                    .sort(this.sortAlphaNumeric)
                    .filter((colsA: any) => {
                        if (reportYears.length > 0) {
                            return reportYears.indexOf(colsA.replace('_MOE', '')) !== -1 || colsToKeep.indexOf(colsA) !== -1;
                        } else {
                            return true;
                        }
                    })
                    .filter((colsB: any) => {
                        if (years.length > 0) {
                            return years.indexOf(colsB.replace('_MOE', '')) !== -1 || colsToKeep.indexOf(colsB) !== -1;
                        } else {
                            return true;
                        }
                    });
                return counter === 0;
            });
            columns.forEach((column: any) => {
                //table column headers
                row += (column === 'Variable' ? 'indicator' : column) + ',';
            });
            row = row.slice(0, -1);
            str += row + '\r\n';

            data.forEach((row: any) => {
                line = '';
                columns.forEach((key: any) => {
                    line += line !== '' ? ',' : '';
                    let val = row[key];
                    if (val !== null) {
                        if (val.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/)) {
                            let precision = this.getPrecision(val);
                            val = parseFloat((+val).toFixed(precision));
                        }
                    }
                    line += val === null ? '' : val.indexOf(',') !== -1 ? '\"' + val + '\"' : val;
                });
                str += line + '\r\n';
            });
            let showDateTimeDownload = batch ? batch && isLast : true;
            if (showDateTimeDownload) {
                var currentDate = new Date();
                var day = currentDate.getDate();
                var month = currentDate.getMonth() + 1;
                var year = currentDate.getFullYear();

                str += '\r\n\Downloaded from the Communities Reporter Tool on ' + month + '/' + day + '/' + year + '\r\n';
                str += window.location.href;
            } else {
                str += '\r\n';
                str += '*****************************************************************************************\r\n';
            }
            return str;
        } else {
            return '';
        }
    }




    getPrecision(sval: any) {
        var arr = new Array();
        // Get the exponent after 'e', make it absolute.
        arr = sval.split('e');
        arr = arr[0].split('.');
        var precision = arr[1].length;
        return parseInt(precision);
    }


    sortAlphaNumeric(a: any, b: any) {
        var aA = a.replace(/[^a-zA-Z]/g, '').replace('MOE', '');
        var bA = b.replace(/[^a-zA-Z]/g, '').replace('MOE', '');
        if (a === 'community') {
            return -1;
        } else if (aA === bA) {
            var aN = parseInt(a.replace(/[^0-9]/g, ''), 10);
            var bN = parseInt(b.replace(/[^0-9]/g, ''), 10);
            return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
            return aA > bA ? -1 : 1;
        }
    }


    download(JSONData: any, years: any, places: any[], indicator: string, batch?: boolean) {
        //console.log('data to convert to csv', JSONData, years, places);
        var placeNames = places.map((p: any) => p.Name).toString().replace(/\,/g, '').replace(/\ /g, '');
        var csvData = batch ? JSONData : this.ConvertToCSV(JSONData, years);
        //var a = document.createElement('a');
        //a.setAttribute('style', 'display:none;');
        //document.body.appendChild(a);
        //var blob = new Blob([csvData], { type: 'text/csv' });
        //var url = window.URL.createObjectURL(blob);
        //a.href = url;
        //a.id = 'crt_download' + Math.random();
        //a.download = (batch ? 'CRTDownload' : indicator.replace(/\ /g, '')) + placeNames + '.csv';
        //a.click();
        //toastr.clear();
        //document.body.removeChild(a);

        let filename = (batch ? 'CRTDownload' : indicator.replace(/\ /g, '')) + placeNames + '.csv';

        var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        if (window.navigator.msSaveOrOpenBlob) { // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var a = window.document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
            toastr.clear();
            document.body.removeChild(a);
        }
    }
}
