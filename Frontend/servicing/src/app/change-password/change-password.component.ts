import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  successMessage :String='';

  changePasswordFormGroup: FormGroup;
  email: any;
  errorMessage: string = '';
  showSubmitMessage: boolean = false;
  hidePassword: boolean = true;

  constructor(private authService: AuthServiceService, private router: Router) { }

  ngOnInit() {
    this.getData();
    this.initForm();
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  initForm() {
    this.changePasswordFormGroup = new FormGroup({
      email: new FormControl(''),
      newPassword: new FormControl('', [Validators.required,Validators.minLength(6)]),
    })
  }

  changePasswordProcess(FormValue: any) {
    FormValue.email = this.email
    if (this.changePasswordFormGroup.valid) {
      this.authService.ChangePassword(FormValue).subscribe((response) => {
        this.showMessage("Password Changed successfully", 1000);
        setTimeout(() => {
          this.router.navigate(['/login'])
        }, 1000)
      }, error => {
        console.log(error);
      })
    } else {
    
      this.errorMessage = 'Please enter a  new password.';
      this.showSubmitMessage = true;
      this.markFieldsAsTouched(this.changePasswordFormGroup);
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
    const control = this.changePasswordFormGroup.get(fieldName);
    return control.invalid && (control.dirty || control.touched);
  }

  private showMessage(message: string, duration: number): void {
    this.successMessage = message;
  
    
    setTimeout(() => {
      this.successMessage = null;
    }, duration);
  }

}