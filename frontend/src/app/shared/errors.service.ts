import {Injectable } from '@angular/core';
import { Router } from '@angular/router'
import {  throwError } from 'rxjs';






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
          
          if ( error.status === 401) {
           // localStorage.clear();
            
            
          }
        return throwError(() => {
          return errorMessage;
        });
      }

 }