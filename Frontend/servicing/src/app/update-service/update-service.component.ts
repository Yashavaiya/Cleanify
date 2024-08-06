import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-service',
  templateUrl: './update-service.component.html',
  styleUrls: ['./update-service.component.css']
})
export class UpdateServiceComponent implements OnInit {
  successMessage :String='';
  onlyNumbers:any;




  serviceFile: any;
  service:any;
    constructor(private router:ActivatedRoute,private authService: AuthServiceService,private Router:Router) {
      this.onlyNumbers= /^\d+$/;
     }
     UpdateServiceFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z\s]*$/)]),
      service_img: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      rate: new FormControl('', [Validators.required,Validators.pattern( /^\d+$/)]),
    });
    ngOnInit(): void {
      this.router.params.subscribe(params => {
        const serviceId = params['_id'];
        this.authService.GetCurrentService(serviceId).subscribe((response: any) => {
          console.log(response);
          this.service=response
          console.log("this.service:",this.service)
          this.UpdateServiceFormGroup.setValue({
            name: response.name,
            service_img: '', 
            description: response.description,
            rate: response.rate,
          });
        });
      });
    }

    onFileChange(event: any): void {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        console.log("file", file);
        this.serviceFile = file;
        this.UpdateServiceFormGroup.get('service_img')?.setValue(file.name);
      }
    }
  
    collection(): void {
      const serviceId = this.router.snapshot.params['_id'];
  
      if (this.UpdateServiceFormGroup.valid) {
        const formData = new FormData();
        formData.append('name', this.UpdateServiceFormGroup.get('name').value);
        formData.append('description', this.UpdateServiceFormGroup.get('description').value);
        formData.append('rate', this.UpdateServiceFormGroup.get('rate').value);
        if (this.serviceFile) {
          formData.append('service_img', this.serviceFile, this.UpdateServiceFormGroup.get('service_img').value);
        }
  
        this.authService.updateServiceData(serviceId, formData).subscribe((result: any) => {
          console.log("result", result);
          if (result.status == "success") {
            this.showMessage("Service update successfully", 1000);
            setTimeout(() => {
              this.Router.navigate(['/showService']);
            }, 1000)
        
          } else {
            alert("update service failed");
          }
        });
      }
    }
    isFieldInvalid(fieldName: string) {
      const control = this.UpdateServiceFormGroup.get(fieldName);
      return control.invalid && (control.dirty || control.touched);
    }
  

    
  private showMessage(message: string, duration: number): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, duration);
  }
  
  }
