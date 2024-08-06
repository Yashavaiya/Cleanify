import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { Router } from '@angular/router'
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  // private loggedInStatus = JSON.parse(localStorage.getItem('EmailId') || ('false'));
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': '*',
  });

  constructor(private http: HttpClient, private router: Router) { }

  login(data: any) {
    let URL = environment.apiUrl
    return this.http.post(URL + "user/signin", data, { headers: this.headers });
  } 

  resetPassword(data: any) {
    let URL = environment.apiUrl
    return this.http.post(URL + "user/requestPasswordReset", data, { headers: this.headers })
  }

  verification(data: any) {
    let URL = environment.apiUrl
    return this.http.post(URL + "user/otpVerification", data, { headers: this.headers })
  }

  ChangePassword(data: any) {
    let URL = environment.apiUrl
    return this.http.post(URL + "user/resetPassword", data, { headers: this.headers })
  }

  createCustomer(data: FormData) {
    let URL = environment.apiUrl
    return this.http.post(URL + "customer/CreateCustomer", data)  //not use headers 

  }

  uploadPaymentImage(invoiceId: string, file: File){
    const formData: FormData = new FormData();
    formData.append('photo', file, file.name);
    let URL = environment.apiUrl

    return this.http.post( URL +`/invoice/upload/${invoiceId}`, formData);
  }


  deleteCustomer(_id: any) {
    let URL = environment.apiUrl
    return this.http.delete(URL + `customer/deleteCustomer/${_id}`)
  }
  GetCurrentCustomer(_id: any) {
    let URL = environment.apiUrl
    return this.http.get(URL + `customer/ShowIndividualCustomer/${_id}`)
  }
  GetCurrentInvoice(_id: any) {
    let URL = environment.apiUrl
    return this.http.get(URL + `invoice/ShowIndividualInvoice/${_id}`)
  }
  updateCustomerData(_id: any, data: any) {
    let URL = environment.apiUrl
    return this.http.put(URL + `customer/updateCustomer/${_id}`, data)
  }
  updateInvoiceData(_id: any, data: any) {
    let URL = environment.apiUrl
    return this.http.put(URL + `invoice/updateinvoice/${_id}`, data)
  }
  createService(data: FormData) {
    let URL = environment.apiUrl
    return this.http.post(URL + "service/CreateService", data) 
  }
  deleteService(_id: any) {
    let URL = environment.apiUrl
    return this.http.delete(URL + `service/deleteService/${_id}`)
  }
  GetCurrentService(_id: any) {
    let URL = environment.apiUrl
    return this.http.get(URL + `service/ShowIndividualService/${_id}`)
  }
  updateServiceData(_id: any, data: any) {
    let URL = environment.apiUrl
    return this.http.put(URL + `service/updateService/${_id}`, data)
  }

  createSetting(data: any) {
    let URL = environment.apiUrl
    return this.http.post(URL + "setting/CreateSetting", data, { headers: this.headers })

  }

  deleteSetting(_id: any) {
    let URL = environment.apiUrl
    return this.http.delete(URL + `setting/deleteSetting/${_id}`)
  }

  GetCurrentSetting(_id: any) {
    let URL = environment.apiUrl
    return this.http.get(URL + `setting/ShowIndividualSetting/${_id}`)
  }
  updateSettingData(_id: any, data: any) {
    let URL = environment.apiUrl
    return this.http.put(URL + `setting/updateSetting/${_id}`, data)
  }
  createInvoice(data: any) {
    let URL = environment.apiUrl
    return this.http.post(URL + "invoice/CreateInvoice", data, { headers: this.headers })

  }
  deleteInvoice(_id: any) {
    let URL = environment.apiUrl
    return this.http.delete(URL + `invoice/deleteInvoice/${_id}`)
  }

  invoice(_id: any) {
    let URL = environment.apiUrl
    return this.http.get(URL + `invoice/${_id}`)
  }

  // getData(key:any) {
  //   let URL =environment.apiUrl
  //   return this.http.get(URL +`customer/searchCustomer/${key}`);
  // }
  searchData(key: string) {
    let URL = environment.apiUrl
    return this.http.get(URL + `customer/searchCustomer/${key}`);
  }

  logout() {
    sessionStorage.clear();
    window.location.reload();
    
    // window.history.back();
  }

  searchCustomers(key: string) {
    let URL = environment.apiUrl
    return this.http.get<any>(`${URL}/customer/searchCustomer/${key}`);
  }

  searchServices(key: string) {
    let URL = environment.apiUrl
    return this.http.get<any>(`${URL}/service/searchService/${key}`);
  }


  searchInvoices(key: string) {
    let URL = environment.apiUrl
    return this.http.get<any>(`${URL}/invoice/searchInvoice/${key}`);
  }

  getPhoto(filename: string){
    let URL = environment.apiUrl
    return this.http.get(`${URL}/customer/GetPhoto/${filename}`, { responseType: 'blob' });
  }
  getCustomerDetails(customerId: string) {
    let URL = environment.apiUrl
    return this.http.get(`${URL}/customer/getCustomerDetails/${customerId}`);
    
  }


 
} 
