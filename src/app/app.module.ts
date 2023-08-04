import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ChargesComponent } from './components/charges/charges.component';
import { EventComponent } from './components/event/event.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthServiceService } from './services/auth-service.service';
import { ReleaseComponent } from './components/release/release.component';
import { ConversionComponent } from './components/conversion/conversion.component';



@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent,
    NavBarComponent,
    ChargesComponent,
    EventComponent,
    TransactionComponent,
    ReleaseComponent,
    ConversionComponent,



  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
