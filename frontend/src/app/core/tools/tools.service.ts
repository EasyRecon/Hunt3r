import { Injectable} from '@angular/core';
import { ToolsData,ToolsConfigUpdate,ToolsConfigModel } from './tools';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class ToolsService  {


  constructor(private httpService:HttpService)  {
  }


  getTools(): Observable<ToolsData> {
    return this.httpService.get<ToolsData>('/admin/tools')
  }
  getToolsModel(): Observable<ToolsConfigModel> {
    return this.httpService.get<ToolsConfigModel>('/admin/tools/model')
  }

  updateTools(data:ToolsConfigUpdate): Observable<ToolsData> {
    return this.httpService.post<ToolsData>('/admin/tools',data)
  }

}