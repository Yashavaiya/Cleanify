import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  successMessage :String='';

  serviceFormGroup: FormGroup;
  showSubmitMessage: boolean = false;
  onlyNumbers:any;
  

  constructor(private authService: AuthServiceService,private router: Router) {
    this.onlyNumbers= /^\d+$/;
   }

  ngOnInit() {
    this.initForm();

  }
  initForm() {
    this.serviceFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z\s]*$/),Validators.minLength(4),]),
      service_img: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      rate: new FormControl('', [Validators.required,Validators.pattern( this.onlyNumbers)]),
    })
  }
  isFieldInvalid(fieldName: string) {
    const control = this.serviceFormGroup.get(fieldName);
    return control.invalid && (control.dirty || control.touched);
  }






  customerFile: any;
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("file", file)
      this.customerFile = file;
      this.serviceFormGroup.get('service_img')?.setValue(file.name);
    }
  }


  createServiceProcess(FormValue: any) {
    console.log("FormValue:", FormValue)
    if (this.serviceFormGroup.valid) {
      const formData = new FormData();
      formData.append('name', this.serviceFormGroup.get('name').value);
      formData.append('service_img', this.customerFile, this.serviceFormGroup.get('service_img').value);
      formData.append('description', this.serviceFormGroup.get('description').value);
      formData.append('rate', this.serviceFormGroup.get('rate').value);
      this.authService.createService(formData).subscribe(
        (response: any) => {
          console.log(response);
          if (response.status == "success") {
            this.showMessage("Service Create successfully", 1000);
            setTimeout(() => {
              this.router.navigate(['/showService']);
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
      this.markFieldsAsTouched(this.serviceFormGroup);
    }
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
