import {Component, OnInit } from '@angular/core';

import { NbThemeService } from '@nebular/theme';

import * as _ from 'lodash';
import { BugbountyPlatformService } from '../../core/bugbountyPlatform/bugbountyPlatform.service'
import { MessageService  } from '../../shared/message.service';
import { ChartService  } from './chart.service';


  import 'echarts/lib/chart/pie'
  import 'echarts/lib/chart/bar'

  import 'echarts/lib/component/legend'
@Component({
  selector: 'ngx-dashboard',
  templateUrl: './bugbountyStat.component.html',
  styleUrls: ['./bugbountyStat.component.scss']
})
export class BugbountyStatComponent implements OnInit {

  loadSyncInti=false
  loadSyncYwh=false
  scopeYWH = [
    {
      "id":"",
      "title":"",
      "severity":"",
      "reward":"",
      "collab":"",
      "status":"",
      "report_date":""
    }
  ]

  statYWH = {
    earnedEuro:0,
    collab_number:0,
    total_rapports:0,
    average_per_rapport:0.0,
    rapport_severity:{
      "C":0,
      "H":0,
      "M":0,
      "L":0
    },
    report_by_month:{
    },
    report_by_status:{
    },
    earn_by_month:{
    }
  };
  optionsYWHPie:any ;
  optionsYWHPieReportStatus: any;
  optionsYWHBarre: any = {};
  optionsYWHEarnedByMonth: any = {};
  loadingYWHGlobal=true
//inti part
loadingINTIGlobal=true
optionsINTIPie:any ;
optionsINTIPieReportStatus: any;
optionsINTIBarre: any = {};
optionsINTIEarnedByMonth: any = {};

statINTI = {
  earnedEuro:0,
  collab_number:0,
  total_rapports:0,
  average_per_rapport:0.0,
  rapport_severity:{
    "C":0,
    "H":0,
    "M":0,
    "L":0
  },
  report_by_month:{
  },
  report_by_status:{
  },
  earn_by_month:{
  }
};
  scopeINTI = [
    {
      "id":"",
      "title":"",
      "severity":"",
      "reward":"",
      "collab":"",
      "status":"",
      "report_date":""
    }
  ]


  loading=true

  yeswehackExist=false
  intigritiExist = false

  //other
  themeSubscription: any;
  constructor(
    private messageService: MessageService,
    private bugbountyPlatform : BugbountyPlatformService,
    private chartService:ChartService) {

    
  }

  ngOnInit(): void {
    this.bugbountyPlatform.getPlatform().subscribe( (result) => {
      this.yeswehackExist = false;
      this.intigritiExist = false;
      let one = false
      result.data.forEach( (element) => {
       // console.log(this.yeswehackExist)
        if(element.name == 'yeswehack'){
          this.yeswehackExist=true
          this.getStatsPlatform('yeswehack')
          one=true
        } 
        if(element.name == 'intigriti'){
          this.intigritiExist = true
          this.getStatsPlatform('intigriti')
          one=true
        } 
      });     
      this.loading = false;
    },(err) =>{
      this.loading = false;
      this.messageService.showToast(err.message,'danger')
    })

  }
  computeYWHStat() {
    var temp=Array();
    var tempStatus=Array()
    var tempEarnByMonth=Array()
    this.loadingYWHGlobal=true
    _.each(this.scopeYWH, (element) => {
      //total earned
      this.statYWH.earnedEuro +=  parseInt(element.reward)
      // collab repport
      if(element.collab){
        this.statYWH.collab_number++
      }
      // order by severety
      if(element.severity=="Low")this.statYWH.rapport_severity.L++
      if(element.severity=="Medium")this.statYWH.rapport_severity.M++
      if(element.severity=="High")this.statYWH.rapport_severity.H++
      if(element.severity=="Critical")this.statYWH.rapport_severity.C++
      //nombre de rapport par mois
      let date = new Date(element.report_date)
      let dateMonth = `${date.getMonth()+1}`.padStart(2, '0');
      let date2 = parseInt(`${date.getFullYear()}${dateMonth}`)
      if(_.isUndefined(temp[date2])){
        temp[date2]=0
        tempEarnByMonth[date2]=0
      }
      tempEarnByMonth[date2]+=element.reward
      temp[date2]++
      //gain par mois

      //status des rapports
      if(_.isUndefined(tempStatus[element.status as keyof typeof tempStatus]))tempStatus[element.status as keyof typeof tempStatus]=0
      tempStatus[element.status as keyof typeof tempStatus]++

    })
    
    this.statYWH.report_by_month= temp
    this.statYWH.report_by_status = tempStatus
    this.statYWH.earn_by_month = tempEarnByMonth
    this.statYWH.total_rapports=this.scopeYWH.length
    this.statYWH.average_per_rapport = parseFloat((this.statYWH.earnedEuro /this.scopeYWH.length).toFixed(2))
    this.loadingYWHGlobal=false
   // console.log(this.statYWH)
    this.optionsYWHPie = this.pieCriticity(this.statYWH.rapport_severity.L,this.statYWH.rapport_severity.M,this.statYWH.rapport_severity.H,this.statYWH.rapport_severity.C)
    this.initYWHBarre()
    this.initYWHPiReportStatus()
    this.initYWHEarnByMonth()
    //console.log(this.statYWH)
    
  }
 
