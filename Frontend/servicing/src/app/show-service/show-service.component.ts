import { Component,OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { HttpClient } from "@angular/common/http";
import { environment } from './../../environments/environment'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-show-service',
  templateUrl: './show-service.component.html',
  styleUrls: ['./show-service.component.css']
})
export class ShowServiceComponent implements OnInit {
  deleteServiceId:any
  searchKey: string = '';
  ServiceData:any;
  p: number = 1;
  itemsPerPage:number=20;
  currentPage: number = 1
  sortDir: number = 1;
  sortBy: string = '';
  constructor(private authService: AuthServiceService,private httpClient:HttpClient,private router:ActivatedRoute){
    this.ServiceData=[];
  }  
  ngOnInit(){
    this.getServiceData();

  }


      getServiceData(){
        let URL =environment.apiUrl;
        this.httpClient.get(URL +"service/ShowService").subscribe((result:any)=>{
          this.ServiceData=result;
          console.log(result);
        })
      }

      deleteServiceProcess(_id:any) {
        this.deleteServiceId = _id;
      }
      confirmDelete(): void {
        console.log(this.deleteServiceId);
        this.authService.deleteService(this.deleteServiceId).subscribe((response: any) => {
          this.getServiceData();
        });
        this.deleteServiceId = null;
      }

      
      searchCustomerData(){
console.log("clicked");
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
      this.ServiceData.sort((a, b) => {
        if (colName === 'rate') {
          return (a[colName] - b[colName]) * this.sortDir;
        } else {
        const aValue = a[colName] && typeof a[colName] === 'string' ? a[colName].toLowerCase() : '';
        const bValue = b[colName] && typeof b[colName] === 'string' ? b[colName].toLowerCase() : '';
        return aValue.localeCompare(bValue) * this.sortDir;
        }
      });
    }
    getSortIcon(column: string) {
      if (this.sortBy === column) {
        return this.sortDir === 1 ? 'fa-sort-up' : 'fa-sort-down';
      }
      return 'fa-sort';
    }

// viewServiceImage(imageUrl: string) {
//   // You can implement logic here to open the image in a modal or new tab
//   window.open(`http://192.168.0.151:3000/cleanService/service/GetPhoto/${imageUrl}`);
// }







searchServices() {
  // Convert to lowercase for case-insensitive search
  const lowerCaseSearchKey = this.searchKey.toLowerCase().trim();    
console.log("lowerCaseSearchKey:",lowerCaseSearchKey)
  if (lowerCaseSearchKey !== '') {
    // Perform search only if search key is provided
    this.authService.searchServices(lowerCaseSearchKey).subscribe(
      (data) => {
        this.ServiceData = data;
        console.log("data:",data)
      },
      (error) => {
        console.error('Error fetching customer data:', error);
      }
    );
  } else {
    this.getServiceData();
    
  }
}

getVisibleServices(): any[] {
  const startIndex = (this.p - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.ServiceData.slice(startIndex, endIndex);
}



totalPages(): number[] {
  const totalItems = this.ServiceData.length;
  const totalPages = Math.ceil(totalItems / this.itemsPerPage);
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}

getCurrentPageData(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.ServiceData.slice(startIndex, endIndex);
}

changePage(page: number): void {
  this.currentPage = page;
}


}