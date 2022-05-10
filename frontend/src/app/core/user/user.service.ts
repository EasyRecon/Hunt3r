import { Injectable  } from '@angular/core';
import { DataUser,UpdateUser,DataUsers,UserResponse,AddUser } from './user';
import { Observable } from 'rxjs';


import {HttpService} from '../../shared/http.service'
@Injectable()
export class UserService  {

  constructor(private httpService:HttpService)  {

  }

  getCurrentUser(): Observable<DataUser> {
    return this.httpService.get<DataUser>('/profile')
  }
  getAllUsers(): Observable<DataUsers> {
    return this.httpService.get<DataUsers>('/admin/users')
  }

  updateCurrentUser(data:UpdateUser): Observable<DataUser> {
    return this.httpService.patch<DataUser>('/profile',data)
  }

  createUser(data:AddUser): Observable<UserResponse> {
    return this.httpService.post<UserResponse>('/admin/users',data)
  }
  deleteUser(id:number): Observable<UserResponse> {
    return this.httpService.delete<UserResponse>('/admin/user/'+id)
  }
  logoutUser(): Observable<any> {
    return this.httpService.delete<UserResponse>('/auth/logout')
  }

}