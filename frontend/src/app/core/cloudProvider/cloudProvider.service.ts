
import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataCloudProvider,DeleteProviderResponse ,UpdateCloudProvider} from './cloudProvider';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import {  NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@nebular/auth';

@Injectable({
    providedIn: 'root',
  })
  export class CloudProviderService  {
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

  createScaleway(data:UpdateCloudProvider): Observable<DataCloudProvider> {
    return this.http
      .post<DataCloudProvider>(
        this.baseurl + '/admin/providers',
        data,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  deleteScaleway(): Observable<DeleteProviderResponse> {
    return this.http
      .delete<DeleteProviderResponse>(
        this.baseurl + '/admin/providers/scaleway',
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }


  updateScaleway(data:UpdateCloudProvider): Observable<DataCloudProvider> {
    return this.http
      .patch<DataCloudProvider>(
        this.baseurl + '/admin/providers',
        data,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  
  getCloudProvider(): Observable<DataCloudProvider> {
    return this.http
      .get<DataCloudProvider>(
        this.baseurl + '/admin/providers',
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