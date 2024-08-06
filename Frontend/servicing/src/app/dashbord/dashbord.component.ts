import { Component,OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { HttpClient } from "@angular/common/http";
import { environment } from './../../environments/environment'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent {
  SettingData:any ;
  constructor(private authService: AuthServiceService,private httpClient:HttpClient,private router:Router,private modalService: NgbModal){
    this.SettingData=[];
}


ngOnInit(){
  this.getSettingData();
}


    getSettingData(){
      let URL =environment.apiUrl;
      this.httpClient.get(URL +"setting/ShowSetting").subscribe((result:any)=>{
        this.SettingData=result;
        
      })
    }



  confirmLogout(): void {
      //  logout logic
      this.authService.logout();
  }
}
