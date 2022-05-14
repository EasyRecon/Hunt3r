export interface Scan {
    id:number
    domain:string
    type_scan:"recon"|"nuclei"
    instance_type:string
    provider:string
    notifs:boolean
    active_recon:string
    intel:boolean
    leak:boolean
    nuclei:boolean
    all_template:boolean
    permutation:boolean
    gau:boolean
    excludes: string[]
    meshs: boolean
    nuclei_severity: string[]
    custom_interactsh: boolean,
    custom_template:string[]
    state:string
}

export interface AddScanData {
    domain:string
    type_scan: "recon"|"nuclei",
    instance_type: string,
    provider: string,
    notifs: boolean,
    active_recon: boolean,
    intel: boolean,
    leak: boolean,
    nuclei: boolean,
    all_templates: boolean,
    permutation: boolean,
    gau: boolean,
    excludes:string[]
    meshs:boolean
    nuclei_severity:string[]
    custom_interactsh: boolean,
    custom_templates: string[]
}
export interface ScanResponse {
    message:string
    data: Scan[]
}
export interface AddScan {
    scan:AddScanData
}