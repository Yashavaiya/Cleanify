import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { environment } from './../../environments/environment';


@Component({
  selector: 'app-view-customer-details',
  templateUrl: './view-customer-details.component.html',
  styleUrls: ['./view-customer-details.component.css']
})
export class ViewCustomerDetailsComponent implements OnInit {
  customerId: any;
  customerDetails: any;
  constructor(private authService: AuthServiceService,private httpClient:HttpClient,private router:ActivatedRoute){}

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.customerId = params['_id'];
      console.log("customerId:", this.customerId)
      if (this.customerId) {
        this.getCustomerDetails();
      }
    });
  }


  getCustomerDetails(): void {
    this.authService.getCustomerDetails(this.customerId).subscribe(
      (data) => {
        this.customerDetails = data;
        console.log('Customer Details:',data);
      },
      (error) => {
        console.error('Error fetching customer details:', error);
      }
    );
  }
}
