import { Injectable} from '@angular/core';
import { SubdomainData,SubdomainScreenshot } from './subdomains';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class SubdomainsService  {
  constructor(private httpService:HttpService)  {
  }


  getSubdomain(page:number,limit:number,domain:string='',url:string='',technolgy:string=''): Observable<SubdomainData> {
    return this.httpService.get<SubdomainData>('/subdomains?page='+page+'&limit='+limit+'&domain='+domain+'&subdomain='+url+'&technology='+technolgy)
  }

  getScreenshot(id:number):Observable<SubdomainScreenshot> {
    return this.httpService.get<SubdomainScreenshot>('/screenshots/'+id)
  }
}