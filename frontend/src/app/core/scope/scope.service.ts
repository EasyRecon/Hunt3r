import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ScopeSyncResponse } from './scope';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import {  NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@nebular/auth';
import {ErrorService} from '../../shared/errors.service'
@Injectable()
export class ScopeService  {
  // Base url
  baseurl = baseUrl;
  token: any;


  constructor(private errorService: ErrorService,private http: HttpClient, authService: NbAuthService,@Inject(NB_AUTH_OPTIONS) protected options = {})  {
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
   syncScope(id:number): Observable<ScopeSyncResponse> {

    return this.http
      .patch<ScopeSyncResponse>(
        this.baseurl + '/programs/'+id+'/scopes',
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
  
  getScope(id:number,scope:string=''): Observable<ScopeSyncResponse> {

    return this.http
      .get<ScopeSyncResponse>(
        this.baseurl + '/programs/'+id+'/scopes?scope='+scope,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
}