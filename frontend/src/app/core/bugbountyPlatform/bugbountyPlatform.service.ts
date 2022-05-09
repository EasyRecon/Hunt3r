
import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BugBountyPlatformSettingsUpdate,BugBountyPlatformSettingsResponse,BugBountyPlatformStatsResponse,BugBountyPlatformSyncsResponse,BugBountyPlatformSyncsData} from './bugbountyPlatform';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import {  NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@nebular/auth';

@Injectable({
    providedIn: 'root',
  })
  export class BugbountyPlatformService  {
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

  
  getPlatform(): Observable<BugBountyPlatformSettingsResponse> {
    return this.http
      .get<BugBountyPlatformSettingsResponse>(
        this.baseurl + '/admin/platforms',
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  deletePlatform(plateform:string): Observable<BugBountyPlatformSettingsResponse> {
    return this.http
      .delete<BugBountyPlatformSettingsResponse>(
        this.baseurl + '/admin/platforms/'+plateform,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  updatePlatform(data:BugBountyPlatformSettingsUpdate): Observable<BugBountyPlatformSettingsResponse> {
    return this.http
      .patch<BugBountyPlatformSettingsResponse>(
        this.baseurl + '/admin/platforms',
        data,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  createPlatform(data:BugBountyPlatformSettingsUpdate): Observable<BugBountyPlatformSettingsResponse> {
    return this.http
      .post<BugBountyPlatformSettingsResponse>(
        this.baseurl + '/admin/platforms',
        data,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getScope(platform:any): Observable<BugBountyPlatformSyncsData> {
    return this.http
      .get<BugBountyPlatformSyncsData>(
        this.baseurl + '/admin/platforms/'+platform+'/stats',
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  
  syncScope(platform:any): Observable<BugBountyPlatformSyncsResponse> {
    return this.http
      .patch<BugBountyPlatformSyncsResponse>(
        this.baseurl + '/admin/platforms/'+platform+'/stats',
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }


  getProgram(platform:any,program:any): Observable<BugBountyPlatformStatsResponse> {
    return this.http
      .post<BugBountyPlatformStatsResponse>(
        this.baseurl + '/programs?name='+platform+'&program='+program,
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