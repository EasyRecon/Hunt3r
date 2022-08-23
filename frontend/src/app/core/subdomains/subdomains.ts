
export interface Subdomain {
    id: number ;
    url:string
    infos:{
      ip:string
      cdn:string
      cname:string
      ports:number[]
      title:string
      location:number
      status_code:number
      technologies:technologie[]   
      content_length:number
      
      

    }
 }
 
 export interface SubdomainData {
    message:string
    data:Subdomain[]
    total_pages:number
 }

  export interface technologie {
    name:string
    cpe:string
    version:string
 }

  
 export interface SubdomainScreenshot {
    message:string
    data:{
       screenshot:string
    }
 }