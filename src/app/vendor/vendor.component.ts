import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../services/api/api.service';
declare var $: any;

@Component({
  selector: 'app-vendor',
  standalone: false,

  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent {
  form!: FormGroup;
  vendors: any[] = [];
  page: number = 1;
  itemsPerPage: number = 5;
  searchVendor: string = '';
  isVendorModalOpen: boolean = false;

  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);

  constructor() {
    this.form = this.formBuilder.group({
      "vendorId": new FormControl(null),
      "vendorCode": new FormControl(null),
      "vendorName": new FormControl(null)
    })
  }

  ngOnInit(){
    this.apiService.getAllVendors().subscribe(res=>{
      if(res){
        this.vendors = res;
      }
    }, err=>{
      console.log(err);
    })
  }

  get filteredVendors() {
    return this.vendors.filter(
      (v) =>
        v.vendorCode.toLowerCase().includes(this.searchVendor.toLowerCase()) ||
        v.vendorName.toLowerCase().includes(this.searchVendor.toLowerCase())
    );
  }

  formSubmit(modal: any){
    if(!this.form.invalid){
      this.apiService.addVendor(this.form.value).subscribe(res=>{
        this.resetForm();
        if(res){
          $.toast({
            heading: 'New Vendor Information Added!',
            text: 'You have added new vendor details.',
            showHideTransition: 'fade',
            icon: 'success',
            position: 'bottom-right',
            bgColor: '#21ab49',
            loader: false,
          });
        }
      }, err=>{
        $.toast({
          heading: 'Information Invalid!',
          text: 'Please re-login and try again!',
          showHideTransition: 'fade',
          icon: 'info',
          position: 'bottom-right',
          bgColor: '#2158ab',
          loader: false,
        });
        console.log(err)
      });


      (modal as HTMLElement).classList.remove('show'); // Remove 'show' class
      document.body.classList.remove('modal-open'); // Remove modal-open class from body
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  resetForm() {
    this.form.reset();
    this.ngOnInit();
  }

  openVendorModal(){
    this.isVendorModalOpen = true;
  }

  editVendor(b: any) {
    this.form.patchValue({
      "vendorId": b.vendorId,
      "vendorCode": b.vendorCode,
      "vendorName": b.vendorName
    })
  }

  updateVendor(modalDefault: any) {

  }

  deleteVendor(modalDefault2: any, vendorCode: any) {

  }
}
