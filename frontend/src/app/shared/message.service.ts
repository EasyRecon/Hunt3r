import {Component, NgModule,Injectable } from '@angular/core';
import {
  NbToastrService,
  NbComponentStatus

} from '@nebular/theme';







@Injectable({
  providedIn: 'root'
})

export class MessageService {
    constructor(private toastrService:NbToastrService) { }
    showToast(message: string, status: NbComponentStatus = 'danger') {
        if(status == 'danger' ) this.toastrService.show(message, 'Error', { status });
        if(status == 'success' ) this.toastrService.show(message, 'Success', { status });
      }

 }