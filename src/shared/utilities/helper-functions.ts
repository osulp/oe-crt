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
}

