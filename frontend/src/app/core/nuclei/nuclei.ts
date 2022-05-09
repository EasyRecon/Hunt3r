
export interface NucleiAddTemplate {
    template:{
        name:string
        value:string
    }
}

export interface NucleiResponse {
    message:string
    data:string
}
export interface NucleiResponseTemplate {
    message:string
    data:string[]
}