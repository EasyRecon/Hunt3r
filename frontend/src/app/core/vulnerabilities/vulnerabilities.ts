
export interface VulnerabilitiesResponse {
   message: string
   data: Vulnerabilities[]
   total_pages:number
}

export interface Vulnerabilities {
   id:number
   name: string
   severity: string
   matched_at:string
   created_at:string
}

export interface VulnerabilitiesDeleteResponse {
   message: string
   data: Vulnerabilities[]
}