import { Injectable  } from '@angular/core';
import { NucleiResponse,NucleiAddTemplate,NucleiResponseTemplate } from './nuclei';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class NucleiService  {
 
  constructor(private httpService:HttpService)  {
  }

  getTemplate(): Observable<NucleiResponseTemplate> {
    return this.httpService.get<NucleiResponseTemplate>('/nuclei')
  }
  deleteTemplate(name:string): Observable<NucleiResponse> {
    return this.httpService.get<NucleiResponse>('/nuclei/'+name)
  }
  addTemplate(data:NucleiAddTemplate): Observable<NucleiResponse> {
    return this.httpService.post<NucleiResponse>('/nuclei/',data)
  }
}