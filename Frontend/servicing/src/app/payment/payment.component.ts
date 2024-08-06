import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit  {

  successMessage :String='';

  invoiceId: string | null = null;
  selectedFile: File | null = null;
  isUploadSuccess: boolean = false;

  constructor(private authService: AuthServiceService,private router:Router,private activatedRoute: ActivatedRoute,private http: HttpClient) {}
  
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      console.log(id);
      this.invoiceId = id;
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }



  uploadPayment(): void {
    if (!this.selectedFile) {
      console.log('Please select an image');
      this.showMessage("Please select an image", 2000);
      return;
    }

    this.authService.uploadPaymentImage(this.invoiceId, this.selectedFile).subscribe(
      (response) => {
        console.log('Payment status updated:', response);
       
      },
      (error) => {
        console.log('Error updating payment status:', error);
     
      }
    );
    this.isUploadSuccess = true;
    setTimeout(() => {
      this.isUploadSuccess = false;
    }, 2000); 
  
  }

  private showMessage(message: string, duration: number): void {
    this.successMessage = message;
  

    setTimeout(() => {
      this.successMessage = null;
    }, duration);
  }


}
