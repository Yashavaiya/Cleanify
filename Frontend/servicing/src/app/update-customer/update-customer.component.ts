import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css']
})
export class UpdateCustomerComponent implements OnInit {
  successMessage :String='';
  passwordPattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";
  phoneNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$"; 
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
    UpdateCustomerFormGroup = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.pattern(this.emailPattern)]),
      name: new FormControl('',
      [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/),Validators.minLength(3),]
      ,),
      photo: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required,Validators.pattern(this.phoneNumberPattern)],),
    })
    customer:any;
  constructor(private router:ActivatedRoute,private authService: AuthServiceService,private Router:Router) { }
  ngOnInit(): void {
    this.router.params.subscribe(params => {
      const customerId = params['_id'];
      this.authService.GetCurrentCustomer(customerId).subscribe((response: any) => {
        console.log("response:",response);
        this.customer = response;
        console.log("this.customer",this.customer);
        console.log("response.photo",this.customer.photo)
        this.UpdateCustomerFormGroup.setValue({
          email: response.email,
          name: response.name,
          photo: '', 
          address: response.address,
          phone: response.phone,
        });
      });
    });
  }
  customerFile:any;
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("file", file);
      this.customerFile = file;
      this.UpdateCustomerFormGroup.get('photo')?.setValue(file.name);
    }
  }

  collection(): void {
    const customerId = this.router.snapshot.params['_id'];

    if (this.UpdateCustomerFormGroup.valid) {
      const formData = new FormData();
      formData.append('email', this.UpdateCustomerFormGroup.get('email').value);
      formData.append('name', this.UpdateCustomerFormGroup.get('name').value);
      if (this.customerFile) {
        formData.append('photo', this.customerFile, this.UpdateCustomerFormGroup.get('photo').value);
      }
      formData.append('address', this.UpdateCustomerFormGroup.get('address').value);
      formData.append('phone', this.UpdateCustomerFormGroup.get('phone').value);

      this.authService.updateCustomerData(customerId, formData).subscribe((result: any) => {
        console.log("result", result);
        if (result.status == "success") {
          this.showMessage("Customer update successfully", 1000);
          setTimeout(() => {
            this.Router.navigate(['/showCustomer']);
          }, 1000)
        } else {
          alert("update customer failed");
        }
      });
    }
  }
  isFieldInvalid(fieldName: string) {
    const control = this.UpdateCustomerFormGroup.get(fieldName);
    return control.invalid && (control.dirty || control.touched);
  }


  private showMessage(message: string, duration: number): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, duration);
  }


}
