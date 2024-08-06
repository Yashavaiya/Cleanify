import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';;
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { OtpComponent } from './verification/otp.component';
import { HttpClientModule } from '@angular/common/http';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { CustomerComponent } from './customer/customer.component';
import { ServicesComponent } from './services/services.component';
import { ShowCustomerComponent } from './show-customer/show-customer.component';

import { UpdateCustomerComponent } from './update-customer/update-customer.component';
import { ShowServiceComponent } from './show-service/show-service.component';
import { UpdateServiceComponent } from './update-service/update-service.component';
import { InvoiceComponent } from './invoice/invoice.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { SettingComponent } from './setting/setting.component';

import { UpdateSettingComponent } from './update-setting/update-setting.component';
import { ShowInvoiceComponent } from './show-invoice/show-invoice.component';
import { SettingComponent } from './setting/setting.component';

import { AuthServiceService } from './auth-service.service';

import { AuthGuardService } from './auth-guard.service';
import { HeaderComponent } from './header/header.component';
import { PaymentComponent } from './payment/payment.component';
import { UpdateInvoiceComponent } from './update-invoice/update-invoice.component';
import { ViewCustomerDetailsComponent } from './view-customer-details/view-customer-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';













@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgetpasswordComponent,
    OtpComponent,
    ChangePasswordComponent,
    DashbordComponent,
    CustomerComponent,
    ServicesComponent,
    ShowCustomerComponent,

    UpdateCustomerComponent,
    ShowServiceComponent,
    UpdateServiceComponent,
    InvoiceComponent,

    SettingComponent,

    UpdateSettingComponent,
    ShowInvoiceComponent,
    SettingComponent,
    HeaderComponent,
    PaymentComponent,
    UpdateInvoiceComponent,
    ViewCustomerDetailsComponent,
    


  





  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // NgxPaginationModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule

  ],
  providers: [ AuthServiceService, AuthGuardService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
