import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { OtpComponent } from './verification/otp.component';
import { ChangePasswordComponent } from './change-password/change-password.component'
import { DashbordComponent } from './dashbord/dashbord.component';
import { CustomerComponent } from './customer/customer.component';
import { ServicesComponent } from './services/services.component';
import { ShowCustomerComponent } from './show-customer/show-customer.component';
import { UpdateCustomerComponent } from './update-customer/update-customer.component';
import { ShowServiceComponent } from './show-service/show-service.component';
import { UpdateServiceComponent } from './update-service/update-service.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { SettingComponent } from './setting/setting.component';

import { UpdateSettingComponent } from './update-setting/update-setting.component';
import { ShowInvoiceComponent } from './show-invoice/show-invoice.component';
import { AuthGuardService } from './auth-guard.service';
import { PaymentComponent } from './payment/payment.component';
import { UpdateInvoiceComponent } from './update-invoice/update-invoice.component';
import { ViewCustomerDetailsComponent } from './view-customer-details/view-customer-details.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  { path: 'ForgetPassword', component: ForgetpasswordComponent },
  {path:'verification',component:OtpComponent},
  {path:'changePassword',component:ChangePasswordComponent},
  {path:'dashBoard',component:DashbordComponent},
  {path:'customer',component:CustomerComponent},
  {path:'service',component:ServicesComponent},
  {path:'showCustomer',component:ShowCustomerComponent},
  {path:'update/:_id',component:UpdateCustomerComponent},
  {path:'showService',component:ShowServiceComponent},
  {path:'Update/:_id',component:UpdateServiceComponent},
  {path:'invoice',component:InvoiceComponent},
  {path:'setting',component:SettingComponent},

  {path:'UpdateSetting/:_id',component:UpdateSettingComponent},
  {path:'showInvoice',component:ShowInvoiceComponent},
  { path: 'payment/:id', component: PaymentComponent },
  {path:'UpdateInvoice/:_id',component:UpdateInvoiceComponent},
  {path:'viewCustomerDetails/:_id',component:ViewCustomerDetailsComponent}




]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
