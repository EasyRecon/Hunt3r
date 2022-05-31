
export interface Url {
    url: number ;
    status_code: number ;
    content_length: number;
 }


export interface UrlData {
   message:string
   data:Url[]
   total_pages:number
}