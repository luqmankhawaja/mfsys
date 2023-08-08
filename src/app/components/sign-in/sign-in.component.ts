import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginn!: FormGroup;


  constructor(
    private formbuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthServiceService,
  ) {}

  ngOnInit(): void {
this.loginn= this.formbuilder.group(
{
  userId: new FormControl('',[Validators.required, Validators.minLength(5)]),
  Password: new FormControl('',Validators.required),
}
)
}

  login() {
    this.http.get<any>('http://localhost:3000/signup').subscribe(
  (response) => {
    const user = response.find((a: any) => {
      return (
        a.userId === this.loginn.value.userId &&
        a.confirmPassword === this.loginn.value.Password
      );
    });
    if (user) {
      this.authService.setIsAuthenticated(true);
      this.router.navigate(['/home']);
      this.toastr.success('login successfully');

      console.log(this.authService.getIsAuthenticated()); 
    } else {
      this.toastr.error('Invalid username or password');

    }
  },
  (error: any) => {
    alert('something went wrong');
  }
);

  }
  get userId() {
    return this.loginn.get('userId');
  }

  get Password() {
    return this.loginn.get('Password');

  }




}

