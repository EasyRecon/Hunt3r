
export interface Url {
    url: number ;
    status_code: string ;
    content_length: string;
 }


export interface UrlData {
   message:string
   data:Url[]
}