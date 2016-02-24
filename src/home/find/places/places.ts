import {Component, OnInit, ElementRef} from 'angular2/core';

@Component({
    selector: 'places',
    templateUrl: './home/find/places/places.html',
    styleUrls: ['./home/find/places/places.css']
})

export class PlacesCmp implements OnInit {
    constructor(private elementRef: ElementRef) { }
    ngOnInit() {
        if (window['map']) {
            //var map = window['map'];
            //map.setVisibility(true);
            //map.resize(true);
            //map.reposition();
            //var h = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
            //var w = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;

            //var mapH = h - 146; //substract height of the header and footer
            //var mapW = w;

            //jQuery('#map').css({ 'width': mapW + 'px', 'height': mapH + 'px' });
            //jQuery('#mapcontent').css({'width': mapW + 'px', 'height': mapH + 'px' });

            //map.setVisibility(true);
            //map.resize(true);
            //map.reposition();

        }
    }
}

