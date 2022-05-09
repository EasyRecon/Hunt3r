
export interface Subdomain {
    id: number ;
    url:string
    infos:{
      ip:string
      cname:string
      ports:number[]
      title:string
      body_hash:string
      screenshot:string
      status_code:number
      technologies:string[]
      content_length:number
      location:number
      cdn:string

    }
 }
 
 export interface SubdomainData {
    message:string
    data:Subdomain[]
    total_pages:number
 }

  
 export interface SubdomainScreenshot {
    message:string
    data:{
       screenshot:string
    }
 }