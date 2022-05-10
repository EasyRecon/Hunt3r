import { Injectable} from '@angular/core';
import { ServerData } from './server';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class ServerService  {

  constructor(private httpService:HttpService)  {

  }

  getServers(): Observable<ServerData> {
    return this.httpService.get<ServerData>('/servers')
  }
  deleteServers(uid:string): Observable<ServerData> {
    return this.httpService.delete<ServerData>('/servers/'+uid)
  }
}