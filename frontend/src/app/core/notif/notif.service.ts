import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotifData,DeleteNotif } from './notif';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import {  NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@nebular/auth';
import {ErrorService} from '../../shared/errors.service'
@Injectable()
export class NotifService  {
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
  getNotif(): Observable<NotifData> {

    return this.http
      .get<NotifData>(
        this.baseurl + '/notifications',
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
  deleteNotif(): Observable<DeleteNotif> {

    return this.http
      .delete<DeleteNotif>(
        this.baseurl + '/notifications',
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
}