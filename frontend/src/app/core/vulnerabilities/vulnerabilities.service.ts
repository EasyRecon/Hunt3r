import { Injectable  } from '@angular/core';
import { VulnerabilitiesDeleteResponse,VulnerabilitiesResponse } from './vulnerabilities';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class VulnerabilitiesService  {



  constructor(private httpService:HttpService)  {
  }


  getVulnerabilities(limit:number,page:number,criticity:string) {
    let critParam =''
    if(criticity!='') critParam='&severity='+criticity
    return this.httpService.get<VulnerabilitiesResponse>('/vulnerabilities?limit='+limit+'&page='+page+critParam)
  }
  
  deleteVulnerabilities(id:number): Observable<VulnerabilitiesDeleteResponse> {
    return this.httpService.delete<VulnerabilitiesDeleteResponse>('/vulnerabilities/'+id)

  }
}