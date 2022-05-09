import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {DomainData } from './domains';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import {  NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@nebular/auth';
@Injectable({
  providedIn: 'root',
})
export class DomainsService  {
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

  getDomain(limit:number,page:number,domain:string='',url:string='',status_code:string='',technologie:string=''): Observable<DomainData> {

    return this.http
      .get<DomainData>(
        this.baseurl + '/domains?limit='+limit+'&page='+page+'&domain='+domain+'&url='+url+'&status_code='+status_code+'&technology='+technologie,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  deleteDomain(id:number): Observable<DomainData> {

    return this.http
      .delete<DomainData>(
        this.baseurl + '/domains/'+id,
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