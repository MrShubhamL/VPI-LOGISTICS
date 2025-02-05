import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import BaseUrl from '../models/base-url';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(public http: HttpClient) {
  }

  public loginUser(user: any): Observable<any> {
    return this.http.post(BaseUrl + '/api/service/login', user, {
      responseType: 'json',
    });
  }

  public getLatestPartyNo(): Observable<any> {
    return this.http.get(BaseUrl + '/api/party/get-latest-party-no', {
      responseType: 'json',
    });
  }

  public getAllParties(): Observable<any> {
    return this.http.get(BaseUrl + '/api/party/get-parties', {
      responseType: 'json',
    });
  }

  public testAPI(): Observable<string> {
    return this.http.get(BaseUrl + '/test', {responseType: 'text'});
  }

  public addParty(party: any): Observable<any> {
    return this.http.post(BaseUrl + '/api/party/add-party', party, {
      responseType: 'json',
    });
  }

  public updateParty(party: any): Observable<any> {
    return this.http.put(BaseUrl + '/api/party/update-party', party, {
      responseType: 'json',
    });
  }

  public deleteParty(id: any): Observable<any> {
    return this.http.delete(BaseUrl + '/api/party/delete-party', {
      params: {partyNo: id},
    });
  }

  // ------------------- ALL Route Operation -----------------------------

  public addRoute(route: any): Observable<any> {
    return this.http.post(BaseUrl + '/api/route/add-route', route, {
      responseType: 'json',
    });
  }

  public deleteRoute(id: any): Observable<any> {
    return this.http.delete(BaseUrl + '/api/route/delete-route', {
      params: {routeNo: id},
    });
  }

  public getAllRoutes(): Observable<any> {
    return this.http.get(BaseUrl + '/api/route/get-routes', {
      responseType: 'json',
    });
  }

  public getLatestRouteNo(): Observable<any> {
    return this.http.get(BaseUrl + '/api/route/get-latest-route-no', {
      responseType: 'json',
    });
  }


  // ------------------------------ Item Operation API --------------------------------------

  public getLatestItemNo(): Observable<any> {
    return this.http.get(BaseUrl + "/api/item/get-latest-item-no", {
      responseType: 'json'
    })
  }

  public addItem(item: any): Observable<any> {
    return this.http.post(BaseUrl + "/api/item/add-item", item, {
      responseType: 'json'
    });
  }

  public updateItem(item: any): Observable<any> {
    return this.http.put(BaseUrl + "/api/item/update-item", item, {
      responseType: 'json'
    });
  }

  public deleteItem(itemNo: any): Observable<any> {
    return this.http.delete(BaseUrl + "/api/item/delete-item", {
      params: {itemNo: itemNo}
    });
  }

  public getAllItems(): Observable<any> {
    return this.http.get(BaseUrl + "/api/item/get-items", {
      responseType: 'json'
    });
  }


  // ---------------------- ALL VEHICLE OPERATIONS ------------------------

  public getLatestVehicleId(): Observable<any> {
    return this.http.get(BaseUrl + "", {
      responseType: 'json'
    });
  }

  public addVehicle(vehicle: any): Observable<any> {
    return this.http.post(BaseUrl + "/api/vehicle/add-vehicle", vehicle, {
      responseType: 'json'
    });
  }

  public updateVehicle(vehicle: any): Observable<any> {
    return this.http.put(BaseUrl + "/api/vehicle/update-vehicle", vehicle, {
      responseType: 'json'
    });
  }

  public getAllVehicles(): Observable<any> {
    return this.http.get(BaseUrl + "/api/vehicle/get-vehicles", {
      responseType: 'json'
    });
  }

  public deleteVehicle(vehicleNumber: any): Observable<any> {
    return this.http.delete(BaseUrl + "/api/vehicle/delete-vehicle", {
      responseType: 'json',
      params: {vehicleId: vehicleNumber}
    });
  }

  public addVehicleOwner(owner: any): Observable<any> {
    return this.http.post(BaseUrl + "/api/owner/add-owner", owner, {
      responseType: 'json'
    });
  }

  public updateVehicleOwner(owner: any): Observable<any> {
    return this.http.put(BaseUrl + "/api/owner/update-owner", owner, {
      responseType: 'json'
    });
  }

  public deleteVehicleOwner(ownerId: any): Observable<any> {
    return this.http.delete(BaseUrl + "/api/owner/delete-owner", {
      responseType: 'json',
      params: {ownerId: ownerId}
    });
  }

  public getVehicleOwnerDetailsByVehicleId(vehicleId: any): Observable<any> {
    return this.http.get(BaseUrl + "/api/owner/get-owner-by-vehicle-id", {
      responseType: 'json',
      params: {vehicleId: vehicleId}
    });
  }


  // ----------------------- User Management ------------------
  public createUser(user: any): Observable<any> {
    return this.http.post(BaseUrl + "/api/user-management/register-user", user, {
      responseType: 'json'
    });
  }

  public updateUser(user: any): Observable<any> {
    return this.http.put(BaseUrl + "/api/user-management/update-user", user, {
      responseType: 'json'
    });
  }

  public createRole(role: any): Observable<any> {
    return this.http.post(BaseUrl + "/api/user-management/create-role", role, {
      responseType: 'json'
    });
  }

  public updateRole(role: any): Observable<any> {
    return this.http.put(BaseUrl + "/api/user-management/update-role", role, {
      responseType: 'json'
    });
  }

  public getRoleByName(roleName: any): Observable<any> {
    return this.http.get(BaseUrl + "/api/user-management/get-role-by-role-name", {
      params: {roleName: roleName},
      responseType: 'json'
    });
  }

  public getAllRoles(): Observable<any> {
    return this.http.get(BaseUrl + "/api/user-management/get-all-roles", {
      responseType: 'json'
    });
  }

  public deleteRole(roleId: any): Observable<any> {
    return this.http.delete(BaseUrl + "/api/user-management/delete-role", {
      params: {roleId: roleId},
      responseType: 'json'
    })
  }

  public getAllUsers(): Observable<any> {
    return this.http.get(BaseUrl + "/api/user-management/get-all-users", {
      responseType: 'json'
    });
  }

  public deleteUser(id: any): Observable<any> {
    return this.http.delete(BaseUrl + "/api/user-management/delete-user", {
      params: {id: id},
      responseType: 'json'
    });
  }

  // --------------------- BRANCH API'S -------------------

  public addBranch(branch: any): Observable<any> {
    return this.http.post(BaseUrl + "/api/branch/add-branch", branch, {
      responseType: 'json'
    });
  }

  public updateBranch(branch: any): Observable<any> {
    return this.http.put(BaseUrl + "/api/branch/update-branch", branch, {
      responseType: 'json'
    });
  }

  public deleteBranch(id: any): Observable<any> {
    return this.http.delete(BaseUrl + "/api/branch/delete-branch", {
      params: {branchNo: id},
      responseType: 'json'
    });
  }

  public getBranches(): Observable<any> {
    return this.http.get(BaseUrl + "/api/branch/get-branches", {
      responseType: 'json'
    });
  }

  public getLatestBranchNo(): Observable<any> {
    return this.http.get(BaseUrl + "/api/branch/get-latest-branch-no", {
      responseType: 'json'
    });
  }

  // ------------- LORRY RECEIPT RESET API -----------

  public getLatestLorryNo(): Observable<any> {
    return this.http.get(BaseUrl + "/api/lorry-receipt/get-latest-lr-no", {
      responseType: 'json'
    });
  }

  public getLatestMemoNo(): Observable<any> {
    return this.http.get(BaseUrl + "/api/lorry-receipt/get-latest-memo-no", {
      responseType: 'json'
    });
  }


  public addLorryReceipt(lr: any): Observable<any> {
    return this.http.post(BaseUrl + "/api/lorry-receipt/add-lorry-receipt", lr,{
      responseType: 'json'
    });
  }

  public updateLorryReceipt(lr: any): Observable<any> {
    return this.http.put(BaseUrl + "/api/lorry-receipt/update-lorry-receipt", lr,{
      responseType: 'json'
    });
  }

  public deleteLrReceipt(lrNo : any): Observable<any> {
    return this.http.delete(BaseUrl + "/api/lorry-receipt/delete-lorry-receipt",{
      params: {lrNo : lrNo},
      responseType: 'json'
    });
  }

  public getAllLorries(): Observable<any>{
    return this.http.get(BaseUrl + "/api/lorry-receipt/get-lorry-receipts", {
      responseType: 'json'
    });
  }

  // --------------------- ALL VENDOR REST APIS ------------------

  public getAllVendors(): Observable<any> {
    return this.http.get(BaseUrl + "/api/vendor/get-vendors", {
      responseType: 'json'
    });
  }

  public addVendor(vendor: any): Observable<any> {
    return this.http.post(BaseUrl + "/api/vendor/add-vendor", vendor, {
      responseType: 'json'
    });
  }
}
