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

  loadSyncINTI=false
  loadSyncYWH=false
  loadSyncH1=false
  scopeYWH = this.scopeTemplate()

  statYWH = this.statTemplate('yeswehack')
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

  statINTI = this.statTemplate('intigriti')
  scopeINTI = this.scopeTemplate()
    //H1 part
  loadingH1Global=true
  optionsH1Pie:any ;
  optionsH1PieReportStatus: any;
  optionsH1Barre: any = {};
  optionsH1EarnedByMonth: any = {};

  statH1 = this.statTemplate('hackerone')
  scopeH1 = this.scopeTemplate()
  loading=true
  //other
  themeSubscription: any;
  constructor(
    private messageService: MessageService,
    private bugbountyPlatform : BugbountyPlatformService,
    private chartService:ChartService) {

    
  }
  ngOnInit(): void {
    this.bugbountyPlatform.getPlatform().subscribe( (result) => {
      result.data.forEach( (element) => {
       // console.log(this.yeswehackExist)
        if(element.name == 'yeswehack'){
          this.getStatsPlatform('yeswehack')
        } 
        if(element.name == 'intigriti'){
          this.getStatsPlatform('intigriti')
        } 
        if(element.name == 'hackerone'){
          this.getStatsPlatform('hackerone')
        } 
      });     
      this.loading = false;
    },(err) =>{
      this.loading = false;
      this.messageService.showToast(err.message,'danger')
    })

  }
  statTemplate(platform:"intigriti"|"yeswehack"|"hackerone"){
    return {
      earnedEuro:0,
      collab_number:0,
      total_rapports:0,
      average_per_rapport:0.0,
      rapport_severity: this.getCriticity(platform),
      report_by_month:{},
      report_by_status:{},
      earn_by_month:{}
    };
  }
  getCriticity(platform:"intigriti"|"yeswehack"|"hackerone"){
     if(platform=='intigriti')return {"C":0,"H":0,"M":0,"L":0,"E":0}
     //else if(platform=='hackerone') return {"critical":0,"high":0,"medium":0,"low":0}
     else return {"C":0,"H":0,"M":0,"L":0,}
  }
  scopeTemplate(){
    return [
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
  }
  countSeverity(severity:string,rapport_severity:any,plateform:'YWH'|'INTI'|'H1'){
    if(severity!=null) severity=severity[0].toUpperCase() + severity.substr(1).toLowerCase()
    if(severity=="Low")rapport_severity.L++
    if(severity=="Medium")rapport_severity.M++
    if(severity=="High")rapport_severity.H++
    if(severity=="Critical")rapport_severity.C++
    if(plateform=='INTI' && severity=="Exceptional") rapport_severity.E++
    return rapport_severity
  }
  computeStat(platform:'YWH'|'INTI'|'H1') {
    this[`stat${platform}`] = this.globalStat(this[`scope${platform}`],platform)
    this[`loading${platform}Global`]=false
    if(platform=='YWH'){
      this[`options${platform}Pie`] = this.pieCriticity(this[`stat${platform}`].rapport_severity.L,this[`stat${platform}`].rapport_severity.M,this[`stat${platform}`].rapport_severity.H,this[`stat${platform}`].rapport_severity.C,this[`stat${platform}`].rapport_severity.E)
    } else {
      this[`options${platform}Pie`] = this.pieCriticity(this[`stat${platform}`].rapport_severity.L,this[`stat${platform}`].rapport_severity.M,this[`stat${platform}`].rapport_severity.H,this[`stat${platform}`].rapport_severity.C)
    }
    let data = this.initBarreData(this[`stat${platform}`])
    this[`options${platform}Barre`] = this.chartService.barreGraph(data.report_by_month,data.label,'Number of rapport','Number of report')
    let dataTwo   = this.initPie(this[`stat${platform}`])
    this[`options${platform}PieReportStatus`] = this.pieRepport(dataTwo)
    this[`options${platform}EarnedByMonth`] = this.chartService.barreGraph(data.earn_by_month,data.label,"Earn by month",'value')
  }
  globalStat(scope:any,platform:'YWH'|'INTI'|'H1'):any{
    let returnData:{report_by_month:any,earn_by_month:any,report_by_status:any,earnedEuro:number,collab_number:number,rapport_severity:any,average_per_rapport:number,total_rapports:number}={
      "report_by_month":{},
      "earn_by_month":{},
      "report_by_status":{},
      "earnedEuro":0,
      "collab_number":0,
      "rapport_severity":{},
      "average_per_rapport":0.0,
      "total_rapports":0
    }
    _.each(scope, (element) => {
      console.log(returnData,element)
      //total earned
      if(element.reward!=null) returnData.earnedEuro +=  parseInt(element.reward)
      else returnData.earnedEuro += 0
      // collab repport
      if(element.collab){
        returnData.collab_number++
      }
     returnData.rapport_severity=this.countSeverity(element.severity,this[`stat${platform}`].rapport_severity,platform)
      //nombre de rapport par mois
      let date = new Date(element.report_date)
      let dateMonth = `${date.getMonth()+1}`.padStart(2, '0');
      let date2 = parseInt(`${date.getFullYear()}${dateMonth}`)
      if(_.isUndefined(returnData.report_by_month[date2 as keyof typeof returnData.report_by_month])){
        returnData.report_by_month[date2 as keyof typeof returnData.report_by_month]=0
        returnData.earn_by_month[date2]=0
      }
      returnData.earn_by_month[date2]+=element.reward
      returnData.report_by_month[date2]++
      //status des rapports
      if(_.isUndefined( returnData.report_by_status[element.status as keyof typeof returnData.report_by_status]))returnData.report_by_status[element.status as keyof typeof returnData.report_by_status]=0
      returnData.report_by_status[element.status as keyof typeof returnData.report_by_status]++
    })
    returnData.total_rapports=scope.length
    returnData.average_per_rapport=parseFloat((returnData.earnedEuro /scope.length).toFixed(2))
    console.log(returnData)
    return returnData
  }

  sync(platform:'hackerone'|'intigriti'|'yeswehack') {
    let shortname = this.getShortName(platform)
    this[`loadSync${shortname}`]=true
    this.bugbountyPlatform.syncScope(platform).subscribe( (result)=>{
      this[`loadSync${shortname}`]=false
      this.getStatsPlatform(platform)
    },(err) =>{
      this[`loadSync${shortname}`]=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  getShortName(platform:'hackerone'|'intigriti'|'yeswehack'):'INTI'|'YWH'|'H1'{
     switch(platform) { 
       case "hackerone": { 
          return "H1"
          break; 
       } 
       case "intigriti": { 
          return "INTI"
          break; 
       }
      case "yeswehack": { 
          return "YWH"
          break; 
       } 
    } 
  }
  initPie(stat:any){
    let data=Array()
    Object.keys(stat.report_by_status).forEach( (element) => {
      data.push({value:stat.report_by_status[element as keyof typeof stat.report_by_status],name:element})
    })
    return data
  }
  initBarreData(stat:any){
    let month=(new Date()).getMonth();
    let year=((new Date()).getFullYear()-2);
    let data=Array()
    let data2=Array()
    let label=Array()
    for(var i=0;i<25;i++){
      let padMonth = `${month}`.padStart(2, '0')
      let key:string = `${year}${padMonth}`
      let tempLabel:string = `${year}-${padMonth}`
      if(Object.prototype.hasOwnProperty.call(stat.report_by_month,key)){
       data.push(stat.report_by_month[key as keyof typeof stat.report_by_month])
      } else data.push(0)
      if(Object.prototype.hasOwnProperty.call(stat.earn_by_month,key)){
        data2.push(stat.earn_by_month[key as keyof typeof stat.earn_by_month])
       } else data2.push(0)
      label.push(tempLabel)
      if(month==12){
        month=0
        year++
      }
      month++
    }
    return {"report_by_month":data,"earn_by_month":data2,"label":label}
  }

  getStatsPlatform(platform:'hackerone'|'intigriti'|'yeswehack'){
    this.bugbountyPlatform.getScope(platform).subscribe( (result) => {
        let shortname = this.getShortName(platform)
        this[`scope${shortname}`]=result.data
        this.computeStat(shortname)
    })
  }
 
  pieRepport(data:any[]){
    return this.chartService.pieChart(data,'Report by status')
  }
  pieCriticity(low:number,medium:number,high:number,critic:number,exceptional:any=''){
    if(exceptional==''){
        return this.chartService.pieChart([
          { value: low, name: "Low" },
          { value: medium, name: "Medium" },
          { value: high, name: "High" },
          { value: critic, name: "Critical" }
        ],
      'Report by criticity')
    } else {
          return this.chartService.pieChart([
            { value: low, name: "Low" },
            { value: medium, name: "Medium" },
            { value: high, name: "High" },
            { value: critic, name: "Critical" },
            { value: exceptional, name: "Exceptional" }
          ],
        'Report by criticity')
    }
    }
}
