import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { HttpClient } from "@angular/common/http";
import { environment } from './../../environments/environment'
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-invoice',
  templateUrl: './update-invoice.component.html',
  styleUrls: ['./update-invoice.component.css']
})
export class UpdateInvoiceComponent {
  yourModelVariable: string = '';
  isError: boolean = false;
  successMessage :String='';
  selectedCustomerId:any;


  dropdownList: [];
  dropdownSettings: any;
  selectedItems: any;
  selectedItemCustomer: any;
  updateInvoice: FormGroup;
  items: FormArray;
  multiDataSettings: any;
  multiData: any;
  selectedValue: any
  customerData: any;
  ServiceData: any;
  value: any;
  filtered: any;
  createStoreForm: FormGroup;
  service: FormGroup;
  selectedServices: any = [];
  customerId: any = null;
  itemsId: any = null;
  hour: number;
  rate: number;
  servicesArray: any = []
  settingData: any;
  selectedCustomer: any; 



  constructor(private fb: FormBuilder, private authService: AuthServiceService, private httpClient: HttpClient, private router: ActivatedRoute, private Router: Router) {

    this.createStoreForm = fb.group({
      'email': ['', Validators.required],
      'address': ['', Validators.required],
      'phone': ['', Validators.required],

    });

    this.filtered = [];
    this.customerData = [];
    this.ServiceData = [];
    this.value = [];
    this.settingData = [];

  }

  ngOnInit() {
    this.getCustomerData();
    this.getServiceData();
    this.initForm();
    this.getSettingData();

    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.service = new FormGroup({
      items: new FormArray([])
    });



    console.log(this.router.snapshot.params['_id']);
    this.authService.GetCurrentInvoice(this.router.snapshot.params['_id']).subscribe((response: any) => {
      console.log("response", response);
      this.updateInvoice = new FormGroup({
        invoice_number: new FormControl(response.invoice_number),
        customer_Id: new FormControl(response.customer_Id),
        service_date: new FormControl(response.service_date),
        service: new FormControl(response.service),
        total_amount: new FormControl(response.total_amount),
        tax_amount: new FormControl(response.tax_amount),

      })
      const selectedCustomer = this.customerData.find(customer => customer._id === response.customer_Id);
      console.log("selectedCustomer", selectedCustomer)
      if (selectedCustomer) {
        this.selectedCustomerId = selectedCustomer._id;
      }

      this.createStoreForm.patchValue({
        'email': selectedCustomer.email,
        'address': selectedCustomer.address,
        'phone': selectedCustomer.phone,
      });

      this.selectedServices = response.service; 
      console.log("response.service:.",response.service);
      this.selectedItems = this.selectedServices.map(service => service);
      this.selectedServices.forEach(service => {
        this.items = this.service.get('items') as FormArray;
        this.items.push(this.fb.group({
          rate: service.rate,
          hour: service.hour,
          amount: service.amount
        }));
      });

    })


  }

  initForm() {
    this.updateInvoice = new FormGroup({
      invoice_number: new FormControl(''),
      // customer_Id:new FormControl(''),
      service_date: new FormControl('', [Validators.required]),
      service: new FormControl([]),
      total_amount: new FormControl('', [Validators.required]),
      tax_amount: new FormControl('', [Validators.required])
    })
  }




  collection() {
    if (this.updateInvoice.valid) {
    console.log("id:", this.router.snapshot.params['_id']);
    this.authService.updateInvoiceData(this.router.snapshot.params['_id'], this.updateInvoice.value).subscribe((result: any) => {
      console.log("result", result)
      if (result.status == "success") {
        this.showMessage("Invoice update successfully", 1000);
        setTimeout(() => {
          this.Router.navigate(['/showInvoice']);
        }, 1000)
      } else {
        alert("update customer failed")
      }
    })
  }else{
    alert("Mandatory fields required!")
  }
  }

