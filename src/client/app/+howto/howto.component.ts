import { Component } from '@angular/core';
//import { ROUTER_DIRECTIVES } from '@angular/router';

declare var $: any;
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-howto',
  templateUrl: 'howto.component.html',
  //directives: [ROUTER_DIRECTIVES],
  styleUrls: ['howto.component.css']
})
export class HowToComponent {
    scrollTo(elem: any) {
        console.log('scroll to element', elem, $(elem).offset().top);
        //$(window).scrollTop($(elem).offset().top);
        $('body,html').animate({
            scrollTop: $(elem).offset().top+'px'
        });
    }
}
