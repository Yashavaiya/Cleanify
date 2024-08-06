import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  successMessage :String='';

  verificationFormGroup: FormGroup;
  email: any;
  errorMessage: string = '';
  showSubmitMessage: boolean = false;
  constructor(private authService: AuthServiceService, private router: Router) { }

  ngOnInit() {
    this.getData();
    this.initForm();
  }

  initForm() {
    this.verificationFormGroup = new FormGroup({
      email: new FormControl(''),
      resetString: new FormControl('', [Validators.required]),
    })
  }

  resetPasswordProcess(FormValue: any) {
    FormValue.email = this.email
    console.log("FormValue:", FormValue)
    if (this.verificationFormGroup.valid) {
      this.authService.verification(FormValue).subscribe((response) => {
        this.showMessage("OTP Entered successfully", 1000);
        setTimeout(() => {
          this.router.navigate(['/changePassword'])
        }, 1000)

         console.log("response:",response);

      }, error => {
        console.log(error);
        this.errorMessage = 'Please enter a  valid OTP.';
      this.showSubmitMessage = true;
      this.markFieldsAsTouched(this.verificationFormGroup);
      setTimeout(() => {
        this.showSubmitMessage = false;
      }, 2000);
      })
    } else {
      this.errorMessage = 'Please enter a  OTP.';
      this.showSubmitMessage = true;
      this.markFieldsAsTouched(this.verificationFormGroup);
      setTimeout(() => {
        this.showSubmitMessage = false;
      }, 2000);
    }

  }
  getData = () => {
    let data: any = localStorage.getItem('storage')
    this.email = JSON.parse(data).email
  }
  markFieldsAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFieldsAsTouched(control);
      }
    });
  }
  isFieldInvalid(fieldName: string) {
    const control = this.verificationFormGroup.get(fieldName);
    return control.invalid && (control.dirty || control.touched);
  }

  private showMessage(message: string, duration: number): void {
    this.successMessage = message;
  
    // Clear the message after the specified duration
    setTimeout(() => {
      this.successMessage = null;
    }, duration);
  }


}
