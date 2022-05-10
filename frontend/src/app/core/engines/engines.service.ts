import { Injectable  } from '@angular/core';
import { AddEngineResponse,EngineResponse,Engine} from './engines';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class EnginesService  {

  constructor(private httpService:HttpService)  {
  }

  getEngines(): Observable<EngineResponse> {
    return this.httpService.get<EngineResponse>('/engines')
  }
  createEngine(data:Engine): Observable<AddEngineResponse> {
    return this.httpService.post<AddEngineResponse>('/engines',data)
  }
  deleteEngine(id:number): Observable<AddEngineResponse> {
    return this.httpService.delete<AddEngineResponse>('/engines/'+id)
  }
}