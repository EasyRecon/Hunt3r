import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubdomainData,SubdomainScreenshot } from './subdomains';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import {  NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@nebular/auth';
import {ErrorService} from '../../shared/errors.service'
@Injectable()
export class SubdomainsService  {
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

  getSubdomain(page:number,limit:number,domain:string='',url:string='',technolgy:string=''): Observable<SubdomainData> {

    return this.http
      .get<SubdomainData>(
        this.baseurl + '/subdomains?page='+page+'&limit='+limit+'&domain='+domain+'&url='+url+'&technolgy='+technolgy,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }

  getScreenshot(id:number):Observable<SubdomainScreenshot> {
    return this.http
    .get<SubdomainScreenshot>(
      this.baseurl + '/screenshots/'+id,
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
}