  onItemSelect(items: any) {
    console.log("items", items);
    this.itemsId = items._id;
    this.servicesArray.push(items)
    this.items = this.service.get('items') as FormArray;
    this.items.push(this.createItem());
    let result: any = this.dropdownList.filter((data: any) => data._id === this.itemsId);

    console.log("result1", result);
    this.selectedServices.push(result[0]);
    let index = this.selectedServices.findIndex((service: any) => service._id === this.itemsId);

    let SettingValue = (<FormArray>this.service.controls['items']).at(index);

    SettingValue.patchValue({
      amount: '',
      rate: result[0].rate,
      hour: ''
    });
  }

  onItemDeSelect(items: any) {
    console.log("items:",items);
    this.itemsId = items._id;
    this.servicesArray = this.servicesArray.filter((service: any) => service._id !== this.itemsId);
    console.log("servicesArray:",this.servicesArray);
  
    let index = this.selectedServices.findIndex((service: any) => service._id === this.itemsId);
    console.log("index:",index);
  
    if (index !== -1) {
      this.selectedServices.splice(index, 1);
    this.deleteServiceGroup(index);
    }
  }


  onSelectAll(items: any) {
    console.log(items);
  }


  createItem(): FormGroup {
    return this.fb.group({
      rate: '',
      hour: '',
      amount: ''
    });
  }

  get data() {
    return this.service.controls['items'] as FormArray
  }

  deleteServiceGroup(index: number) {
    const add = this.service.get('items') as FormArray;
    add.removeAt(index)
    const total = this.items.value.reduce((acc: any, curr: any) => {
      acc += (curr.hour || 0) * (curr.rate || 0);
      return acc;
    }, 0);
    var taxAmount = (total * this.settingData[0].tax) / 100;
    const totalAmountWithTax = total + taxAmount;
    this.updateInvoice.get('total_amount').setValue(totalAmountWithTax);
    this.updateInvoice.get('tax_amount').setValue(taxAmount);

  }


  getCustomerData() {
    let URL = environment.apiUrl;
    this.httpClient.get(URL + "customer/ShowCustomer").subscribe((result: any) => {
      this.customerData = result;
      console.log("result", result);
    })
  }


  getServiceData() {
    let list: any = []
    let URL = environment.apiUrl;
    this.httpClient.get(URL + "service/ShowService").subscribe((result: any) => {


      this.dropdownList = result;
      console.log("dropdownList", result);
    })
  }


  onSelect(event: any) {
    this.customerId = event.target.value;
    console.log("customerId : ", event.target.value)
    console.log("customerData : ", this.customerData)
    const result = this.customerData.filter((data: any) => data._id === this.customerId);

    this.updateInvoice.patchValue({
      customer_Id: this.customerId,
    })
    console.log("this.customerId:",this.customerId)
    this.createStoreForm.patchValue({
      'email': result[0].email,
      'address': result[0].address,
      'phone': result[0].phone,
    });
  }


  addItem(): void {
    this.items = this.service.get('items') as FormArray;
    this.items.push(this.createItem());
  }



  onChangeHour(index: number) {
    const items = this.items;
    if (items && items.at(index)) {
      const amount = (items.at(index).get('rate').value || 0) * (items.at(index).get('hour').value || 0);
      items.at(index).get('amount').setValue(amount);

    

      if (this.selectedServices[index]) {
  
        // add field in database hour and rate
        this.selectedServices[index].hour = this.items.at(index).get('hour').value
        this.selectedServices[index].rate = this.items.at(index).get('rate').value
        this.selectedServices[index].amount = this.items.at(index).get('amount').value
      }


    }

    var total = this.items.value.reduce((acc: any, curr: any) => {
      acc += ((curr.hour || 0) * (curr.rate || 0));
      return acc;
    }, 0);
    const taxAmount = (total * this.settingData[0].tax) / 100;
    console.log("taxAmount:",taxAmount);
    const totalAmountWithTax = total + taxAmount;

    this.updateInvoice.get('total_amount').setValue(totalAmountWithTax);
    this.updateInvoice.get('tax_amount').setValue(taxAmount);
  }

  getSettingData() {
    let URL = environment.apiUrl;
    this.httpClient.get(URL + "setting/ShowSetting").subscribe((result: any) => {
      this.settingData = result;
      console.log("SettingData :", result);
    })
  }

  private showMessage(message: string, duration: number): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, duration);
  }




}
