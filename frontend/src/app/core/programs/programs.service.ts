import { Injectable } from '@angular/core';
import { ProgramsData } from './programs';
import { Observable } from 'rxjs';


import {HttpService} from '../../shared/http.service'
@Injectable()
export class ProgramsService  {



  constructor(private httpService:HttpService)  {
  }

  getPrograms(platform:any,search:any): Observable<ProgramsData> {
    return this.httpService.get<ProgramsData>('/programs?name='+platform+'&program='+search)
  }
  syncPrograms(): Observable<ProgramsData> {
    return this.httpService.patch<ProgramsData>('/programs')
  }  
}