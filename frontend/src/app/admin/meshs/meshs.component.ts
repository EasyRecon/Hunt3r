import {Component, OnInit,TemplateRef} from '@angular/core';
import { MessageService  } from '../../shared/message.service';
import {
  NbDialogService,
} from '@nebular/theme';

import { MeshsService } from '../../core/meshs/meshs.service';
import { Router } from '@angular/router';
import { MeshConfig } from '../../core/meshs/meshs';


import { FormGroup,FormBuilder   } from '@angular/forms';




@Component({
  
  templateUrl: './meshs.component.html',
  styleUrls: ['./meshs.component.scss']
})

export class MeshsComponent implements  OnInit  {

  loadingModalUpdate = false
  loadingModalCreate = false;
  dialogueRefUpdate:any;
  dialogueRefCreate:any;
  loading = true;
  updateMeshForm: FormGroup = <FormGroup> {};
  createMeshForm: FormGroup = <FormGroup> {};
  meshs: MeshConfig[] = [{
    id: 0,
    name: '',
    url: '',
    token: ''
  }]
  




  constructor(private messageService: MessageService,
              private meshsService:MeshsService,
              private fbuilder: FormBuilder,
              private dialogService: NbDialogService,
              private router:Router) {
    this.updateMeshForm = this.fbuilder.group({
      name: '',
      url: '',
      token: ''
  });
  this.createMeshForm = this.fbuilder.group({
    name: '',
    url: '',
    token: ''
});
    this.getMesh()
  }

gotToSyncMesh(id:number){
  this.router.navigate(['admin','meshs','sync',id]);
}
  getMesh() {
    this.loading = true;
    this.meshsService.getMeshs().subscribe( (result)=> {
      this.meshs=result.data
      this.loading = false;
    },(err) => {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
    
  }
  ngOnInit(): void {
  }
  createMesh(event:any){
    event.preventDefault()
    this.loadingModalCreate = true 
    let data = this.createMeshForm.value
    this.meshsService.createMeshs(data).subscribe( (result) => {
      this.loadingModalCreate = false 
      this.messageService.showToast(result.message,'success')
      this.closeCreate()
      this.getMesh()
    },(err) => {
      this.loadingModalCreate = false 
      this.messageService.showToast(err.message,'danger')
    })
  }
  updateMesh(event:any) {
    event.preventDefault()
    this.loadingModalUpdate = true 
    let data = this.updateMeshForm.value
    this.meshsService.updateMeshs(data).subscribe( (result) => {
      this.loadingModalUpdate = false 
      this.messageService.showToast(result.message,'success')
      this.closeUpdate()
      this.getMesh()
    },(err) => {
      this.loadingModalUpdate = false 
      this.messageService.showToast(err.message,'danger')
    })
  }
  deleteMesh(id:number){
    this.loading=true
    this.meshsService.deleteMeshs(id).subscribe( (result) => {
      this.loading=false
      this.getMesh()
    },(err) => {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }

  meshUpdateModal(dialog: TemplateRef<any>,id:number){
    this.meshs.forEach(element => {
      if(element.id == id ){
        console.log(element)
        this.updateMeshForm = this.fbuilder.group({
          name: element.name,
          url: element.url,
          token: element.token
      });
      } 
    });
    this.dialogueRefUpdate = this.dialogService.open(dialog);
  }
  meshCreateModal(dialog: TemplateRef<any>) {
    this.dialogueRefCreate = this.dialogService.open(dialog);
  }
  closeCreate() {
    this.dialogueRefCreate.close();
  }
    closeUpdate() {
    this.dialogueRefUpdate.close();
  }
}


