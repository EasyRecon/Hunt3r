import {Injectable } from '@angular/core';








@Injectable({
  providedIn: 'root'
})

export class ChartService {
    constructor() { }
    barreGraph(data:any[],label:any[],title:string,yaxis:string){
        return{
          title: {
            text: title,
            //x: "center"
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: label,
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',      
            },
          ],
          series: [
            {
              name: yaxis,
              type: 'bar',
              barWidth: '60%',
              data: data,
            },
          ],
        };
      }
      pieChart(data:any[],title:string){
        return {
          title: {
            text: title,
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          calculable: true,
          series: [
            {
              name: title,
              type: "pie",
              radius: [30, 110],
              roseType: "area",
              data: data,
              color:['#00d68f','#fa0','#ff3d71','#222b45']
            }
          ]
        };
    
      }

 }