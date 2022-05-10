import { Injectable  } from '@angular/core';
import { VulnerabilitiesDeleteResponse,VulnerabilitiesResponse } from './vulnerabilities';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class VulnerabilitiesService  {



  constructor(private httpService:HttpService)  {
  }


  getVulnerabilities(limit:number,page:number) {
    return this.httpService.get<VulnerabilitiesResponse>('/vulnerabilities?limit='+limit+'&page='+page)
  }
  
  deleteVulnerabilities(id:number): Observable<VulnerabilitiesDeleteResponse> {
    return this.httpService.delete<VulnerabilitiesDeleteResponse>('/vulnerabilities/'+id)

  }
}