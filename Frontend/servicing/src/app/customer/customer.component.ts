import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  successMessage :String='';

  customerFormGroup: FormGroup;
  showSubmitMessage: boolean = false;
  
  passwordPattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";
  phoneNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$"; 
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(private authService: AuthServiceService, private router: Router) { }
  

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.customerFormGroup = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.pattern(this.emailPattern)]),
      name: new FormControl('',
      [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/),Validators.minLength(3),]
      ,),
      photo: new FormControl(null,[Validators.required]),
      address: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required,Validators.pattern(this.phoneNumberPattern)],),
    })
  }



  customerFile: any;
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("file", file)
      this.customerFile = file;
      this.customerFormGroup.get('photo')?.setValue(file.name);
    }
  }


  createCustomerProcess(FormValue: any) {
    console.log("FormValue:", FormValue)
    if (this.customerFormGroup.valid) {
      const formData = new FormData();
      formData.append('email', this.customerFormGroup.get('email').value);
      formData.append('name', this.customerFormGroup.get('name').value);
      formData.append('photo', this.customerFile, this.customerFormGroup.get('photo').value);
      formData.append('address', this.customerFormGroup.get('address').value);
      formData.append('phone', this.customerFormGroup.get('phone').value);
      this.authService.createCustomer(formData).subscribe(
        (response: any) => {
          if (response.status == "success") {
            this.showMessage("Customer Create successfully", 1000);
            setTimeout(() => {
              this.router.navigate(['/showCustomer']);
            }, 1000)
          } else {
            alert("Create customer Failed");
          }
        },
        (error) => {
          console.log("Error:", error);
        }
      );
    }else{
      this.showSubmitMessage = true;
      this.markFieldsAsTouched(this.customerFormGroup);
    }
  }
  isFieldInvalid(fieldName: string) {
    const control = this.customerFormGroup.get(fieldName);
    return control.invalid && (control.dirty || control.touched);
  }
  markFieldsAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFieldsAsTouched(control);
      }
    });
  }

  // get in otp ts
  getData = () => {
    let data = localStorage.getItem('storage')
    console.log(data);
  }

  private showMessage(message: string, duration: number): void {
    this.successMessage = message;

    setTimeout(() => {
      this.successMessage = null;
    }, duration);
  }

}
