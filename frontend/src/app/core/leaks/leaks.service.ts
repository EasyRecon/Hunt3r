import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LeakData } from './leaks';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import {ErrorService} from '../../shared/errors.service'
@Injectable()
export class LeaksService  {
  // Base url
  baseurl = baseUrl;
  token: any;


  constructor(private errorService: ErrorService,private http: HttpClient, @Inject(NB_AUTH_OPTIONS) protected options = {})  {

  }


  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  
  getLeaks(domain:string,limit:number,page:number): Observable<LeakData> {
    let domainParam=''
    if(domain!='')domainParam='domain='+domain
    return this.http
      .get<LeakData>(
        this.baseurl + '/leaks?domain='+domain+'&page='+page+'&limit='+limit,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
}