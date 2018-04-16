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
var PlaceBinGroupCombinePipe = (function () {
    function PlaceBinGroupCombinePipe() {
    }
    PlaceBinGroupCombinePipe.prototype.transform = function (places) {
        var processedGroups = [];
        var returnArray = [];
        for (var _i = 0; _i < places.length; _i++) {
            var place = places[_i];
            var groupArray = [];
            if (place.GroupName === undefined) {
                groupArray = places.filter(function (pl) {
                    return pl.Name === place.Name;
                });
            }
            else if (processedGroups.indexOf(place.GroupName) === -1) {
                groupArray = places.filter(function (pl) {
                    return pl.GroupName === place.GroupName;
                });
                processedGroups.push(place.GroupName);
            }
            else {
                var placeHolder = {
                    'TypeCategory': place.TypeCategory
                };
                groupArray = [placeHolder];
            }
            returnArray.push(groupArray);
        }
        console.log('pb return', returnArray);
        return returnArray;
    };
    PlaceBinGroupCombinePipe = __decorate([
        core_1.Pipe({
            name: 'placeBinGroupCombinePipe'
        }), 
        __metadata('design:paramtypes', [])
    ], PlaceBinGroupCombinePipe);
    return PlaceBinGroupCombinePipe;
})();
exports.PlaceBinGroupCombinePipe = PlaceBinGroupCombinePipe;
//# sourceMappingURL=place.bin.group.combine.pipe.js.map