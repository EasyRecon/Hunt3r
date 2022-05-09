import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddEngineResponse,EngineResponse,Engine} from './engines';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import {  NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@nebular/auth';
@Injectable({
  providedIn: 'root',
})
export class EnginesService  {
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
  getEngines(): Observable<EngineResponse> {

    return this.http
      .get<EngineResponse>(
        this.baseurl + '/engines',
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }


  createEngine(data:Engine): Observable<AddEngineResponse> {

    return this.http
      .post<AddEngineResponse>(
        this.baseurl + '/engines',
        data,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  deleteEngine(id:number): Observable<AddEngineResponse> {
    return this.http
      .delete<AddEngineResponse>(
        this.baseurl + '/engines/'+id,
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