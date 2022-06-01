import { Injectable  } from '@angular/core';
//import {  } from './urls';
import { Observable } from 'rxjs';

import {baseUrl } from "../../../environments/environment";
import {HttpService} from '../../shared/http.service'
import {UrlData} from './urls'
@Injectable()

export class UrlsService  {
  // Base url
  baseurl = baseUrl;
  token: any;


  constructor(private httpService:HttpService)  {
  }

  getUrls(idSub:number,page:number=1,limit:number=10,status_code:any=''): Observable<UrlData> {
    let statuParam =''
    if(status_code!='')statuParam="&status_code="+status_code
    return this.httpService.get<UrlData>('/urls/'+idSub+"?page="+page+"&limit="+limit+statuParam)
  }



}