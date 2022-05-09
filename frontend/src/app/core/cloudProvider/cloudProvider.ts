export interface CloudProvider {
        name : string;
        infos: {
            access_key: string;
            secret_key: string;
            organization_id: string;
            project_id: string;
            region: string;
            zone: string,
            ssh_key: string
        }
 }


export interface DataCloudProvider {
    data: CloudProvider[]
 }


 export interface UpdateCloudProvider {
    provider: CloudProvider
 }


 export interface DeleteProviderResponse {
    success: string;
 }




