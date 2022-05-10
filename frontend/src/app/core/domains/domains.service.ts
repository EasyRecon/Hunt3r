import { Injectable  } from '@angular/core';
import {DomainData } from './domains';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class DomainsService  {
  constructor(private httpService:HttpService)  {
  }

  getDomain(limit:number,page:number,domain:string='',url:string='',status_code:string='',technologie:string=''): Observable<DomainData> {
    return this.httpService.get<DomainData>('/domains?limit='+limit+'&page='+page+'&domain='+domain+'&url='+url+'&status_code='+status_code+'&technology='+technologie)
  }
  deleteDomain(id:number): Observable<DomainData> {
    return this.httpService.delete<DomainData>('/domains/'+id)
  }
}