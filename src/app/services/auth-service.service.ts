import { Injectable } from '@angular/core';
import { ɵangular_packages_platform_browser_platform_browser_n } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  public isAuthenticated :boolean

  constructor(private router:Router, private http: HttpClient) {}
  logout() {
    this.isAuthenticated = false;
    this.router.navigate(['/sign-in']);
  }






  home(){

    this.isAuthenticated = true;
    this.router.navigate(['/home'])
  }
  event(){

    this.isAuthenticated = true;
    this.router.navigate(['/event'])
  }

  transaction(){
    this.isAuthenticated = true;
    this.router.navigate(['/transaction'])
  }

  charges(){
    this.isAuthenticated = true;
    this.router.navigate(['/charges'])
  }
  getData() {
    // Replace the URL with the actual endpoint to fetch the data
    return this.http.get('http://example.com/data');
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  setIsAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }
}
