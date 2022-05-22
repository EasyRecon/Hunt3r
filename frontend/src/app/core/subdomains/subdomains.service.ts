import { Injectable} from '@angular/core';
import { SubdomainData,SubdomainScreenshot } from './subdomains';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class SubdomainsService  {
  constructor(private httpService:HttpService)  {
  }


  getSubdomain(page:number,limit:number,domain:string='',subdomain:string='',technolgy:string='',status_code:string=''): Observable<SubdomainData> {
    return this.httpService.get<SubdomainData>('/subdomains?page='+page+'&limit='+limit+'&domain='+domain+'&subdomain='+subdomain+'&technology='+technolgy+'&status_code='+status_code)
  }

  getScreenshot(id:number):Observable<Blob> {
    return this.httpService.getRaw('/screenshots/'+id)
  }
}