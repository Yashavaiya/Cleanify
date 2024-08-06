import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  successMessage :String='';
  
  loginFormGroup: FormGroup;
  errorMessage: string = '';
  hidePassword: boolean = true;
  
  showSubmitMessage: boolean = false;
  constructor(private authService: AuthServiceService, private router: Router) { }

  ngOnInit() {
    this.initForm();

    const user = sessionStorage.getItem("EmailId");
    console.log("Storage:", user)


  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  initForm() {
    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required,Validators.email]),
      password: new FormControl('', [Validators.required,Validators.minLength(6)])
    })
  }
  markFieldsAsTouched(loginFormGroup: FormGroup): void {
    Object.values(loginFormGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFieldsAsTouched(control);
      }
    });
  }

  loginProcess(FormValue: any) {
    console.log("FormValue:", FormValue)
    if (this.loginFormGroup.valid) {
      this.authService.login(FormValue).subscribe((response: any) => {
        if (response.status == "success") {
          this.showMessage(" Login successfully", 1000);
            setTimeout(() => {
              sessionStorage.setItem("EmailId", FormValue.email);
            this.router.navigate(['/dashBoard'])
            }, 1000)
          
 
        } else {
          this.errorMessage = 'Login failed. Please check your EmailId or Password !';
          this.showSubmitMessage = true;
      this.markFieldsAsTouched(this.loginFormGroup);
      setTimeout(() => {
        this.showSubmitMessage = false;
      }, 2000);
        }
      }, error => {
        console.log(error);
      })
    } else{
      this.showSubmitMessage = true;
      this.markFieldsAsTouched(this.loginFormGroup);
    }

  }
  isFieldInvalid(fieldName: string) {
    const control = this.loginFormGroup.get(fieldName);
    return control.invalid && (control.dirty || control.touched);
  }
  
  private showMessage(message: string, duration: number): void {
    this.successMessage = message;
  
  
    setTimeout(() => {
      this.successMessage = null;
    }, duration);
  }

}
