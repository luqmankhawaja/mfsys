import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  navOpen=false;
  constructor(public authService:AuthServiceService) {
  }

  ngOnInit(): void {


  }
  navbar(){
    this.navOpen=!this.navOpen;
    
  }

}
