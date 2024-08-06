import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})

export class ForgetpasswordComponent implements OnInit {
  successMessage :String='';
  ResetPasswordFormGroup: FormGroup;
  SettingData:any ;
  errorMessage: string = '';
  showSubmitMessage: boolean = false;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  
  constructor(private authService: AuthServiceService,private httpClient:HttpClient,private router: Router) {  
    this.SettingData=[];

  }

  ngOnInit() {
    this.initForm();
    this.getData();
    this.getSettingData();

  }
  initForm() {
    this.ResetPasswordFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required,Validators.pattern(this.emailPattern)]),
    })
  }

  resetPasswordProcess(FormValue: any) {  
    console.log("FormValue:", FormValue)
    if (this.ResetPasswordFormGroup.valid) {
      this.authService.resetPassword(FormValue).subscribe((response) => {
        this.showMessage("Mail Send successfully", 1000);
            setTimeout(() => {
              localStorage.setItem('storage', JSON.stringify(FormValue));
        this.router.navigate(['/verification'])
            }, 1000)
        console.log(response);
       

      }, error => {
        this.errorMessage = 'Invalid email address. Please check and try again.';
        this.showSubmitMessage = true;
        console.log(error);
        setTimeout(() => {
          this.showSubmitMessage = false;
        }, 2000);
       
      })
    } else {
      this.errorMessage = 'Please enter a valid email address.';
      this.showSubmitMessage = true;
      this.markFieldsAsTouched(this.ResetPasswordFormGroup);
      setTimeout(() => {
        this.showSubmitMessage = false;
      }, 2000);
    }

  }
  isFieldInvalid(fieldName: string) {
    const control = this.ResetPasswordFormGroup.get(fieldName);
    return control.invalid && (control.dirty || control.touched);
  }

  // get in otp ts
  getData = () => {
    let data = localStorage.getItem('storage')
    console.log(data);
  }

  getSettingData(){
    let URL =environment.apiUrl;
    this.httpClient.get(URL +"setting/ShowSetting").subscribe((result:any)=>{
      this.SettingData=result;
      console.log("SettingData :",result);
    })
  }
  markFieldsAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFieldsAsTouched(control);
      }
    });
  }

  private showMessage(message: string, duration: number): void {
    this.successMessage = message;
  
    setTimeout(() => {
      this.successMessage = null;
    }, duration);
  }

}
