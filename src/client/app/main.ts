import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode, provide, ExceptionHandler, Injectable,Injector} from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS, Router } from '@angular/router';
//import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import {HTTP_PROVIDERS,JSONP_PROVIDERS} from '@angular/http';
//import {PlaceInfoService} from './shared/services/places/index';
//import { AppExceptionHandler} from './shared/error-handle/app.exception.handler';
//import {DND_PROVIDERS} from 'ng2-dnd/ng2-dnd';


import { AppComponent } from './app.component';

if ('<%= ENV %>' === 'prod') { enableProdMode(); }

export class ArrayLogger {
    res:any = [];
    log(s: any): void { this.res.push(s); }
    logError(s: any): void { this.res.push(s); }
    logGroup(s: any): void { this.res.push(s); }
    logGroupEnd() { ; };
}

@Injectable()
export class AppExceptionHandler extends ExceptionHandler {
    private router: Router;
    //private toaster: ToastsManager;

    constructor(private injector: Injector) {
        super(new ArrayLogger(), true);
    }

    call(exception: any, stackTrace?: any, reason?: string): void {
        this.getDependencies();
        console.log('error handler',exception);
        //this.router.navigate(['Error', { error: exception }]);
        //if (exception.status === 401) {
        //    // Show login
        //    this.router.navigate(['/Error']);
        //}

        // Get error messages if http exception
        //let msgs = [];
        //if (exception instanceof Response) {
        //    msgs = this.getMessagesFromResponse(exception);
        //} else {

        //    // Otherwise show generic error
        //    msgs.push('Something went wrong');
        //}

        //// Show messages
        //msgs.forEach((msg) => this.toaster.error(msg));

        super.call(exception, stackTrace, reason);
    }

    private getDependencies() {
        if (!this.router) {
            this.router = this.injector.get(Router);
        }
        //if (!this.toaster) {
        //    this.toaster = this.injector.get(ToastsManager);
        //}
    }

}

/**
 * Bootstraps the application and makes the ROUTER_PROVIDERS and the APP_BASE_HREF available to it.
 * @see https://angular.io/docs/ts/latest/api/platform-browser-dynamic/index/bootstrap-function.html
 */
bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    JSONP_PROVIDERS,
    ROUTER_PROVIDERS,
    //PlaceInfoService,
    //DND_PROVIDERS,
    provide(APP_BASE_HREF, { useValue: '<%= ENV %>' === 'prod' ? '<%= APP_BASE %>' : '/' }),
    //provide(APP_BASE_HREF, { useValue: '/' }),
    //{ provide: ExceptionHandler, useClass: AppExceptionHandler }
    provide(ExceptionHandler, { useClass: AppExceptionHandler })
]);

// In order to start the Service Worker located at "./worker.js"
// uncomment this line. More about Service Workers here
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
//
// if ('serviceWorker' in navigator) {
//   (<any>navigator).serviceWorker.register('./worker.js').then((registration: any) =>
//       console.log('ServiceWorker registration successful with scope: ', registration.scope))
//     .catch((err: any) =>
//       console.log('ServiceWorker registration failed: ', err));
// }
