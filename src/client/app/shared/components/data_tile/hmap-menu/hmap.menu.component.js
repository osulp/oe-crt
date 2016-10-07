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
var HmapMenuComponent = (function () {
    function HmapMenuComponent() {
        this.selMapView = new core_1.EventEmitter();
    }
    HmapMenuComponent.prototype.mapViewClick = function (evt) {
        console.log(evt.target.value);
        if (evt.target.value !== this._translatedMapView) {
            this.selMapView.emit(evt.target.value);
        }
    };
    HmapMenuComponent.prototype.ngOnInit = function () {
        this.mapViews = ['Counties', 'Cities', 'Census Tracts', 'School Districts'];
    };
    HmapMenuComponent.prototype.setIndicatorGeoFilter = function (filter) {
        switch (filter) {
            case 'Place, Tract & County':
                this.mapViews = ['Counties', 'Cities', 'Census Tracts'];
                break;
            case 'Place and Counties':
                this.mapViews = ['Cities', 'Counties'];
                break;
            case 'County':
                this.mapViews = ['Counties'];
                break;
            case 'School only':
                this.mapViews = ['School Districts'];
                break;
            case 'School and County':
                this.mapViews = ['Counties', 'School Districts'];
                break;
            case 'Place only':
                this.mapViews = ['Cities'];
                break;
            case 'Tract only':
                this.mapView = ['Census Tracts'];
                break;
            default:
                this.mapViews = ['Counties'];
                break;
        }
    };
    HmapMenuComponent.prototype.ngOnChanges = function (changes) {
        console.log('Change detected:', changes);
        if (changes['mapView']) {
            if (changes['mapView'].currentValue !== changes['mapView'].previousValue) {
                switch (changes['mapView'].currentValue) {
                    case 'Counties':
                        this._translatedMapView = 'Counties';
                        break;
                    case 'Places':
                        this._translatedMapView = 'Cities';
                        break;
                    case 'Tracts':
                    case 'Unicorporated Place':
                    case 'Census Tract':
                    case 'Census Tracts':
                        this._translatedMapView = 'Census Tracts';
                        break;
                    case 'School District':
                        this._translatedMapView = 'School Districts';
                        break;
                    default:
                        break;
                }
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], HmapMenuComponent.prototype, "mapView", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], HmapMenuComponent.prototype, "showMenuLeft", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], HmapMenuComponent.prototype, "selMapView", void 0);
    HmapMenuComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'hmap-menu',
            templateUrl: 'hmap.menu.component.html',
            styleUrls: ['hmap.menu.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], HmapMenuComponent);
    return HmapMenuComponent;
})();
exports.HmapMenuComponent = HmapMenuComponent;
//# sourceMappingURL=hmap.menu.component.js.map