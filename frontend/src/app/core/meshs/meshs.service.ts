import { Injectable } from '@angular/core';
import { MeshData,CreateMesh,MeshResponse } from './meshs';
import { Observable} from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class MeshsService  {

  constructor(private httpService:HttpService)  {

  }



  getMeshs(): Observable<MeshData> {
    return this.httpService.get<MeshData>('/admin/meshs')
  }

  createMeshs(data:CreateMesh): Observable<MeshData> {
    return this.httpService.post<MeshData>('/admin/meshs',data)
  }
  updateMeshs(data:CreateMesh): Observable<MeshResponse> {
    return this.httpService.patch<MeshData>('/admin/meshs',data)
  }
  deleteMeshs(id:number): Observable<MeshResponse> {
    return this.httpService.delete<MeshData>('/admin/meshs'+id)
  }
}