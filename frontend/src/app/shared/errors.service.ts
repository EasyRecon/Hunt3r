import {Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';






@Injectable({
  providedIn: 'root'
})

export class ErrorService {
    constructor() { }
    

    errorHandl(error : any) {
        let errorMessage = {};
        if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = {"status" : "", "error":"",'message':error.message};
        } else {
          // Get server-side error
          errorMessage = {"status" : error.status, "error":error.error.errors,'message':error.error.message};
        }
        console.log(errorMessage);
        return throwError(() => {
          return errorMessage;
        });
      }

 }