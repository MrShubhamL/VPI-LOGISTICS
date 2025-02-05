import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms';
import {ApiService} from '../services/api/api.service';
import {StorageService} from '../services/storage/storage.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoggedIn: boolean = false;
  form!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private toastr = inject(ToastrService)

  constructor() {
    this.form = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
  }

  formSubmit(){
    this.isLoggedIn = true;
    this.apiService.loginUser(this.form.value).subscribe(res =>{
      this.storageService.saveUser(res);
      this.storageService.saveToken(res.jwtToken);
      // console.log(res);
      if(this.storageService.getUser() !== null && this.storageService.getUserRole() !== null){
        this.router.navigate(['/dashboard']);
        this.isLoggedIn = false;
      } else{
        this.router.navigate(['/login'])
      }
    }, err =>{
      this.storageService.logout();
      if(typeof window !== 'undefined'){
        window.location.reload();
        this.router.navigate(['/login']);
        this.toastr.info('Invalid Credentials!', err);
      }
    });
  }
}
