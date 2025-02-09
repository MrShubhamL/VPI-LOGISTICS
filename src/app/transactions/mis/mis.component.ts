import {Component, inject} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {WebSocketService} from '../../services/api/web-socket.service';
import {StorageService} from '../../services/storage/storage.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

declare var $: any;
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-mis',
  standalone: false,

  templateUrl: './mis.component.html',
  styleUrl: './mis.component.scss'
})
export class MisComponent {

  form!: FormGroup;

  lorryListData: any[] = [];
  searchLorry: string = '';
  selectedButtonStatus: string = 'rejected';
  fileName!: string;
  currentRole: any = '';
  page: number = 1;
  itemsPerPage: number = 15;
  isDataLoading: boolean = false;

  private apiService = inject(ApiService);
  private webSocketService = inject(WebSocketService);
  private storageService = inject(StorageService);
  private formBuilder = inject(FormBuilder);

  constructor() {
    this.form = this.formBuilder.group({
      lrNo: new FormControl(''),
      lrDate: new FormControl(''),
      billNo: new FormControl(''),
      billDate: new FormControl(''),
      unloadDate: new FormControl(''),
      billRNo: new FormControl(''),
    });
  }


  ngOnInit() {
    this.currentRole = this.storageService.getUserRole();
    this.isDataLoading = true;
    this.apiService.getAllLorries().subscribe(res => {
      if (res) {
        this.lorryListData = res;
        this.isDataLoading = false;
        console.log(this.filteredLorries);
      }
    }, err => {
      console.log(err);
    });

  }

  get filteredLorries() {
    return this.lorryListData.filter(
      (l) =>
        l.lrNo.toLowerCase().includes(this.searchLorry.toLowerCase()) ||
        l.branch.branchName.toLowerCase().includes(this.searchLorry.toLowerCase()) ||
        l.route.routeName.toLowerCase().includes(this.searchLorry.toLowerCase()) ||
        l.consignee.partyName.toLowerCase().includes(this.searchLorry.toLowerCase()) ||
        l.consignor.partyName.toLowerCase().includes(this.searchLorry.toLowerCase()) ||
        l.memo.memoNo.toLowerCase().includes(this.searchLorry.toLowerCase()),
    )
  }

  formReset() {
    this.form.reset();
    this.ngOnInit();
  }

  editData(lr: any) {
    this.form.get('lrNo')?.setValue(lr.lrNo);
    this.form.get('lrDate')?.setValue(lr.lrDate);
    this.form.get('billNo')?.setValue(lr.bill.billNo || null);
    this.form.get('billDate')?.setValue(lr.bill.billDate || null);
    this.form.get('unloadDate')?.setValue(lr.bill.unloadDate || null);
    this.form.get('billRNo')?.setValue(lr.bill.billRNo || null);
  }

  formSubmit(modal: any) {
    const lrNo = this.form.get('lrNo')?.value;
    const lrDate = this.form.get('lrDate')?.value;
    const formObj = {
      billNo: this.form.get('billNo')?.value,
      billDate: this.form.get('billDate')?.value,
      unloadDate: this.form.get('unloadDate')?.value,
      billRNo: this.form.get('billRNo')?.value,
    }

    this.apiService.updateLorryReceiptBillDetails(lrNo, lrDate, formObj).subscribe(res => {
      if (res) {
        this.formReset();
        $.toast({
          heading: 'MIS Bill Information Updated',
          text: 'You have updated mis bill information.',
          showHideTransition: 'fade',
          icon: 'success',
          position: 'bottom-right',
          bgColor: '#1f592c',
          loader: false,
        });
      }
    }, err => {
      console.log(err)
    });

    (modal as HTMLElement).classList.remove('show'); // Remove 'show' class
    document.body.classList.remove('modal-open'); // Remove modal-open class from body
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove(); // Remove the backdrop
    }

  }

  // exportToExcel(): void {
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.lorryListData);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Lorry List');
  //
  //   // Generate Excel file and trigger download
  //   const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  //   saveAs(data, `${this.fileName}.xlsx`);
  // }

  exportToExcel(): void {
    if(this.fileName){
      // Prepare data for export
      let exportData = this.filteredLorries.map((lr, index) => {
        return {
          "Sr.No": (this.page - 1) * this.itemsPerPage + index + 1,
          "Vendor Code": lr.lorryReceiptItems.map((v: any) => v.item.vendorCode).join(', '),
          "Vendor Name": lr.lorryReceiptItems.map((v: any) => v.item.party.partyName).join(', '),
          "Part No.": lr.lorryReceiptItems.map((v: any) => v.item.partNo).join(', '),
          "Part Name": lr.lorryReceiptItems.map((v: any) => v.item.itemName).join(', '),
          "Invoice No.": lr.chalan?.chalanNo || '',
          "Invoice Date": lr.chalan?.chalanDate || '',
          "Quantity": lr.lorryReceiptItems.map((v: any) => v.quantity).join(', '),
          "FTL/LCV": lr.lorryReceiptItems.map((v: any) => v.lcvFtl).join(', '),
          "Pack Type": lr.packType,
          "LR No.": lr.lrNo,
          "LR Date": lr.lrDate,
          "Vehicle No": lr.refTruckNo,
          "Invoice": lr.chalan?.valueOnChalan || '',
          "Bill No": lr.bill?.billNo || 'N/A',
          "Bill Date": lr.bill?.billDate || 'N/A',
          "Unload Date": lr.bill?.unloadDate || 'N/A',
          "Total Weight": lr.lorryReceiptItems.map((v: any) => v.totalWeight).join(', '),
          "Total Freight": lr.grandTotal,
          "MRNo": "MRNo", // You can replace with actual data if available
          "PU": lr.lorryReceiptItems.map((v: any) => v.item.pu).join(', '),
          "ASN No": lr.asnNo
        };
      });

      // Convert JSON data to a worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

      // Create a new workbook and append the worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Lorry List');

      // Write the file and trigger download
      const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
      const data: Blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
      saveAs(data, `${this.fileName}.xlsx`);
      this.fileName = '';
    }
  }

}
