import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MeshData,CreateMesh,MeshResponse } from './meshs';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import {  NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@nebular/auth';
import {ErrorService} from '../../shared/errors.service'
@Injectable()
export class MeshsService  {
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

  getMeshs(): Observable<MeshData> {

    return this.http
      .get<MeshData>(
        this.baseurl + '/admin/meshs',
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }

  createMeshs(data:CreateMesh): Observable<MeshData> {

    return this.http
      .post<MeshData>(
        this.baseurl + '/admin/meshs',
        data,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
  updateMeshs(data:CreateMesh): Observable<MeshResponse> {

    return this.http
      .patch<MeshResponse>(
        this.baseurl + '/admin/meshs',
        data,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
  deleteMeshs(id:number): Observable<MeshResponse> {

    return this.http
      .delete<MeshResponse>(
        this.baseurl + '/admin/meshs/'+id,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
}