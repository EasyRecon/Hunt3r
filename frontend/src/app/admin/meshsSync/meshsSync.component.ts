import {Component, OnInit} from '@angular/core';
import { MessageService  } from '../../shared/message.service';
import {
  NbDialogService,
} from '@nebular/theme';

import { MeshsService } from '../../core/meshs/meshs.service';

import { MeshConfig } from '../../core/meshs/meshs';


import { FormBuilder   } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { elementAt } from 'rxjs';

@Component({
  
  templateUrl: './meshsSync.component.html',
  styleUrls: ['./meshsSync.component.scss']
})

export class MeshsSyncComponent implements  OnInit  {


listDomain:any[]=[]
loading=false
id:any
domain:any



  constructor(private messageService: MessageService,
              private meshsService:MeshsService,
              private Activatedroute:ActivatedRoute,
              private fbuilder: FormBuilder,
              private dialogService: NbDialogService) {
                
                this.id=this.Activatedroute.snapshot.paramMap.get("id") || '';
             //   this.domain=this.Activatedroute.snapshot.paramMap.get("domain") || '';
             this.getDomain()
  }
 
  ngOnInit(): void {
  }
  getDomain(){
    this.loading=true
    this.meshsService.getMeshs().subscribe((result)=>{
      result.data.forEach(element => {
        if(this.id==element.id){
          this.meshsService.postMeshsDomain({"meshs":{"url":element.url,"token":element.token,"type":"domain"}}).subscribe((domain)=> {
            this.loading=false
            this.listDomain=domain.data
          },(err)=>{
            this.loading=false
            this.messageService.showToast(err.message,'danger')
          })
        }
      });

    },(err)=>{
      this.messageService.showToast(err.message,'danger')
    })
   }
  syncDomain(domain:string){
    this.loading=true
    this.meshsService.getMeshs().subscribe((result)=>{
      result.data.forEach(element => {
        if(this.id=element.id){
          this.meshsService.postMeshsSync({"meshs":{"url":element.url,"token":element.token,"type":"subdomain","domain":domain}}).subscribe((resultSync)=> {
            this.loading=false
            this.messageService.showToast(resultSync.message,'success')
          },(err)=>{
            this.loading=false
            this.messageService.showToast(err.message,'danger')
          })
        }
      })
    },(err)=>{
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }
}


