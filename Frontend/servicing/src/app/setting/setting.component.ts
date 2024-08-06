import { Component,OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { HttpClient } from "@angular/common/http";
import { environment } from './../../environments/environment'
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {
  SettingData:any ;
  constructor(private authService: AuthServiceService,private httpClient:HttpClient,private router:ActivatedRoute){
    this.SettingData=[];
}


ngOnInit(){
  this.getSettingData();

   console.warn(this.router.snapshot.params['_id']);
  this.authService.GetCurrentSetting(this.router.snapshot.params['_id']).subscribe((response:any)=>{
    console.log(response);
   this.UpdateSettingFormGroup = new FormGroup({
    user_email: new FormControl(response.user_email),
    password: new FormControl(response.password),
    host_name: new FormControl(response.user_name),
    tax: new FormControl(response.tax),
    port: new FormControl(response.port),
    })
  })
}


    getSettingData(){
      let URL =environment.apiUrl;
      this.httpClient.get(URL +"setting/ShowSetting").subscribe((result:any)=>{
        this.SettingData=result;
        console.log("SettingData :",result);
      })
    }


  UpdateSettingFormGroup = new FormGroup({
    user_email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    host_name: new FormControl('', [Validators.required]),
    tax: new FormControl('', [Validators.required]),
    port: new FormControl('', [Validators.required]),
  })




collection(){
  console.log("id:",this.router.snapshot.params['_id']);
  this.authService.updateSettingData(this.router.snapshot.params['_id'],this.UpdateSettingFormGroup.value).subscribe((result:any)=>{
    console.log("result",result)
  })
 
}
}
