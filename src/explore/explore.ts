import {Component} from 'angular2/core';
import {SearchCmp} from '../shared/components/search/search';

@Component({
  selector: 'explore',
  templateUrl: './explore/explore.html',
  styleUrls: ['./explore/explore.css'],
  directives: [SearchCmp]
})
export class ExploreCmp {}
