
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth-service.service';
 import { passwordMatchValidator } from './matchPassword';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthServiceService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
  }
  signup_Form = new FormGroup({
    userId: new FormControl('', [Validators.required, Validators.minLength(2)]),
    Password: new FormControl('',[Validators.required, Validators.minLength(5)]),
    confirmPassword: new FormControl(null),

  },{
      validators:passwordMatchValidator
  });
  signup() {
    this.http.post<any>('http://localhost:3000/signup', this.signup_Form.value)
      .subscribe(
        (Response) => {

          console.log(Response)
          this.toastr.success('Signup successfully');


          this.signup_Form.reset();
          this.router.navigate(['/sign-in']);
        },
        (error) => {
          this.toastr.warning('Please enter valid data');

        }
      );
  }
  get userId() {
    return this.signup_Form.get('userId');
  }

  get password() {
    return this.signup_Form.get('password');
  }

  get confirmPassword() {
    return this.signup_Form.get('confirmPassword');
  }

}
