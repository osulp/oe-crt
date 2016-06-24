var HelperFunctions = (function () {
    function HelperFunctions() {
    }
    HelperFunctions.prototype.updateQueryStringParam = function (key, value, page) {
        console.log('got here');
        var baseUrl = [location.protocol, '//', location.host, location.pathname].join(''), urlQueryString = document.location.search, newParam = key + '=' + value, params = '?' + newParam;
        if (urlQueryString) {
            var keyRegex = new RegExp('([\?&])' + key + '[^&]*');
            if (urlQueryString.match(keyRegex) !== null) {
                params = urlQueryString.replace(keyRegex, '$1' + newParam);
            }
            else {
                params = urlQueryString + '&' + newParam;
            }
        }
        console.log(baseUrl + encodeURI(params));
        return page + encodeURI(params);
    };
    ;
    HelperFunctions.prototype.translatePlaceTypes = function (placeType) {
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
    };
    return HelperFunctions;
})();
exports.HelperFunctions = HelperFunctions;
//# sourceMappingURL=helper.functions.js.map