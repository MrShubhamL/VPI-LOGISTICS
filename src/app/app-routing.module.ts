import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {HomeComponent} from './home/home.component';
import {PartyComponent} from './party/party.component';
import {ItemComponent} from './item/item.component';
import {authGuard} from './services/guards/auth.guard';
import {RouteManagerComponent} from './route-manager/route-manager.component';
import {ChatBoxComponent} from './chat-box/chat-box.component';
import {VehicleRegistrationComponent} from './vehicle-registration/vehicle-registration.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {RolesPermissionsComponent} from './roles-permissions/roles-permissions.component';
import {PermissionGuard} from './services/guards/permission.guard';
import {BranchComponent} from './branch/branch.component';
import {LorryReceiptComponent} from './transactions/lorry-receipt/lorry-receipt.component';
import {VendorComponent} from './vendor/vendor.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: "dashboard",
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "create-party",
        component: PartyComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'create-party'}
      },
      {
        path: "item-records",
        component: ItemComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'item-records'}
      },
      {
        path: "manage-route",
        component: RouteManagerComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'manage-route'}
      },
      {
        path: "create-branch",
        component: BranchComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'create-branch'}
      },
      {
        path: 'vehicle-registration',
        component: VehicleRegistrationComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'vehicle-registration'}
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'user-management'}
      },
      {
        path: 'roles-permissions',
        component: RolesPermissionsComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'roles-permissions'}
      },
      {
        path: 'create-vendor',
        component: VendorComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'create-vendor'}
      },
      // ------------ TRANSACTION -----------------
      {
        path: 'lorry-receipt',
        component: LorryReceiptComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'lorry-receipt'}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
