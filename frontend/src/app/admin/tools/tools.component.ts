import {Component, OnInit,TemplateRef,ViewChild,AfterViewInit } from '@angular/core';
import {ToolsService} from '../../core/tools/tools.service';
import { MessageService  } from '../../shared/message.service';
import {
  NbComponentStatus,
  NbDialogService

} from '@nebular/theme';

import { FormGroup,FormBuilder   } from '@angular/forms';
import { ToolsConfig } from 'src/app/core/tools/tools';




@Component({
  
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit, AfterViewInit  {
  dialogueRefUpdate:any;

  loading = true;
  toolModel:any[]=[];
  toolsList:any[]=[]
  tools:ToolsConfig[]=<ToolsConfig[]>[]
modalHTML:any;


@ViewChild('dialogCreateGlobal', { read: TemplateRef }) dialogCreateGlobal:any;
private defaultTabButtonsTpl: any;


toolsFormGlobal: FormGroup = <FormGroup> {};

  dialogueRefCreate:any;


  constructor(private messageService: MessageService,
              private toolsService:ToolsService,
              private fbuilder: FormBuilder,
              private dialogService: NbDialogService) {
    this.toolsFormGlobal= this.fbuilder.group({ name: '',user: '', password: '',api_key:'',webhook:'',url:'',config_value:''});
    this.getToolsModel()
    this.getTools()

  }


  ngOnInit(): void {

  }
  ngAfterViewInit() {

  }
  blankFrom(){
    this.toolsFormGlobal= this.fbuilder.group({ name: '',user: '', password: '',api_key:'',webhook:'',url:'',config_value:''});
  }

  closeModal() {
    this.dialogueRefCreate.close();
  }
  createModal(tool:any){
   this.blankFrom()
   this.dialogueRefCreate= this.dialogService.open(this.dialogCreateGlobal, { context: {name:tool,required:this.toolModel[tool]} });
   this.toolsFormGlobal.controls['name'].setValue(tool);
  }
  updateModal(tool:any){
   this.blankFrom()
   this.dialogueRefCreate= this.dialogService.open(this.dialogCreateGlobal, { context: {name:tool,required:this.toolModel[tool]} });
   this.setElement(tool,this.toolModel[tool])

  }
  setElement(tool:string,key:any[],){
    this.tools.forEach((element)=>{ 
      if(element.name==tool){ 
        key.forEach((keys:any)=>{
          if(keys=='config_value'){
            element.infos[keys as keyof typeof element.infos]=atob(element.infos[keys as keyof typeof element.infos])
          }
          this.toolsFormGlobal.controls[keys].setValue(element.infos[keys as keyof typeof element.infos])
        })
      } 
    })
  }

  updateTools(event:any,name:any){
    this.loading=true
    event.preventDefault()
    var data= this.toolsFormGlobal.value
    if(data.config_value){
      data.config_value=btoa( data.config_value)
    }
    delete data.name
    data=Object.fromEntries(Object.entries(data).filter(([_, v]) => v != ""));
    let finalData={"tool":{"name":name,"infos":data}}
    this.toolsService.updateTools(finalData).subscribe( (result) => {
        this.closeModal()
        this.loading=false
        this.messageService.showToast(result.message,'success')
        this.getTools()
    },(err) => {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  getTools(){
    this.loading=true
    this.toolsService.getTools().subscribe( (result) => {
      this.loading=false
      this.tools=result.data
      
    },(err) => {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  getKey(tool:any){
    let data=''
    this.tools.forEach((element)=>{
      if(element.name==tool){
        data=Object.keys(element.infos).join(',')
      }
    })
    return data
  }

  getToolsModel() {
    this.toolsService.getToolsModel().subscribe( (result) => {
      this.toolModel=result.data
      this.toolsList=Object.keys(result.data)
    },(err) => {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }

}
