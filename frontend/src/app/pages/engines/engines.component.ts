import {Component, OnInit,TemplateRef} from '@angular/core';
import {NucleiService} from '../../core/nuclei/nuclei.service';

import {EnginesService} from '../../core/engines/engines.service';
import {Engine} from '../../core/engines/engines';
import { FormGroup,FormBuilder   } from '@angular/forms';
import { MessageService  } from '../../shared/message.service';
import {
  NbDialogService
} from '@nebular/theme';




@Component({
  
  templateUrl: './engines.component.html',
  styleUrls: ['./engines.component.scss']
})
export class EnginesComponent implements OnInit {

  enginesList:Engine[]=<any>[]
  loading=true
  loadingModal=false
  addEngineForm: FormGroup = <FormGroup> {};
  engineModal:any;
  templatList:string[]=<any>[]
  modelEngine:Engine=<Engine>{}


  constructor(private enginesService : EnginesService,
              private messageService: MessageService,
              private fbuilder: FormBuilder,
              private dialogService: NbDialogService,
              private nucleiService: NucleiService) {
    
this.initEngineForm()
    this.getEngines()
  }

  ngOnInit(): void {

   
  }
initEngineForm(){
  this.addEngineForm = this.fbuilder.group({
    "type_scan": "",
    "instance_type": "",
    "provider": "",
    "notifs": false,
    "active_recon": false,
    "intel": false,
    "leak": false,
    "nuclei": false,
    "custom_interactsh":false,
    "nuclei_severity":[],
    "all_templates": false,
    "meshs":false,
    "permutation": false,
    "gau": false,
    "custom_templates": []
});
}
initEmptyEngine():any{
  return {
    "name":"",
    "infos":  {
      "type_scan": "",
      "instance_type": "",
      "provider": "",
      "notifs": false,
      "active_recon": false,
      "intel": false,
      "leak": false,
      "nuclei": false,
      "custom_interactsh":false,
      "nuclei_severity":[],
      "all_templates": false,
      "meshs":false,
      "permutation": false,
      "gau": false,
      "custom_templates": []
  }
  }

}
  addEngineModal(dialog: TemplateRef<any>){
    this.loadingModal=true
    this.engineModal = this.dialogService.open(dialog, { context: '-1' });
    this.nucleiService.getTemplate().subscribe((result)=> {
      this.modelEngine=this.initEmptyEngine()
      this.loadingModal=false
      this.templatList=result.data
      this.initEngineForm()
      
    },(err)=>{
      this.loadingModal=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  openUpdateTemplate(id:number,dialog: TemplateRef<any>){
    this.loadingModal=true
    this.engineModal = this.dialogService.open(dialog, { context: `${id}` });
    this.enginesList.forEach((element)=>{
      if(element.id==id){
       this.modelEngine=element
       this.loadingModal=false
       this.upddateModlaValue(element)
      }
    })
    this.nucleiService.getTemplate().subscribe((result)=> {
      this.loadingModal=false
      this.templatList=result.data
    },(err)=>{
      this.loadingModal=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  upddateModlaValue(element:any){
    Object.keys(element.infos).forEach((key) => {
      this.addEngineForm.get(key)!.setValue(element.infos[key as keyof typeof element.infos])
    })
  }
  closeAddEngineModal(){
    this.engineModal.close()
  }
  toggle(checked: any,name:string) {

    this.addEngineForm.get(name)!.setValue(checked)
    console.log(this.addEngineForm.value)
  }

  addEngine(event:any,name:string){
    this.loadingModal=true
    let infos = this.addEngineForm.value
    if(infos.custom_templates==null)infos.custom_templates=[]
    let corp:Engine = {"id":0,"name":name,"infos":infos}
    this.enginesService.createEngine(corp).subscribe( (result)=> {
      this.loadingModal=false
      this.closeAddEngineModal()
      this.getEngines()
    },(err)=> {
      this.loadingModal=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  updateEngine(event:any,name:string,id:number){
    this.loadingModal=true
    let infos = this.addEngineForm.value
    if(infos.custom_templates==null)infos.custom_templates=[]
    let corp:Engine = {"id":0,"name":name,"infos":infos}
    this.enginesService.updateEngine(corp,id).subscribe( (result)=> {
      this.loadingModal=false
      this.closeAddEngineModal()
      this.getEngines()
    },(err)=> {
      this.loadingModal=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  getEngines(){
    this.loading=true
    this.enginesService.getEngines().subscribe( (result)=> {
      this.loading=false
      this.enginesList=result.data
    },(err)=> {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }
    deleteEngine(id:number){
    this.loading=true
    this.enginesService.deleteEngine(id).subscribe( (result)=> {
      this.loading=false
      this.messageService.showToast(result.message,'success')
      this.getEngines()
    },(err)=> {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }
}