  syncYWH() {
    this.loadSyncYwh=true
    this.bugbountyPlatform.syncScope('yeswehack').subscribe( (result)=>{
      this.loadSyncYwh=false
      this.getStatsPlatform('yeswehack')
    },(err) =>{
      this.loadSyncYwh=false
      this.messageService.showToast(err.message,'danger')
    })
  }

  initYWHPiReportStatus(){
    let data=Array()
    Object.keys(this.statYWH.report_by_status).forEach( (element) => {
      data.push({value:this.statYWH.report_by_status[element as keyof typeof this.statYWH.report_by_status],name:element})
    })
    //console.log(data)
    this.optionsYWHPieReportStatus = this.pieRepport(data)
  }

  initYWHBarre(){
    let month=(new Date()).getMonth();
    let year=((new Date()).getFullYear()-2);
    let data=Array()
    let label=Array()
    for(var i=0;i<25;i++){
      let padMonth = `${month}`.padStart(2, '0')
      let key:string = `${year}${padMonth}`
      let tempLabel:string = `${year}-${padMonth}`
      if(Object.prototype.hasOwnProperty.call(this.statYWH.report_by_month,key)){
       data.push(this.statYWH.report_by_month[key as keyof typeof this.statYWH.report_by_month])
      } else {
        data.push(0)
      }
      label.push(tempLabel)
      if(month==12){
        month=0
        year++
      }
      month++
    }
    this.optionsYWHBarre = this.chartService.barreGraph(data,label,'Number of rapport','Number of report')
  }
  
  initYWHEarnByMonth(){
    let month=(new Date()).getMonth();
    let year=((new Date()).getFullYear()-2);
    let data=Array()
    let label=Array()
    for(var i=0;i<25;i++){
      let padMonth = `${month}`.padStart(2, '0')
      let key:string = `${year}${padMonth}`
      let tempLabel:string = `${year}-${padMonth}`
      if(Object.prototype.hasOwnProperty.call(this.statYWH.earn_by_month,key)){
       data.push(this.statYWH.earn_by_month[key as keyof typeof this.statYWH.earn_by_month])
      } else {
        data.push(0)
      }
      label.push(tempLabel)
      if(month==12){
        month=0
        year++
      }
      month++
    }
    this.optionsYWHEarnedByMonth = this.chartService.barreGraph(data,label,"Earn by month",'value')
  }
  //---------------Intigriti part

  getStatsPlatform(platform:string){
    this.bugbountyPlatform.getScope(platform).subscribe( (result) => {
      if(platform=='yeswehack'){
        this.scopeYWH=result.data
        this.computeYWHStat()
      }
      if(platform=='intigriti'){
        this.scopeINTI=result.data
        this.computeINTIStat()
      }

    })
  }

