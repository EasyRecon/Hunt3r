export interface BugBountyPlatformSettingsResponse {
    success: string;
 }

 export interface BugBountyPlatformSettings {
    name: string;
    email: string;
    password: string;
    otp: string;
 }

 export interface BugBountyPlatformSettingsResponse {
    message:string
    data: BugBountyPlatformSettings[]
 }

 export interface BugBountyPlatformSettingsUpdate {
    platform: BugBountyPlatformSettings
 }
 

 export interface BugBountyPlatformStatsResponse {
   data: BugBountyPlatformSettings[]
   message:string;
}


export interface BugBountyPlatformSyncsResponse {
   message: string
   data:string
}

export interface BugBountyPlatformSyncs {
   id:string;
   title:string;
   severity:string;
   reward:string;
   collab:string;
   status:string;
   report_date:string;
}
export interface BugBountyPlatformSyncsData {
   data:BugBountyPlatformSyncs[]
   message:string;
}