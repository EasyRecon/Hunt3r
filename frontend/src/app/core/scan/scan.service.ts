import { Injectable  } from '@angular/core';
import {AddScan,ScanResponse} from './scan';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class ScanService  {



  constructor(private httpService:HttpService)  {
  }


 getScans(): Observable<ScanResponse> {
  return this.httpService.get<ScanResponse>('/scans')
  }
  addScans(data:AddScan): Observable<ScanResponse> {
    return this.httpService.post<ScanResponse>('/scans',data)
  }
}