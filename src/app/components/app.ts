import {Component, ViewEncapsulation} from 'angular2/core';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';

import {HomeCmp} from '../../home/home';
import {AboutCmp} from '../../about/components/about';
import {CollectionsCmp} from '../../collections/components/collections';
import {ExploreCmp} from '../../explore/components/explore';
import {DataFeaturedCmp} from '../../data_featured/components/data_featured';
import {NameList} from '../../shared/services/name_list';

@Component({
  selector: 'app',
  viewProviders: [NameList],
  templateUrl: './app/components/app.html',
  styleUrls: ['./app/components/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
  { path: '/about', component: AboutCmp, as: 'About' },
  { path: '/explore', component: ExploreCmp, as: 'Explore' },
  { path: '/collections', component: CollectionsCmp, as: 'Collections' },
  { path: '/my_pins', component: DataFeaturedCmp, as: 'My Pins' }
])
export class AppCmp {}
