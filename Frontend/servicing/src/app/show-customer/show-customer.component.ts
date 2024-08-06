import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { environment } from './../../environments/environment';



@Component({
  selector: 'app-show-customer',
  templateUrl: './show-customer.component.html',
  styleUrls: ['./show-customer.component.css']
})
export class ShowCustomerComponent implements OnInit {
  deleteCustomerId: any; 
  itemsPerPage:number=20;
  deleteMessage:String= '';
  imageUrl: any;
searchKey: string = '';
searchResults: any[] = [];
  // sortDir = 1;
  serviceData:any;
  buttonValue:any;
  name:any;
  searchText: string;
  p: number = 1;
  searchData: string = '';
  customerData: any = [];
  currentPage: number = 1;
  sortDir: number = 1;
  sortBy: string = '';

  constructor(private authService: AuthServiceService,private httpClient:HttpClient,private router:ActivatedRoute){
    this.customerData=[];
    this.buttonValue=[];
    this.serviceData=[];
    this.searchResults=[];
 
  }  
  ngOnInit(){
    this.getCustomerData();
  }


      getCustomerData(){
        let URL =environment.apiUrl;
        this.httpClient.get(URL +"customer/ShowCustomer").subscribe((result:any)=>{
          this.customerData=result;
          console.log("CustomerData",result);
        })
      }

      deleteCustomerProcess(_id:any) {
        this.deleteCustomerId = _id;
      }
      confirmDelete(): void {
        console.log(this.deleteCustomerId);
        this.authService.deleteCustomer(this.deleteCustomerId).subscribe((response: any) => {
          this.getCustomerData();
        });
        this.deleteCustomerId = null;
      }

      search(key:any) {
        this.authService.searchData(key).subscribe((data) => {
          this.customerData = data;

        });
      }

onSortClick(column: string) {
  if (this.sortBy === column) {
    this.sortDir = -this.sortDir;
  } else {
    this.sortBy = column;
    this.sortDir = 1;
  }
  this.sortArr(column);
}

sortArr(colName: string) {
  this.customerData.sort((a, b) => {
    const aValue = a[colName] && typeof a[colName] === 'string' ? a[colName].toLowerCase() : '';
    const bValue = b[colName] && typeof b[colName] === 'string' ? b[colName].toLowerCase() : '';
    return aValue.localeCompare(bValue) * this.sortDir;
  });
}
getSortIcon(column: string) {
  if (this.sortBy === column) {
    return this.sortDir === 1 ? 'fa-sort-up' : 'fa-sort-down';
  }
  return 'fa-sort';
}


searchCustomers() {
  // Convert to lowercase for case-insensitive search
  const lowerCaseSearchKey = this.searchKey.toLowerCase().trim(); 
  if (lowerCaseSearchKey !== '') {
    this.authService.searchCustomers(lowerCaseSearchKey).subscribe(
      (data) => {
        this.customerData = data;
        console.log("data:",data)
      },
      (error) => {
        console.error('Error fetching customer data:', error);
      }
    );
  } else {
    
    this.getCustomerData();
    
  }
}


getPhoto(){
  const filename = this.customerData.photo;
  console.log("filename:",filename)
  this.authService.getPhoto(filename).subscribe((image: Blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(image);
  });
}

private showDeleteMessage(message: string, duration: number): void {
  this.deleteMessage = message;
  setTimeout(() => {
    this.deleteMessage = null;
  }, duration);
}
getVisibleServices(): any[] {
  const startIndex = (this.p - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.customerData.slice(startIndex, endIndex);
}



totalPages(): number[] {
  const totalItems = this.customerData.length;
  const totalPages = Math.ceil(totalItems / this.itemsPerPage);
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}

getCurrentPageData(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.customerData.slice(startIndex, endIndex);
}

changePage(page: number): void {
  this.currentPage = page;
}
}