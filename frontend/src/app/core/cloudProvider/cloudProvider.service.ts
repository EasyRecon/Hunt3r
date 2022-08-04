
import { Injectable  } from '@angular/core';
import { DataCloudProvider,DeleteProviderResponse ,UpdateCloudProvider,UpdateProviderResponse} from './cloudProvider';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
  export class CloudProviderService  {

    constructor(private httpService:HttpService)  {
    }
  createCloud(data:UpdateCloudProvider): Observable<UpdateProviderResponse> {
    return this.httpService.post<UpdateProviderResponse>('/admin/providers',data)
  }
  deleteCloud(platform:string): Observable<DeleteProviderResponse> {
    return this.httpService.delete<DeleteProviderResponse>('/admin/providers/'+platform)
  }
  updateCloud(data:UpdateCloudProvider): Observable<UpdateProviderResponse> {
    return this.httpService.patch<UpdateProviderResponse>('/admin/providers',data)
  }

  getCloudProvider(): Observable<DataCloudProvider> {
    return this.httpService.get<DataCloudProvider>('/admin/providers')
  }
}