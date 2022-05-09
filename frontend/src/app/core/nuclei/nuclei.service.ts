import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NucleiResponse,NucleiAddTemplate,NucleiResponseTemplate } from './nuclei';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import {  NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@nebular/auth';
@Injectable({
  providedIn: 'root',
})
export class NucleiService  {
  // Base url
  baseurl = baseUrl;
  token: any;


  constructor(private http: HttpClient, authService: NbAuthService,@Inject(NB_AUTH_OPTIONS) protected options = {})  {
    authService.onTokenChange()
    .subscribe((token: NbAuthToken) => {
      this.token = null;
      if (token && token.isValid()) {
        this.token = token;
      }
    });
  }


  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  // POST
  getTemplate(): Observable<NucleiResponseTemplate> {

    return this.http
      .get<NucleiResponseTemplate>(
        this.baseurl + '/nuclei',
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  
  deleteTemplate(name:string): Observable<NucleiResponse> {

    return this.http
      .delete<NucleiResponse>(
        this.baseurl + '/nuclei/'+name,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  addTemplate(data:NucleiAddTemplate): Observable<NucleiResponse> {
    return this.http
      .post<NucleiResponse>(
        this.baseurl + '/nuclei/',
        data,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  

  
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