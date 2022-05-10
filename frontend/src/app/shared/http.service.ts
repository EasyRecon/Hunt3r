import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../environments/environment";
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import {ErrorService} from './errors.service'





@Injectable()
export class HttpService  {
  // Base url
  baseurl = baseUrl;
  token: any;


  constructor(private errorService: ErrorService,private http: HttpClient,@Inject(NB_AUTH_OPTIONS) protected options = {})  {
  }


  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  // POST
  
  get<T>(url:string): Observable<T>  {
    return this.http
      .get<T>(
        this.baseurl + url,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
  post<T>(url:string,data:any={}): Observable<T>  {
    return this.http
      .post<T>(
        this.baseurl + url,
        data,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
  put<T>(url:string,data:any={}): Observable<T>  {
    return this.http
      .put<T>(
        this.baseurl + url,
        data,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
  patch<T>(url:string,data:any={}): Observable<T>  {
    return this.http
      .patch<T>(
        this.baseurl + url,
        data,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
  delete<T>(url:string): Observable<T>  {
    return this.http
      .delete<T>(
        this.baseurl + url,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }





  
  
}