  computeINTIStat() {
      var temp=Array();
      var tempStatus=Array()
      var tempEarnByMonth=Array()
      this.loadingINTIGlobal=true
      console.log(this.scopeINTI)
      _.each(this.scopeINTI, (element) => {
        //total earned
        this.statINTI.earnedEuro +=  parseInt(element.reward)
        // collab repport
        if(element.collab){
          this.statINTI.collab_number++
        }
        // order by severety
        if(element.severity=="Low")this.statINTI.rapport_severity.L++
        if(element.severity=="Medium")this.statINTI.rapport_severity.M++
        if(element.severity=="High")this.statINTI.rapport_severity.H++
        if(element.severity=="Critical")this.statINTI.rapport_severity.C++
        //nombre de rapport par mois
        let date = new Date(element.report_date)
        let dateMonth = `${date.getMonth()+1}`.padStart(2, '0');
        let date2 = parseInt(`${date.getFullYear()}${dateMonth}`)
        if(_.isUndefined(temp[date2])){
          temp[date2]=0
          tempEarnByMonth[date2]=0
        }
        tempEarnByMonth[date2]+=element.reward
        temp[date2]++
        //gain par mois

        //status des rapports
        
        if(_.isUndefined(tempStatus[element.status as keyof typeof tempStatus]))tempStatus[element.status as keyof typeof tempStatus]=0
        tempStatus[element.status as keyof typeof tempStatus]++
      })
        this.statINTI.report_by_month= temp
        this.statINTI.report_by_status = tempStatus
        this.statINTI.earn_by_month = tempEarnByMonth
        this.statINTI.total_rapports=this.scopeINTI.length
        this.statINTI.average_per_rapport = parseFloat((this.statINTI.earnedEuro /this.scopeINTI.length).toFixed(2))
        this.loadingINTIGlobal=false
        //console.log(this.statINTI)
        this.optionsINTIPie =  this.pieCriticity(this.statINTI.rapport_severity.L,this.statINTI.rapport_severity.M,this.statINTI.rapport_severity.H,this.statINTI.rapport_severity.C)

      
      this.initINTIBarre()
      this.initINTIPiReportStatus()
      this.initINTIEarnByMonth()
      //console.log(this.statINTI)
  }
  syncINTI() {
    this.loadSyncInti=true
    this.bugbountyPlatform.syncScope('intigriti').subscribe( (result)=>{
      this.loadSyncInti=false
      this.getStatsPlatform('intigriti')
    },(err) =>{
      this.loadSyncInti=false
      this.loadingINTIGlobal = false;
      this.messageService.showToast(err.message,'danger')
    })
  }

  initINTIPiReportStatus(){
    let data=Array()
    Object.keys(this.statINTI.report_by_status).forEach( (element) => {
      data.push({value:this.statINTI.report_by_status[element as keyof typeof this.statINTI.report_by_status],name:element})
    })
    //console.log(data)
    this.optionsINTIPieReportStatus = this.pieRepport(data)
  }

  initINTIBarre(){
    let month=(new Date()).getMonth();
    let year=((new Date()).getFullYear()-2);
    let data=Array()
    let label=Array()
    for(var i=0;i<25;i++){
      let padMonth = `${month}`.padStart(2, '0')
      let key:string = `${year}${padMonth}`
      let tempLabel:string = `${year}-${padMonth}`
      if(Object.prototype.hasOwnProperty.call(this.statINTI.report_by_month,key)){
       data.push(this.statINTI.report_by_month[key as keyof typeof this.statINTI.report_by_month])
      } else {
        data.push(0)
      }
      label.push(tempLabel)
      if(month==12){
        month=0
        year++
      }
      month++
    }
    this.optionsINTIBarre =  this.chartService.barreGraph(data,label,'Report by month','value')
  }
  
  initINTIEarnByMonth(){
    let month=(new Date()).getMonth();
    let year=((new Date()).getFullYear()-2);
    let data=Array()
    let label=Array()
    for(var i=0;i<25;i++){
      let padMonth = `${month}`.padStart(2, '0')
      let key:string = `${year}${padMonth}`
      let tempLabel:string = `${year}-${padMonth}`
      if(Object.prototype.hasOwnProperty.call(this.statINTI.earn_by_month,key)){
       data.push(this.statINTI.earn_by_month[key as keyof typeof this.statINTI.earn_by_month])
      } else {
        data.push(0)
      }
      label.push(tempLabel)
      if(month==12){
        month=0
        year++
      }
      month++
    }
    this.optionsINTIEarnedByMonth = this.chartService.barreGraph(data,label,"Earn by month","value")
  }
  pieRepport(data:any[]){
    return this.chartService.pieChart(data,
                       'Report by status')
  }
  pieCriticity(low:number,medium:number,high:number,critic:number){
    return this.chartService.pieChart([
                    { value: low, name: "Low" },
                    { value: medium, name: "Medium" },
                    { value: high, name: "High" },
                    { value: critic, name: "Critical" }
                  ],
                'Report by criticity')
  }
}
