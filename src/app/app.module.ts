import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { PartyComponent } from './party/party.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Material} from './material';
import { ItemComponent } from './item/item.component';
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthInterceptor} from './services/models/auth.interceptor';
import { PleaseWaitModalComponent } from './please-wait-modal/please-wait-modal.component';
import {CommonModule} from '@angular/common';
import { RouteManagerComponent } from './route-manager/route-manager.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { VehicleRegistrationComponent } from './vehicle-registration/vehicle-registration.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RolesPermissionsComponent } from './roles-permissions/roles-permissions.component';
import { BranchComponent } from './branch/branch.component';
import { LorryReceiptComponent } from './transactions/lorry-receipt/lorry-receipt.component';
import { VendorComponent } from './vendor/vendor.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    MainComponent,
    HomeComponent,
    PartyComponent,
    ItemComponent,
    PleaseWaitModalComponent,
    RouteManagerComponent,
    ChatBoxComponent,
    VehicleRegistrationComponent,
    UserManagementComponent,
    RolesPermissionsComponent,
    BranchComponent,
    LorryReceiptComponent,
    VendorComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    Material,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
