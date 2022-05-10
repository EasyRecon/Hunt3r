import { Injectable  } from '@angular/core';
import { InvoiceSettingsData,InvoiceDataUpdate,InvoiceData } from './invoices';
import { Observable} from 'rxjs';
import {HttpService} from '../../shared/http.service'
@Injectable()
export class InvoicesService  {


  constructor(private httpService:HttpService)  {

  }

  getInvoiceSettings(): Observable<InvoiceSettingsData> {
    return this.httpService.get<InvoiceSettingsData>('/admin/platforms/intigriti/invoice')
  }
  postInvoiceSettings(settings:InvoiceDataUpdate): Observable<InvoiceSettingsData> {
    return this.httpService.post<InvoiceSettingsData>('/admin/platforms/intigriti/invoice',settings)
  }
  getInvoice(from:any,to:any,invoice_id:any): Observable<InvoiceData> {
    return this.httpService.get<InvoiceData>('/admin/platforms/intigriti/invoice/generate?from='+from+'&to='+to+'&invoice_id='+invoice_id)
  }
 
}