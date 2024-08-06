import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-setting',
  templateUrl: './update-setting.component.html',
  styleUrls: ['./update-setting.component.css']
})
export class UpdateSettingComponent {
  hidePassword: boolean = true;
  successMessage: string = '';
  UpdateSettingFormGroup = new FormGroup({
    user_email: new FormControl('', [Validators.required]),
    // service_img: new FormControl(''),
    password: new FormControl('', [Validators.required]),
    host_name: new FormControl('', [Validators.required]),
    tax: new FormControl('', [Validators.required]),
    port: new FormControl('', [Validators.required]),
  })

constructor(private router:ActivatedRoute,private authService: AuthServiceService) { }
ngOnInit():void {
  console.warn(this.router.snapshot.params['_id']);
  this.authService.GetCurrentSetting(this.router.snapshot.params['_id']).subscribe((response:any)=>{
    console.log(response);
   this.UpdateSettingFormGroup = new FormGroup({
    user_email: new FormControl(response.user_email),
    password: new FormControl(response.password),
    host_name: new FormControl(response.host_name),
    tax: new FormControl(response.tax),
    port: new FormControl(response.port),
    })
  })

}

togglePasswordVisibility() {
  this.hidePassword = !this.hidePassword;
}

collection(){
  console.log("id:",this.router.snapshot.params['_id']);
  this.authService.updateSettingData(this.router.snapshot.params['_id'],this.UpdateSettingFormGroup.value).subscribe((result:any)=>{
    console.log("result",result)
  })
  this.successMessage = 'Setting updated successfully';
  setTimeout(() => {
    this.successMessage = '';
  }, 3000); 
 
}
}
