import { Component } from '@angular/core';
import {Router} from '@angular/router';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'top-collection',
  templateUrl: 'top.collection.component.html',
  styleUrls: ['top.collection.component.css']
})
export class TopCollectionComponent {

    constructor(private _router: Router) {}

    gotoTop() {
        this._router.navigate(['Explore', { collection: 'Tracking%20Oregon%27s%20Progress' }]);
    }
}
