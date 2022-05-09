
export interface InvoiceData {

    user_name: string
    user_lastname: string
    user_address: string
    user_phone: string
    user_email: string
    user_siret: string
    user_bic: string
    user_bank: string
    user_iban: string
    user_vat: boolean
    user_vat_number: string
    client_project: string
    client_name: string
    client_btw: string
    client_address: string
    client_email: string

}
export interface InvoiceDataUpdate {
    invoice: InvoiceData
}

export interface InvoiceSettingsData {
    message:string;
    data: InvoiceData;
}
export interface InvoiceData {
    message:string;
    data: string;
}