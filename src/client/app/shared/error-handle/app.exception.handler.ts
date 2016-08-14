import {Injectable, ExceptionHandler} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class AppExceptionHandler extends ExceptionHandler {
    constructor(private router: Router) {
        super(null, null);
    }

    call(exception: any, stackTrace?: any, reason?: string): void {
        console.log('call...', exception, stackTrace, reason);

        this.router.navigate(['Error']);
    }
}
