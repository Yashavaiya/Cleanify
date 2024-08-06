import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { HttpClient } from "@angular/common/http";
import { environment } from './../../environments/environment'
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-show-invoice',
  templateUrl: './show-invoice.component.html',
  styleUrls: ['./show-invoice.component.css']
})
export class ShowInvoiceComponent {
  deleteInvoiceId: any;
  successMessage: String = '';
  loading: boolean = false;
  searchKey: string = '';
  message: string = '';
  currentPage: number = 1
  itemsPerPage: number = 20;
  InvoiceData: any;
  p: number = 1;
  sortDir: number = 1;
  sortBy: string = '';
  constructor(private authService: AuthServiceService, private httpClient: HttpClient, private router: ActivatedRoute) {
    this.InvoiceData = [];
  }
  ngOnInit() {
    this.getInvoiceData();

  }


  getInvoiceData() {
    let URL = environment.apiUrl;
    this.httpClient.get(URL + "invoice/ShowInvoice").subscribe((result: any) => {
      this.InvoiceData = result;
      console.log("result:", result);
    })
  }

  deleteInvoiceProcess(_id: any) {
    this.deleteInvoiceId = _id;
  }
  confirmDelete(): void {
    console.log(this.deleteInvoiceId);
    this.authService.deleteInvoice(this.deleteInvoiceId).subscribe((response: any) => {
      this.getInvoiceData();
    });
    this.deleteInvoiceId = null;
  }

  sendInvoice(_id: any) {
    this.loading = true;
    this.authService.invoice(_id).subscribe((response: any) => {
      this.loading = false;
      this.showMessage("Mail Send  successfully", 1000);
      console.log("response:", response)

    }, (error: any) => {
      console.log('Error sending invoice:', error);
      this.loading = false;

    })
  }
  private showMessage(message: string, duration: number): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
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
    this.InvoiceData.sort((a, b) => {
      if (colName === 'total_amount') {
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



  searchInvoices() {
    // Convert to lowercase for case-insensitive search
    const lowerCaseSearchKey = this.searchKey.toLowerCase().trim();

    if (lowerCaseSearchKey !== '') {
      // Perform search only if search key is provided
      this.authService.searchInvoices(lowerCaseSearchKey).subscribe(
        (data) => {
          this.InvoiceData = data;
          console.log("data:", data)
        },
        (error) => {
          console.error('Error fetching customer data:', error);
        }
      );
    } else {
      this.getInvoiceData();

    }
  }

  getVisibleServices(): any[] {
    const startIndex = (this.p - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.InvoiceData.slice(startIndex, endIndex);
  }


  totalPages(): number[] {
    const totalItems = this.InvoiceData.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.InvoiceData.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }


}