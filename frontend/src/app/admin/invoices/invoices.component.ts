import {Component, OnInit } from '@angular/core';

import { FormGroup,FormBuilder  } from '@angular/forms';
import { InvoicesService } from '../../core/invoices/invoices.service'
import { MessageService  } from '../../shared/message.service';


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  invoiceForm: FormGroup = <FormGroup> {};

  invoice = {
		"user_name": "",
		"user_lastname": "",
		"user_address": "",
		"user_phone": "",
		"user_email": "",
		"user_siret": "",
		"user_bic": "",
		"user_bank": "",
		"user_iban": "",
		"user_vat": false,
		"user_vat_number": "",
		"client_project": "",
		"client_name": "",
		"client_btw": "",
		"client_address": "",
		"client_email": ""
  }
checked_user_vat=false;
loading=true

  constructor(private fbuilder: FormBuilder,
              private messageService: MessageService,
              private invoiceService: InvoicesService) {

      this.invoiceForm = this.fbuilder.group({
        user_name: "",
        user_lastname: "",
        user_address: "",
        user_phone: "",
        user_email: "",
        user_siret: "",
        user_bic: "",
        user_bank: "",
        user_iban: "",
        user_vat: false,
        user_vat_number: "",
        client_project: "",
        client_name: "",
        client_btw: "",
        client_address: "",
        client_email: ""
    });

  }

  urlPDF:any;
  ngOnInit(): void {
    this.getInvoiceSettings() 
  }
  getInvoiceSettings() {
    this.invoiceService.getInvoiceSettings().subscribe( (result) => {
      this.invoice=result.data
      this.invoiceForm = this.fbuilder.group({
        user_name: this.invoice.user_name,
        user_lastname: this.invoice.user_lastname,
        user_address: this.invoice.user_address,
        user_phone: this.invoice.user_phone,
        user_email: this.invoice.user_email,
        user_siret: this.invoice.user_siret,
        user_bic: this.invoice.user_bic,
        user_bank: this.invoice.user_bank,
        user_iban: this.invoice.user_iban,
        user_vat: this.invoice.user_vat,
        user_vat_number: this.invoice.user_vat_number,
        client_project: this.invoice.client_project,
        client_name: this.invoice.client_name,
        client_btw: this.invoice.client_btw,
        client_address: this.invoice.client_address,
        client_email: this.invoice.client_email
    });
    })
    this.loading=false
  }
  toggle(checked: boolean) {
    this.checked_user_vat = checked;
    this.invoiceForm.get('user_vat')!.setValue(checked)
    console.log(this.checked_user_vat)
  }
  updateinvoiceSettings(event:any){
    this.loading=true
    event.preventDefault()
    let data = this.invoiceForm.value
    console.log(data)
    //Object.keys(data).forEach(k => {if(data[k] != '') delete data[k]});
    let finalData = {"invoice": data}
    this.invoiceService.postInvoiceSettings(finalData).subscribe( (result) => {
      this.loading=false
      this.messageService.showToast(result.message,'success')
      this.getInvoiceSettings()
    },(err)=> {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }

  getInvoice(from:any,to:any,invoice_id:any) {
      this.loading=true
      from = new Date(from).toLocaleDateString().split('/').join('-')
      to = new Date(to).toLocaleDateString().split('/').join('-')
      this.invoiceService.getInvoice(from,to,invoice_id).subscribe( (result)=> {
        const source = `data:application/pdf;base64,${result.data}`;
        const link = document.createElement("a");
        link.href = source;
        link.download = `invoices-N°${invoice_id}.pdf`
        link.click(); 
        this.loading=false
      },(err) => {
        this.loading=false
        this.messageService.showToast(err.message,'danger')
      })
  }
}
