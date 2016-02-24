var map = null;
require([
  "esri/layers/WebTiledLayer",
  "esri/Map",
  "esri/views/MapView",
  "dojo/domReady!"
], function (WebTiledLayer, Map, MapView) {
    //set timeout to actually wait for all returns.  I think it is a conflict with the Systemjs module loader of ng2 and dojo/domReady doing the same thing.  -mgr
    window.setTimeout(function () {
        map = new Map({
            basemap: "",
            autoResize: true
        });
        var view = new MapView({
            container: "viewDiv",  
            map: map,  
            zoom: 7,  
            center: [-122, 45]  
        });       

        var tiledLayer = new WebTiledLayer({
            urlTemplate: "http://{subDomain}.tiles.mapbox.com/v4/censusreporter.map-j9q076fv/{level}/{col}/{row}.png?access_token=pk.eyJ1IjoibWFyY2dyIiwiYSI6ImNpamNhcGNkdzAwMTd0Z2trejBvd3l2NGEifQ.mzlA0ioTAIu0cF4ZdlvvEw",
            subDomains: ["a", "b", "c", "d"],
            copyright: "MapBox and Census Reporter"
        });

        map.add(tiledLayer);
    }, 1000);

});
//$(document).ready(function () {
//    window.setTimeout(function () {
//        var nhlTeams = ['Anaheim Ducks', 'Atlanta Thrashers', 'Boston Bruins', 'Buffalo Sabres', 'Calgary Flames', 'Carolina Hurricanes', 'Chicago Blackhawks', 'Colorado Avalanche', 'Columbus Blue Jackets', 'Dallas Stars', 'Detroit Red Wings', 'Edmonton OIlers', 'Florida Panthers', 'Los Angeles Kings', 'Minnesota Wild', 'Montreal Canadiens', 'Nashville Predators', 'New Jersey Devils', 'New Rork Islanders', 'New York Rangers', 'Ottawa Senators', 'Philadelphia Flyers', 'Phoenix Coyotes', 'Pittsburgh Penguins', 'Saint Louis Blues', 'San Jose Sharks', 'Tampa Bay Lightning', 'Toronto Maple Leafs', 'Vancouver Canucks', 'Washington Capitals'];
//        var nbaTeams = ['Atlanta Hawks', 'Boston Celtics', 'Charlotte Bobcats', 'Chicago Bulls', 'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons', 'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers', 'LA Clippers', 'LA Lakers', 'Memphis Grizzlies', 'Miami Heat', 'Milwaukee Bucks', 'Minnesota Timberwolves', 'New Jersey Nets', 'New Orleans Hornets', 'New York Knicks', 'Oklahoma City Thunder', 'Orlando Magic', 'Philadelphia Sixers', 'Phoenix Suns', 'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs', 'Toronto Raptors', 'Utah Jazz', 'Washington Wizards'];
//        var nhl = $.map(nhlTeams, function (team) { return { value: team, data: { category: 'NHL' } }; });
//        var nba = $.map(nbaTeams, function (team) { return { value: team, data: { category: 'NBA' } }; });
//        var teams = nhl.concat(nba);

//        // Initialize autocomplete with local lookup:
//        $('#autocomplete').devBridgeAutocomplete({
//            lookup: teams,
//            minChars: 1,
//            onSelect: function (suggestion) {
//                $('#selection').html('You selected: ' + suggestion.value + ', ' + suggestion.data.category);
//            },
//            showNoSuggestionNotice: true,
//            noSuggestionNotice: 'Sorry, no matching results',
//            groupBy: 'category'
//        });
//    }, 1000);
//});

