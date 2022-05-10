import { Injectable  } from '@angular/core';
import { NotifData,DeleteNotif } from './notif';
import { Observable } from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class NotifService  {


  constructor(private httpService:HttpService)  {
  }


  getNotif(): Observable<NotifData> {
    return this.httpService.get<NotifData>('/notifications')
  }
  deleteNotif(): Observable<DeleteNotif> {
    return this.httpService.delete<DeleteNotif>('/notifications')
  }
}