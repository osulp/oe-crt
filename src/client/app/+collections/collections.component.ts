import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';


/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-collections',
  templateUrl: 'collections.component.html',
  styleUrls: ['collections.component.css'],
   directives: [ROUTER_DIRECTIVES]
})
export class CollectionsComponent {}
