import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VulnerabilitiesDeleteResponse,VulnerabilitiesResponse } from './vulnerabilities';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import {  NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@nebular/auth';
import {ErrorService} from '../../shared/errors.service'
@Injectable()
export class VulnerabilitiesService  {
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
  
  getVulnerabilities(limit:number,page:number): Observable<VulnerabilitiesResponse> {

    return this.http
      .get<VulnerabilitiesResponse>(
        this.baseurl + '/vulnerabilities?limit='+limit+'&page='+page,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }


  deleteVulnerabilities(id:number): Observable<VulnerabilitiesDeleteResponse> {

    return this.http
      .delete<VulnerabilitiesDeleteResponse>(
        this.baseurl + '/vulnerabilities/'+id,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }



  
  
}