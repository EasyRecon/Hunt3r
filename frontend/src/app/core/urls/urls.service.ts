import { Injectable  } from '@angular/core';
//import {  } from './urls';
import { Observable } from 'rxjs';
import {baseUrl } from "../../../environments/environment";
import {HttpService} from '../../shared/http.service'
@Injectable()

export class UrlsService  {
  // Base url
  baseurl = baseUrl;
  token: any;


  constructor(private httpService:HttpService)  {
  }

  getCurrentUser(): Observable<any> {
    return this.httpService.get<any>('/profile')
  }



}