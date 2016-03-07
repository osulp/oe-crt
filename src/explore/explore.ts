import {Component} from 'angular2/core';
import {SearchCmp} from '../shared/components/search/search';
import {TopicsCmp} from './topics/topics';
import {PlacesCmp} from './places/places';

@Component({
  selector: 'explore',
  templateUrl: './explore/explore.html',
  styleUrls: ['./explore/explore.css'],
  directives: [SearchCmp,TopicsCmp,PlacesCmp]
})
export class ExploreCmp {}
