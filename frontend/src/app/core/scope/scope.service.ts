import { Injectable  } from '@angular/core';
import { ScopeSyncResponse } from './scope';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class ScopeService  {


  constructor(private httpService:HttpService)  {

  }

   syncScope(id:number): Observable<ScopeSyncResponse> {
    return this.httpService.patch<ScopeSyncResponse>( '/programs/'+id+'/scopes')
  }
  
  getScope(id:number,scope:string=''): Observable<ScopeSyncResponse> {
    return this.httpService.get<ScopeSyncResponse>('/programs/'+id+'/scopes?scope='+scope)
  }
}