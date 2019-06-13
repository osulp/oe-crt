export class HelperFunctions {
    updateQueryStringParam(key: string, value: string, page: string): string {
        console.log('got here');
        var baseUrl = [location.protocol, '//', location.host, location.pathname].join(''),
            urlQueryString = document.location.search,
            newParam = key + '=' + value,
            params = '?' + newParam;
        //baseUrl += page !== '' ? page : '';
        // If the "search" string exists, then build params from it
        if (urlQueryString) {
            var keyRegex = new RegExp('([\?&])' + key + '[^&]*');

            // If param exists already, update it
            if (urlQueryString.match(keyRegex) !== null) {
                params = urlQueryString.replace(keyRegex, '$1' + newParam);
            } else { // Otherwise, add it to end of query string
                params = urlQueryString + '&' + newParam;
            }
        }
        console.log(baseUrl + encodeURI(params));
        //return baseUrl + page + encodeURI(params);
        return page + encodeURI(params);
        //if (page !== '') {
        //    //return baseUrl + page + params;
        //    window.history.pushState({}, '', baseUrl + page + encodeURI(params));
        //} else {
        //    //window.history.replaceState({}, '', baseUrl + encodeURI(params));
        //}
    };

    translatePlaceTypes(placeType: string) {
        switch (placeType) {
            case 'County':
            case 'Counties':
            case 'State':
                return 'Counties';
            case 'Census Designated Place':
            case 'Incorporated City':
            case 'Incorporated Town':
            case 'City':
            case 'Cities':
                return 'Places';
            case 'Census Tract':
            case 'Census Tracts':
            case 'Unicorporated Place':
                return 'Tracts';
            default:
                return placeType;
        }
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


}

