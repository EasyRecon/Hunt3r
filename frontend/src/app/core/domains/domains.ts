
export interface Domain {
      id:number
      name:string
      nb_subdomain:string
      updated_at:string
 }


 export interface DomainData {
    message:string
    data:Domain[]
    total_pages:number
 }