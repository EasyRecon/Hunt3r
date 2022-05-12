
import { Injectable  } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
import { 
  BugBountyPlatformSettingsUpdate,
  BugBountyPlatformSettingsResponse,
  BugBountyPlatformStatsResponse,
  BugBountyPlatformSyncsResponse,
  BugBountyPlatformSyncsData
} from './bugbountyPlatform';


@Injectable()
  export class BugbountyPlatformService  {

    constructor(private httpService:HttpService)  {
    }

  getPlatform(): Observable<BugBountyPlatformSettingsResponse> {
    return this.httpService.get<BugBountyPlatformSettingsResponse>('/admin/platforms')
  }
  deletePlatform(plateform:string): Observable<BugBountyPlatformSettingsResponse> {
    return this.httpService.delete<BugBountyPlatformSettingsResponse>('/admin/platforms/'+plateform)
  }

  updatePlatform(data:BugBountyPlatformSettingsUpdate): Observable<BugBountyPlatformSettingsResponse> {
    return this.httpService.patch<BugBountyPlatformSettingsResponse>('/admin/platforms',data)
  }

  createPlatform(data:BugBountyPlatformSettingsUpdate): Observable<BugBountyPlatformSettingsResponse> {
    return this.httpService.post<BugBountyPlatformSettingsResponse>('/admin/platforms',data)
  }

  getScope(platform:any): Observable<BugBountyPlatformSyncsData> {
    return this.httpService.get<BugBountyPlatformSyncsData>('/admin/platforms/'+platform+'/stats')
  }
  
  syncScope(platform:any): Observable<BugBountyPlatformSyncsResponse> {
    return this.httpService.patch<BugBountyPlatformSyncsResponse>('/admin/platforms/'+platform+'/stats')
  }

  getProgram(platform:any,program:any): Observable<BugBountyPlatformStatsResponse> {
    return this.httpService.get<BugBountyPlatformStatsResponse>('/programs?name='+platform+'&program='+program)
  }
}